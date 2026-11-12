import { Router } from 'express';
import { CartController } from './cart.controller';

const router = Router();
const controller = new CartController();

router.get('/:userId', controller.getCart);
router.post('/add', controller.addItem);
router.delete('/:userId/item/:productId', controller.removeItem);
router.delete('/:userId', controller.clearCart);

export default router;