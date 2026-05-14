import { Op } from 'sequelize';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Table from '../models/Table.js';
import { sendBookingConfirmationEmail } from '../services/emailService.js';

const ACTIVE_BOOKING_STATUSES = ['đang chờ', 'đã xác nhận', 'đã check-in'];

export const authMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Chưa đăng nhập' });
    }
    return res.json(req.user);
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi máy chủ', error: error.message });
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
    console.error('Lỗi cập nhật hồ sơ:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Table, as: 'Table' }],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ bookings });
  } catch (error) {
    console.error('Lỗi lấy lịch sử đặt bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const createBooking = async (req, res) => {
  try {
    const userId = req.user.id;
    const { tableId, time, numberOfGuests, guestEmail, guestPhone, specialRequests, PaymentMethod } = req.body;

    if (!tableId || !time || !numberOfGuests || !guestEmail || !guestPhone) {
      return res.status(400).json({ message: 'Thiếu thông tin đặt bàn' });
    }

    const bookingTime = new Date(time);
    if (Number.isNaN(bookingTime.getTime()) || bookingTime <= new Date()) {
      return res.status(400).json({ message: 'Thời gian đặt bàn không hợp lệ hoặc đã qua' });
    }

    const table = await Table.findByPk(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Bàn không tồn tại' });
    }

    if (table.status !== 'Có sẵn') {
      return res.status(400).json({ message: 'Bàn này hiện không có sẵn' });
    }

    if (Number(numberOfGuests) > table.capacity) {
      return res.status(400).json({ message: `Bàn chỉ chứa tối đa ${table.capacity} khách` });
    }

    const booking = await Booking.create({
      userId,
      tableId,
      time: bookingTime,
      numberOfGuests,
      guestEmail,
      guestPhone,
      specialRequests: specialRequests || '',
      PaymentMethod: PaymentMethod || 'tiền mặt',
      totalPrice: table.price,
      status: 'đang chờ',
      paymentStatus: 'chưa thanh toán',
    });

    await table.update({ status: 'Đã đặt' });

    const bookingWithTable = await Booking.findByPk(booking.id, {
      include: [{ model: Table, as: 'Table' }],
    });

    try {
      await sendBookingConfirmationEmail(guestEmail, bookingWithTable);
    } catch (emailError) {
      console.error('Lỗi gửi email xác nhận đặt bàn:', emailError.message);
    }

    return res.status(201).json({ message: 'Đặt bàn thành công', booking: bookingWithTable });
  } catch (error) {
    console.error('Lỗi tạo đặt bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Table, as: 'Table' }],
    });
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }
    return res.json({ booking });
  } catch (error) {
    console.error('Lỗi lấy chi tiết đặt bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }
    if (booking.status !== 'đang chờ') {
      return res.status(400).json({ message: 'Chỉ có thể chỉnh sửa đặt bàn đang chờ xác nhận' });
    }

    const { time, numberOfGuests, guestEmail, guestPhone, specialRequests, PaymentMethod } = req.body;
    const nextData = {};

    if (time) {
      const bookingTime = new Date(time);
      if (Number.isNaN(bookingTime.getTime()) || bookingTime <= new Date()) {
        return res.status(400).json({ message: 'Thời gian đặt bàn không hợp lệ hoặc đã qua' });
      }
      nextData.time = bookingTime;
    }

    if (numberOfGuests) {
      const table = await Table.findByPk(booking.tableId);
      if (table && Number(numberOfGuests) > table.capacity) {
        return res.status(400).json({ message: `Bàn chỉ chứa tối đa ${table.capacity} khách` });
      }
      nextData.numberOfGuests = numberOfGuests;
    }

    if (guestEmail) nextData.guestEmail = guestEmail;
    if (guestPhone) nextData.guestPhone = guestPhone;
    if (specialRequests !== undefined) nextData.specialRequests = specialRequests;
    if (PaymentMethod) nextData.PaymentMethod = PaymentMethod;

    await booking.update(nextData);

    const updated = await Booking.findByPk(booking.id, {
      include: [{ model: Table, as: 'Table' }],
    });
    return res.json({ message: 'Cập nhật đặt bàn thành công', booking: updated });
  } catch (error) {
    console.error('Lỗi cập nhật đặt bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
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

export const updatePaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }

    const { paymentStatus } = req.body;
    if (!['chưa thanh toán', 'đã thanh toán'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Trạng thái thanh toán không hợp lệ' });
    }

    await booking.update({ paymentStatus });
    return res.json({ message: 'Cập nhật thanh toán thành công', booking });
  } catch (error) {
    console.error('Lỗi cập nhật thanh toán:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
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
    console.error('Lỗi lấy danh sách bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const getTableById = async (req, res) => {
  try {
    const table = await Table.findByPk(req.params.id);
    if (!table) {
      return res.status(404).json({ message: 'Không tìm thấy bàn' });
    }
    return res.json({ table });
  } catch (error) {
    console.error('Lỗi lấy chi tiết bàn:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

async function releaseTableIfNoActiveBookings(tableId) {
  const activeBookings = await Booking.count({
    where: {
      tableId,
      status: { [Op.in]: ACTIVE_BOOKING_STATUSES },
    },
  });

  if (activeBookings === 0) {
    const table = await Table.findByPk(tableId);
    if (table) {
      await table.update({ status: 'Có sẵn' });
    }
  }
}
