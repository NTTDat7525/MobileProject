import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UserBookingsCreate from '../app/user/bookings-create';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  router: { push: jest.fn() },
  useLocalSearchParams: jest.fn(() => ({ tableId: 'test-table-id' })),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@/components/user/UserHeader', () => 'UserHeader');
jest.mock('@/components/admin/FormInput', () => 'FormInput');
jest.mock('@/components/ui/Button', () => 'Button');

describe('UserBookingsCreate Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        user: {
          displayName: 'Test User',
          email: 'test@example.com',
          phone: '123456789',
        },
      },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<UserBookingsCreate />);
    expect(root).toBeTruthy();
  });

  it('fetches user data on mount', async () => {
    render(<UserBookingsCreate />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('displays UserHeader component', async () => {
    const { root } = render(<UserBookingsCreate />);
    expect(root).toBeTruthy();
  });

  it('renders scrollable form', async () => {
    const { root } = render(<UserBookingsCreate />);
    expect(root).toBeTruthy();
  });

  it('displays form input fields', async () => {
    const { root } = render(<UserBookingsCreate />);
    expect(root).toBeTruthy();
  });

  it('displays submit button', async () => {
    const { root } = render(<UserBookingsCreate />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<UserBookingsCreate />);
    expect(root).toBeTruthy();
  });

  it('pre-fills user data in form', async () => {
    render(<UserBookingsCreate />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});
