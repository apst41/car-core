import {Router} from 'express';
import {loginInUser, signUpUser} from "../controller/partner/PartnerService";
import {fetchBookings, updateBookingStatus} from "../controller/partner/PartnerBookingService";


const partnerRouter = Router();


partnerRouter.post('/signup', signUpUser)

partnerRouter.post('/login', loginInUser);

partnerRouter.get("/booking", fetchBookings)

partnerRouter.put('/booking/:id/status', updateBookingStatus);


export default partnerRouter;