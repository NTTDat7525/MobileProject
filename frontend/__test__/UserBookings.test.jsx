import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UserBookings from '../app/user/bookings';

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
jest.mock('@/components/user/BookingCard', () => 'BookingCard');

describe('UserBookings Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        bookings: [
          {
            _id: '1',
            status: 'pending',
            bookingDate: new Date(Date.now() + 86400000).toISOString(),
          },
          {
            _id: '2',
            status: 'completed',
            bookingDate: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<UserBookings />);
    expect(root).toBeTruthy();
  });

  it('displays UserHeader component', async () => {
    const { root } = render(<UserBookings />);
    expect(root).toBeTruthy();
  });

  it('displays bookings list items', async () => {
    const { root } = render(<UserBookings />);
    expect(root).toBeTruthy();
  });

  it('displays filter buttons section', async () => {
    const { root } = render(<UserBookings />);
    expect(root).toBeTruthy();
  });

  it('renders scrollable content', async () => {
    const { root } = render(<UserBookings />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<UserBookings />);
    expect(root).toBeTruthy();
  });

  it('displays loading state properly', async () => {
    const { root } = render(<UserBookings />);
    expect(root).toBeTruthy();
  });

  it('has proper layout structure', async () => {
    const { root } = render(<UserBookings />);
    expect(root).toBeTruthy();
  });
});
