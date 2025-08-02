import {Router} from 'express';
import {loginInUser, signUpUser, logoutUser} from "../controller/partner/PartnerService";
import {fetchBookings, fetchBookingsById, updateBookingStatus} from "../controller/partner/PartnerBookingService";
import {authenticatePartnerToken} from "../controller/middleware/PartnerAuthMiddleware";



const partnerRouter = Router();


partnerRouter.post('/signup', signUpUser)

partnerRouter.post('/login', loginInUser);

partnerRouter.post('/logout', authenticatePartnerToken, logoutUser);

partnerRouter.get("/booking", authenticatePartnerToken, fetchBookings)

partnerRouter.put('/booking/:id/status', authenticatePartnerToken, updateBookingStatus);

partnerRouter.get('/booking/:id', authenticatePartnerToken, fetchBookingsById)


export default partnerRouter;