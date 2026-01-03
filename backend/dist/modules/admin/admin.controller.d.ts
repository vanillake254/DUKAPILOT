import { PrismaService } from '../../database/prisma.service';
export declare class AdminController {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalBusinesses: number;
        activeBusinesses: number;
        suspendedBusinesses: number;
        totalProducts: number;
        totalOrders: number;
        pendingComplaints: number;
    }>;
    getAllBusinesses(): Promise<{
        id: string;
        businessName: string;
        businessEmail: string;
        phone: string | null;
        status: import(".prisma/client").$Enums.BusinessStatus;
        createdAt: Date;
        _count: {
            products: number;
            orders: number;
        };
    }[]>;
    updateBusinessStatus(id: string, body: {
        status: string;
    }): Promise<{
        id: string;
        businessName: string;
        businessEmail: string;
        password: string;
        phone: string | null;
        logo: string | null;
        description: string | null;
        locationLat: number | null;
        locationLng: number | null;
        locationAddress: string | null;
        mpesaNumber: string | null;
        tillNumber: string | null;
        paybillNumber: string | null;
        status: import(".prisma/client").$Enums.BusinessStatus;
        forcePasswordChange: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    resetBusinessPassword(id: string): Promise<{
        id: string;
        businessName: string;
        businessEmail: string;
        password: string;
        phone: string | null;
        logo: string | null;
        description: string | null;
        locationLat: number | null;
        locationLng: number | null;
        locationAddress: string | null;
        mpesaNumber: string | null;
        tillNumber: string | null;
        paybillNumber: string | null;
        status: import(".prisma/client").$Enums.BusinessStatus;
        forcePasswordChange: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllComplaints(): Promise<({
        business: {
            id: string;
            businessName: string;
            businessEmail: string;
        };
    } & {
        id: string;
        description: string;
        status: import(".prisma/client").$Enums.ComplaintStatus;
        createdAt: Date;
        updatedAt: Date;
        businessId: string;
        customerName: string;
        customerEmail: string | null;
        resolution: string | null;
    })[]>;
    updateComplaint(id: string, body: {
        status: string;
        resolution?: string;
    }): Promise<{
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
    getAllReviews(): Promise<({
        business: {
            id: string;
            businessName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        businessId: string;
        customerName: string;
        rating: number;
        comment: string | null;
        isApproved: boolean;
    })[]>;
    updateReview(id: string, body: {
        isApproved: boolean;
    }): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        customerName: string;
        rating: number;
        comment: string | null;
        isApproved: boolean;
    }>;
}
