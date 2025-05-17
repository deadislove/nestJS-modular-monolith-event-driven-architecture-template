import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import ProductTypeOrmEntity from "../typeorm/entities/product.orm-entity";
import { plainToInstance } from "class-transformer";
import { IProductRepository } from "@modules/product/domain/interfaces/product.repository.interface";
import { Product } from "@modules/product/domain/entities/product.entity";
import { ProductId } from "@modules/product/domain/value-objects/product-id.vo";
import { DomainException } from "@core/exceptions/base-exception";

@Injectable()
export class ProductRepository implements IProductRepository {
    constructor(
        @InjectRepository(ProductTypeOrmEntity)
        private readonly repo: Repository<ProductTypeOrmEntity>
    ) { }

    async findOne(id: ProductId): Promise<Product | null> {

        try {
            const data: ProductTypeOrmEntity | null = await this.repo.findOne({
                where: {
                    id: id.value
                }
            })

            return plainToInstance(Product, data)
        } catch (error) {
            throw new DomainException('GET_PRODUCT_BY_ID_BY_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async findAll(): Promise<Product[]> {
        try {
            const data: ProductTypeOrmEntity[] = await this.repo.find()

            return plainToInstance(Product, data)
        } catch (error) {
            throw new DomainException('GET_PRODUCT_LIST_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async create(entity: Partial<ProductTypeOrmEntity>): Promise<Partial<Product> & Product> {
        try {
            const result: Partial<ProductTypeOrmEntity> & ProductTypeOrmEntity = await this.repo.save(entity)

            return plainToInstance(Product, result)
        } catch (error) {
            throw new DomainException('CREATE_PRODUCT_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async update(id: ProductId, entity: Partial<ProductTypeOrmEntity>): Promise<boolean> {
        try {
            const result: UpdateResult = await this.repo.update(id.value, entity)

            return result.affected !== 0
        } catch (error) {
            throw new DomainException('UPDATE_PRODUCT_BY_ID_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }

    async delete(id: ProductId): Promise<boolean> {
        try {
            const result: DeleteResult = await this.repo.delete(id.value)

            return result.affected !== 0
        } catch (error) {
            throw new DomainException('DELETE_PRODUCT_BY_ID_FAILED', error.message, HttpStatus.BAD_REQUEST)
        }
    }
}