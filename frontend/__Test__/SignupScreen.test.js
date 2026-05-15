
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import SignupScreen from '../app/(auth)/signup';

import { signup } from '@/src/services/auth.service';

jest.mock('@/src/services/auth.service', () => ({
  signup: jest.fn(),
}));

const mockReplace = jest.fn();
const mockBack = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    back: mockBack,
  }),
}));

jest.mock('@/src/store/authStore', () => () => ({
  login: jest.fn(),
}));

describe('UnitTest SignupScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hiển thị lỗi khi bỏ trống input', async () => {
    const { getAllByText } = render(<SignupScreen />);

    fireEvent.press(getAllByText('Đăng ký')[1]);

    await waitFor(() => {
      expect(
        getAllByText('Vui lòng nhập tên đăng nhập')
      ).toBeTruthy();

      expect(
        getAllByText('Vui lòng nhập email')
      ).toBeTruthy();

      expect(
        getAllByText('Vui lòng nhập mật khẩu')
      ).toBeTruthy();
    });
  });

  test('hiển thị lỗi email không hợp lệ', async () => {
    const { getByPlaceholderText, getAllByText } =
      render(<SignupScreen />);

    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'abc'
    );

    fireEvent.press(getAllByText('Đăng ký')[1]);

    await waitFor(() => {
      expect(
        getAllByText('Email không hợp lệ')
      ).toBeTruthy();
    });
  });

  test('hiển thị lỗi khi mật khẩu dưới 6 ký tự', async () => {
    const { getByPlaceholderText, getAllByText } =
      render(<SignupScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Tối thiểu 6 ký tự'),
      '123'
    );

    fireEvent.press(getAllByText('Đăng ký')[1]);

    await waitFor(() => {
      expect(
        getAllByText('Mật khẩu tối thiểu 6 ký tự')
      ).toBeTruthy();
    });
  });

  test('hiển thị lỗi khi mật khẩu xác nhận không khớp', async () => {
    const {
      getByPlaceholderText,
      getAllByText,
    } = render(<SignupScreen />);

    fireEvent.changeText(
      getByPlaceholderText('Tối thiểu 6 ký tự'),
      '123456'
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập lại mật khẩu'),
      '654321'
    );

    fireEvent.press(getAllByText('Đăng ký')[1]);

    await waitFor(() => {
      expect(
        getAllByText('Mật khẩu xác nhận không khớp')
      ).toBeTruthy();
    });
  });

  test('đăng ký thành công', async () => {
    jest.spyOn(Alert, 'alert');

    signup.mockResolvedValue({});

    const {
      getByPlaceholderText,
      getAllByText,
    } = render(<SignupScreen />);

    fireEvent.changeText(
      getByPlaceholderText('username123'),
      'admin'
    );

    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'admin@gmail.com'
    );

    fireEvent.changeText(
      getByPlaceholderText('Tối thiểu 6 ký tự'),
      '123456'
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập lại mật khẩu'),
      '123456'
    );

    fireEvent.press(getAllByText('Đăng ký')[1]);

    await waitFor(() => {
      expect(signup).toHaveBeenCalledWith({
        username: 'admin',
        email: 'admin@gmail.com',
        password: '123456',
      });

      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  test('hiển thị alert khi đăng ký thất bại', async () => {
    jest.spyOn(Alert, 'alert');

    signup.mockRejectedValue({
      response: {
        data: {
          message: 'Email đã tồn tại',
        },
      },
    });

    const {
      getByPlaceholderText,
      getAllByText,
    } = render(<SignupScreen />);

    fireEvent.changeText(
      getByPlaceholderText('username123'),
      'admin'
    );

    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'admin@gmail.com'
    );

    fireEvent.changeText(
      getByPlaceholderText('Tối thiểu 6 ký tự'),
      '123456'
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập lại mật khẩu'),
      '123456'
    );

    fireEvent.press(getAllByText('Đăng ký')[1]);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Lỗi đăng ký',
        'Email đã tồn tại'
      );
    });
  });

  test('hiển thị lỗi mặc định khi server lỗi', async () => {
    jest.spyOn(Alert, 'alert');

    signup.mockRejectedValue(new Error('Network Error'));

    const {
      getByPlaceholderText,
      getAllByText,
    } = render(<SignupScreen />);

    fireEvent.changeText(
      getByPlaceholderText('username123'),
      'admin'
    );

    fireEvent.changeText(
      getByPlaceholderText('email@example.com'),
      'admin@gmail.com'
    );

    fireEvent.changeText(
      getByPlaceholderText('Tối thiểu 6 ký tự'),
      '123456'
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập lại mật khẩu'),
      '123456'
    );

    fireEvent.press(getAllByText('Đăng ký')[1]);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Lỗi đăng ký',
        'Đăng ký thất bại. Vui lòng thử lại.'
      );
    });
  });
});

