import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import BookingScreen from '../app/(user)/booking';

import { createBooking } from '@/src/services/booking.service';

jest.mock('@/src/services/booking.service', () => ({
  createBooking: jest.fn(),
}));

const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
  }),

  useLocalSearchParams: () => ({
    tableId: '1',
    tableName: 'Bàn VIP',
    price: '500000',
    capacity: '4',
  }),
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

        {props.error ? (
          <Text>{props.error}</Text>
        ) : null}
      </View>
    );
  };
});
describe('UnitTest BookingScreen', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hiển thị lỗi khi bỏ trống input', async () => {

    const { getByText } = render(<BookingScreen />);

    fireEvent.press(getByText('Xác nhận đặt bàn'));

    await waitFor(() => {

      expect(
        getByText('Vui lòng nhập thời gian')
      ).toBeTruthy();

      expect(
        getByText('Vui lòng nhập email')
      ).toBeTruthy();

      expect(
        getByText('Vui lòng nhập số điện thoại')
      ).toBeTruthy();

    });

  });

  test('hiển thị lỗi email không hợp lệ', async () => {

    const {
      getByPlaceholderText,
      getByText,
    } = render(<BookingScreen />);

    fireEvent.changeText(
      getByPlaceholderText('datetime'),
      '2099-12-31 18:00'
    );

    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'abc'
    );

    fireEvent.changeText(
      getByPlaceholderText('0912345678'),
      '0912345678'
    );

    fireEvent.press(getByText('Xác nhận đặt bàn'));

    await waitFor(() => {

      expect(
        getByText('Email không hợp lệ')
      ).toBeTruthy();

    });

  });

  test('hiển thị lỗi khi thời gian ở quá khứ', async () => {

    const {
      getByPlaceholderText,
      getByText,
    } = render(<BookingScreen />);

    fireEvent.changeText(
      getByPlaceholderText('datetime'),
      '2020-01-01 10:00'
    );

    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'admin@gmail.com'
    );

    fireEvent.changeText(
      getByPlaceholderText('0912345678'),
      '0912345678'
    );

    fireEvent.press(getByText('Xác nhận đặt bàn'));

    await waitFor(() => {

      expect(
        getByText('Thời gian phải ở tương lai')
      ).toBeTruthy();

    });

  });



  test('đặt bàn thành công', async () => {

    createBooking.mockResolvedValue({
      data: {
        booking: {
          id: '123',
        },
      },
    });

    const {
      getByPlaceholderText,
      getByText,
    } = render(<BookingScreen />);

    fireEvent.changeText(
      getByPlaceholderText('datetime'),
      '2099-12-31 18:00'
    );

    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'admin@gmail.com'
    );

    fireEvent.changeText(
      getByPlaceholderText('0912345678'),
      '0912345678'
    );

    fireEvent.changeText(
      getByPlaceholderText('Ví dụ: Sinh nhật, dị ứng thực phẩm...'),
      'Sinh nhật'
    );

    fireEvent.press(getByText('Xác nhận đặt bàn'));

    await waitFor(() => {

      expect(createBooking).toHaveBeenCalled();

      expect(mockReplace).toHaveBeenCalledWith({
        pathname: '/(user)/confirmation',
        params: {
          bookingId: '123',
        },
      });

    });

  });

  test('hiển thị alert khi đặt bàn thất bại', async () => {

    jest.spyOn(Alert, 'alert');

    createBooking.mockRejectedValue({
      response: {
        data: {
          message: 'Bàn đã được đặt',
        },
      },
    });

    const {
      getByPlaceholderText,
      getByText,
    } = render(<BookingScreen />);

    fireEvent.changeText(
      getByPlaceholderText('datetime'),
      '2099-12-31 18:00'
    );

    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'admin@gmail.com'
    );

    fireEvent.changeText(
      getByPlaceholderText('0912345678'),
      '0912345678'
    );

    fireEvent.press(getByText('Xác nhận đặt bàn'));

    await waitFor(() => {

      expect(Alert.alert).toHaveBeenCalledWith(
        'Lỗi',
        'Bàn đã được đặt'
      );

    });

  });

  test('hiển thị lỗi mặc định khi server lỗi', async () => {

    jest.spyOn(Alert, 'alert');

    createBooking.mockRejectedValue(
      new Error('Network Error')
    );

    const {
      getByPlaceholderText,
      getByText,
    } = render(<BookingScreen />);

    fireEvent.changeText(
      getByPlaceholderText('datetime'),
      '2099-12-31 18:00'
    );

    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'admin@gmail.com'
    );

    fireEvent.changeText(
      getByPlaceholderText('0912345678'),
      '0912345678'
    );

    fireEvent.press(getByText('Xác nhận đặt bàn'));

    await waitFor(() => {

      expect(Alert.alert).toHaveBeenCalledWith(
        'Lỗi',
        'Đặt bàn thất bại. Vui lòng thử lại.'
      );

    });

  });

});
