import express from 'express';
import {
    authMe,
    updateProfile,
    getUserBookings,
    createBooking,
    getBookingById,
    updateBooking,
    cancelBooking,
    getUserTables,
    getTableById,
} from '../controllers/userController.js';

const route = express.Router();

route.get('/me', authMe);
route.put('/profile', updateProfile);

route.get('/bookings', getUserBookings);
route.post('/bookings', createBooking);
route.get('/bookings/:id', getBookingById);
route.put('/bookings/:id/cancel', cancelBooking);
route.put('/bookings/:id', updateBooking);

route.get('/tables', getUserTables);
route.get('/tables/:id', getTableById);

export default route;