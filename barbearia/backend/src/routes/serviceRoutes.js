import express from 'express';
import { addService, getServices } from '../controllers/serviceController.js';
import upload from '../middlewares/upload.js';


const router = express.Router();

router.post('/services', upload.single('image'), addService);
router.get('/services', getServices);

export default router;