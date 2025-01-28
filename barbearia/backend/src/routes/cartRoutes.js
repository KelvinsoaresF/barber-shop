import express from 'express';
import { addToCart, getCartItems, removeToCart } from '../controllers/cartController.js';
import { checkAuth } from '../middlewares/checkAuth.js';

const router = express.Router();

router.post('/cart', checkAuth, addToCart);
router.get('/cart', checkAuth, getCartItems);
router.delete('/cart', checkAuth, removeToCart);

export default router;