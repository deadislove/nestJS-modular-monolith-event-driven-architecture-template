import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { UserService } from "../application/services/user.service";
import { DomainException } from "@core/exceptions/base-exception";
import { User } from "../domain/entities/user.entity";
import { plainToInstance } from "class-transformer";
import { CreateUserDto, UpdateUserDto } from "../application/dtos";

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController { 
    constructor(private readonly userService:UserService) {}

    @Get()
    async getUsers() {
        return this.userService.getAll()
    }

    @Get(':id')
    async getUserById(
        @Param('id', ParseIntPipe) id:number
    ) {
        if( id === 0) {
            throw new DomainException('BAD_REQUEST','id can not equal to 0.', HttpStatus.BAD_REQUEST)
        }

        return this.getUserById(id)
    }

    @Post()
    async createUser(
        @Body() requestModel: CreateUserDto
    ) {
        const user:User = plainToInstance(User, requestModel)
        return this.userService.createUser(user)
    }

    @Put(':id')
    async updateUser(
        @Param('id', ParseIntPipe) id:number,
        @Body() requestModel: UpdateUserDto
    ) {
        if(id !== requestModel.id || !requestModel) {
            throw new DomainException('BAD_REQUEST' ,'Parameter ID must equal to request model info.', HttpStatus.BAD_REQUEST)
        }

        const user:User = plainToInstance(User, requestModel)

        return this.userService.updateUser(user)
    }

    @Delete(':id')
    async deleteUser(
        @Param('id', ParseIntPipe) id:number
    ) {
        if(id === 0) {
            throw new DomainException('BAD_REQUEST','Parameter ID can\'t equal to 0', HttpStatus.BAD_REQUEST)
        }

        return this.userService.deleteUserById(id)
    }
}