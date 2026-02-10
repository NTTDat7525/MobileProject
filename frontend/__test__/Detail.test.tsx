import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Detail from '../app/screens/Detail';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
    back: jest.fn(),
  },
}));

describe('Detail Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders restaurant name', () => {
    const { getByText } = render(<Detail />);
    expect(getByText('Name restaurant')).toBeTruthy();
  });

  it('renders Describe text', () => {
    const { getByText } = render(<Detail />);
    expect(getByText('Describe')).toBeTruthy();
  });

  it('renders Service section', () => {
    const { getByText, getAllByText } = render(<Detail />);
    expect(getByText('Service')).toBeTruthy();
    expect(getAllByText('NAME').length).toBe(4);
  });

  it('renders Contact section', () => {
    const { getByText } = render(<Detail />);
    expect(getByText('Contact')).toBeTruthy();
    expect(getByText(/\+84 394782XXX/)).toBeTruthy();
    expect(getByText('CALL')).toBeTruthy();
  });

  it('renders Book a Table button', () => {
    const { getByText } = render(<Detail />);
    expect(getByText('Book a Table')).toBeTruthy();
  });

  it('navigates to Booking screen when Book a Table is pressed', () => {
    const { getByText } = render(<Detail />);
    fireEvent.press(getByText('Book a Table'));
    expect(router.push).toHaveBeenCalledWith('/screens/Booking');
  });
});
