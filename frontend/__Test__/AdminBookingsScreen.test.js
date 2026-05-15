import React from 'react';
import { render, waitFor } from '@testing-library/react-native';

import AdminBookingsScreen from '../app/(admin)/bookings';
import { getAllBookings } from '@/src/services/booking.service';

jest.mock('@/src/services/booking.service', () => ({
  getAllBookings: jest.fn(),
  updateBookingStatus: jest.fn(),
  adminCancelBooking: jest.fn(),
}));

describe('UnitTest AdminBookingsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hiển thị dữ liệu booking đã map từ backend', async () => {
    getAllBookings.mockResolvedValue({
      data: {
        bookings: [
          {
            id: 'booking-1',
            time: '2099-12-31T18:00:00.000Z',
            numberOfGuests: 2,
            guestEmail: 'guest@gmail.com',
            guestPhone: '0912345678',
            status: 'đang chờ',
            paymentStatus: 'chưa thanh toán',
            totalPrice: 500000,
            createdAt: '2026-01-01T00:00:00.000Z',
            Table: { tableName: 'Bàn VIP' },
            User: { username: 'user01' },
          },
        ],
      },
    });

    const { getByText } = render(<AdminBookingsScreen />);

    await waitFor(() => {
      expect(getByText('Bàn VIP')).toBeTruthy();
      expect(getByText('Khách hàng: user01')).toBeTruthy();
      expect(getByText('guest@gmail.com')).toBeTruthy();
      expect(getByText('Tổng tiền: 500.000 ₫')).toBeTruthy();
    });
  });

  test('hiển thị empty state khi không có booking', async () => {
    getAllBookings.mockResolvedValue({ data: { bookings: [] } });

    const { getByText } = render(<AdminBookingsScreen />);

    await waitFor(() => {
      expect(getByText('Không có đặt bàn')).toBeTruthy();
    });
  });

  test('hiển thị error state khi API lỗi', async () => {
    getAllBookings.mockRejectedValue(new Error('Network Error'));

    const { getByText } = render(<AdminBookingsScreen />);

    await waitFor(() => {
      expect(getByText('Không tải được đặt bàn')).toBeTruthy();
      expect(getByText('Không thể tải danh sách đặt bàn.')).toBeTruthy();
    });
  });
});
