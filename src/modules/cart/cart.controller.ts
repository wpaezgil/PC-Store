import { Request, Response } from 'express';
import { CartService } from './cart.service';

export class CartController {
  private service = new CartService();

  getCart = async (req: Request, res: Response): Promise<void> => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const cart = await this.service.getCart(userId);
    res.json(cart);
  };

  addItem = async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId, productId, quantity } = req.body;
      if (!userId || !productId || !quantity || quantity <= 0) {
        res.status(400).json({ message: 'Los campos userId, productId y quantity (> 0) son obligatorios.' });
        return;
      }
      const cart = await this.service.addItem({ userId, productId, quantity });
      res.status(200).json(cart);
    } catch (error: any) {
      res.status(404).json({ message: error.message || 'Error al agregar al carrito' });
    }
  };

  removeItem = async (req: Request, res: Response): Promise<void> => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    const productId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
    const cart = await this.service.removeItem(userId, productId);
    res.json(cart);
  };

  clearCart = async (req: Request, res: Response): Promise<void> => {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
    await this.service.clearCart(userId);
    res.json({ message: 'Carrito vaciado exitosamente' });
  };
}