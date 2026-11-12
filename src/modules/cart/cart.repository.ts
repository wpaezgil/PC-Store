import { Collection } from 'mongodb';
import { getDb } from '../../config/database';
import { Cart } from './cart.model';

export class CartRepository {
  private collection(): Collection<Cart> {
    return getDb().collection<Cart>('carts');
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    return await this.collection().findOne({ userId });
  }

  async saveCart(cart: Cart): Promise<Cart> {
    await this.collection().updateOne(
      { userId: cart.userId },
      { $set: cart },
      { upsert: true } // Crea el carrito si no existe, o lo actualiza si ya existe
    );
    return cart;
  }

  async clearCart(userId: string): Promise<boolean> {
    const result = await this.collection().deleteOne({ userId });
    return result.deletedCount > 0;
  }
}