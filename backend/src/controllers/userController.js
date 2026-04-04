import User from "../models/User.js";
import Table from "../models/Table.js";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import { Op } from "sequelize";

/**
 * Get current user profile
 */
export const authMe = async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error in authMe:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get user profile by ID
 */
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userId, {
            attributes: { exclude: ['hashPassword'] }
        });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });
    } catch (error) {
        console.error("Error in getUserProfile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
    try {
        const { displayName, bio, phone } = req.body;

        // Validate input
        if (displayName && displayName.trim().length === 0) {
            return res.status(400).json({ message: "Display name cannot be empty" });
        }

        const updateData = {};
        if (displayName) updateData.displayName = displayName.trim();
        if (bio) updateData.bio = bio.trim();
        if (phone) updateData.phone = phone.trim();

        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.update(updateData);

        return res.status(200).json({
            message: "Profile updated successfully",
            user: {
                ...user.toJSON(),
                hashPassword: undefined
            }
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get available tables with filtering
 */
export const getTables = async (req, res) => {
    try {
        const { type, capacity, location } = req.query;
        const where = { status: "available" };

        // Apply filters
        if (type) where.type = type;
        if (capacity) where.capacity = { [Op.gte]: parseInt(capacity) };
        if (location) where.location = location;

        const tables = await Table.findAll({
            where,
            order: [['capacity', 'ASC']]
        });

        return res.status(200).json({
            total: tables.length,
            tables
        });
    } catch (error) {
        console.error("Error in getTables:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get specific table details
 */
export const getTableById = async (req, res) => {
    try {
        const table = await Table.findByPk(req.params.tableId);
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }
        return res.status(200).json({ table });
    } catch (error) {
        console.error("Error in getTableById:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Create a new booking
 */
export const createBooking = async (req, res) => {
    try {
        const {
            tableId,
            bookingDate,
            numberOfGuests,
            guestName,
            guestEmail,
            guestPhone,
            specialRequests,
            dietaryRestrictions,
            occasion
        } = req.body;

        // Validation
        if (!tableId || !bookingDate || !numberOfGuests) {
            return res.status(400).json({
                message: "tableId, bookingDate, and numberOfGuests are required"
            });
        }

        if (numberOfGuests < 1 || numberOfGuests > 30) {
            return res.status(400).json({
                message: "Number of guests must be between 1 and 30"
            });
        }

        // Check if table exists and has enough capacity
        const table = await Table.findByPk(tableId);
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }

        if (table.capacity < numberOfGuests) {
            return res.status(400).json({
                message: `Table capacity is ${table.capacity}, but ${numberOfGuests} guests requested`
            });
        }

        // Check if table is available at that time (simplified check)
        const bookingDateStart = new Date(bookingDate);
        bookingDateStart.setHours(0, 0, 0, 0);
        const bookingDateEnd = new Date(bookingDate);
        bookingDateEnd.setHours(23, 59, 59, 999);

        const existingBooking = await Booking.findOne({
            where: {
                tableId,
                bookingDate: {
                    [Op.gte]: bookingDateStart,
                    [Op.lt]: bookingDateEnd
                },
                status: { [Op.in]: ["confirmed", "checked-in"] }
            }
        });

        if (existingBooking) {
            return res.status(400).json({
                message: "Table is already booked for this date"
            });
        }

        // Create booking
        const booking = await Booking.create({
            userId: req.user.id,
            tableId,
            bookingDate,
            numberOfGuests,
            guestName: guestName || req.user.displayName,
            guestEmail: guestEmail || req.user.email,
            guestPhone: guestPhone || req.user.phone,
            specialRequests: specialRequests || "",
            dietaryRestrictions: dietaryRestrictions || [],
            occasion: occasion || "regular",
            status: "pending"
        });

        await booking.reload({
            include: [
                { association: 'table' },
                { association: 'user' }
            ]
        });

        return res.status(201).json({
            message: "Booking created successfully",
            booking
        });
    } catch (error) {
        console.error("Error in createBooking:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get user's bookings
 */
export const getUserBookings = async (req, res) => {
    try {
        const { status } = req.query;
        const where = { userId: req.user.id };

        if (status) {
            where.status = status;
        }

        const bookings = await Booking.findAll({
            where,
            include: [
                { 
                    association: 'table',
                    attributes: ['id', 'tableNumber', 'capacity', 'type', 'location']
                }
            ],
            order: [['bookingDate', 'DESC']]
        });

        return res.status(200).json({
            total: bookings.length,
            bookings
        });
    } catch (error) {
        console.error("Error in getUserBookings:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get specific booking details
 */
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findByPk(req.params.bookingId, {
            include: [
                { association: 'table' },
                { 
                    association: 'user',
                    attributes: { exclude: ['hashPassword'] }
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check if user owns this booking
        if (booking.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        return res.status(200).json({ booking });
    } catch (error) {
        console.error("Error in getBookingById:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update booking
 */
export const updateBooking = async (req, res) => {
    try {
        const { specialRequests, dietaryRestrictions, numberOfGuests } = req.body;

        const booking = await Booking.findByPk(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check ownership
        if (booking.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Prevent updating confirmed/completed bookings
        if (["confirmed", "checked-in", "completed", "cancelled"].includes(booking.status)) {
            return res.status(400).json({
                message: `Cannot update booking with status: ${booking.status}`
            });
        }

        // Update allowed fields
        const updateData = {};
        if (specialRequests !== undefined) updateData.specialRequests = specialRequests;
        if (dietaryRestrictions !== undefined) updateData.dietaryRestrictions = dietaryRestrictions;
        if (numberOfGuests !== undefined) updateData.numberOfGuests = numberOfGuests;

        await booking.update(updateData);
        await booking.reload({
            include: [
                { association: 'table' }
            ]
        });

        return res.status(200).json({
            message: "Booking updated successfully",
            booking
        });
    } catch (error) {
        console.error("Error in updateBooking:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Cancel booking
 */
export const cancelBooking = async (req, res) => {
    try {
        const { reason } = req.body;

        const booking = await Booking.findByPk(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        // Check ownership
        if (booking.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Cannot cancel completed bookings
        if (["completed", "cancelled"].includes(booking.status)) {
            return res.status(400).json({
                message: `Cannot cancel booking with status: ${booking.status}`
            });
        }

        await booking.update({
            status: "cancelled",
            cancellationReason: reason || "User cancelled",
            cancellationDate: new Date()
        });

        return res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });
    } catch (error) {
        console.error("Error in cancelBooking:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get user's orders
 */
export const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { userId: req.user.id },
            include: [
                { 
                    association: 'booking',
                    attributes: ['id', 'bookingDate', 'guestName']
                },
                {
                    association: 'table',
                    attributes: ['id', 'tableNumber']
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        return res.status(200).json({
            total: orders.length,
            orders
        });
    } catch (error) {
        console.error("Error in getUserOrders:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get order details
 */
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findByPk(req.params.orderId, {
            include: [
                { 
                    association: 'user',
                    attributes: { exclude: ['hashPassword'] }
                },
                { association: 'booking' },
                { association: 'table' }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Check ownership
        if (order.userId !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Unauthorized" });
        }

        return res.status(200).json({ order });
    } catch (error) {
        console.error("Error in getOrderById:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
