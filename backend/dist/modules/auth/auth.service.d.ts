import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../database/prisma.service';
export declare class RegisterBusinessDto {
    businessName: string;
    businessEmail: string;
    password: string;
    phone?: string;
}
export declare class LoginDto {
    businessName: string;
    password: string;
}
export declare class ForgotPasswordDto {
    businessNameOrEmail: string;
}
export declare class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    hashPassword(password: string): Promise<string>;
    comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean>;
    registerBusiness(dto: RegisterBusinessDto): Promise<{
        message: string;
        token: string;
        business: {
            id: string;
            businessName: string;
            businessEmail: string;
            status: import(".prisma/client").$Enums.BusinessStatus;
            forcePasswordChange: boolean;
        };
    }>;
    loginBusiness(dto: LoginDto): Promise<{
        message: string;
        token: string;
        business: {
            id: string;
            businessName: string;
            businessEmail: string;
            status: "ACTIVE" | "PENDING";
            forcePasswordChange: boolean;
        };
    }>;
    loginAdmin(email: string, password: string): Promise<{
        message: string;
        token: string;
        admin: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.AdminRole;
        };
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        message: string;
        businessId: string;
    }>;
    resetBusinessPassword(businessId: string): Promise<{
        message: string;
    }>;
    changePassword(businessId: string, dto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    private generateToken;
}
