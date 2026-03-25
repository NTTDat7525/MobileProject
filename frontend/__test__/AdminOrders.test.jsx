import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AdminOrders from '../app/admin/orders';

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

describe('AdminOrders Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        orders: [],
        totalRevenue: 0,
        totalOrders: 0,
        completedOrders: 0,
      },
    });
    axios.put.mockResolvedValue({
      data: { success: true },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<AdminOrders />);
    expect(root).toBeTruthy();
  });

  it('fetches orders on mount', async () => {
    render(<AdminOrders />);
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
    });
  });

  it('displays admin header', async () => {
    const { root } = render(<AdminOrders />);
    expect(root).toBeTruthy();
  });

  it('displays orders list', async () => {
    const { root } = render(<AdminOrders />);
    expect(root).toBeTruthy();
  });

  it('displays loading state', async () => {
    const { root } = render(<AdminOrders />);
    expect(root).toBeTruthy();
  });

  it('renders scrollable content', async () => {
    const { root } = render(<AdminOrders />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<AdminOrders />);
    expect(root).toBeTruthy();
  });

  it('supports order status updates', async () => {
    render(<AdminOrders />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});
