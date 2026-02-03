import express from "express";
import Table from "../models/Table.js";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import Food from "../models/Food.js";

const route = express.Router();

//Xem doanh thu
route.get("/revenue", async (req, res) => {
    try {
        const orders = await Order.find({ status: "paid" });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        res.json({ totalRevenue });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Kiểm tra tình trạng bàn
route.get("/tables/status", async (req, res) => {
    try {
        const tables = await Table.find();
        res.json(tables);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Xem và thanh toán hóa đơn
route.put("/orders/:id/pay", async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: "paid" }, { new: true });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Thêm bàn
route.post("/tables", async (req, res) => {
    try {
        const table = new Table(req.body);
        await table.save();
        res.status(201).json(table);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Sửa bàn
route.put("/tables/:id", async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(table);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Xóa bàn
route.delete("/tables/:id", async (req, res) => {
    try {
        await Table.findByIdAndDelete(req.params.id);
        res.json({ message: "Table deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Hủy đặt bàn
route.put("/bookings/:id/cancel", async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" }, { new: true });
        res.json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//Thêm món ăn vào hóa đơn
route.put("/orders/:id/add-food", async (req, res) => {
    try {
        const { foodId, quantity, price } = req.body;
        const order = await Order.findById(req.params.id);
        order.items.push({ foodId, quantity, price });
        order.totalAmount += quantity * price;
        await order.save();
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default route;