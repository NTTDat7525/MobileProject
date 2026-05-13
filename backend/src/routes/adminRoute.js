import express from "express";
import {
    getAllBookings,
    updateBookingStatus,
    adminCancelBooking,
    getTableStatus,
    addTable,
    updateTable,
    deleteTable,
} from "../controllers/adminController.js";
import { upload } from "../middlewares/upload.js";

const route = express.Router();

route.get('/bookings', getAllBookings);
route.put('/bookings/:id/status', updateBookingStatus);
route.put('/bookings/:id/cancel', adminCancelBooking);

route.get('/tables/status', getTableStatus);
route.post('/tables', upload.single('image'), addTable);
route.put('/tables/:id', upload.single('image'), updateTable);
route.delete('/tables/:id', deleteTable);

export default route;