import express from "express";
import {
    getRevenue,
    getTableStatus,
    payOrder,
    addTable,
    updateTable,
    deleteTable,
    updateBookingStatus,
    cancelBooking,
    createFood,
    getFoods,
    getFoodById,
    updateFood,
    deleteFood,
    createOrder,
    updateOrderStatus,
    addItemToOrder,
    getOrderStats
} from "../controllers/adminController.js";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const route = express.Router();
route.use(protectedRoute);
route.use(authorizeRoles("admin"));

route.get("/revenue", getRevenue);
route.get("/orders/stats", getOrderStats);

route.get("/tables/status", getTableStatus);
route.post("/tables", addTable);
route.put("/tables/:tableId", updateTable);
route.delete("/tables/:tableId", deleteTable);

route.put("/bookings/:bookingId/status", updateBookingStatus);
route.put("/bookings/:bookingId/cancel", cancelBooking);

route.post("/orders", createOrder);
route.put("/orders/:orderId/pay", payOrder);
route.put("/orders/:orderId/status", updateOrderStatus);
route.put("/orders/:orderId/add-item", addItemToOrder);

route.post("/foods", createFood);
route.get("/foods", getFoods);
route.get("/foods/:foodId", getFoodById);
route.put("/foods/:foodId", updateFood);
route.delete("/foods/:foodId", deleteFood);

export default route;