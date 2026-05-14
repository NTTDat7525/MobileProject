import Booking from '../models/Booking.js';
import Table from '../models/Table.js';
import {
  buildVietQrInfo,
  findBookingFromSepayPayload,
  verifySepayWebhook,
} from '../services/paymentService.js';

export const getBookingPaymentInfo = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Table, as: 'Table' }],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt bàn' });
    }

    if (booking.PaymentMethod !== 'chuyển khoản ngân hàng') {
      return res.status(400).json({ message: 'Đặt bàn này không dùng phương thức chuyển khoản' });
    }

    return res.json({
      payment: buildVietQrInfo(booking),
      booking,
    });
  } catch (error) {
    console.error('Lỗi lấy thông tin thanh toán:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const handleSepayWebhook = async (req, res) => {
  try {
    if (!verifySepayWebhook(req)) {
      return res.status(401).json({ success: false, message: 'Webhook không hợp lệ' });
    }

    const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : '{}';
    const payload = JSON.parse(rawBody || '{}');

    if (payload.transfer_type && payload.transfer_type !== 'credit') {
      return res.json({ success: true, message: 'Bỏ qua giao dịch ghi nợ' });
    }

    const booking = await findBookingFromSepayPayload(payload);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy đặt bàn phù hợp' });
    }

    const receivedAmount = Number(payload.amount || 0);
    const expectedAmount = Number(booking.totalPrice || 0);
    if (receivedAmount < expectedAmount) {
      return res.status(400).json({ success: false, message: 'Số tiền thanh toán chưa đủ' });
    }

    await booking.update({ paymentStatus: 'đã thanh toán' });

    return res.json({
      success: true,
      message: 'Cập nhật thanh toán thành công',
      bookingId: booking.id,
    });
  } catch (error) {
    console.error('Lỗi xử lý webhook SePay:', error);
    return res.status(500).json({ success: false, message: 'Lỗi máy chủ' });
  }
};
