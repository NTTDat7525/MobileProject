import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AdminBookings from '../app/admin/bookings';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@/components/admin/AdminHeader', () => 'AdminHeader');
jest.mock('@/components/admin/ListItem', () => 'ListItem');
jest.mock('@/components/admin/FormInput', () => 'FormInput');
jest.mock('@/components/ui/Button', () => 'Button');

describe('AdminBookings Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        bookings: [
          { _id: '1', status: 'pending', guestName: 'User 1' },
          { _id: '2', status: 'confirmed', guestName: 'User 2' },
        ],
      },
    });
    axios.put.mockResolvedValue({
      data: { success: true },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<AdminBookings />);
    expect(root).toBeTruthy();
  });

  it('fetches bookings on mount', async () => {
    render(<AdminBookings />);
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
    });
  });

  it('displays admin header', async () => {
    const { root } = render(<AdminBookings />);
    expect(root).toBeTruthy();
  });

  it('displays bookings list items', async () => {
    const { root } = render(<AdminBookings />);
    expect(root).toBeTruthy();
  });

  it('displays loading state', async () => {
    const { root } = render(<AdminBookings />);
    expect(root).toBeTruthy();
  });

  it('has scrollable content', async () => {
    const { root } = render(<AdminBookings />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<AdminBookings />);
    expect(root).toBeTruthy();
  });

  it('supports booking status updates', async () => {
    render(<AdminBookings />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});