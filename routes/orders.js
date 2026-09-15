import express from 'express';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.post('/:customerId', orderController.placeOrder);
router.get('/:customerId', orderController.listOrders);
router.put('/:orderId', orderController.updateOrder);
router.delete('/:orderId', orderController.deleteOrder);

export default router;
