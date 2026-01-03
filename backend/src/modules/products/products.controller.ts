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
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetBusinessId } from '../../common/decorators/get-user.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('BUSINESS')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    create(@GetBusinessId() businessId: string, @Body() createProductDto: any) {
        return this.productsService.create(businessId, createProductDto);
    }

    @Post('bulk-onboard')
    bulkOnboard(@GetBusinessId() businessId: string, @Body() body: { items: any[] }) {
        return this.productsService.bulkOnboard(businessId, body.items);
    }

    @Get()
    findAll(
        @GetBusinessId() businessId: string,
        @Query('category') category?: string,
        @Query('isPublished') isPublished?: string,
        @Query('search') search?: string,
    ) {
        return this.productsService.findAll(businessId, {
            category,
            isPublished: isPublished === 'true',
            search,
        });
    }

    @Get('inventory-summary')
    getInventorySummary(@GetBusinessId() businessId: string) {
        return this.productsService.getInventorySummary(businessId);
    }

    @Get('categories')
    getCategories(@GetBusinessId() businessId: string) {
        return this.productsService.getCategories(businessId);
    }

    @Get(':id')
    findOne(@GetBusinessId() businessId: string, @Param('id') id: string) {
        return this.productsService.findOne(businessId, id);
    }

    @Patch(':id')
    update(
        @GetBusinessId() businessId: string,
        @Param('id') id: string,
        @Body() updateProductDto: any,
    ) {
        return this.productsService.update(businessId, id, updateProductDto);
    }

    @Post(':id/sell')
    recordSale(
        @GetBusinessId() businessId: string,
        @Param('id') id: string,
        @Body() body: { quantity: number; notes?: string },
    ) {
        return this.productsService.recordSale(
            businessId,
            id,
            body.quantity,
            body.notes,
        );
    }

    @Delete(':id')
    remove(@GetBusinessId() businessId: string, @Param('id') id: string) {
        return this.productsService.remove(businessId, id);
    }
}
