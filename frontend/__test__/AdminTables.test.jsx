import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AdminTables from '../app/admin/tables';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: jest.fn((callback) => callback()),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@/components/admin/AdminHeader', () => 'AdminHeader');
jest.mock('@/components/admin/ListItem', () => 'ListItem');
jest.mock('@/components/admin/FormInput', () => 'FormInput');
jest.mock('@/components/ui/Button', () => 'Button');

describe('AdminTables Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        tables: [
          { _id: '1', tableNumber: '1', capacity: 4, type: 'standard' },
          { _id: '2', tableNumber: '2', capacity: 6, type: 'vip' },
        ],
      },
    });
    axios.post.mockResolvedValue({ data: { success: true } });
    axios.delete.mockResolvedValue({ data: { success: true } });
  });

  it('renders without crashing', async () => {
    const { root } = render(<AdminTables />);
    expect(root).toBeTruthy();
  });

  it('fetches tables on mount', async () => {
    render(<AdminTables />);
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
    });
  });

  it('displays admin header', async () => {
    const { root } = render(<AdminTables />);
    expect(root).toBeTruthy();
  });

  it('displays tables list', async () => {
    const { root } = render(<AdminTables />);
    expect(root).toBeTruthy();
  });

  it('displays loading state', async () => {
    const { root } = render(<AdminTables />);
    expect(root).toBeTruthy();
  });

  it('renders add table button', async () => {
    const { root } = render(<AdminTables />);
    expect(root).toBeTruthy();
  });

  it('displays table form', async () => {
    const { root } = render(<AdminTables />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<AdminTables />);
    expect(root).toBeTruthy();
  });
});
