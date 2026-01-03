import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    UseGuards,
    Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetBusinessId } from '../../common/decorators/get-user.decorator';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    // Customer creates order (public endpoint)
    @Post()
    create(@Body() createOrderDto: any) {
        return this.ordersService.create(createOrderDto.businessId, createOrderDto);
    }

    // Business gets their orders
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUSINESS')
    @Get()
    findAll(
        @GetBusinessId() businessId: string,
        @Query('status') status?: string,
    ) {
        return this.ordersService.findAll(businessId, status);
    }

    // Get order stats
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUSINESS')
    @Get('stats')
    getStats(@GetBusinessId() businessId: string) {
        return this.ordersService.getStats(businessId);
    }

    // Get single order
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUSINESS')
    @Get(':id')
    findOne(@GetBusinessId() businessId: string, @Param('id') id: string) {
        return this.ordersService.findOne(businessId, id);
    }

    // Update order status
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('BUSINESS')
    @Patch(':id/status')
    updateStatus(
        @GetBusinessId() businessId: string,
        @Param('id') id: string,
        @Body() body: { status: string; mpesaCode?: string },
    ) {
        return this.ordersService.updateStatus(
            businessId,
            id,
            body.status,
            body.mpesaCode,
        );
    }
}
