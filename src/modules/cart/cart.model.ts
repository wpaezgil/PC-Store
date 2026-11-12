import { ObjectId } from 'mongodb';

export interface CartItem {
  productId: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  _id?: ObjectId;
  userId: string; // Identificador del cliente o sesión (ej. "cliente-1")
  items: CartItem[];
  total: number;
  updatedAt: Date;
}

export interface AddToCartDTO {
  userId: string;
  productId: string;
  quantity: number;
}