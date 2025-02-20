import { Router } from 'express';
import {healthCheck} from "../controller/Controller";
import {verifyotp, register} from "../controller/Auth";
import {getCities} from "../controller/CitiesController";
import {getUserDetails} from "../controller/UserDetails";
import {authenticateToken} from "../controller/middleware/AuthMiddleware";

const router = Router();

router.get('/', healthCheck);
router.post('/auth/send-otp',register)
router.post('/auth/verify-otp', verifyotp);
router.get('/cities', getCities);
router.get('/user',authenticateToken,getUserDetails)



export default router;
