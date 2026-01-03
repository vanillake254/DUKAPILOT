import {
    Body,
    Controller,
    Get,
    Patch,
    UseGuards,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetBusinessId } from '../../common/decorators/get-user.decorator';

@Controller('business')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BUSINESS')
export class BusinessController {
    constructor(private prisma: PrismaService) { }

    @Get('me')
    async getMe(@GetBusinessId() businessId: string) {
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

    @Patch('me')
    async updateMe(
        @GetBusinessId() businessId: string,
        @Body()
        body: {
            phone?: string;
            logo?: string;
            description?: string;
            locationLat?: number;
            locationLng?: number;
            locationAddress?: string;
            mpesaNumber?: string;
            tillNumber?: string;
            paybillNumber?: string;
        },
    ) {
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
}
