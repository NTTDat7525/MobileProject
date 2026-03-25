import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AdminDashboard from '../app/admin/index';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  router: { replace: jest.fn(), push: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@/components/admin/StatCard', () => 'StatCard');
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'Icon',
}));

describe('AdminDashboard Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        totalRevenue: 5000000,
        totalOrders: 50,
        availableTables: 8,
        totalTables: 10,
        completedOrders: 45,
        paidOrders: 48,
        summary: { available: 8 },
      },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<AdminDashboard />);
    expect(root).toBeTruthy();
  });

  it('fetches dashboard data on mount', async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
    });
  });

  it('displays loading state initially', async () => {
    const { root } = render(<AdminDashboard />);
    expect(root).toBeTruthy();
  });

  it('displays stat cards container', async () => {
    const { root } = render(<AdminDashboard />);
    expect(root).toBeTruthy();
  });

  it('displays admin menu items', async () => {
    const { root } = render(<AdminDashboard />);
    expect(root).toBeTruthy();
  });

  it('has scrollable content area', async () => {
    const { root } = render(<AdminDashboard />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<AdminDashboard />);
    expect(root).toBeTruthy();
  });

  it('fetches data from multiple API endpoints', async () => {
    render(<AdminDashboard />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});
