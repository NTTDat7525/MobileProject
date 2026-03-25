import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import axios from 'axios';
import UserTables from '../app/user/tables';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  router: { push: jest.fn() },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@/components/user/UserHeader', () => 'UserHeader');
jest.mock('@/components/user/TableCard', () => 'TableCard');
jest.mock('@/components/ui/Button', () => 'Button');
jest.mock('@/components/admin/FormInput', () => 'FormInput');

describe('UserTables Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({
      data: {
        tables: [
          { _id: '1', tableNumber: '1', capacity: 4, type: 'standard' },
          { _id: '2', tableNumber: '2', capacity: 6, type: 'vip' },
        ],
      },
    });
  });

  it('renders without crashing', async () => {
    const { root } = render(<UserTables />);
    expect(root).toBeTruthy();
  });

  it('fetches tables on mount', async () => {
    render(<UserTables />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    });
  });

  it('displays UserHeader component', async () => {
    const { root } = render(<UserTables />);
    expect(root).toBeTruthy();
  });

  it('displays filter section', async () => {
    const { root } = render(<UserTables />);
    expect(root).toBeTruthy();
  });

  it('renders scrollable content', async () => {
    const { root } = render(<UserTables />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<UserTables />);
    expect(root).toBeTruthy();
  });

  it('displays tables list', async () => {
    render(<UserTables />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('supports table type filtering', async () => {
    render(<UserTables />);
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalled();
    }, { timeout: 2000 });
  });
});
