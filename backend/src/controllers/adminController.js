import Booking from '../models/Booking.js';
import Table from '../models/Table.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

const BOOKING_STATUSES = ['đang chờ', 'đã xác nhận', 'đã check-in', 'hoàn thành', 'đã hủy'];
const TABLE_STATUSES = ['Có sẵn', 'Đang sử dụng', 'Đã đặt', 'Bảo trì'];

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
    console.error('Lỗi lấy danh sách đặt bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!BOOKING_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
    }

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }

    await booking.update({ status });

    const table = await Table.findByPk(booking.tableId);
    if (table) {
      if (status === 'đã check-in') {
        await table.update({ status: 'Đang sử dụng' });
      } else if (status === 'đã xác nhận') {
        await table.update({ status: 'Đã đặt' });
      } else if (['hoàn thành', 'đã hủy'].includes(status)) {
        await releaseTableIfNoActiveBookings(booking.tableId);
      }
    }

    return res.json({ message: 'Cập nhật trạng thái thành công', booking });
  } catch (error) {
    console.error('Lỗi cập nhật trạng thái đặt bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const updateBookingPayment = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!['chưa thanh toán', 'đã thanh toán'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ' });
    }

    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }

    await booking.update({ paymentStatus });
    return res.json({ message: 'Cập nhật thanh toán thành công', booking });
  } catch (error) {
    console.error('Lỗi cập nhật thanh toán:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const adminCancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }
    if (['hoàn thành', 'đã hủy'].includes(booking.status)) {
      return res.status(400).json({ message: 'Không thể hủy đặt bàn ở trạng thái này' });
    }

    await booking.update({ status: 'đã hủy' });
    await releaseTableIfNoActiveBookings(booking.tableId);

    return res.json({ message: 'Hủy đặt bàn thành công' });
  } catch (error) {
    console.error('Lỗi hủy đặt bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
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
    console.error('Lỗi lấy trạng thái bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const addTable = async (req, res) => {
  try {
    const { tableName, capacity, location, price, status } = req.body;

    if (!tableName || !capacity || !location || price === undefined) {
      return res.status(400).json({ message: 'Thiếu thông tin bàn' });
    }

    if (status && !TABLE_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái bàn không hợp lệ' });
    }

    const existing = await Table.findOne({ where: { tableName } });
    if (existing) {
      return res.status(409).json({ message: 'Tên bàn đã tồn tại' });
    }

    const image = req.file ? `/uploads/tables/${req.file.filename}` : null;
    const table = await Table.create({
      tableName,
      capacity,
      location,
      price,
      status: status || 'Có sẵn',
      image
    });
    return res.status(201).json({ message: 'Thêm bàn thành công', table });
  } catch (error) {
    console.error('Lỗi thêm bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const updateTable = async (req, res) => {
  try {
    const { tableName, capacity, location, price, status } = req.body;

    const table = await Table.findByPk(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }

    if (status && !TABLE_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Trạng thái bàn không hợp lệ' });
    }

    const nextData = {
      ...(tableName !== undefined && { tableName }),
      ...(capacity !== undefined && { capacity }),
      ...(location !== undefined && { location }),
      ...(price !== undefined && { price }),
      ...(status !== undefined && { status }),
    };
    if (req.file) {
      nextData.image = `/uploads/tables/${req.file.filename}`;
    }

    await table.update(nextData);
    return res.json({ message: 'Cập nhật bàn thành công', table });
  } catch (error) {
    console.error('Lỗi cập nhật bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }

    const activeBookings = await Booking.count({
      where: {
        tableId: req.params.id,
        status: { [Op.in]: ['đang chờ', 'đã xác nhận', 'đã check-in'] },
      },
    });

    if (activeBookings > 0) {
      return res.status(400).json({ message: 'Không thể xóa bàn đang có đặt bàn hoạt động' });
    }

    await table.destroy();
    return res.json({ message: 'Xóa bàn thành công' });
  } catch (error) {
    console.error('Lỗi xóa bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['hashPassword'] },
      order: [['createdAt', 'DESC']],
    });
    return res.json({ users });
  } catch (error) {
    console.error('Lỗi lấy danh sách người dùng:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const getReports = async (req, res) => {
  try {
    const [totalUsers, totalBookings, totalTables, paidBookings, revenueRows] = await Promise.all([
      User.count(),
      Booking.count(),
      Table.count(),
      Booking.count({ where: { paymentStatus: 'đã thanh toán' } }),
      Booking.findAll({
        attributes: ['totalPrice'],
        where: { paymentStatus: 'đã thanh toán' },
      }),
    ]);

    const revenue = revenueRows.reduce((sum, item) => sum + Number(item.totalPrice || 0), 0);
    const byStatus = {};
    for (const status of BOOKING_STATUSES) {
      byStatus[status] = await Booking.count({ where: { status } });
    }

    return res.json({
      report: {
        totalUsers,
        totalBookings,
        totalTables,
        paidBookings,
        revenue,
        byStatus,
      },
    });
  } catch (error) {
    console.error('Lỗi lấy báo cáo:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

async function releaseTableIfNoActiveBookings(tableId) {
  const activeBookings = await Booking.count({
    where: {
      tableId,
      status: { [Op.in]: ['đang chờ', 'đã xác nhận', 'đã check-in'] },
    },
  });

  if (activeBookings === 0) {
    const table = await Table.findByPk(tableId);
    if (table) {
      await table.update({ status: 'Có sẵn' });
    }
  }
}
