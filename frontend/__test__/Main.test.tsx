import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Main from '../app/screens/Main';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Main Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders restaurant name', () => {
    const { getByText } = render(<Main />);
    expect(getByText('The Grand Cellar')).toBeTruthy();
  });

  it('renders introduction text', () => {
    const { getByText } = render(<Main />);
    expect(getByText('An elegant European-style restaurant')).toBeTruthy();
    expect(getByText('with vintage décor, fine wines,')).toBeTruthy();
    expect(getByText('and authentic French–Italian cuisine.')).toBeTruthy();
  });

  it('renders Get Started button', () => {
    const { getByText } = render(<Main />);
    expect(getByText('Get Started')).toBeTruthy();
  });

  it('navigates to Signin when Get Started is pressed', () => {
    const { getByText } = render(<Main />);
    fireEvent.press(getByText('Get Started'));
    expect(router.push).toHaveBeenCalledWith('/screens/Signin');
  });
});
