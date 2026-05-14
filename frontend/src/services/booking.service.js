import api from './api';

export const createBooking = (data) =>
  api.post('/users/bookings', data);

export const getUserBookings = () =>
  api.get('/users/bookings');

export const getBookingById = (id) =>
  api.get(`/users/bookings/${id}`);

export const getBookingPaymentInfo = (id) =>
  api.get(`/users/bookings/${id}/payment-info`);

export const updateBooking = (id, data) =>
  api.put(`/users/bookings/${id}`, data);

export const cancelBooking = (id) =>
  api.put(`/users/bookings/${id}/cancel`);

export const updatePaymentStatus = (id, paymentStatus) =>
  api.put(`/users/bookings/${id}/payment`, { paymentStatus });

export const getAllBookings = () =>
  api.get('/admin/bookings');

export const updateBookingStatus = (id, status) =>
  api.put(`/admin/bookings/${id}/status`, { status });

export const updateBookingPayment = (id, paymentStatus) =>
  api.put(`/admin/bookings/${id}/payment`, { paymentStatus });

export const adminCancelBooking = (id) =>
  api.put(`/admin/bookings/${id}/cancel`);
