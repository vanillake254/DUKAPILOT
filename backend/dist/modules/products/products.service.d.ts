import { PrismaService } from '../../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class CreateProductDto {
    name: string;
    description?: string;
    category: string;
    price: number;
    cost: number;
    quantityBought: number;
    images?: string[];
    isPublished?: boolean;
}
export declare class BulkOnboardDto {
    name: string;
    quantityBought: number;
    totalCost: number;
}
export declare class ProductsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(businessId: string, dto: CreateProductDto): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        businessId: string;
        category: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        quantityBought: number;
        quantitySold: number;
        quantityRemaining: number;
        images: string[];
        isPublished: boolean;
    }>;
    bulkOnboard(businessId: string, items: BulkOnboardDto[]): Promise<{
        message: string;
        products: any[];
    }>;
    findAll(businessId: string, filters?: {
        category?: string;
        isPublished?: boolean;
        search?: string;
    }): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        businessId: string;
        category: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        quantityBought: number;
        quantitySold: number;
        quantityRemaining: number;
        images: string[];
        isPublished: boolean;
    }[]>;
    findOne(businessId: string, id: string): Promise<{
        stockMovements: {
            id: string;
            createdAt: Date;
            businessId: string;
            movementType: import(".prisma/client").$Enums.MovementType;
            quantity: number;
            previousStock: number;
            newStock: number;
            notes: string | null;
            productId: string;
        }[];
    } & {
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        businessId: string;
        category: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        quantityBought: number;
        quantitySold: number;
        quantityRemaining: number;
        images: string[];
        isPublished: boolean;
    }>;
    update(businessId: string, id: string, dto: Partial<CreateProductDto>): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        businessId: string;
        category: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        quantityBought: number;
        quantitySold: number;
        quantityRemaining: number;
        images: string[];
        isPublished: boolean;
    }>;
    remove(businessId: string, id: string): Promise<{
        message: string;
    }>;
    getInventorySummary(businessId: string): Promise<{
        totalProducts: number;
        totalValue: number;
        lowStock: number;
        outOfStock: number;
        products: {
            id: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            businessId: string;
            category: string;
            price: Prisma.Decimal;
            cost: Prisma.Decimal;
            quantityBought: number;
            quantitySold: number;
            quantityRemaining: number;
            images: string[];
            isPublished: boolean;
        }[];
    }>;
    getCategories(businessId: string): Promise<string[]>;
    recordSale(businessId: string, productId: string, quantity: number, notes?: string): Promise<{
        id: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        businessId: string;
        category: string;
        price: Prisma.Decimal;
        cost: Prisma.Decimal;
        quantityBought: number;
        quantitySold: number;
        quantityRemaining: number;
        images: string[];
        isPublished: boolean;
    }>;
}
