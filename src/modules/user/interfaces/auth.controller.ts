import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { LoginDto } from "../application/dtos/login.dto";
import { AuthService } from "@modules/auth/auth.service";
import { RegisterDto } from "../application/dtos/register.dto";
import { User } from "@common/decorators/user.decorator";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService:AuthService
    ){}

    @Post('login')
    async Login(
        @Body() requestModel: LoginDto
    ) {
        const user = await this.authService.validateUser(requestModel.name, requestModel.email)
        return this.authService.login(user)
    }

    @Post('register')
    async Register(
        @Body() requestModel: RegisterDto
    ) {
        return this.authService.register(requestModel.name, requestModel.email)
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    async Logout(@User() user:any) {
        return this.authService.logout(user.UserId)
    }
}