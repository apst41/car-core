import { Router } from 'express';
import {healthCheck} from "../controller/Controller";
import {verifyotp, register} from "../controller/Auth";
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
import {getAllServices, getPopularServices, getServiceById} from "../controller/ServicesController";
import { getAvailableSlots} from "../controller/SlotController";
import {
    addVehicle, deleteUserVehicle,
    getUserVehicleById,
    getUserVehicles,
    updateVehicleSelection
} from "../controller/UserVehicleController";
import {addBackendVehicle, getAllVehicles} from "../controller/VehicleController";
import {createBooking} from "../controller/BookingController";

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
router.get("/services",authenticateToken,getAllServices)
router.get("/service-details/:id",authenticateToken,getServiceById)
router.get("/popular-services",authenticateToken,getPopularServices)
router.get("/time-slot",authenticateToken,getAvailableSlots)
router.post("/user-vehicle",authenticateToken,addVehicle)
router.get("/user-vehicle",authenticateToken,getUserVehicles)
router.get("/user-vehicle/:id",authenticateToken,getUserVehicleById)
router.put("/user-vehicle/:id/update-selection",authenticateToken,updateVehicleSelection)
router.delete("/user-vehicle/:id",authenticateToken,deleteUserVehicle)
router.post("/backend-vehicle",addBackendVehicle)
router.get("/backend-vehicle",getAllVehicles)
router.post("/booking",authenticateToken,createBooking)
export default router;
