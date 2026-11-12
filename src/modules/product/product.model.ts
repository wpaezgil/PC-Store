import { ObjectId } from 'mongodb';

export type ProductCategory = 'componentes' | 'accesorios';

export interface Product {
  _id?: ObjectId;
  name: string;
  price: number;
  category: ProductCategory;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductDTO {
  name: string;
  price: number;
  category: ProductCategory;
}