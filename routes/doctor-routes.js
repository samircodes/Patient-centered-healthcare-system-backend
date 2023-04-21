import express from 'express';

import { doctorRegister, doctorLogin} from '../controllers/doctor-controller.js';

const router = express.Router();

router.post('/doctorRegister', doctorRegister)

router.post('/doctorLogin', doctorLogin)

export { router as doctorRoutes };