"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = exports.BulkOnboardDto = exports.CreateProductDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
class CreateProductDto {
    name;
    description;
    category;
    price;
    cost;
    quantityBought;
    images;
    isPublished;
}
exports.CreateProductDto = CreateProductDto;
class BulkOnboardDto {
    name;
    quantityBought;
    totalCost;
}
exports.BulkOnboardDto = BulkOnboardDto;
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(businessId, dto) {
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
    async bulkOnboard(businessId, items) {
        const products = [];
        for (const item of items) {
            const unitCost = item.totalCost / item.quantityBought;
            const product = await this.prisma.product.create({
                data: {
                    businessId,
                    name: item.name,
                    category: 'Uncategorized',
                    price: unitCost * 1.3,
                    cost: unitCost,
                    quantityBought: item.quantityBought,
                    quantityRemaining: item.quantityBought,
                },
            });
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
    async findAll(businessId, filters) {
        const where = {
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
    async findOne(businessId, id) {
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
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
    async update(businessId, id, dto) {
        const product = await this.prisma.product.findFirst({
            where: { id, businessId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        let quantityRemaining = product.quantityRemaining;
        if (dto.quantityBought !== undefined) {
            const difference = dto.quantityBought - product.quantityBought;
            quantityRemaining += difference;
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
    async remove(businessId, id) {
        const product = await this.prisma.product.findFirst({
            where: { id, businessId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        await this.prisma.product.delete({
            where: { id },
        });
        return { message: 'Product deleted successfully' };
    }
    async getInventorySummary(businessId) {
        const products = await this.prisma.product.findMany({
            where: { businessId },
        });
        const totalProducts = products.length;
        const totalValue = products.reduce((sum, p) => sum + Number(p.cost) * p.quantityRemaining, 0);
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
    async getCategories(businessId) {
        const products = await this.prisma.product.findMany({
            where: { businessId },
            select: { category: true },
            distinct: ['category'],
        });
        return products.map((p) => p.category);
    }
    async recordSale(businessId, productId, quantity, notes) {
        if (!quantity || quantity <= 0) {
            throw new common_1.BadRequestException('Quantity must be greater than 0');
        }
        const product = await this.prisma.product.findFirst({
            where: { id: productId, businessId },
        });
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        if (product.quantityRemaining < quantity) {
            throw new common_1.BadRequestException(`Insufficient stock. Available: ${product.quantityRemaining}`);
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
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map