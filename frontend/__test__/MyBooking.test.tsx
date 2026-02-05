import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MyBookings from '../app/screens/MyBookings'; // chỉnh lại đường dẫn nếu khác
import { router } from 'expo-router';

// Mock router để kiểm tra navigation
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('MyBookings Screen', () => {
  it('renders header correctly', () => {
    const { getByText } = render(<MyBookings />);
    expect(getByText('My Bookings')).toBeTruthy();
  });

  it('renders upcoming bookings by default', () => {
    const { getAllByText } = render(<MyBookings />);
    expect(getAllByText('NAME RESTAURANT').length).toBeGreaterThan(0);
    expect(getAllByText('Edit').length).toBeGreaterThan(0);
    expect(getAllByText(/Cancel/i).length).toBeGreaterThan(0);
  });

  it('switches to past bookings when Past tab is pressed', async () => {
    const { getByText, findAllByText } = render(<MyBookings />);
    
    await act(async () => {
      fireEvent.press(getByText('Past'));
    });

    expect((await findAllByText('Book Again')).length).toBeGreaterThan(0);
    expect((await findAllByText(/Delete/i)).length).toBeGreaterThan(0);
  });

  it('navigates to Booking screen when Edit is pressed', async () => {
    const { getAllByText } = render(<MyBookings />);
    
    await act(async () => {
        fireEvent.press(getAllByText('Edit')[0]); // chọn nút Edit đầu tiên
    });

    expect(router.push).toHaveBeenCalledWith('/screens/Booking');
    });
});
