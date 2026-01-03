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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const bcrypt = __importStar(require("bcrypt"));
let AdminController = class AdminController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const totalBusinesses = await this.prisma.business.count();
        const activeBusinesses = await this.prisma.business.count({
            where: { status: 'ACTIVE' },
        });
        const suspendedBusinesses = await this.prisma.business.count({
            where: { status: 'SUSPENDED' },
        });
        const totalProducts = await this.prisma.product.count();
        const totalOrders = await this.prisma.order.count();
        const pendingComplaints = await this.prisma.complaint.count({
            where: { status: 'PENDING' },
        });
        return {
            totalBusinesses,
            activeBusinesses,
            suspendedBusinesses,
            totalProducts,
            totalOrders,
            pendingComplaints,
        };
    }
    async getAllBusinesses() {
        return this.prisma.business.findMany({
            select: {
                id: true,
                businessName: true,
                businessEmail: true,
                phone: true,
                status: true,
                createdAt: true,
                _count: {
                    select: {
                        products: true,
                        orders: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateBusinessStatus(id, body) {
        return this.prisma.business.update({
            where: { id },
            data: { status: body.status },
        });
    }
    async resetBusinessPassword(id) {
        const hashedPassword = await bcrypt.hash('00000000', 10);
        return this.prisma.business.update({
            where: { id },
            data: {
                password: hashedPassword,
                forcePasswordChange: true,
            },
        });
    }
    async getAllComplaints() {
        return this.prisma.complaint.findMany({
            include: {
                business: {
                    select: {
                        id: true,
                        businessName: true,
                        businessEmail: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateComplaint(id, body) {
        return this.prisma.complaint.update({
            where: { id },
            data: {
                status: body.status,
                resolution: body.resolution,
            },
        });
    }
    async getAllReviews() {
        return this.prisma.review.findMany({
            include: {
                business: {
                    select: {
                        id: true,
                        businessName: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateReview(id, body) {
        return this.prisma.review.update({
            where: { id },
            data: { isApproved: body.isApproved },
        });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('dashboard'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getDashboardStats", null);
__decorate([
    (0, common_1.Get)('businesses'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllBusinesses", null);
__decorate([
    (0, common_1.Patch)('businesses/:id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateBusinessStatus", null);
__decorate([
    (0, common_1.Patch)('businesses/:id/reset-password'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "resetBusinessPassword", null);
__decorate([
    (0, common_1.Get)('complaints'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllComplaints", null);
__decorate([
    (0, common_1.Patch)('complaints/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateComplaint", null);
__decorate([
    (0, common_1.Get)('reviews'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getAllReviews", null);
__decorate([
    (0, common_1.Patch)('reviews/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateReview", null);
exports.AdminController = AdminController = __decorate([
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('SUPER_ADMIN'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map