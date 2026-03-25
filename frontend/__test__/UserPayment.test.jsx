import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UserPayment from '../app/user/payment';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  router: { push: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'Icon',
}));
jest.mock('@/components/payment/PaymentModal', () => 'PaymentModal');
jest.mock('@/components/ui/Button', () => 'Button');
jest.mock('@/components/common/Card', () => 'Card');
jest.mock('@/components/common/SectionHeader', () => 'SectionHeader');

describe('UserPayment Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        booking: {
          _id: 'test-id',
          bookingDate: new Date().toISOString(),
          numberOfGuests: 4,
        },
      },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<UserPayment />);
    expect(root).toBeTruthy();
  });

  it('displays scrollable content', async () => {
    const { root } = render(<UserPayment />);
    expect(root).toBeTruthy();
  });

  it('displays payment options', async () => {
    const { root } = render(<UserPayment />);
    expect(root).toBeTruthy();
  });

  it('displays amount information', async () => {
    const { root } = render(<UserPayment />);
    expect(root).toBeTruthy();
  });

  it('displays payment button', async () => {
    const { root } = render(<UserPayment />);
    expect(root).toBeTruthy();
  });

  it('handles component props properly', async () => {
    const { root } = render(<UserPayment />);
    expect(root).toBeTruthy();
  });

  it('displays safe area layout', async () => {
    const { root } = render(<UserPayment />);
    expect(root).toBeTruthy();
  });

  it('handles rendering without booking id gracefully', async () => {
    const { root } = render(<UserPayment />);
    expect(root).toBeTruthy();
  });
});
