import Booking from '../models/Booking.js';
import Table from '../models/Table.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [
        { model: Table, as: 'Table' },
        { model: User, as: 'User', attributes: { exclude: ['hashPassword'] } },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ bookings });
  } catch (error) {
    console.error('Error in getAllBookings:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['đang chờ', 'đã xác nhận', 'đã check-in', 'hoàn thành', 'đã hủy'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }

    await booking.update({ status });

    const table = await Table.findByPk(booking.tableId);
    if (table) {
      if (status === 'đã check-in') {
        await table.update({ status: 'Đang sử dụng' });
      } else if (['hoàn thành', 'đã hủy'].includes(status)) {
        await table.update({ status: 'Có sẵn' });
      }
    }

    return res.json({ message: 'Cập nhật trạng thái thành công', booking });
  } catch (error) {
    console.error('Error in updateBookingStatus:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const adminCancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findByPk(id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }
    if (['hoàn thành', 'đã hủy'].includes(booking.status)) {
      return res.status(400).json({ message: 'Không thể hủy đặt bàn ở trạng thái này' });
    }

    await booking.update({ status: 'đã hủy' });

    const table = await Table.findByPk(booking.tableId);
    if (table && table.status === 'Đã đặt') {
      await table.update({ status: 'Có sẵn' });
    }

    return res.json({ message: 'Hủy đặt bàn thành công' });
  } catch (error) {
    console.error('Error in adminCancelBooking:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getTableStatus = async (req, res) => {
  try {
    const tables = await Table.findAll({ order: [['tableName', 'ASC']] });

    const summary = {
      total: tables.length,
      available: tables.filter((t) => t.status === 'Có sẵn').length,
      inUse: tables.filter((t) => t.status === 'Đang sử dụng').length,
      booked: tables.filter((t) => t.status === 'Đã đặt').length,
      maintenance: tables.filter((t) => t.status === 'Bảo trì').length,
    };

    return res.json({ tables, summary });
  } catch (error) {
    console.error('Error in getTableStatus:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const addTable = async (req, res) => {
  try {
    const { tableName, capacity, location, price, status } = req.body;

    if (!tableName || !capacity || !location || price === undefined) {
      return res.status(400).json({ message: 'Thiếu thông tin bàn' });
    }

    const existing = await Table.findOne({ where: { tableName } });
    if (existing) {
      return res.status(409).json({ message: 'Tên bàn đã tồn tại' });
    }

    const image = req.file ? `/uploads/tables/${req.file.filename}` : null;
    const table = await Table.create({ tableName, capacity, location, price, status: status || 'Có sẵn' , image });
    return res.status(201).json({ message: 'Thêm bàn thành công', table });
  } catch (error) {
    console.error('Error in addTable:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableName, capacity, location, price, status } = req.body;

    const table = await Table.findByPk(id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }

    const image = req.file ? `/uploads/tables/${req.file.filename}` : null;
    await table.update({ tableName, capacity, location, price, status, image });
    return res.json({ message: 'Cập nhật bàn thành công', table });
  } catch (error) {
    console.error('Error in updateTable:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.findByPk(id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }

    const activeBookings = await Booking.count({
      where: {
        tableId: id,
        status: { [Op.in]: ['đang chờ', 'đã xác nhận', 'đã check-in'] },
      },
    });

    if (activeBookings > 0) {
      return res.status(400).json({ message: 'Không thể xoá bàn đang có đặt bàn hoạt động' });
    }

    await table.destroy();
    return res.json({ message: 'Xoá bàn thành công' });
  } catch (error) {
    console.error('Error in deleteTable:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};
