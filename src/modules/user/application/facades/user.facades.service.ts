import { HttpStatus, Injectable } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { DomainException } from "@core/exceptions/base-exception";

@Injectable()
export class UserFacade {
    constructor(
        private readonly userService: UserService
    ){}

    async findUser(userId: number, userName: string) {
        if(userId) {
            return this.userService.getUserById(userId)
        }

        if(userName) {
            return this.userService.findByUsername(userName)
        }

        throw new DomainException('FIND_USER_FAILED', 'FIND_USER_FAILED', HttpStatus.BAD_REQUEST)
    }
}