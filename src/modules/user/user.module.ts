import { forwardRef, Module } from "@nestjs/common";
import { UserService } from "./application/services/user.service";
import { UserRepository } from "./infra/repositories/user.repository.impl";
import { TypeOrmModule } from "@nestjs/typeorm";
import UserTypeOrmEntity from "./infra/typeorm/entities/user.orm-entity";
import { UserController } from "./interfaces/user.controller";
import { AuthController } from "./interfaces/auth.controller";
import { AuthModule } from "@modules/auth/auth.module";
import { EventBusService } from "@infra/event-bus/event-bus.service";
import { EventBusModule } from "@infra/event-bus/event-bus.module";
import { UserFacade } from "./application/facades/user.facades.service";


@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserTypeOrmEntity
        ]),
        forwardRef(() => AuthModule),
        EventBusModule.register(),
    ],
    controllers: [
        UserController,
        AuthController
    ],
    providers: [
        UserService,
        {
            provide: 'IUserRepository',
            useClass: UserRepository
        },
        UserFacade
    ],
    exports: [
        UserService,
        UserFacade,
    ]
})
export class UserModule {}