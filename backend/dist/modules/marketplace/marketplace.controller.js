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
exports.MarketplaceController = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let MarketplaceController = class MarketplaceController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllProducts(search, category, lat, lng) {
        const products = await this.prisma.product.findMany({
            where: {
                isPublished: true,
                quantityRemaining: { gt: 0 },
                ...(category && { category }),
                ...(search && {
                    OR: [
                        { name: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            },
            include: {
                business: {
                    select: {
                        id: true,
                        businessName: true,
                        locationLat: true,
                        locationLng: true,
                        locationAddress: true,
                        phone: true,
                        mpesaNumber: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);
            const productsWithDistance = products.map((product) => {
                let distance = null;
                if (product.business.locationLat && product.business.locationLng) {
                    const R = 6371;
                    const dLat = this.toRad(product.business.locationLat - userLat);
                    const dLon = this.toRad(product.business.locationLng - userLng);
                    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(this.toRad(userLat)) *
                            Math.cos(this.toRad(product.business.locationLat)) *
                            Math.sin(dLon / 2) *
                            Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    distance = R * c;
                }
                return { ...product, distance };
            });
            return productsWithDistance.sort((a, b) => {
                if (a.distance === null)
                    return 1;
                if (b.distance === null)
                    return -1;
                return a.distance - b.distance;
            });
        }
        return products;
    }
    async getBusinessStorefront(id) {
        const business = await this.prisma.business.findFirst({
            where: { id, status: 'ACTIVE' },
            select: {
                id: true,
                businessName: true,
                description: true,
                logo: true,
                phone: true,
                locationLat: true,
                locationLng: true,
                locationAddress: true,
                mpesaNumber: true,
                tillNumber: true,
                paybillNumber: true,
            },
        });
        if (!business) {
            return null;
        }
        const products = await this.prisma.product.findMany({
            where: {
                businessId: id,
                isPublished: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        const reviews = await this.prisma.review.findMany({
            where: {
                businessId: id,
                isApproved: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 10,
        });
        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;
        return {
            business,
            products,
            reviews,
            avgRating,
            totalReviews: reviews.length,
        };
    }
    async getProduct(id) {
        const product = await this.prisma.product.findFirst({
            where: {
                id,
                isPublished: true,
            },
            include: {
                business: {
                    select: {
                        id: true,
                        businessName: true,
                        phone: true,
                        locationAddress: true,
                        mpesaNumber: true,
                        tillNumber: true,
                        paybillNumber: true,
                    },
                },
            },
        });
        return product;
    }
    async submitReview(body) {
        return this.prisma.review.create({
            data: {
                businessId: body.businessId,
                customerName: body.customerName,
                rating: body.rating,
                comment: body.comment,
            },
        });
    }
    async submitComplaint(body) {
        return this.prisma.complaint.create({
            data: {
                businessId: body.businessId,
                customerName: body.customerName,
                customerEmail: body.customerEmail,
                description: body.description,
            },
        });
    }
    toRad(value) {
        return (value * Math.PI) / 180;
    }
};
exports.MarketplaceController = MarketplaceController;
__decorate([
    (0, common_1.Get)('products'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category')),
    __param(2, (0, common_1.Query)('lat')),
    __param(3, (0, common_1.Query)('lng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('business/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getBusinessStorefront", null);
__decorate([
    (0, common_1.Get)('products/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "getProduct", null);
__decorate([
    (0, common_1.Post)('reviews'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "submitReview", null);
__decorate([
    (0, common_1.Post)('complaints'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MarketplaceController.prototype, "submitComplaint", null);
exports.MarketplaceController = MarketplaceController = __decorate([
    (0, common_1.Controller)('marketplace'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MarketplaceController);
//# sourceMappingURL=marketplace.controller.js.map