import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';

import ProfileScreen from '../app/(user)/profile';
import { changePassword } from '@/src/services/auth.service';

jest.mock('@/src/services/auth.service', () => ({
  updateProfile: jest.fn(),
  signout: jest.fn(),
  changePassword: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('@/src/store/authStore', () => () => ({
  user: {
    username: 'user01',
    email: 'user01@gmail.com',
    phone: '0912345678',
    bio: '',
    role: 'user',
  },
  logout: jest.fn(),
  updateUser: jest.fn(),
}));

describe('UnitTest ProfileScreen change password', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('hiển thị lỗi validate khi bỏ trống form đổi mật khẩu', async () => {
    const { getByText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Đổi mật khẩu'));
    fireEvent.press(getByText('Cập nhật'));

    await waitFor(() => {
      expect(getByText('Vui lòng nhập mật khẩu hiện tại')).toBeTruthy();
      expect(getByText('Vui lòng nhập mật khẩu mới')).toBeTruthy();
      expect(getByText('Vui lòng xác nhận mật khẩu mới')).toBeTruthy();
    });
  });

  test('không gọi API khi xác nhận mật khẩu mới không khớp', async () => {
    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Đổi mật khẩu'));
    fireEvent.changeText(getByPlaceholderText('Nhập mật khẩu hiện tại'), 'oldpass');
    fireEvent.changeText(getByPlaceholderText('Tối thiểu 6 ký tự'), 'newpass1');
    fireEvent.changeText(getByPlaceholderText('Nhập lại mật khẩu mới'), 'newpass2');
    fireEvent.press(getByText('Cập nhật'));

    await waitFor(() => {
      expect(getByText('Xác nhận mật khẩu mới không khớp')).toBeTruthy();
      expect(changePassword).not.toHaveBeenCalled();
    });
  });

  test('đổi mật khẩu thành công', async () => {
    jest.spyOn(Alert, 'alert');
    changePassword.mockResolvedValue({ data: { message: 'Đổi mật khẩu thành công' } });

    const { getByText, getByPlaceholderText } = render(<ProfileScreen />);

    fireEvent.press(getByText('Đổi mật khẩu'));
    fireEvent.changeText(getByPlaceholderText('Nhập mật khẩu hiện tại'), 'oldpass');
    fireEvent.changeText(getByPlaceholderText('Tối thiểu 6 ký tự'), 'newpass1');
    fireEvent.changeText(getByPlaceholderText('Nhập lại mật khẩu mới'), 'newpass1');
    fireEvent.press(getByText('Cập nhật'));

    await waitFor(() => {
      expect(changePassword).toHaveBeenCalledWith({
        currentPassword: 'oldpass',
        newPassword: 'newpass1',
        confirmPassword: 'newpass1',
      });
      expect(Alert.alert).toHaveBeenCalledWith('Thành công', 'Đổi mật khẩu thành công');
    });
  });
});
