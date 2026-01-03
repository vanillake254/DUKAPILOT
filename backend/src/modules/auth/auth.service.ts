import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';

export class RegisterBusinessDto {
    businessName: string;
    businessEmail: string;
    password: string;
    phone?: string;
}

export class LoginDto {
    businessName: string;
    password: string;
}

export class ForgotPasswordDto {
    businessNameOrEmail: string;
}

export class ChangePasswordDto {
    currentPassword: string;
    newPassword: string;
}

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    // Hash password
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    // Compare passwords
    async comparePasswords(
        plainPassword: string,
        hashedPassword: string,
    ): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }

    // Register a new business
    async registerBusiness(dto: RegisterBusinessDto) {
        // Check if business name already exists
        const existingBusiness = await this.prisma.business.findFirst({
            where: {
                OR: [
                    { businessName: dto.businessName },
                    { businessEmail: dto.businessEmail },
                ],
            },
        });

        if (existingBusiness) {
            throw new ConflictException(
                'Business name or email already exists',
            );
        }

        // Hash password
        const hashedPassword = await this.hashPassword(dto.password);

        // Create business
        const business = await this.prisma.business.create({
            data: {
                businessName: dto.businessName,
                businessEmail: dto.businessEmail,
                password: hashedPassword,
                phone: dto.phone,
                status: 'ACTIVE',
            },
        });

        // Generate JWT token
        const token = this.generateToken(business);

        return {
            message: 'Business registered successfully',
            token,
            business: {
                id: business.id,
                businessName: business.businessName,
                businessEmail: business.businessEmail,
                status: business.status,
                forcePasswordChange: business.forcePasswordChange,
            },
        };
    }

    // Business login
    async loginBusiness(dto: LoginDto) {
        // Find business by name
        const business = await this.prisma.business.findUnique({
            where: { businessName: dto.businessName },
        });

        if (!business) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Check if business is suspended
        if (business.status === 'SUSPENDED') {
            throw new UnauthorizedException(
                'Your account has been suspended. Please contact admin.',
            );
        }

        // Verify password
        const isPasswordValid = await this.comparePasswords(
            dto.password,
            business.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const token = this.generateToken(business);

        return {
            message: 'Login successful',
            token,
            business: {
                id: business.id,
                businessName: business.businessName,
                businessEmail: business.businessEmail,
                status: business.status,
                forcePasswordChange: business.forcePasswordChange,
            },
        };
    }

    // Super Admin login
    async loginAdmin(email: string, password: string) {
        const admin = await this.prisma.admin.findUnique({
            where: { email },
        });

        if (!admin) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await this.comparePasswords(
            password,
            admin.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({
            sub: admin.id,
            role: 'SUPER_ADMIN',
            email: admin.email,
        });

        return {
            message: 'Admin login successful',
            token,
            admin: {
                id: admin.id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
            },
        };
    }

    // Forgot password (Super Admin reset flow)
    async forgotPassword(dto: ForgotPasswordDto) {
        const business = await this.prisma.business.findFirst({
            where: {
                OR: [
                    { businessName: dto.businessNameOrEmail },
                    { businessEmail: dto.businessNameOrEmail },
                ],
            },
        });

        if (!business) {
            throw new NotFoundException('Business not found');
        }

        // In a real scenario, this would send a request to super admin
        // For now, return a message
        return {
            message:
                'Password reset request sent to Super Admin. Please contact support.',
            businessId: business.id,
        };
    }

    // Super Admin reset business password (to "00000000")
    async resetBusinessPassword(businessId: string) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
        });

        if (!business) {
            throw new NotFoundException('Business not found');
        }

        const resetPassword = '00000000';
        const hashedPassword = await this.hashPassword(resetPassword);

        await this.prisma.business.update({
            where: { id: businessId },
            data: {
                password: hashedPassword,
                forcePasswordChange: true,
            },
        });

        return {
            message: 'Password reset to 00000000. Business must change on next login.',
        };
    }

    // Change password
    async changePassword(businessId: string, dto: ChangePasswordDto) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
        });

        if (!business) {
            throw new NotFoundException('Business not found');
        }

        // Verify current password
        const isCurrentPasswordValid = await this.comparePasswords(
            dto.currentPassword,
            business.password,
        );

        if (!isCurrentPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Hash new password
        const newHashedPassword = await this.hashPassword(dto.newPassword);

        // Update password and remove force change flag
        await this.prisma.business.update({
            where: { id: businessId },
            data: {
                password: newHashedPassword,
                forcePasswordChange: false,
            },
        });

        return {
            message: 'Password changed successfully',
        };
    }

    // Generate JWT token
    private generateToken(business: any) {
        return this.jwtService.sign({
            sub: business.id,
            businessId: business.id,
            role: 'BUSINESS',
            email: business.businessEmail,
            forcePasswordChange: business.forcePasswordChange,
        });
    }
}
