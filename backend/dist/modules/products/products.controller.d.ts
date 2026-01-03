import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(businessId: string, createProductDto: any): Promise<{
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
    }>;
    bulkOnboard(businessId: string, body: {
        items: any[];
    }): Promise<{
        message: string;
        products: any[];
    }>;
    findAll(businessId: string, category?: string, isPublished?: string, search?: string): Promise<{
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
    }[]>;
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
            price: import("@prisma/client/runtime/library").Decimal;
            cost: import("@prisma/client/runtime/library").Decimal;
            quantityBought: number;
            quantitySold: number;
            quantityRemaining: number;
            images: string[];
            isPublished: boolean;
        }[];
    }>;
    getCategories(businessId: string): Promise<string[]>;
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
        price: import("@prisma/client/runtime/library").Decimal;
        cost: import("@prisma/client/runtime/library").Decimal;
        quantityBought: number;
        quantitySold: number;
        quantityRemaining: number;
        images: string[];
        isPublished: boolean;
    }>;
    update(businessId: string, id: string, updateProductDto: any): Promise<{
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
    }>;
    recordSale(businessId: string, id: string, body: {
        quantity: number;
        notes?: string;
    }): Promise<{
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
    }>;
    remove(businessId: string, id: string): Promise<{
        message: string;
    }>;
}
