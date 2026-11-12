import { Router } from 'express';
import demoRoutes from '../../modules/demo/demo.routes';
import productRoutes from '../../modules/product/product.routes';
import cartRoutes from '../../modules/cart/cart.routes';

const router = Router();

router.use('/demo', demoRoutes);
router.use('/product', productRoutes);
router.use('/cart', cartRoutes);

export default router;