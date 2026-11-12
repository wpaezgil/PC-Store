import { Collection, ObjectId } from 'mongodb';
import { getDb } from '../../config/database';
import { Product, ProductCategory } from './product.model';

export class ProductRepository {
  private collection(): Collection<Product> {
    return getDb().collection<Product>('products');
  }

  async create(data: Product): Promise<Product> {
    const result = await this.collection().insertOne(data);
    return { ...data, _id: result.insertedId };
  }

  async findAll(): Promise<Product[]> {
    return await this.collection().find().toArray();
  }

  async findByCategory(category: ProductCategory): Promise<Product[]> {
    return await this.collection().find({ category }).toArray();
  }

  async findById(id: string): Promise<Product | null> {
    return await this.collection().findOne({ _id: new ObjectId(id) });
  }

  async update(id: string, data: Partial<Product>): Promise<boolean> {
    const result = await this.collection().updateOne(
      { _id: new ObjectId(id) },
      { $set: data }
    );
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}