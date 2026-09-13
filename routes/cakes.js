import express from 'express';
import * as cakeController from '../controllers/cakeController.js';

const router = express.Router();

router.get('/', cakeController.listCakes);
router.get('/:name', cakeController.getCake);
router.post('/', cakeController.createCake);

export default router;
