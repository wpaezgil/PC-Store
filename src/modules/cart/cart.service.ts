import { CartRepository } from './cart.repository';
import { ProductRepository } from '../product/product.repository';
import { AddToCartDTO, Cart } from './cart.model';

export class CartService {
  private cartRepo = new CartRepository();
  private productRepo = new ProductRepository();

  async getCart(userId: string): Promise<Cart> {
    const cart = await this.cartRepo.findByUserId(userId);
    if (!cart) {
      return { userId, items: [], total: 0, updatedAt: new Date() };
    }
    return cart;
  }

  async addItem(dto: AddToCartDTO): Promise<Cart> {
    const product = await this.productRepo.findById(dto.productId);
    if (!product) {
      throw new Error('El producto no existe en el catálogo.');
    }

    const cart = await this.getCart(dto.userId);
    const existingIndex = cart.items.findIndex((i) => i.productId === dto.productId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += dto.quantity;
      cart.items[existingIndex].subtotal =
        cart.items[existingIndex].quantity * product.price;
    } else {
      cart.items.push({
        productId: dto.productId,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: dto.quantity,
        subtotal: product.price * dto.quantity,
      });
    }

    cart.total = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    cart.updatedAt = new Date();

    return await this.cartRepo.saveCart(cart);
  }

  async removeItem(userId: string, productId: string): Promise<Cart> {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.total = cart.items.reduce((acc, item) => acc + item.subtotal, 0);
    cart.updatedAt = new Date();

    return await this.cartRepo.saveCart(cart);
  }

  async clearCart(userId: string): Promise<boolean> {
    return await this.cartRepo.clearCart(userId);
  }
}