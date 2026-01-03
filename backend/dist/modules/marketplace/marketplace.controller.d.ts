import { PrismaService } from '../../database/prisma.service';
export declare class MarketplaceController {
    private prisma;
    constructor(prisma: PrismaService);
    getAllProducts(search?: string, category?: string, lat?: string, lng?: string): Promise<({
        business: {
            id: string;
            businessName: string;
            phone: string | null;
            locationLat: number | null;
            locationLng: number | null;
            locationAddress: string | null;
            mpesaNumber: string | null;
        };
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
    })[]>;
    getBusinessStorefront(id: string): Promise<{
        business: {
            id: string;
            businessName: string;
            phone: string | null;
            logo: string | null;
            description: string | null;
            locationLat: number | null;
            locationLng: number | null;
            locationAddress: string | null;
            mpesaNumber: string | null;
            tillNumber: string | null;
            paybillNumber: string | null;
        };
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
        reviews: {
            id: string;
            createdAt: Date;
            businessId: string;
            customerName: string;
            rating: number;
            comment: string | null;
            isApproved: boolean;
        }[];
        avgRating: number;
        totalReviews: number;
    } | null>;
    getProduct(id: string): Promise<({
        business: {
            id: string;
            businessName: string;
            phone: string | null;
            locationAddress: string | null;
            mpesaNumber: string | null;
            tillNumber: string | null;
            paybillNumber: string | null;
        };
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
    }) | null>;
    submitReview(body: any): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        customerName: string;
        rating: number;
        comment: string | null;
        isApproved: boolean;
    }>;
    submitComplaint(body: any): Promise<{
        id: string;
        description: string;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        customerName: string;
        customerEmail: string | null;
        resolution: string | null;
    }>;
    private toRad;
}
