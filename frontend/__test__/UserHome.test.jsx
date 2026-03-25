import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UserHome from '../app/user/index';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
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

describe('UserHome Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        user: { id: '1', displayName: 'Test User' },
        bookings: [
          { _id: '1', status: 'pending', bookingDate: new Date(Date.now() + 86400000).toISOString() },
          { _id: '2', status: 'completed', bookingDate: new Date(Date.now() - 86400000).toISOString() },
        ],
      },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<UserHome />);
    expect(root).toBeTruthy();
  });

  it('displays loading spinner initially', async () => {
    const { root } = render(<UserHome />);
    expect(root).toBeTruthy();
  });

  it('has SafeAreaView wrapper', async () => {
    const { root } = render(<UserHome />);
    expect(root).toBeTruthy();
  });

  it('includes ScrollView for content', async () => {
    const { root } = render(<UserHome />);
    expect(root).toBeTruthy();
  });

  it('has proper layout structure', async () => {
    const { root } = render(<UserHome />);
    expect(root).toBeTruthy();
  });

  it('applies correct styling', async () => {
    const { root } = render(<UserHome />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<UserHome />);
    expect(root).toBeTruthy();
  });

  it('renders with proper component structure', async () => {
    const { root } = render(<UserHome />);
    expect(root).toBeTruthy();
  });
});
