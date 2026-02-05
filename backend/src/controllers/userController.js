import User from "../models/User.js";
import Table from "../models/Table.js";
import Booking from "../models/Booking.js";

export const authMe = async (req, res) => {
    try {
        const user = req.user; //lấy user từ middleware
        return res.status(200).json({user});
    } catch (error) {
        console.error("Error in authMe:", error);
        return res.status(500).json({message: "Internal server error"});
    }
};

// Tìm bàn
export const getTables = async (req, res) => {
    try {
        const { type } = req.query;
        const tables = await Table.find(type ? { type } : {});
        res.json(tables);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Đặt bàn
export const createBooking = async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();
        res.status(201).json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Chỉnh sửa profile
export const updateProfile = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-hashPassword");
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Xem lịch sử đặt bàn
export const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.params.userId }).populate("tableId");
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thay đổi thông tin đặt bàn
export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(booking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
