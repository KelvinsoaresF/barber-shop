import express from "express";
import { creatAppointment } from "../controllers/appointmentController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

router.post('/appointments', checkAuth, creatAppointment)


export default router;