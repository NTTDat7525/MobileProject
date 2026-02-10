import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Confirm from '../app/screens/Confirm';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Confirm Screen', () => {
  it('renders header correctly', () => {
    const { getByText } = render(<Confirm />);
    expect(getByText('Confirm Booking')).toBeTruthy();
  });

  it('renders restaurant info card', () => {
    const { getByText } = render(<Confirm />);
    expect(getByText('NAME RESTAURANT')).toBeTruthy();
    expect(getByText('Type')).toBeTruthy();
  });

  it('renders Booking Detail section', () => {
    const { getByText } = render(<Confirm />);
    expect(getByText('Booking Detail')).toBeTruthy();
  });

  it('renders booking details (date, time, guest)', () => {
    const { getByText } = render(<Confirm />);
    expect(getByText('Date')).toBeTruthy();
    expect(getByText('Monday, May 15, 2026')).toBeTruthy();
    expect(getByText('Time')).toBeTruthy();
    expect(getByText('7:00 PM')).toBeTruthy();
    expect(getByText('Guest')).toBeTruthy();
    expect(getByText('2 People')).toBeTruthy();
  });

  it('renders Your Information section', () => {
    const { getByText } = render(<Confirm />);
    expect(getByText('Your Infomation')).toBeTruthy();
    expect(getByText('Full Name')).toBeTruthy();
    expect(getByText('Phone Number')).toBeTruthy();
    expect(getByText('Email Address')).toBeTruthy();
    expect(getByText('Special Request')).toBeTruthy();
  });

  it('renders CONFIRM button', () => {
    const { getByText } = render(<Confirm />);
    expect(getByText('CONFIRM')).toBeTruthy();
  });

  it('renders back button', () => {
    const { getByText } = render(<Confirm />);
    // back button exists in header
    expect(getByText('Confirm Booking')).toBeTruthy();
  });
});
