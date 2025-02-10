import express from "express";
import { createAvailable, getAvailable } from "../controllers/availableController.js";

import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router()

router.post('/available', checkAuth, createAvailable)
router.get('/available',  getAvailable)

export default router