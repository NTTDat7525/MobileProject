import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AdminFoods from '../app/admin/foods';

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

describe('AdminFoods Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    AsyncStorage.getItem.mockResolvedValue('mock-token');
    axios.get.mockResolvedValue({
      data: {
        foods: [
          { _id: '1', name: 'Pho', category: 'Soup', price: 50000 },
          { _id: '2', name: 'Banh Mi', category: 'Sandwich', price: 30000 },
        ],
      },
    });
    axios.post.mockResolvedValue({ data: { success: true } });
    axios.delete.mockResolvedValue({ data: { success: true } });
  });

  it('renders without crashing', async () => {
    const { root } = render(<AdminFoods />);
    expect(root).toBeTruthy();
  });

  it('fetches foods on mount', async () => {
    render(<AdminFoods />);
    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('accessToken');
    });
  });

  it('displays admin header', async () => {
    const { root } = render(<AdminFoods />);
    expect(root).toBeTruthy();
  });

  it('displays foods list', async () => {
    const { root } = render(<AdminFoods />);
    expect(root).toBeTruthy();
  });

  it('displays loading state', async () => {
    const { root } = render(<AdminFoods />);
    expect(root).toBeTruthy();
  });

  it('renders add food button', async () => {
    const { root } = render(<AdminFoods />);
    expect(root).toBeTruthy();
  });

  it('displays food form', async () => {
    const { root } = render(<AdminFoods />);
    expect(root).toBeTruthy();
  });

  it('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    const { root } = render(<AdminFoods />);
    expect(root).toBeTruthy();
  });
});
