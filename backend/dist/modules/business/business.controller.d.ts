import { PrismaService } from '../../database/prisma.service';
export declare class BusinessController {
    private prisma;
    constructor(prisma: PrismaService);
    getMe(businessId: string): Promise<{
        id: string;
        businessName: string;
        businessEmail: string;
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
    } | null>;
    updateMe(businessId: string, body: {
        phone?: string;
        logo?: string;
        description?: string;
        locationLat?: number;
        locationLng?: number;
        locationAddress?: string;
        mpesaNumber?: string;
        tillNumber?: string;
        paybillNumber?: string;
    }): Promise<{
        id: string;
        businessName: string;
        businessEmail: string;
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
}
