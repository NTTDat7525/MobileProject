import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Table from '../models/Table.js';
import { Op } from 'sequelize';
import { sendBookingConfirmationEmail } from '../services/emailService.js';

export const authMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { phone, bio } = req.body;
    const userId = req.user.id;
    await User.update({ phone, bio }, { where: { id: userId } });
    const user = await User.findByPk(userId, { attributes: { exclude: ['hashPassword'] } });
    return res.json({ message: 'Cập nhật hồ sơ thành công', user });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const bookings = await Booking.findAll({
      where: { userId },
      include: [{ model: Table, as: 'Table' }],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ bookings });
  } catch (error) {
    console.error('Error in getUserBookings:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tableId, time, numberOfGuests, guestEmail, guestPhone, specialRequests, PaymentMethod } = req.body;

    if (!tableId || !time || !numberOfGuests || !guestEmail || !guestPhone) {
      return res.status(400).json({ message: 'Thiếu thông tin đặt bàn' });
    }

    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Bàn không tồn tại' });
    }
    if (table.status !== 'Có sẵn') {
      return res.status(400).json({ message: 'Bàn này hiện không có sẵn' });
    }

    const booking = await Booking.create({
      userId,
      tableId,
      time: new Date(time),
      numberOfGuests,
      guestEmail,
      guestPhone,
      specialRequests: specialRequests || '',
      PaymentMethod: PaymentMethod || 'tiền mặt',
      totalPrice: table.price,
      status: 'đang chờ',
    });

    await table.update({ status: 'Đã đặt' });

    const bookingWithTable = await Booking.findByPk(booking.id, {
      include: [{ model: Table, as: 'Table' }],
    });

    // Gửi email xác nhận đặt bàn thành công
    try {
      await sendBookingConfirmationEmail(guestEmail, bookingWithTable);
    } catch (emailError) {
      console.error('Lỗi gửi email xác nhận:', emailError);
      // Không trả lỗi cho client, vì đặt bàn đã thành công
    }

    return res.status(201).json({ message: 'Đặt bàn thành công', booking: bookingWithTable });
  } catch (error) {
    console.error('Error in createBooking:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const booking = await Booking.findOne({
      where: { id, userId },
      include: [{ model: Table, as: 'Table' }],
    });
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }
    return res.json({ booking });
  } catch (error) {
    console.error('Error in getBookingById:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { time, numberOfGuests, guestEmail, guestPhone, specialRequests, PaymentMethod } = req.body;

    const booking = await Booking.findOne({ where: { id, userId } });
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }
    if (booking.status !== 'đang chờ') {
      return res.status(400).json({ message: 'Chỉ có thể chỉnh sửa đặt bàn đang chờ xác nhận' });
    }

    await booking.update({
      ...(time && { time: new Date(time) }),
      ...(numberOfGuests && { numberOfGuests }),
      ...(guestEmail && { guestEmail }),
      ...(guestPhone && { guestPhone }),
      ...(specialRequests !== undefined && { specialRequests }),
      ...(PaymentMethod && { PaymentMethod }),
    });

    return res.json({ message: 'Cập nhật đặt bàn thành công', booking });
  } catch (error) {
    console.error('Error in updateBooking:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const booking = await Booking.findOne({ where: { id, userId } });
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
    console.error('Error in cancelBooking:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getUserTables = async (req, res) => {
  try {
    const { location, capacity } = req.query;
    const where = {};
    if (location) where.location = location;
    if (capacity) where.capacity = { [Op.gte]: parseInt(capacity, 10) };

    const tables = await Table.findAll({ where, order: [['tableName', 'ASC']] });
    return res.json({ tables });
  } catch (error) {
    console.error('Error in getUserTables:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.findByPk(id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }
    return res.json({ table });
  } catch (error) {
    console.error('Error in getTableById:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};