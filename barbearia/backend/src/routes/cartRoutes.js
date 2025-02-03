import express from 'express';
import { addToCart, getCartItems, removeToCart } from '../controllers/cartController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/cartAdd', checkAuth, addToCart);
router.get('/cartGet', checkAuth, getCartItems);
router.delete('/cartRemove/:serviceId', checkAuth, removeToCart);

export default router;