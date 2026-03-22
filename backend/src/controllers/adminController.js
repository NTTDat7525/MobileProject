import Table from "../models/Table.js";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import Food from "../models/Food.js";

export const getRevenue = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { paymentStatus: "paid" };

        if (startDate || endDate) {
            query.paymentDate = {};
            if (startDate) query.paymentDate.$gte = new Date(startDate);
            if (endDate) query.paymentDate.$lte = new Date(endDate);
        }

        const orders = await Order.find(query);
        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return res.status(200).json({
            totalRevenue,
            totalOrders,
            avgOrderValue,
            orders
        });
    } catch (error) {
        console.error("Error in getRevenue:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getTableStatus = async (req, res) => {
    try {
        const tables = await Table.find().populate("currentBookingId");

        // Calculate status summary
        const summary = {
            total: tables.length,
            available: tables.filter(t => t.status === "available").length,
            occupied: tables.filter(t => t.status === "occupied").length,
            reserved: tables.filter(t => t.status === "reserved").length,
            maintenance: tables.filter(t => t.status === "maintenance").length
        };

        return res.status(200).json({
            summary,
            tables
        });
    } catch (error) {
        console.error("Error in getTableStatus:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const payOrder = async (req, res) => {
    try {
        const { paymentMethod, transactionId } = req.body;

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({ message: "Order is already paid" });
        }

        order.paymentMethod = paymentMethod || order.paymentMethod;
        order.paymentStatus = "paid";
        order.paidAmount = order.totalAmount;
        order.paymentDate = new Date();
        if (transactionId) order.transactionId = transactionId;

        await order.save();

        return res.status(200).json({
            message: "Order payment updated successfully",
            order
        });
    } catch (error) {
        console.error("Error in payOrder:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const addTable = async (req, res) => {
    try {
        const {
            tableNumber,
            capacity,
            type,
            location,
            features,
            description
        } = req.body;

        if (!tableNumber || !capacity || !type || !location) {
            return res.status(400).json({
                message: "tableNumber, capacity, type, and location are required"
            });
        }

        const existingTable = await Table.findOne({ tableNumber });
        if (existingTable) {
            return res.status(400).json({
                message: "Table number already exists"
            });
        }

        const table = new Table({
            tableNumber,
            capacity,
            type,
            location,
            description: description || "",
            features: features || {
                hasWindow: false,
                hasView: false,
                isHighChairs: false,
                wheelchair: false
            },
            status: "available"
        });

        await table.save();

        return res.status(201).json({
            message: "Table created successfully",
            table
        });
    } catch (error) {
        console.error("Error in addTable:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateTable = async (req, res) => {
    try {
        const { capacity, type, location, features, description, status } = req.body;

        const table = await Table.findById(req.params.tableId);
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }

        if (capacity !== undefined) table.capacity = capacity;
        if (type !== undefined) table.type = type;
        if (location !== undefined) table.location = location;
        if (description !== undefined) table.description = description;
        if (features !== undefined) table.features = { ...table.features, ...features };
        if (status !== undefined) table.status = status;

        await table.save();

        return res.status(200).json({
            message: "Table updated successfully",
            table
        });
    } catch (error) {
        console.error("Error in updateTable:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const deleteTable = async (req, res) => {
    try {
        const table = await Table.findByIdAndDelete(req.params.tableId);
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }

        return res.status(200).json({
            message: "Table deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteTable:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateBookingStatus = async (req, res) => {
    try {
        const { status, notes } = req.body;

        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const validStatuses = ["pending", "confirmed", "checked-in", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        booking.status = status;
        if (notes) booking.internalNotes = notes;

        const table = await Table.findById(booking.tableId);
        if (table) {
            if (status === "checked-in") {
                table.status = "occupied";
                table.currentBookingId = booking._id;
            } else if (status === "completed" || status === "cancelled") {
                table.status = "available";
                table.currentBookingId = null;
            }
            await table.save();
        }

        await booking.save();

        return res.status(200).json({
            message: "Booking status updated successfully",
            booking
        });
    } catch (error) {
        console.error("Error in updateBookingStatus:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const cancelBooking = async (req, res) => {
    try {
        const { reason } = req.body;

        const booking = await Booking.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        booking.status = "cancelled";
        booking.cancellationReason = reason || "Admin cancelled";
        booking.cancellationDate = new Date();

        const table = await Table.findById(booking.tableId);
        if (table && table.currentBookingId?.toString() === booking._id.toString()) {
            table.status = "available";
            table.currentBookingId = null;
            await table.save();
        }

        await booking.save();

        return res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });
    } catch (error) {
        console.error("Error in cancelBooking:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createFood = async (req, res) => {
    try {
        const {
            name,
            description,
            category,
            cuisine,
            price,
            allergens,
            isVegetarian,
            isVegan,
            spiceLevel,
            preparationTime
        } = req.body;

        if (!name || !category || !price) {
            return res.status(400).json({
                message: "name, category, and price are required"
            });
        }

        const food = new Food({
            name: name.trim(),
            description: description?.trim() || "",
            category,
            cuisine: cuisine || "vietnamese",
            price,
            allergens: allergens || [],
            isVegetarian: isVegetarian || false,
            isVegan: isVegan || false,
            spiceLevel: spiceLevel || 0,
            preparationTime: preparationTime || 15,
            status: "active",
            isAvailable: true
        });

        await food.save();

        return res.status(201).json({
            message: "Food item created successfully",
            food
        });
    } catch (error) {
        console.error("Error in createFood:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getFoods = async (req, res) => {
    try {
        const { category, cuisine, isVegetarian, isVegan, status } = req.query;
        const query = {};

        if (category) query.category = category;
        if (cuisine) query.cuisine = cuisine;
        if (isVegetarian === "true") query.isVegetarian = true;
        if (isVegan === "true") query.isVegan = true;
        if (status) query.status = status;

        const foods = await Food.find(query)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            total: foods.length,
            foods
        });
    } catch (error) {
        console.error("Error in getFoods:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const getFoodById = async (req, res) => {
    try {
        const food = await Food.findById(req.params.foodId);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }
        return res.status(200).json({ food });
    } catch (error) {
        console.error("Error in getFoodById:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update food
 */
export const updateFood = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            allergens,
            isVegetarian,
            isVegan,
            spiceLevel,
            status,
            isAvailable
        } = req.body;

        const food = await Food.findById(req.params.foodId);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        // Update fields
        if (name !== undefined) food.name = name.trim();
        if (description !== undefined) food.description = description.trim();
        if (price !== undefined) food.price = price;
        if (discountPrice !== undefined) food.discountPrice = discountPrice;
        if (allergens !== undefined) food.allergens = allergens;
        if (isVegetarian !== undefined) food.isVegetarian = isVegetarian;
        if (isVegan !== undefined) food.isVegan = isVegan;
        if (spiceLevel !== undefined) food.spiceLevel = spiceLevel;
        if (status !== undefined) food.status = status;
        if (isAvailable !== undefined) food.isAvailable = isAvailable;

        await food.save();

        return res.status(200).json({
            message: "Food updated successfully",
            food
        });
    } catch (error) {
        console.error("Error in updateFood:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Delete food
 */
export const deleteFood = async (req, res) => {
    try {
        const food = await Food.findByIdAndDelete(req.params.foodId);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        return res.status(200).json({
            message: "Food deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteFood:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Create order
 */
export const createOrder = async (req, res) => {
    try {
        const {
            userId,
            bookingId,
            tableId,
            items,
            paymentMethod,
            notes
        } = req.body;

        // Validation
        if (!bookingId || !tableId || !items || items.length === 0) {
            return res.status(400).json({
                message: "bookingId, tableId, and items are required"
            });
        }

        // Calculate totals
        let subtotal = 0;
        const processedItems = [];

        for (const item of items) {
            const food = await Food.findById(item.foodId);
            if (!food) {
                return res.status(404).json({
                    message: `Food item ${item.foodId} not found`
                });
            }

            const itemTotal = food.price * item.quantity;
            subtotal += itemTotal;

            processedItems.push({
                foodId: item.foodId,
                foodName: food.name,
                quantity: item.quantity,
                unitPrice: food.price,
                specialInstructions: item.specialInstructions || ""
            });
        }

        // Calculate additional charges (simplified)
        const tax = subtotal * 0.1; // 10% tax
        const serviceCharge = subtotal * 0.05; // 5% service charge
        const totalAmount = subtotal + tax + serviceCharge;

        const order = new Order({
            orderNumber: `ORD${Date.now()}`,
            userId: userId || null,
            bookingId,
            tableId,
            items: processedItems,
            subtotal,
            tax,
            serviceCharge,
            discount: 0,
            totalAmount,
            paymentMethod: paymentMethod || "cash",
            paymentStatus: "unpaid",
            status: "pending",
            notes: notes || ""
        });

        await order.save();
        await order.populate("bookingId tableId items.foodId");

        return res.status(201).json({
            message: "Order created successfully",
            order
        });
    } catch (error) {
        console.error("Error in createOrder:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Update order status
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const validStatuses = ["pending", "preparing", "ready", "served", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Set timing based on status
        if (status === "preparing" && !order.startedAt) {
            order.startedAt = new Date();
        } else if (status === "completed" && !order.completedAt) {
            order.completedAt = new Date();
        }

        order.status = status;
        await order.save();

        return res.status(200).json({
            message: "Order status updated successfully",
            order
        });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Add item to order
 */
export const addItemToOrder = async (req, res) => {
    try {
        const { foodId, quantity, specialInstructions } = req.body;

        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const food = await Food.findById(foodId);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        // Add item
        const itemPrice = food.price * quantity;
        order.items.push({
            foodId,
            foodName: food.name,
            quantity,
            unitPrice: food.price,
            specialInstructions: specialInstructions || ""
        });

        // Recalculate totals
        order.subtotal += itemPrice;
        order.tax = order.subtotal * 0.1;
        order.serviceCharge = order.subtotal * 0.05;
        order.totalAmount = order.subtotal + order.tax + order.serviceCharge - order.discount;

        await order.save();

        return res.status(200).json({
            message: "Item added to order successfully",
            order
        });
    } catch (error) {
        console.error("Error in addItemToOrder:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * Get order statistics
 */
export const getOrderStats = async (req, res) => {
    try {
        const { period } = req.query; // day, week, month

        let dateFilter = {};
        const now = new Date();

        if (period === "day") {
            dateFilter = {
                $gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                $lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
            };
        } else if (period === "week") {
            const weekAgo = new Date(now.setDate(now.getDate() - 7));
            dateFilter = { $gte: weekAgo };
        } else if (period === "month") {
            dateFilter = {
                $gte: new Date(now.getFullYear(), now.getMonth(), 1),
                $lt: new Date(now.getFullYear(), now.getMonth() + 1, 1)
            };
        }

        const orders = await Order.find({ createdAt: dateFilter });

        const stats = {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, o) => sum + o.totalAmount, 0),
            completedOrders: orders.filter(o => o.status === "completed").length,
            cancelledOrders: orders.filter(o => o.status === "cancelled").length,
            paidOrders: orders.filter(o => o.paymentStatus === "paid").length,
            avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + o.totalAmount, 0) / orders.length : 0
        };

        return res.status(200).json(stats);
    } catch (error) {
        console.error("Error in getOrderStats:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};