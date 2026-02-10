import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Upcoming from '../app/screens/Upcoming';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Upcoming Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header correctly', () => {
    const { getByText } = render(<Upcoming />);
    expect(getByText('My Bookings')).toBeTruthy();
  });

  it('renders tabs', () => {
    const { getByText } = render(<Upcoming />);
    expect(getByText('Upcoming')).toBeTruthy();
    expect(getByText('Past')).toBeTruthy();
  });

  it('renders upcoming bookings with Edit and Cancel buttons', () => {
    const { getAllByText } = render(<Upcoming />);
    expect(getAllByText('NAME RESTAURANT').length).toBeGreaterThan(0);
    expect(getAllByText('Edit').length).toBeGreaterThan(0);
    expect(getAllByText(/Cancel/i).length).toBeGreaterThan(0);
  });

  it('renders booking details', () => {
    const { getAllByText } = render(<Upcoming />);
    expect(getAllByText(/Mon, May 16, 2026/).length).toBeGreaterThan(0);
    expect(getAllByText(/7 PM/).length).toBeGreaterThan(0);
    expect(getAllByText(/2 Guests/).length).toBeGreaterThan(0);
  });

  it('renders booking IDs', () => {
    const { getAllByText } = render(<Upcoming />);
    expect(getAllByText(/Booking ID: #TB-03XX-78XX/).length).toBeGreaterThan(0);
  });

  it('navigates to Booking screen when Edit is pressed', async () => {
    const { getAllByText } = render(<Upcoming />);
    await act(async () => {
      fireEvent.press(getAllByText('Edit')[0]);
    });
    expect(router.push).toHaveBeenCalledWith('/screens/Booking');
  });

  it('can switch to past tab', async () => {
    const { getByText } = render(<Upcoming />);
    await act(async () => {
      fireEvent.press(getByText('Past'));
    });
    expect(getByText('Past')).toBeTruthy();
  });
});
