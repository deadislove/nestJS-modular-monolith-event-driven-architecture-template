import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcryptjs'
import { IUserRepository } from "@modules/user/domain/interfaces/user.repository.interface";
import { User } from "@modules/user/domain/entities/user.entity";
import { plainToInstance } from "class-transformer";
import UserTypeOrmEntity from "@modules/user/infra/typeorm/entities/user.orm-entity";
import { UserId } from "@modules/user/domain/value-objects/user-id.vo";
import { DomainException } from "@core/exceptions/base-exception";
import { EventBusService } from "@infra/event-bus/event-bus.service";
import { UserCreatedEvent } from "../events/account-created.event";

@Injectable()
export class UserService {

    constructor(
        @Inject('IUserRepository')
        private readonly userRepository: IUserRepository,
        private readonly eventBus: EventBusService
    ) { }

    async validateCredentials(username: string, email: string): Promise<User | null> {
        try {
            const user: User | null = await this.findByUsername(username);
            const isValid: boolean | null = user && (await bcrypt.compare(email, user.email));
            return isValid ? user : null;
        } catch (error) {
            throw new DomainException('VALIDATE_CREDENTIALS_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async findByUsername(username: string): Promise<User | null> {
        try {
            return this.userRepository.findByUsername(username)
        } catch (error) {
            throw new DomainException('GET_USER_BY_NAME_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async createUser(user: User): Promise<Partial<User> & User> {
        try {
            let entity: UserTypeOrmEntity = plainToInstance(UserTypeOrmEntity, user)

            if(entity.email) {
                const saltRounds:number = 10
                const hashedEmail = await bcrypt.hash(entity.email, saltRounds)
                entity.email = hashedEmail
            }

            const result = await this.userRepository.create(entity)
            await this.eventBus.publish( new UserCreatedEvent(result.id, result.email))
            return result
        } catch (error) {
            throw new DomainException('CREAT_USER_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async updateUser(user: User): Promise<boolean> {
        try {
            let entity: UserTypeOrmEntity = plainToInstance(UserTypeOrmEntity, user)

            if(entity.email) {
                const saltRounds:number = 10
                const hashedEmail = await bcrypt.hash(entity.email, saltRounds)
                entity.email = hashedEmail
            }

            return this.userRepository.update(new UserId(entity.id), entity)
        } catch (error) {
            throw new DomainException('UPDATE_USER_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async getAll(): Promise<User[]> {
        try {
            return this.userRepository.findAll()
        } catch (error) {
            throw new DomainException('GET_USER_LIST_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async getUserById(id: number): Promise<User | null> {
        try {
            return this.userRepository.findOne(new UserId(id))
        } catch (error) {
            throw new DomainException('GET_USER_BY_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async deleteUserById(id: number): Promise<boolean> {
        try {
            return this.userRepository.delete(new UserId(id))
        } catch (error) {
            throw new DomainException('DELETE_USER_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }
}