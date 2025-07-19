import { Router } from 'express';
import {loginInUser, signUpUser} from "../controller/partner/PartnerService";
import {fetchBookings, getPaginatedBookings} from "../controller/partner/PartnerBookingService";





const partnerRouter = Router();





partnerRouter.post('/signup',signUpUser)

partnerRouter.post('/login',loginInUser);

partnerRouter.get("/booking",fetchBookings)





export default partnerRouter;