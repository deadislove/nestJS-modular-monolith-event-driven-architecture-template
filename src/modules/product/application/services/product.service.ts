import { DomainException } from "@core/exceptions/base-exception";
import { EventBusService } from "@infra/event-bus/event-bus.service";
import { Product } from "@modules/product/domain/entities/product.entity";
import { IProductRepository } from "@modules/product/domain/interfaces/product.repository.interface";
import { ProductId } from "@modules/product/domain/value-objects/product-id.vo";
import ProductTypeOrmEntity from "@modules/product/infra/typeorm/entities/product.orm-entity";
import { HttpStatus, Inject } from "@nestjs/common";
import { plainToInstance } from "class-transformer";

export class ProductService {
    constructor(
        @Inject('IProductRepository')
        private readonly productRepository: IProductRepository,
        private readonly eventBus: EventBusService
    ) { }

    async createProduct(product: Product): Promise<Product> {
        try {
            const entity: ProductTypeOrmEntity = plainToInstance(ProductTypeOrmEntity, product)
            const result: Product = await this.productRepository.create(entity)
            return result
        } catch (error) {
            throw new DomainException('CREATE_PRODUCT_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async updateProduct(product: Product): Promise<boolean> {
        try {
            const entity: ProductTypeOrmEntity = plainToInstance(ProductTypeOrmEntity, product)
            return this.productRepository.update(new ProductId(entity.id), entity)
        } catch (error) {
            throw new DomainException('UPDATE_PRODUCT_BY_ID_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async getAll(): Promise<Product[]> {
        try {
            return this.productRepository.findAll()
        }
        catch (error) {
            throw new DomainException('GET_PRODUCT_LIST_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async getProductById(id: number): Promise<Product | null> {
        try {
            return this.productRepository.findOne(new ProductId(id))
        } catch (error) {
            throw new DomainException('GET_PRODUCT_BY_ID_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async deleteProductId(id: number): Promise<boolean> {
        try {
            return this.productRepository.delete(new ProductId(id))
        } catch (error) {
            throw new DomainException('DELETE_PRODUCT_BY_ID_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }
}