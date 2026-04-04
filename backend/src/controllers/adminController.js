import Table from "../models/Table.js";
import Booking from "../models/Booking.js";
import Order from "../models/Order.js";
import Food from "../models/Food.js";
import { Op } from "sequelize";

export const getRevenue = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const where = { paymentStatus: "paid" };

        if (startDate || endDate) {
            where.paymentDate = {};
            if (startDate) where.paymentDate[Op.gte] = new Date(startDate);
            if (endDate) where.paymentDate[Op.lte] = new Date(endDate);
        }

        const orders = await Order.findAll({ where });
        const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
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
        const tables = await Table.findAll();

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

        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({ message: "Order is already paid" });
        }

        await order.update({
            paymentMethod: paymentMethod || order.paymentMethod,
            paymentStatus: "paid",
            paidAmount: order.totalAmount,
            paymentDate: new Date(),
            ...(transactionId && { transactionId })
        });

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

        const existingTable = await Table.findOne({ where: { tableNumber } });
        if (existingTable) {
            return res.status(400).json({
                message: "Table number already exists"
            });
        }

        const table = await Table.create({
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

        const table = await Table.findByPk(req.params.tableId);
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }

        const updateData = {};
        if (capacity !== undefined) updateData.capacity = capacity;
        if (type !== undefined) updateData.type = type;
        if (location !== undefined) updateData.location = location;
        if (description !== undefined) updateData.description = description;
        if (features !== undefined) updateData.features = { ...table.features, ...features };
        if (status !== undefined) updateData.status = status;

        await table.update(updateData);

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
        const table = await Table.findByPk(req.params.tableId);
        if (!table) {
            return res.status(404).json({ message: "Table not found" });
        }

        await table.destroy();

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

        const booking = await Booking.findByPk(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const validStatuses = ["pending", "confirmed", "checked-in", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updateData = { status };
        if (notes) updateData.internalNotes = notes;
        
        await booking.update(updateData);

        const table = await Table.findByPk(booking.tableId);
        if (table) {
            if (status === "checked-in") {
                await table.update({
                    status: "occupied",
                    currentBookingId: booking.id
                });
            } else if (status === "completed" || status === "cancelled") {
                await table.update({
                    status: "available",
                    currentBookingId: null
                });
            }
        }

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

        const booking = await Booking.findByPk(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }

        await booking.update({
            status: "cancelled",
            cancellationReason: reason || "Admin cancelled",
            cancellationDate: new Date()
        });

        const table = await Table.findByPk(booking.tableId);
        if (table && table.currentBookingId === booking.id) {
            await table.update({
                status: "available",
                currentBookingId: null
            });
        }

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

        const food = await Food.create({
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
        const where = {};

        if (category) where.category = category;
        if (cuisine) where.cuisine = cuisine;
        if (isVegetarian === "true") where.isVegetarian = true;
        if (isVegan === "true") where.isVegan = true;
        if (status) where.status = status;

        const foods = await Food.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

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
        const food = await Food.findByPk(req.params.foodId);
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

        const food = await Food.findByPk(req.params.foodId);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        // Update fields
        const updateData = {};
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (price !== undefined) updateData.price = price;
        if (discountPrice !== undefined) updateData.discountPrice = discountPrice;
        if (allergens !== undefined) updateData.allergens = allergens;
        if (isVegetarian !== undefined) updateData.isVegetarian = isVegetarian;
        if (isVegan !== undefined) updateData.isVegan = isVegan;
        if (spiceLevel !== undefined) updateData.spiceLevel = spiceLevel;
        if (status !== undefined) updateData.status = status;
        if (isAvailable !== undefined) updateData.isAvailable = isAvailable;

        await food.update(updateData);

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
        const food = await Food.findByPk(req.params.foodId);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        await food.destroy();

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
            const food = await Food.findByPk(item.foodId);
            if (!food) {
                return res.status(404).json({
                    message: `Food item ${item.foodId} not found`
                });
            }

            const itemTotal = parseFloat(food.price) * item.quantity;
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

        const order = await Order.create({
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

        await order.reload({
            include: [
                { association: 'booking' },
                { association: 'table' }
            ]
        });

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

        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const validStatuses = ["pending", "preparing", "ready", "served", "completed", "cancelled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Set timing based on status
        const updateData = { status };
        if (status === "preparing" && !order.startedAt) {
            updateData.startedAt = new Date();
        } else if (status === "completed" && !order.completedAt) {
            updateData.completedAt = new Date();
        }

        await order.update(updateData);

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

        const order = await Order.findByPk(req.params.orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const food = await Food.findByPk(foodId);
        if (!food) {
            return res.status(404).json({ message: "Food not found" });
        }

        // Add item
        const itemPrice = parseFloat(food.price) * quantity;
        const updatedItems = [...order.items, {
            foodId,
            foodName: food.name,
            quantity,
            unitPrice: food.price,
            specialInstructions: specialInstructions || ""
        }];

        // Recalculate totals
        const newSubtotal = parseFloat(order.subtotal) + itemPrice;
        const newTax = newSubtotal * 0.1;
        const newServiceCharge = newSubtotal * 0.05;
        const newTotalAmount = newSubtotal + newTax + newServiceCharge - parseFloat(order.discount);

        await order.update({
            items: updatedItems,
            subtotal: newSubtotal,
            tax: newTax,
            serviceCharge: newServiceCharge,
            totalAmount: newTotalAmount
        });

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

        let where = {};
        const now = new Date();

        if (period === "day") {
            const dayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const dayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
            where.createdAt = {
                [Op.gte]: dayStart,
                [Op.lt]: dayEnd
            };
        } else if (period === "week") {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            where.createdAt = { [Op.gte]: weekAgo };
        } else if (period === "month") {
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
            where.createdAt = {
                [Op.gte]: monthStart,
                [Op.lt]: monthEnd
            };
        }

        const orders = await Order.findAll({ where });

        const stats = {
            totalOrders: orders.length,
            totalRevenue: orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0),
            completedOrders: orders.filter(o => o.status === "completed").length,
            cancelledOrders: orders.filter(o => o.status === "cancelled").length,
            paidOrders: orders.filter(o => o.paymentStatus === "paid").length,
            avgOrderValue: orders.length > 0 ? orders.reduce((sum, o) => sum + parseFloat(o.totalAmount), 0) / orders.length : 0
        };

        return res.status(200).json(stats);
    } catch (error) {
        console.error("Error in getOrderStats:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};