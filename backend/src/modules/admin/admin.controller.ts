import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import * as bcrypt from 'bcrypt';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class AdminController {
    constructor(private prisma: PrismaService) { }

    // Get dashboard stats
    @Get('dashboard')
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

    // Get all businesses
    @Get('businesses')
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

    // Suspend/Activate business
    @Patch('businesses/:id/status')
    async updateBusinessStatus(
        @Param('id') id: string,
        @Body() body: { status: string },
    ) {
        return this.prisma.business.update({
            where: { id },
            data: { status: body.status as any },
        });
    }

    // Reset business password
    @Patch('businesses/:id/reset-password')
    async resetBusinessPassword(@Param('id') id: string) {
        const hashedPassword = await bcrypt.hash('00000000', 10);

        return this.prisma.business.update({
            where: { id },
            data: {
                password: hashedPassword,
                forcePasswordChange: true,
            },
        });
    }

    // Get all complaints
    @Get('complaints')
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

    // Update complaint status
    @Patch('complaints/:id')
    async updateComplaint(
        @Param('id') id: string,
        @Body() body: { status: string; resolution?: string },
    ) {
        return this.prisma.complaint.update({
            where: { id },
            data: {
                status: body.status as any,
                resolution: body.resolution,
            },
        });
    }

    // Get all reviews
    @Get('reviews')
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

    // Approve/reject review
    @Patch('reviews/:id')
    async updateReview(
        @Param('id') id: string,
        @Body() body: { isApproved: boolean },
    ) {
        return this.prisma.review.update({
            where: { id },
            data: { isApproved: body.isApproved },
        });
    }
}
