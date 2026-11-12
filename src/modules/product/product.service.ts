import { ProductRepository } from './product.repository';
import { Product, ProductCategory, ProductDTO } from './product.model';

export class ProductService {
  private repository = new ProductRepository();

  async createProduct(dto: ProductDTO): Promise<Product> {
    const newProduct: Product = {
      name: dto.name,
      price: dto.price,
      category: dto.category,
      active: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return await this.repository.create(newProduct);
  }

  async getAllProducts(category?: ProductCategory): Promise<Product[]> {
    if (category) {
      return await this.repository.findByCategory(category);
    }
    return await this.repository.findAll();
  }

  async getProductById(id: string): Promise<Product | null> {
    return await this.repository.findById(id);
  }

  async updateProduct(id: string, dto: Partial<ProductDTO>): Promise<boolean> {
    return await this.repository.update(id, { ...dto, updatedAt: new Date() });
  }

  async deleteProduct(id: string): Promise<boolean> {
    return await this.repository.delete(id);
  }
}