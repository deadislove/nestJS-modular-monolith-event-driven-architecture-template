import { UserService } from "@modules/user/application/services/user.service"
import { User } from "@modules/user/domain/entities/user.entity"
import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { plainToInstance } from "class-transformer"

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) { }

    async validateUser(username: string, password: string): Promise<any> {
        const user = await this.userService.validateCredentials(username, password)
        if (!user) {
            throw new UnauthorizedException('Invalid credentials')
        }
        return user
    }

    async login(user: any): Promise<{ access_token: string }> {
        const payload = { sub: user.id, username: user.name }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }

    async logout(userId: number) {
        return {
            messages: `Logged out successfully(${userId})`
        }
    }

    async register(username: string, email: string): Promise<{ message: string, access_token: string }> {

        const userEntity = plainToInstance(User, { name: username, email: email })
        const user = await this.userService.createUser(userEntity)
        const payload = { sub: user.id, username: user.name }
        return {
            message: `Register New User: ${username}`,
            access_token: this.jwtService.sign(payload),
        }
    }
}