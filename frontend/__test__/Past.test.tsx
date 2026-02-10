import React, { act } from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Past from '../app/screens/Past';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Past Screen', () => {
  it('renders header correctly', () => {
    const { getByText } = render(<Past />);
    expect(getByText('My Bookings')).toBeTruthy();
  });

  it('renders tabs', () => {
    const { getByText } = render(<Past />);
    expect(getByText('Upcoming')).toBeTruthy();
    expect(getByText('Past')).toBeTruthy();
  });

  it('renders past bookings with Book Again and Delete buttons', () => {
    const { getAllByText } = render(<Past />);
    expect(getAllByText('NAME RESTAURANT').length).toBeGreaterThan(0);
    expect(getAllByText('Book Again').length).toBeGreaterThan(0);
    expect(getAllByText(/Delete/i).length).toBeGreaterThan(0);
  });

  it('renders booking details', () => {
    const { getAllByText } = render(<Past />);
    expect(getAllByText(/Mon, May 16, 2026/).length).toBeGreaterThan(0);
    expect(getAllByText(/7 PM/).length).toBeGreaterThan(0);
    expect(getAllByText(/2 Guests/).length).toBeGreaterThan(0);
  });

  it('renders booking IDs', () => {
    const { getAllByText } = render(<Past />);
    expect(getAllByText(/Booking ID: #TB-03XX-78XX/).length).toBeGreaterThan(0);
  });

  it('can switch to upcoming tab', async () => {
    const { getByText } = render(<Past />);
    await act(async () => {
      fireEvent.press(getByText('Upcoming'));
    });
    expect(getByText('Upcoming')).toBeTruthy();
  });
});
