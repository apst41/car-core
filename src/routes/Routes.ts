import { Router } from 'express';
import {healthCheck} from "../controller/Controller";
import {login, register, verifyOtp} from "../controller/Auth";

const router = Router();

router.get('/', healthCheck);
router.post('/register',register)
router.post('/verify-otp', verifyOtp)
router.post('/login', login);


export default router;
