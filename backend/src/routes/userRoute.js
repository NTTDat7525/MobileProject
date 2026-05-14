import express from 'express';
import {
    authMe,
    updateProfile,
    getUserBookings,
    createBooking,
    getBookingById,
    updateBooking,
    cancelBooking,
    updatePaymentStatus,
    getUserTables,
    getTableById,
} from '../controllers/userController.js';
import { getBookingPaymentInfo } from '../controllers/paymentController.js';

const route = express.Router();

route.get('/me', authMe);
route.put('/profile', updateProfile);

route.get('/bookings', getUserBookings);
route.post('/bookings', createBooking);
route.get('/bookings/:id', getBookingById);
route.get('/bookings/:id/payment-info', getBookingPaymentInfo);
route.put('/bookings/:id/cancel', cancelBooking);
route.put('/bookings/:id/payment', updatePaymentStatus);
route.put('/bookings/:id', updateBooking);

route.get('/tables', getUserTables);
route.get('/tables/:id', getTableById);

export default route;
