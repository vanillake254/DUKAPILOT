"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = exports.ChangePasswordDto = exports.ForgotPasswordDto = exports.LoginDto = exports.RegisterBusinessDto = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../../database/prisma.service");
class RegisterBusinessDto {
    businessName;
    businessEmail;
    password;
    phone;
}
exports.RegisterBusinessDto = RegisterBusinessDto;
class LoginDto {
    businessName;
    password;
}
exports.LoginDto = LoginDto;
class ForgotPasswordDto {
    businessNameOrEmail;
}
exports.ForgotPasswordDto = ForgotPasswordDto;
class ChangePasswordDto {
    currentPassword;
    newPassword;
}
exports.ChangePasswordDto = ChangePasswordDto;
let AuthService = class AuthService {
    prisma;
    jwtService;
    constructor(prisma, jwtService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
    }
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }
    async comparePasswords(plainPassword, hashedPassword) {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
    async registerBusiness(dto) {
        const existingBusiness = await this.prisma.business.findFirst({
            where: {
                OR: [
                    { businessName: dto.businessName },
                    { businessEmail: dto.businessEmail },
                ],
            },
        });
        if (existingBusiness) {
            throw new common_1.ConflictException('Business name or email already exists');
        }
        const hashedPassword = await this.hashPassword(dto.password);
        const business = await this.prisma.business.create({
            data: {
                businessName: dto.businessName,
                businessEmail: dto.businessEmail,
                password: hashedPassword,
                phone: dto.phone,
                status: 'ACTIVE',
            },
        });
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
    async loginBusiness(dto) {
        const business = await this.prisma.business.findUnique({
            where: { businessName: dto.businessName },
        });
        if (!business) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (business.status === 'SUSPENDED') {
            throw new common_1.UnauthorizedException('Your account has been suspended. Please contact admin.');
        }
        const isPasswordValid = await this.comparePasswords(dto.password, business.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
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
    async loginAdmin(email, password) {
        const admin = await this.prisma.admin.findUnique({
            where: { email },
        });
        if (!admin) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await this.comparePasswords(password, admin.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
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
    async forgotPassword(dto) {
        const business = await this.prisma.business.findFirst({
            where: {
                OR: [
                    { businessName: dto.businessNameOrEmail },
                    { businessEmail: dto.businessNameOrEmail },
                ],
            },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        return {
            message: 'Password reset request sent to Super Admin. Please contact support.',
            businessId: business.id,
        };
    }
    async resetBusinessPassword(businessId) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
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
    async changePassword(businessId, dto) {
        const business = await this.prisma.business.findUnique({
            where: { id: businessId },
        });
        if (!business) {
            throw new common_1.NotFoundException('Business not found');
        }
        const isCurrentPasswordValid = await this.comparePasswords(dto.currentPassword, business.password);
        if (!isCurrentPasswordValid) {
            throw new common_1.BadRequestException('Current password is incorrect');
        }
        const newHashedPassword = await this.hashPassword(dto.newPassword);
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
    generateToken(business) {
        return this.jwtService.sign({
            sub: business.id,
            businessId: business.id,
            role: 'BUSINESS',
            email: business.businessEmail,
            forcePasswordChange: business.forcePasswordChange,
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map