import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Signup from '../app/screens/Signup'; // chỉnh lại đường dẫn nếu khác
import { router } from 'expo-router';

// Mock router để kiểm tra navigation
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Signup Screen', () => {
  it('renders title and subtitle correctly', () => {
    const { getByText } = render(<Signup />);
    expect(getByText('Create Account')).toBeTruthy();
    expect(
      getByText('Sign up to start booking amazing restaurants')
    ).toBeTruthy();
  });

  it('renders input fields for username, password, and confirm password', () => {
    const { getByPlaceholderText } = render(<Signup />);
    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
    expect(getByPlaceholderText('Confirm your password')).toBeTruthy();
  });

  it('renders Create Account button', () => {
    const { getByText } = render(<Signup />);
    expect(getByText('Created Account')).toBeTruthy();
  });

  it('renders Google sign in button', () => {
    const { getByText } = render(<Signup />);
    expect(getByText('Sign in with Google')).toBeTruthy();
  });

  it('navigates to Signin screen when Sign In link is pressed', () => {
    const { getByText } = render(<Signup />);
    fireEvent.press(getByText('Sign In.'));
    expect(router.push).toHaveBeenCalledWith('/screens/Signin');
  });
});