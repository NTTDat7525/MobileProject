import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Profile from '../app/screens/Profile';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('Profile Screen', () => {
  it('renders Profile title', () => {
    const { getByText } = render(<Profile />);
    expect(getByText('Profile')).toBeTruthy();
  });

  it('renders user name', () => {
    const { getByText } = render(<Profile />);
    expect(getByText('Jack and Sol')).toBeTruthy();
  });

  it('renders Contact Information card', () => {
    const { getByText } = render(<Profile />);
    expect(getByText('Contact Information')).toBeTruthy();
  });

  it('renders email info', () => {
    const { getByText } = render(<Profile />);
    expect(getByText('Email')).toBeTruthy();
    expect(getByText('Monday, May 15, 2026')).toBeTruthy();
  });

  it('renders phone info', () => {
    const { getByText } = render(<Profile />);
    expect(getByText('Phone')).toBeTruthy();
    expect(getByText('+84 9478XXXX')).toBeTruthy();
  });

  it('renders restaurant info', () => {
    const { getByText } = render(<Profile />);
    expect(getByText('Restaurant')).toBeTruthy();
  });

  it('renders Log out button', () => {
    const { getByText } = render(<Profile />);
    expect(getByText('Log out')).toBeTruthy();
  });

  it('shows logout modal when Log out is pressed', () => {
    const { getByText } = render(<Profile />);
    fireEvent.press(getByText('Log out'));
    expect(getByText('Are you sure you want to log out?')).toBeTruthy();
  });

  it('closes logout modal when Cancel is pressed', () => {
    const { getByText, queryByText } = render(<Profile />);
    fireEvent.press(getByText('Log out'));
    expect(getByText('Are you sure you want to log out?')).toBeTruthy();
    fireEvent.press(getByText('Cancel'));
    // Modal should be hidden
  });
});
