import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';

import BookingScreen from '../app/(user)/booking';
import { createBooking } from '@/src/services/booking.service';

jest.mock('@/src/services/booking.service', () => ({
  createBooking: jest.fn(),
}));

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({
    tableId: 'table-1',
    tableName: 'Bàn VIP',
    price: '500000',
    capacity: '4',
  }),
}));

jest.mock('@/src/store/authStore', () => () => ({
  email: 'user01@gmail.com',
  phone: '0912345678',
}));

jest.mock('@/src/components/common/DateTimePicker', () => {
  const React = require('react');
  const { View, TextInput, Text } = require('react-native');

  return function MockDateTimePicker(props) {
    return (
      <View>
        <TextInput
          placeholder="datetime"
          value={props.value}
          onChangeText={props.onChange}
        />
        {props.error ? <Text>{props.error}</Text> : null}
      </View>
    );
  };
});

describe('UnitTest BookingScreen prefill', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('tự động điền email và số điện thoại từ tài khoản', () => {
    const { getByDisplayValue } = render(<BookingScreen />);

    expect(getByDisplayValue('user01@gmail.com')).toBeTruthy();
    expect(getByDisplayValue('0912345678')).toBeTruthy();
  });

  test('gửi thông tin liên hệ đã chỉnh sửa khi tạo booking', async () => {
    createBooking.mockResolvedValue({ data: { booking: { id: 'booking-1' } } });
    const { getByPlaceholderText, getByText } = render(<BookingScreen />);

    fireEvent.changeText(getByPlaceholderText('datetime'), '2099-12-31 18:00');
    fireEvent.changeText(getByPlaceholderText('email@example.com'), 'new@gmail.com');
    fireEvent.changeText(getByPlaceholderText('0912345678'), '0987654321');
    fireEvent.press(getByText('Xác nhận đặt bàn'));

    await waitFor(() => {
      expect(createBooking).toHaveBeenCalledWith(expect.objectContaining({
        guestEmail: 'new@gmail.com',
        guestPhone: '0987654321',
      }));
    });
  });
});
