import { PrismaService } from '../../database/prisma.service';
export declare class CreateOrderDto {
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
export declare class OrdersService {
    private prisma;
    constructor(prisma: PrismaService);
    create(businessId: string, dto: CreateOrderDto): Promise<{
        items: ({
            product: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                businessId: string;
                category: string;
                price: import("@prisma/client/runtime/library").Decimal;
                cost: import("@prisma/client/runtime/library").Decimal;
                quantityBought: number;
                quantitySold: number;
                quantityRemaining: number;
                images: string[];
                isPublished: boolean;
            };
        } & {
            id: string;
            quantity: number;
            productId: string;
            priceAtPurchase: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        deliveryType: import(".prisma/client").$Enums.DeliveryType;
        deliveryLat: number | null;
        deliveryLng: number | null;
        deliveryAddress: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        mpesaCode: string | null;
        paymentConfirmed: boolean;
    }>;
    findAll(businessId: string, status?: string): Promise<({
        items: ({
            product: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                businessId: string;
                category: string;
                price: import("@prisma/client/runtime/library").Decimal;
                cost: import("@prisma/client/runtime/library").Decimal;
                quantityBought: number;
                quantitySold: number;
                quantityRemaining: number;
                images: string[];
                isPublished: boolean;
            };
        } & {
            id: string;
            quantity: number;
            productId: string;
            priceAtPurchase: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        deliveryType: import(".prisma/client").$Enums.DeliveryType;
        deliveryLat: number | null;
        deliveryLng: number | null;
        deliveryAddress: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        mpesaCode: string | null;
        paymentConfirmed: boolean;
    })[]>;
    findOne(businessId: string, id: string): Promise<{
        items: ({
            product: {
                id: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                businessId: string;
                category: string;
                price: import("@prisma/client/runtime/library").Decimal;
                cost: import("@prisma/client/runtime/library").Decimal;
                quantityBought: number;
                quantitySold: number;
                quantityRemaining: number;
                images: string[];
                isPublished: boolean;
            };
        } & {
            id: string;
            quantity: number;
            productId: string;
            priceAtPurchase: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
    } & {
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        deliveryType: import(".prisma/client").$Enums.DeliveryType;
        deliveryLat: number | null;
        deliveryLng: number | null;
        deliveryAddress: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        mpesaCode: string | null;
        paymentConfirmed: boolean;
    }>;
    updateStatus(businessId: string, id: string, status: string, mpesaCode?: string): Promise<{
        id: string;
        status: import(".prisma/client").$Enums.OrderStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        customerId: string | null;
        customerName: string;
        customerPhone: string;
        customerEmail: string | null;
        deliveryType: import(".prisma/client").$Enums.DeliveryType;
        deliveryLat: number | null;
        deliveryLng: number | null;
        deliveryAddress: string | null;
        totalAmount: import("@prisma/client/runtime/library").Decimal;
        mpesaCode: string | null;
        paymentConfirmed: boolean;
    }>;
    getStats(businessId: string): Promise<{
        totalOrders: number;
        pending: number;
        confirmed: number;
        delivered: number;
        totalRevenue: number;
    }>;
}
