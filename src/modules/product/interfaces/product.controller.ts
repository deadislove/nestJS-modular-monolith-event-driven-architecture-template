import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { ProductService } from "../application/services/product.service";
import { JwtAuthGuard } from "@common/guards/jwt-auth.guard";
import { DomainException } from "@core/exceptions/base-exception";
import { CreateProductDTO, UpdatedProductDTO } from "../application/dtos";
import { plainToInstance } from "class-transformer";
import { Product } from "../domain/entities/product.entity";

@UseGuards(JwtAuthGuard)
@Controller('product')
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Get()
    async getProducts() {
        return this.productService.getAll()
    }

    @Get(':id')
    async getProductById(
        @Param('id', ParseIntPipe) id: number
    ) {
        if (id === 0) {
            throw new DomainException('BAD_REQUEST', 'id can not equal to 0.', HttpStatus.BAD_REQUEST)
        }
        return this.productService.getProductById(id)
    }

    @Post()
    async createProduct(
        @Body() requestModel: CreateProductDTO
    ) {
        if(!requestModel) {
            throw new DomainException( 'CREATE_PRODUCT_FAILED','Body is null', HttpStatus.BAD_REQUEST)
        }

        const product: Product = plainToInstance(Product, requestModel)
        return this.productService.createProduct(product)
    }

    @Put(':id') 
    async updateProduct(
        @Param('id', ParseIntPipe) id:number,
        @Body() requestModel: UpdatedProductDTO
    ) {
        if(id !== +requestModel.id || !requestModel) {
            throw new DomainException('BAD_REQUEST' ,'Parameter ID must equal to request model info.', HttpStatus.BAD_REQUEST)
        }

        const product:Product = plainToInstance(Product, requestModel)
        return this.productService.updateProduct(product)
    }

    @Delete(':id')
    async deleteProduct(
        @Param('id', ParseIntPipe) id: number
    ) {
        if(id === 0) {
            throw new DomainException('BAD_REQUEST','Parameter ID can\'t equal to 0', HttpStatus.BAD_REQUEST)
        }

        return this.productService.deleteProductId(id)
    }
}