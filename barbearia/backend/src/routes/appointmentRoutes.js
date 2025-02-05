import express from "express";
import { creatAppointment, getAppointmentByUser } from "../controllers/appointmentController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = express.Router();

router.post('/appointments', checkAuth, creatAppointment)
router.get('/appointments', checkAuth, getAppointmentByUser)


export default router;