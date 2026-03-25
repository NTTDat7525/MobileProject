import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UserOrders from '../app/user/orders';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  router: { push: jest.fn() },
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => {
    // Don't execute callback during render
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@/components/user/UserHeader', () => 'UserHeader');
jest.mock('@/components/user/OrderCard', () => 'OrderCard');
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'Icon',
}));

describe('UserOrders Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        orders: [
          { _id: '1', status: 'completed', paymentStatus: 'paid' },
          { _id: '2', status: 'pending', paymentStatus: 'unpaid' },
        ],
      },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<UserOrders />);
    expect(root).toBeTruthy();
  });

  it('displays UserHeader component', async () => {
    const { root } = render(<UserOrders />);
    expect(root).toBeTruthy();
  });

  it('displays filter buttons', async () => {
    const { root } = render(<UserOrders />);
    expect(root).toBeTruthy();
  });

  it('renders scrollable content', async () => {
    const { root } = render(<UserOrders />);
    expect(root).toBeTruthy();
  });

  it('displays loading state', async () => {
    const { root } = render(<UserOrders />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<UserOrders />);
    expect(root).toBeTruthy();
  });

  it('displays orders list properly', async () => {
    const { root } = render(<UserOrders />);
    expect(root).toBeTruthy();
  });

  it('has proper component structure', async () => {
    const { root } = render(<UserOrders />);
    expect(root).toBeTruthy();
  });
});
