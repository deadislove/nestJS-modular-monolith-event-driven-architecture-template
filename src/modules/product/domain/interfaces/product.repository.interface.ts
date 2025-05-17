import ProductTypeOrmEntity from "@modules/product/infra/typeorm/entities/product.orm-entity"
import { Product } from "../entities/product.entity"
import { ProductId } from "../value-objects/product-id.vo"

export interface IProductRepository {
    findOne(id: ProductId): Promise<Product | null>
    findAll(): Promise<Product[]>
    create(entity: Partial<ProductTypeOrmEntity>): Promise<Partial<Product> & Product>
    update(id: ProductId, entity: Partial<ProductTypeOrmEntity>): Promise<boolean>
    delete(id: ProductId): Promise<boolean>
}