import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus } from '@prisma/client';

export class CreateOrderDto {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryType: 'DELIVERY' | 'PICKUP';
    deliveryLat?: number;
    deliveryLng?: number;
    deliveryAddress?: string;
    items: {
        productId: string;
        quantity: number;
    }[];
}

@Injectable()
export class OrdersService {
    constructor(private prisma: PrismaService) { }

    // Create order
    async create(businessId: string, dto: CreateOrderDto) {
        // Validate products and calculate total
        let totalAmount = 0;
        const orderItems: any[] = [];

        for (const item of dto.items) {
            const product = await this.prisma.product.findFirst({
                where: { id: item.productId, businessId },
            });

            if (!product) {
                throw new NotFoundException(`Product ${item.productId} not found`);
            }

            if (product.quantityRemaining < item.quantity) {
                throw new NotFoundException(
                    `Insufficient stock for ${product.name}. Available: ${product.quantityRemaining}`,
                );
            }

            totalAmount += Number(product.price) * item.quantity;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price,
            });
        }

        // Create order
        const order = await this.prisma.order.create({
            data: {
                businessId,
                customerName: dto.customerName,
                customerPhone: dto.customerPhone,
                customerEmail: dto.customerEmail,
                deliveryType: dto.deliveryType,
                deliveryLat: dto.deliveryLat,
                deliveryLng: dto.deliveryLng,
                deliveryAddress: dto.deliveryAddress,
                totalAmount,
                status: 'PENDING',
                items: {
                    create: orderItems,
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return order;
    }

    // Get all orders for business
    async findAll(businessId: string, status?: string) {
        const where: any = {
            businessId,
        };

        if (status) {
            where.status = status;
        }

        return this.prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Get single order
    async findOne(businessId: string, id: string) {
        const order = await this.prisma.order.findFirst({
            where: { id, businessId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        return order;
    }

    // Update order status
    async updateStatus(
        businessId: string,
        id: string,
        status: string,
        mpesaCode?: string,
    ) {
        const order = await this.prisma.order.findFirst({
            where: { id, businessId },
            include: { items: true },
        });

        if (!order) {
            throw new NotFoundException('Order not found');
        }

        // If confirming order, reduce stock
        if (status === 'CONFIRMED' && order.status === 'PENDING') {
            for (const item of order.items) {
                const product = await this.prisma.product.findUnique({
                    where: { id: item.productId },
                });

                if (product) {
                    await this.prisma.product.update({
                        where: { id: item.productId },
                        data: {
                            quantitySold: product.quantitySold + item.quantity,
                            quantityRemaining: product.quantityRemaining - item.quantity,
                        },
                    });

                    // Log stock movement
                    await this.prisma.stockMovement.create({
                        data: {
                            productId: item.productId,
                            businessId,
                            movementType: 'SALE',
                            quantity: item.quantity,
                            previousStock: product.quantityRemaining,
                            newStock: product.quantityRemaining - item.quantity,
                            notes: `Order ${order.id}`,
                        },
                    });
                }
            }
        }

        const updateData: any = { status };
        if (mpesaCode) {
            updateData.mpesaCode = mpesaCode;
            updateData.paymentConfirmed = true;
        }

        return this.prisma.order.update({
            where: { id },
            data: updateData,
        });
    }

    // Get order statistics
    async getStats(businessId: string) {
        const orders = await this.prisma.order.findMany({
            where: { businessId },
        });

        const totalOrders = orders.length;
        const pending = orders.filter((o) => o.status === 'PENDING').length;
        const confirmed = orders.filter((o) => o.status === 'CONFIRMED').length;
        const delivered = orders.filter((o) => o.status === 'DELIVERED').length;
        const totalRevenue = orders
            .filter((o) => o.status !== 'CANCELLED')
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);

        return {
            totalOrders,
            pending,
            confirmed,
            delivered,
            totalRevenue,
        };
    }
}
