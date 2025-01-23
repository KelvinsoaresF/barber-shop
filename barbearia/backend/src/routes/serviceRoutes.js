import express from 'express';
import { addService } from '../controllers/serviceController.js';
import imageFile from '../middlewares/upload.js';


const router = express.Router();

router.post('/services', addService);


export default router;