import express from 'express';
import { addService, getServices, deleteService } from '../controllers/serviceController.js';
import upload from '../middlewares/upload.js';


const router = express.Router();

router.post('/services', upload.single('image'), addService);
router.get('/services', getServices);
router.delete('/service-delete/:id', deleteService);

export default router;