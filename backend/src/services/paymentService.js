import crypto from 'crypto';
import Booking from '../models/Booking.js';
import Table from '../models/Table.js';

const stripVietnamese = (value) =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .trim();

export const buildPaymentCode = (bookingId) =>
  `GS${String(bookingId || '').replace(/-/g, '').slice(0, 12).toUpperCase()}`;

export const buildVietQrInfo = (booking) => {
  const bankCode = process.env.SEPAY_BANK_CODE || '';
  const accountNo = process.env.SEPAY_ACCOUNT_NO || '';
  const accountName = stripVietnamese(process.env.SEPAY_ACCOUNT_NAME || 'Golden Spoons');
  const amount = Math.round(Number(booking.totalPrice || 0));
  const paymentCode = buildPaymentCode(booking.id);
  const addInfo = paymentCode;

  const qrImageUrl =
    `https://img.vietqr.io/image/${encodeURIComponent(bankCode)}-${encodeURIComponent(accountNo)}-compact2.png` +
    `?amount=${encodeURIComponent(amount)}` +
    `&addInfo=${encodeURIComponent(addInfo)}` +
    `&accountName=${encodeURIComponent(accountName)}`;

  return {
    bankCode,
    accountNo,
    accountName,
    amount,
    paymentCode,
    addInfo,
    qrImageUrl,
  };
};

export const findBookingFromSepayPayload = async (payload) => {
  const content = String(payload.content || payload.description || payload.payment_code || '');
  const paymentCode = String(payload.payment_code || '');
  const normalizedContent = `${content} ${paymentCode}`.toUpperCase();

  const bookings = await Booking.findAll({
    where: { paymentStatus: 'chưa thanh toán' },
    include: [{ model: Table, as: 'Table' }],
  });

  return bookings.find((booking) => normalizedContent.includes(buildPaymentCode(booking.id)));
};

export const verifySepayWebhook = (req) => {
  const secret = process.env.SEPAY_SECRET;
  if (!secret) return true;

  const authHeader = req.headers.authorization || '';
  if (authHeader === `Apikey ${secret}` || authHeader === `Bearer ${secret}`) {
    return true;
  }

  const signature = req.headers['x-sepay-signature'];
  const timestamp = req.headers['x-sepay-timestamp'];
  if (!signature || !timestamp) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - Number(timestamp)) > 300) return false;

  const rawBody = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : String(req.body || '');
  const expected = `sha256=${crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`)
    .digest('hex')}`;

  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(String(signature));
  if (expectedBuffer.length !== signatureBuffer.length) return false;
  return crypto.timingSafeEqual(expectedBuffer, signatureBuffer);
};
