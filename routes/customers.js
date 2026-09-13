import express from 'express';
import * as customerController from '../controllers/customerController.js';

const router = express.Router();

router.post('/', customerController.createCustomer);
router.get('/:email', customerController.getCustomer);

export default router;
