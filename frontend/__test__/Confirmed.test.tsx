import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Confirmed from '../app/screens/Confirmed';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    replace: jest.fn(),
  },
}));

describe('Confirmed Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders confirmation message', () => {
    const { getByText } = render(<Confirmed />);
    expect(getByText('Your booking is confirmed!')).toBeTruthy();
  });

  it('renders confirmation details text', () => {
    const { getByText } = render(<Confirmed />);
    expect(
      getByText(
        "Your table has been successfully reserved. We'll send you a confirmation email shortly."
      )
    ).toBeTruthy();
  });

  it('renders Booking ID', () => {
    const { getByText } = render(<Confirmed />);
    expect(getByText('Booking ID')).toBeTruthy();
    expect(getByText('#TB-03XX-78XX')).toBeTruthy();
  });

  it('renders booking details', () => {
    const { getByText } = render(<Confirmed />);
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Monday, May 15, 2026')).toBeTruthy();
    expect(getByText('Time')).toBeTruthy();
    expect(getByText('7:00 PM')).toBeTruthy();
    expect(getByText('Guest')).toBeTruthy();
    expect(getByText('2 People')).toBeTruthy();
    expect(getByText('Restaurant')).toBeTruthy();
  });

  it('renders View My Booking button', () => {
    const { getByText } = render(<Confirmed />);
    expect(getByText('View My Booking')).toBeTruthy();
  });

  it('renders Back to Home button', () => {
    const { getByText } = render(<Confirmed />);
    expect(getByText('Back to Home')).toBeTruthy();
  });

  it('navigates to bookings when View My Booking is pressed', () => {
    const { getByText } = render(<Confirmed />);
    fireEvent.press(getByText('View My Booking'));
    expect(router.push).toHaveBeenCalledWith('/(tabs)/booking');
  });

  it('navigates to home when Back to Home is pressed', () => {
    const { getByText } = render(<Confirmed />);
    fireEvent.press(getByText('Back to Home'));
    expect(router.replace).toHaveBeenCalledWith('/(tabs)/home');
  });
});
