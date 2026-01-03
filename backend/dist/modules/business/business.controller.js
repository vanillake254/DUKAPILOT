"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusinessController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const get_user_decorator_1 = require("../../common/decorators/get-user.decorator");
let BusinessController = class BusinessController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMe(businessId) {
        return this.prisma.business.findUnique({
            where: { id: businessId },
            select: {
                id: true,
                businessName: true,
                businessEmail: true,
                phone: true,
                logo: true,
                description: true,
                locationLat: true,
                locationLng: true,
                locationAddress: true,
                mpesaNumber: true,
                tillNumber: true,
                paybillNumber: true,
                status: true,
                forcePasswordChange: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async updateMe(businessId, body) {
        return this.prisma.business.update({
            where: { id: businessId },
            data: {
                phone: body.phone,
                logo: body.logo,
                description: body.description,
                locationLat: body.locationLat,
                locationLng: body.locationLng,
                locationAddress: body.locationAddress,
                mpesaNumber: body.mpesaNumber,
                tillNumber: body.tillNumber,
                paybillNumber: body.paybillNumber,
            },
            select: {
                id: true,
                businessName: true,
                businessEmail: true,
                phone: true,
                logo: true,
                description: true,
                locationLat: true,
                locationLng: true,
                locationAddress: true,
                mpesaNumber: true,
                tillNumber: true,
                paybillNumber: true,
                status: true,
                forcePasswordChange: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
};
exports.BusinessController = BusinessController;
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, get_user_decorator_1.GetBusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getMe", null);
__decorate([
    (0, common_1.Patch)('me'),
    __param(0, (0, get_user_decorator_1.GetBusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "updateMe", null);
exports.BusinessController = BusinessController = __decorate([
    (0, common_1.Controller)('business'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)('BUSINESS'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessController);
//# sourceMappingURL=business.controller.js.map