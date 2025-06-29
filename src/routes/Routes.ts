import { Router } from 'express';
import {healthCheck} from "../controller/Controller";
import {verifyotp, register, logout} from "../controller/Auth";
import {getCities} from "../controller/CitiesController";
import {getUserDetails} from "../controller/UserDetails";
import {authenticateToken} from "../controller/middleware/AuthMiddleware";
import {
    addAddress,
    deleteAddress,
    getUserAddresses,
    updateAddress,
    updateSelection
} from "../controller/AddressController";
import {getAllPackages, getPopularServices, getPackageById, getHomeBanner} from "../controller/PackagesController";
import {generateSlots, getAvailableSlots} from "../controller/SlotController";
import {
    addVehicle, deleteUserVehicle,
    getUserVehicleById,
    getUserVehicles,
    updateVehicleSelection
} from "../controller/UserVehicleController";
import {addBackendVehicle, getAllVehicles} from "../controller/VehicleController";
import {cancelBooking, createBooking, getAllBookings, rescheduleBooking} from "../controller/BookingController";
import {getCarModel} from "../controller/CarModelService";
import {getPrice} from "../controller/PriceMapperService";

const router = Router();

router.get('/', healthCheck);
router.post('/auth/send-otp',register)
router.post('/auth/verify-otp', verifyotp);
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
export default router;
