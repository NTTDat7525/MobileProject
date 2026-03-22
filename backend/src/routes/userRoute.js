import express from 'express';
import {
    authMe,
    getUserProfile,
    updateProfile,
    getTables,
    getTableById,
    createBooking,
    getUserBookings,
    getBookingById,
    updateBooking,
    cancelBooking,
    getUserOrders,
    getOrderById
} from '../controllers/userController.js';
import { protectedRoute } from '../middlewares/authMiddleware.js';

const route = express.Router();

route.get('/me', protectedRoute, authMe);
route.get('/profile/:userId', protectedRoute, getUserProfile);
route.put('/profile', protectedRoute, updateProfile);

route.get("/tables", getTables);
route.get("/tables/:tableId", getTableById);

route.post("/bookings", protectedRoute, createBooking);
route.get("/bookings", protectedRoute, getUserBookings);
route.get("/bookings/:bookingId", protectedRoute, getBookingById);
route.put("/bookings/:bookingId", protectedRoute, updateBooking);
route.put("/bookings/:bookingId/cancel", protectedRoute, cancelBooking);

route.get("/orders", protectedRoute, getUserOrders);
route.get("/orders/:orderId", protectedRoute, getOrderById);

export default route;