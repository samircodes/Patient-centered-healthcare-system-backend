import express from 'express';

import { patientRegister,patientLogin } from '../controllers/patient-controller.js';

const router = express.Router();

router.post('/patientRegister', patientRegister)

router.post('/patientLogin', patientLogin)

export { router as patientRoutes };