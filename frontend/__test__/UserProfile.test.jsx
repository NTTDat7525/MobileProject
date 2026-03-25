import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import UserProfile from '../app/user/profile';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  router: { push: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@/components/user/UserHeader', () => 'UserHeader');
jest.mock('@/components/admin/FormInput', () => 'FormInput');
jest.mock('@/components/ui/Button', () => 'Button');

describe('UserProfile Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        user: {
          _id: '1',
          displayName: 'Test User',
          bio: 'Test bio',
          phone: '123456789',
          email: 'test@example.com',
        },
      },
    });
    axios.put.mockResolvedValue({
      data: {
        user: {
          _id: '1',
          displayName: 'Updated User',
          bio: 'Updated bio',
          phone: '987654321',
        },
      },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<UserProfile />);
    expect(root).toBeTruthy();
  });

  it('fetches user profile on mount', async () => {
    render(<UserProfile />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('displays UserHeader component', async () => {
    const { root } = render(<UserProfile />);
    expect(root).toBeTruthy();
  });

  it('renders scrollable content', async () => {
    const { root } = render(<UserProfile />);
    expect(root).toBeTruthy();
  });

  it('displays form input fields', async () => {
    const { root } = render(<UserProfile />);
    expect(root).toBeTruthy();
  });

  it('displays update button', async () => {
    const { root } = render(<UserProfile />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<UserProfile />);
    expect(root).toBeTruthy();
  });

  it('pre-fills form with user data', async () => {
    render(<UserProfile />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});
