import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('marketplace')
export class MarketplaceController {
    constructor(private prisma: PrismaService) { }

    // Get all published products from all businesses
    @Get('products')
    async getAllProducts(
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('lat') lat?: string,
        @Query('lng') lng?: string,
    ) {
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

        // If location provided, calculate distance and sort
        if (lat && lng) {
            const userLat = parseFloat(lat);
            const userLng = parseFloat(lng);

            const productsWithDistance = products.map((product) => {
                let distance: number | null = null;
                if (product.business.locationLat && product.business.locationLng) {
                    // Haversine formula for distance
                    const R = 6371; // Earth's radius in km
                    const dLat = this.toRad(product.business.locationLat - userLat);
                    const dLon = this.toRad(product.business.locationLng - userLng);
                    const a =
                        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                        Math.cos(this.toRad(userLat)) *
                        Math.cos(this.toRad(product.business.locationLat)) *
                        Math.sin(dLon / 2) *
                        Math.sin(dLon / 2);
                    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    distance = R * c;
                }
                return { ...product, distance };
            });

            // Sort by distance
            return productsWithDistance.sort((a, b) => {
                if (a.distance === null) return 1;
                if (b.distance === null) return -1;
                return a.distance - b.distance;
            });
        }

        return products;
    }

    // Get business storefront
    @Get('business/:id')
    async getBusinessStorefront(@Param('id') id: string) {
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

        const avgRating =
            reviews.length > 0
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

    // Get product details
    @Get('products/:id')
    async getProduct(@Param('id') id: string) {
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

    // Submit review
    @Post('reviews')
    async submitReview(@Body() body: any) {
        return this.prisma.review.create({
            data: {
                businessId: body.businessId,
                customerName: body.customerName,
                rating: body.rating,
                comment: body.comment,
            },
        });
    }

    // Submit complaint
    @Post('complaints')
    async submitComplaint(@Body() body: any) {
        return this.prisma.complaint.create({
            data: {
                businessId: body.businessId,
                customerName: body.customerName,
                customerEmail: body.customerEmail,
                description: body.description,
            },
        });
    }

    private toRad(value: number): number {
        return (value * Math.PI) / 180;
    }
}
