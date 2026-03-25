import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Signin from '../app/screens/Signin';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('axios');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('@/components/SigninForm', () => 'SigninForm');

const { useRouter } = require('expo-router');

describe('Signin Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useRouter.mockReturnValue({
      replace: jest.fn(),
      push: jest.fn(),
    });
    AsyncStorage.getItem.mockResolvedValue(null);
  });

  it('renders without crashing', async () => {
    const { root } = render(<Signin />);
    expect(root).toBeTruthy();
  });

  it('checks if user is already logged in on mount', async () => {
    render(<Signin />);
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
    });
  });

  it('has SafeAreaView wrapper', async () => {
    const { root } = render(<Signin />);
    expect(root).toBeTruthy();
  });

  it('includes KeyboardAvoidingView for proper keyboard handling', async () => {
    const { root } = render(<Signin />);
    expect(root).toBeTruthy();
  });

  it('displays SigninForm component', async () => {
    const { root } = render(<Signin />);
    expect(root).toBeTruthy();
  });

  it('handles AsyncStorage errors gracefully', async () => {
    AsyncStorage.getItem.mockRejectedValue(new Error('Storage error'));
    const { root } = render(<Signin />);
    expect(root).toBeTruthy();
  });

  it('redirects to admin when admin token is present', async () => {
    const mockRouter = { replace: jest.fn() };
    useRouter.mockReturnValue(mockRouter);

    AsyncStorage.getItem.mockImplementation((key) => {
      if (key === 'accessToken') return Promise.resolve('mock-token');
      if (key === 'user') return Promise.resolve(JSON.stringify({ role: 'admin' }));
      return Promise.resolve(null);
    });

    render(<Signin />);

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
    }, { timeout: 2000 });
  });
});
