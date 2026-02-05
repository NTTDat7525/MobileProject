import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Signin from '../app/screens/Signin'; // đường dẫn tới file Signin.tsx
import { router } from 'expo-router';

// Mock router để kiểm tra navigation
jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Signin Screen', () => {
  it('renders title and subtitle correctly', () => {
    const { getByText } = render(<Signin />);
    expect(getByText('Welcome Back')).toBeTruthy();
    expect(getByText('Sign in to continue booking')).toBeTruthy();
  });

  it('renders input fields for username and password', () => {
    const { getByPlaceholderText } = render(<Signin />);
    expect(getByPlaceholderText('Enter your username')).toBeTruthy();
    expect(getByPlaceholderText('Enter your password')).toBeTruthy();
  });

  it('renders Continue button', () => {
    const { getByText } = render(<Signin />);
    expect(getByText('Continue')).toBeTruthy();
  });

  it('renders Google sign in button', () => {
    const { getByText } = render(<Signin />);
    expect(getByText('Sign in with Google')).toBeTruthy();
  });

  it('navigates to Signup screen when Sign Up link is pressed', () => {
    const { getByText } = render(<Signin />);
    fireEvent.press(getByText('Sign Up.'));
    expect(router.push).toHaveBeenCalledWith('/screens/Signup');
  });
});