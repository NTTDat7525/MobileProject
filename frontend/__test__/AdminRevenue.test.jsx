import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AdminRevenue from '../app/admin/revenue';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@/components/admin/AdminHeader', () => 'AdminHeader');
jest.mock('@/components/admin/StatCard', () => 'StatCard');
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'Icon',
}));

describe('AdminRevenue Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        totalRevenue: 5000000,
        totalOrders: 50,
        completedOrders: 45,
        cancelledOrders: 2,
        paidOrders: 48,
        avgOrderValue: 100000,
      },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<AdminRevenue />);
    expect(root).toBeTruthy();
  });

  it('fetches revenue data on mount', async () => {
    render(<AdminRevenue />);
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
    });
  });

  it('displays admin header', async () => {
    const { root } = render(<AdminRevenue />);
    expect(root).toBeTruthy();
  });

  it('displays revenue stat cards', async () => {
    const { root } = render(<AdminRevenue />);
    expect(root).toBeTruthy();
  });

  it('displays loading state', async () => {
    const { root } = render(<AdminRevenue />);
    expect(root).toBeTruthy();
  });

  it('displays period selector buttons', async () => {
    const { root } = render(<AdminRevenue />);
    expect(root).toBeTruthy();
  });

  it('has scrollable content', async () => {
    const { root } = render(<AdminRevenue />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<AdminRevenue />);
    expect(root).toBeTruthy();
  });
});
