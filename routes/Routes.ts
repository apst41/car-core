import { Router } from 'express';
import {healthCheck} from "../controller/Controller";
import {login} from "../controller/Auth";

const router = Router();

router.get('/', healthCheck);

router.post('/login', login);



export default router;
