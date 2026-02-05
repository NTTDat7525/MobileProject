import Table from "../models/Table.js";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";

// Xem doanh số
export const getRevenue = async (req, res) => {
    try {
        const orders = await Order.find({ status: "paid" });
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        res.json({ totalRevenue });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Kiểm tra tình trạng bàn
export const getTableStatus = async (req, res) => {
    try {
        const tables = await Table.find();
        res.json(tables);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thanh toán hóa đơn
export const payOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(req.params.id, { status: "paid" }, { new: true });
        res.json(order);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Thêm bàn
export const addTable = async (req, res) => {
    try {
        const table = new Table(req.body);
        await table.save();
        res.status(201).json(table);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Sửa bàn
export const updateTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(table);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Xóa bàn
export const deleteTable = async (req, res) => {
    try {
        await Table.findByIdAndDelete(req.params.id);
        res.json({ message: "Table deleted" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Hủy đặt bàn
export const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, { status: "cancelled" }, { new: true });
        res.json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Thêm món ăn vào hóa đơn
export const addFoodToOrder = async (req, res) => {
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
};