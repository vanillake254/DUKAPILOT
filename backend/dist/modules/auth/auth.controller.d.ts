import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(body: any): Promise<{
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
    login(body: any): Promise<{
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
    adminLogin(body: {
        email: string;
        password: string;
    }): Promise<{
        message: string;
        token: string;
        admin: {
            id: string;
            email: string;
            name: string;
            role: import(".prisma/client").$Enums.AdminRole;
        };
    }>;
    forgotPassword(body: any): Promise<{
        message: string;
        businessId: string;
    }>;
    changePassword(req: any, body: any): Promise<{
        message: string;
    }>;
    resetPassword(body: {
        businessId: string;
    }): Promise<{
        message: string;
    }>;
}
