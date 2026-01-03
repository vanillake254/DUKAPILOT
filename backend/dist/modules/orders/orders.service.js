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
exports.OrdersService = exports.CreateOrderDto = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
class CreateOrderDto {
    customerName;
    customerPhone;
    customerEmail;
    deliveryType;
    deliveryLat;
    deliveryLng;
    deliveryAddress;
    items;
}
exports.CreateOrderDto = CreateOrderDto;
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(businessId, dto) {
        let totalAmount = 0;
        const orderItems = [];
        for (const item of dto.items) {
            const product = await this.prisma.product.findFirst({
                where: { id: item.productId, businessId },
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product ${item.productId} not found`);
            }
            if (product.quantityRemaining < item.quantity) {
                throw new common_1.NotFoundException(`Insufficient stock for ${product.name}. Available: ${product.quantityRemaining}`);
            }
            totalAmount += Number(product.price) * item.quantity;
            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price,
            });
        }
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
    async findAll(businessId, status) {
        const where = {
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
    async findOne(businessId, id) {
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
            throw new common_1.NotFoundException('Order not found');
        }
        return order;
    }
    async updateStatus(businessId, id, status, mpesaCode) {
        const order = await this.prisma.order.findFirst({
            where: { id, businessId },
            include: { items: true },
        });
        if (!order) {
            throw new common_1.NotFoundException('Order not found');
        }
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
        const updateData = { status };
        if (mpesaCode) {
            updateData.mpesaCode = mpesaCode;
            updateData.paymentConfirmed = true;
        }
        return this.prisma.order.update({
            where: { id },
            data: updateData,
        });
    }
    async getStats(businessId) {
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
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map