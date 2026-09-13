import express from 'express';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.post('/', orderController.placeOrder);
router.get('/:id', orderController.listOrders);
router.put('/:id', orderController.updateOrder);
router.delete('/:id', orderController.deleteOrder);

export default router;
