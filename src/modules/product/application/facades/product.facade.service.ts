import { Injectable } from "@nestjs/common";
import { ProductService } from "../services/product.service";
import { UserFacade } from "@modules/user/application/facades/user.facades.service";

@Injectable()
export class ProductFacade {
    constructor(
        private readonly productService: ProductService,
        private readonly userFacade: UserFacade
    ) {}
}