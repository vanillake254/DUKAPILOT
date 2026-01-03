import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
    Patch,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // Business Registration
    @Post('register')
    async register(@Body() body: any) {
        return this.authService.registerBusiness(body);
    }

    // Business Login
    @Post('login')
    async login(@Body() body: any) {
        return this.authService.loginBusiness(body);
    }

    // Admin Login
    @Post('admin/login')
    async adminLogin(@Body() body: { email: string; password: string }) {
        return this.authService.loginAdmin(body.email, body.password);
    }

    // Forgot Password
    @Post('forgot-password')
    async forgotPassword(@Body() body: any) {
        return this.authService.forgotPassword(body);
    }

    // Change Password (Business must be logged in)
    @UseGuards(JwtAuthGuard)
    @Patch('change-password')
    async changePassword(@Req() req: any, @Body() body: any) {
        return this.authService.changePassword(req.user.sub, body);
    }

    // Super Admin: Reset Business Password
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('SUPER_ADMIN')
    @Post('admin/reset-password/:businessId')
    async resetPassword(@Body() body: { businessId: string }) {
        return this.authService.resetBusinessPassword(body.businessId);
    }
}
