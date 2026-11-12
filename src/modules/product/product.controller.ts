import { Request, Response } from 'express';
import { ProductService } from './product.service';
import { ProductCategory } from './product.model';

export class ProductController {
  private service = new ProductService();
  private validCategories: ProductCategory[] = ['componentes', 'accesorios'];

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, price, category } = req.body;
      if (!name || price === undefined || !category) {
        res.status(400).json({ message: 'Los campos name, price y category son obligatorios.' });
        return;
      }
      if (!this.validCategories.includes(category)) {
        res.status(400).json({ message: "La categoría debe ser 'componentes' o 'accesorios'." });
        return;
      }
      const product = await this.service.createProduct({ name, price, category });
      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el producto', error });
    }
  };

  getAll = async (req: Request, res: Response): Promise<void> => {
    const categoryQuery = req.query.category as ProductCategory | undefined;
    if (categoryQuery && !this.validCategories.includes(categoryQuery)) {
      res.status(400).json({ message: "Categoría inválida. Usa 'componentes' o 'accesorios'." });
      return;
    }
    const products = await this.service.getAllProducts(categoryQuery);
    res.json(products);
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const product = await this.service.getProductById(id);
    if (!product) {
      res.status(404).json({ message: 'Producto no encontrado' });
      return;
    }
    res.json(product);
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const updated = await this.service.updateProduct(id, req.body);
    if (!updated) {
      res.status(404).json({ message: 'No se pudo actualizar el producto' });
      return;
    }
    res.json({ message: 'Producto actualizado exitosamente' });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = await this.service.deleteProduct(id);
    if (!deleted) {
      res.status(404).json({ message: 'No se pudo eliminar el producto' });
      return;
    }
    res.json({ message: 'Producto eliminado exitosamente' });
  };
}