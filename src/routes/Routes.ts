import { Router } from 'express';
import {healthCheck} from "../controller/apis/Controller";
import {verifyOtp, registerOrSendOtp, logout} from "../controller/apis/Auth";
import {getCities} from "../controller/apis/CitiesController";
import {getUserDetails} from "../controller/apis/UserDetails";
import {authenticateToken} from "../controller/middleware/AuthMiddleware";
import {
    addAddress,
    deleteAddress,
    getUserAddresses,
    updateAddress,
    updateSelection
} from "../controller/apis/AddressController";
import {getAllPackages, getPopularServices, getPackageById, getHomeBanner} from "../controller/apis/PackagesController";
import {generateSlots, getAvailableSlots} from "../controller/apis/SlotController";
import {
    addVehicle, deleteUserVehicle,
    getUserVehicleById,
    getUserVehicles,
    updateVehicleSelection
} from "../controller/apis/UserVehicleController";
import {addBackendVehicle, getAllVehicles} from "../controller/apis/VehicleController";
import {cancelBooking, createBooking, getAllBookings, rescheduleBooking} from "../controller/apis/BookingController";
import {getCarModel} from "../controller/apis/CarModelService";
import {getPrice} from "../controller/apis/PriceMapperService";
import {getFeedback, getFeedbackById, saveFeedback} from "../controller/apis/FeedBackService";
import {
    createPayment,
    getPaymentStatus,
    getPaymentDetails,
    getUserPayments,
    getToken, createPhonePeSdkOrder
} from "../controller/apis/PaymentController";
import {checkAppVersion} from "../controller/apis/AppVersionController";

const router = Router();

router.get('/', healthCheck);
router.post('/auth/send-otp',registerOrSendOtp)
router.post('/auth/verify-otp', verifyOtp);
router.get('/cities', getCities);
router.get('/user',authenticateToken,getUserDetails)
router.post("/addAddress",authenticateToken,addAddress)
router.delete("/deleteAddress/:addressId",authenticateToken,deleteAddress)
router.put("/updateAddress/:addressId",authenticateToken,updateAddress)
router.put("/updateAddress/:addressId/update-selection",authenticateToken,updateSelection)
router.get("/getAddress",authenticateToken,getUserAddresses)
router.get("/packages",authenticateToken,getHomeBanner)
router.get("/package-details/:id/:userVehicle",authenticateToken,getPackageById)
router.get("/popular-packages",authenticateToken,getPopularServices)
router.get("/time-slot",authenticateToken,getAvailableSlots)
router.post("/user-vehicle",authenticateToken,addVehicle)
router.get("/user-vehicle",authenticateToken,getUserVehicles)
router.get("/user-vehicle/:id",authenticateToken,getUserVehicleById)
router.put("/user-vehicle/:id/update-selection",authenticateToken,updateVehicleSelection)
router.delete("/user-vehicle/:id",authenticateToken,deleteUserVehicle)
router.post("/backend-vehicle",addBackendVehicle)
router.get("/backend-vehicle",getAllVehicles)
router.post("/booking",authenticateToken,createBooking)
router.get("/carModel/:manufacturerId",authenticateToken,getCarModel)
router.get("/priceMapper",authenticateToken,getPrice)
router.post("/slot",generateSlots)
router.get("/auth/logout",authenticateToken,logout)
router.get("/booking",authenticateToken,getAllBookings)
router.delete("/booking",authenticateToken,cancelBooking)
router.put("/booking",authenticateToken,rescheduleBooking)
router.post("/feedback",authenticateToken,saveFeedback)
router.get("/feedback",authenticateToken,getFeedback)
router.get("/feedback/:id",authenticateToken,getFeedbackById)
 router.get("/app/version/", checkAppVersion);
// Payment routes
router.post("/payment/create", authenticateToken, createPayment);
router.get("/payment/status/:merchantOrderId", authenticateToken, getPaymentStatus);
router.get("/payment/details/:merchantOrderId", authenticateToken, getPaymentDetails);
router.get("/payment/user", authenticateToken, getUserPayments);
router.get("/payment/token",authenticateToken,getToken)
router.post("/sdk/payment/order",authenticateToken,createPhonePeSdkOrder)
export default router;
