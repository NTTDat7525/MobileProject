import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import SigninScreen from '../app/(auth)/signin';

import { signin } from '@/src/services/auth.service';

jest.mock('@/src/services/auth.service', () => ({
  signin: jest.fn(),
}));

const mockReplace = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: mockReplace,
    push: jest.fn(),
  }),
}));

const mockLogin = jest.fn();

jest.mock('@/src/store/authStore', () => () => ({
  user: null,
  login: mockLogin,
  isLoading: false,
}));

describe('UnitTest SigninScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hiển thị lỗi khi bỏ trống input', async () => {
    const { getAllByText } = render(<SigninScreen />);

    fireEvent.press(getAllByText('Đăng nhập')[1]);

    await waitFor(() => {
      expect(
        getAllByText('Vui lòng nhập tên đăng nhập')
      ).toBeTruthy();

      expect(
        getAllByText('Vui lòng nhập mật khẩu')
      ).toBeTruthy();
    });
  });

  test('login thành công với user role', async () => {
    signin.mockResolvedValue({
      data: {
        accessToken: 'token123',
        user: {
          role: 'user',
        },
      },
    });

    const { getByPlaceholderText, getAllByText } = render(
      <SigninScreen />
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập tên đăng nhập'),
      'admin'
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập mật khẩu'),
      '123456'
    );

    fireEvent.press(getAllByText('Đăng nhập')[1]);

    await waitFor(() => {
      expect(signin).toHaveBeenCalledWith(
        'admin',
        '123456'
      );

      expect(mockLogin).toHaveBeenCalled();

      expect(mockReplace).toHaveBeenCalledWith(
        '/(user)/home'
      );
    });
  });

  test('login thành công với admin role', async () => {
    signin.mockResolvedValue({
      data: {
        accessToken: 'token123',
        user: {
          role: 'admin',
        },
      },
    });

    const { getByPlaceholderText, getAllByText } = render(
      <SigninScreen />
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập tên đăng nhập'),
      'admin'
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập mật khẩu'),
      '123456'
    );

    fireEvent.press(getAllByText('Đăng nhập')[1]);

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith(
        '/(admin)/dashboard'
      );
    });
  });

  test('hiển thị alert khi login thất bại', async () => {
    jest.spyOn(Alert, 'alert');

    signin.mockRejectedValue({
      response: {
        data: {
          message: 'Sai tài khoản hoặc mật khẩu',
        },
      },
    });

    const { getByPlaceholderText, getAllByText } = render(
      <SigninScreen />
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập tên đăng nhập'),
      'admin'
    );

    fireEvent.changeText(
      getByPlaceholderText('Nhập mật khẩu'),
      'wrongpass'
    );

    fireEvent.press(getAllByText('Đăng nhập')[1]);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'Lỗi đăng nhập',
        'Sai tài khoản hoặc mật khẩu'
      );
    });
  });

    test('hiển thị lỗi mặc định', async () => {
    jest.spyOn(Alert, 'alert');

    signin.mockRejectedValue(new Error('Network Error'));

    const {
        getByPlaceholderText,
        getByTestId,
    } = render(<SigninScreen />);

    fireEvent.changeText(
        getByPlaceholderText('Nhập tên đăng nhập'),
        'admin'
    );

    fireEvent.changeText(
        getByPlaceholderText('Nhập mật khẩu'),
        '123456'
    );

    fireEvent.press(getByTestId('signin-button'));

    await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
        'Lỗi đăng nhập',
        'Đăng nhập thất bại. Vui lòng thử lại.'
        );
   });
  });
});