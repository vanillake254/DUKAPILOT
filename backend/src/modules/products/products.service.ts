import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';

export class CreateProductDto {
    name: string;
    description?: string;
    category: string;
    price: number;
    cost: number;
    quantityBought: number;
    images?: string[];
    isPublished?: boolean;
}

export class BulkOnboardDto {
    name: string;
    quantityBought: number;
    totalCost: number;
}

@Injectable()
export class ProductsService {
    constructor(private prisma: PrismaService) { }

    // Create individual product
    async create(businessId: string, dto: CreateProductDto) {
        const quantityRemaining = dto.quantityBought;

        const product = await this.prisma.product.create({
            data: {
                businessId,
                name: dto.name,
                description: dto.description,
                category: dto.category,
                price: dto.price,
                cost: dto.cost,
                quantityBought: dto.quantityBought,
                quantityRemaining,
                images: dto.images || [],
                isPublished: dto.isPublished ?? false,
            },
        });

        // Log stock movement
        await this.prisma.stockMovement.create({
            data: {
                productId: product.id,
                businessId,
                movementType: 'PURCHASE',
                quantity: dto.quantityBought,
                previousStock: 0,
                newStock: quantityRemaining,
                notes: 'Initial stock purchase',
            },
        });

        return product;
    }

    // Bulk onboard (name, quantity, total cost)
    async bulkOnboard(businessId: string, items: BulkOnboardDto[]) {
        const products: any[] = [];

        for (const item of items) {
            const unitCost = item.totalCost / item.quantityBought;

            const product = await this.prisma.product.create({
                data: {
                    businessId,
                    name: item.name,
                    category: 'Uncategorized', // Default category
                    price: unitCost * 1.3, // Default 30% markup
                    cost: unitCost,
                    quantityBought: item.quantityBought,
                    quantityRemaining: item.quantityBought,
                },
            });

            // Log stock movement
            await this.prisma.stockMovement.create({
                data: {
                    productId: product.id,
                    businessId,
                    movementType: 'PURCHASE',
                    quantity: item.quantityBought,
                    previousStock: 0,
                    newStock: item.quantityBought,
                    notes: 'Bulk onboard',
                },
            });

            products.push(product);
        }

        return {
            message: `Successfully onboarded ${products.length} products`,
            products,
        };
    }

    // Find all products for a business
    async findAll(businessId: string, filters?: {
        category?: string;
        isPublished?: boolean;
        search?: string;
    }) {
        const where: Prisma.ProductWhereInput = {
            businessId,
            ...(filters?.category && { category: filters.category }),
            ...(filters?.isPublished !== undefined && { isPublished: filters.isPublished }),
            ...(filters?.search && {
                OR: [
                    { name: { contains: filters.search, mode: 'insensitive' } },
                    { description: { contains: filters.search, mode: 'insensitive' } },
                ],
            }),
        };

        const products = await this.prisma.product.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        return products;
    }

    // Get product by ID
    async findOne(businessId: string, id: string) {
        const product = await this.prisma.product.findFirst({
            where: { id, businessId },
            include: {
                stockMovements: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        return product;
    }

    // Update product
    async update(businessId: string, id: string, dto: Partial<CreateProductDto>) {
        const product = await this.prisma.product.findFirst({
            where: { id, businessId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        // Recalculate quantity remaining if quantityBought changed
        let quantityRemaining = product.quantityRemaining;
        if (dto.quantityBought !== undefined) {
            const difference = dto.quantityBought - product.quantityBought;
            quantityRemaining += difference;

            // Log stock adjustment
            if (difference !== 0) {
                await this.prisma.stockMovement.create({
                    data: {
                        productId: id,
                        businessId,
                        movementType: 'ADJUSTMENT',
                        quantity: Math.abs(difference),
                        previousStock: product.quantityRemaining,
                        newStock: quantityRemaining,
                        notes: `Stock adjustment: ${difference > 0 ? 'added' : 'removed'} ${Math.abs(difference)} units`,
                    },
                });
            }
        }

        return this.prisma.product.update({
            where: { id },
            data: {
                ...dto,
                quantityRemaining: dto.quantityBought !== undefined ? quantityRemaining : undefined,
            },
        });
    }

    // Delete product
    async remove(businessId: string, id: string) {
        const product = await this.prisma.product.findFirst({
            where: { id, businessId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        await this.prisma.product.delete({
            where: { id },
        });

        return { message: 'Product deleted successfully' };
    }

    // Get inventory summary
    async getInventorySummary(businessId: string) {
        const products = await this.prisma.product.findMany({
            where: { businessId },
        });

        const totalProducts = products.length;
        const totalValue = products.reduce(
            (sum, p) => sum + Number(p.cost) * p.quantityRemaining,
            0,
        );
        const lowStock = products.filter((p) => p.quantityRemaining < 10).length;
        const outOfStock = products.filter((p) => p.quantityRemaining === 0).length;

        return {
            totalProducts,
            totalValue,
            lowStock,
            outOfStock,
            products,
        };
    }

    // Get product categories
    async getCategories(businessId: string) {
        const products = await this.prisma.product.findMany({
            where: { businessId },
            select: { category: true },
            distinct: ['category'],
        });

        return products.map((p) => p.category);
    }

    async recordSale(
        businessId: string,
        productId: string,
        quantity: number,
        notes?: string,
    ) {
        if (!quantity || quantity <= 0) {
            throw new BadRequestException('Quantity must be greater than 0');
        }

        const product = await this.prisma.product.findFirst({
            where: { id: productId, businessId },
        });

        if (!product) {
            throw new NotFoundException('Product not found');
        }

        if (product.quantityRemaining < quantity) {
            throw new BadRequestException(
                `Insufficient stock. Available: ${product.quantityRemaining}`,
            );
        }

        const updated = await this.prisma.product.update({
            where: { id: productId },
            data: {
                quantitySold: product.quantitySold + quantity,
                quantityRemaining: product.quantityRemaining - quantity,
            },
        });

        await this.prisma.stockMovement.create({
            data: {
                productId: productId,
                businessId,
                movementType: 'SALE',
                quantity,
                previousStock: product.quantityRemaining,
                newStock: product.quantityRemaining - quantity,
                notes: notes || 'Manual sale',
            },
        });

        return updated;
    }
}
