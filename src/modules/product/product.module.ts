import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import ProductTypeOrmEntity from "./infra/typeorm/entities/product.orm-entity";
import { UserModule } from "@modules/user/user.module";
import { ProductService } from "./application/services/product.service";
import { ProductRepository } from "./infra/repositories/product.repository.impl";
import { EventBusModule } from "@infra/event-bus/event-bus.module";
import { ProductFacade } from "./application/facades/product.facade.service";
import { ProductController } from "./interfaces/product.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProductTypeOrmEntity,
        ]),
        UserModule,
        EventBusModule.register()
    ],
    controllers: [
        ProductController,
    ],
    providers: [
        ProductService,
        {
            provide: 'IProductRepository',
            useClass: ProductRepository
        },
        ProductFacade
    ],
    exports: [
        ProductFacade
    ]
})
export class ProductModule {}