import express from 'express';
import { authMe } from '../controllers/userController.js';
import User from '../models/User.js';
import Table from '../models/Table.js';
import Booking from '../models/Booking.js';
const route = express.Router();

route.get('/me', authMe);

route.get("/tables", async (req, res) => {
    try {
        const { type } = req.query;
        const tables = await Table.find(type ? { type } : {});
        res.json(tables);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Đặt bàn
route.post("/bookings", async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Chỉnh sửa profile
route.put("/profile/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Xem lịch sử đặt bàn
route.get("/bookings/:userId", async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).populate("tableId");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Thay đổi thông tin đặt bàn
route.put("/bookings/:id", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


export default route;