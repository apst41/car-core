import { Router } from 'express';
import {healthCheck} from "../controller/Controller";
import {verifyotp, register} from "../controller/Auth";

const router = Router();

router.get('/', healthCheck);
router.post('/auth/send-otp',register)
router.post('/auth/verify-otp', verifyotp);


export default router;
