import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Home from '../app/screens/Home';
import { router } from 'expo-router';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Home Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search box', () => {
    const { getByPlaceholderText } = render(<Home />);
    expect(getByPlaceholderText('Search')).toBeTruthy();
  });

  it('renders CATEGORIES title', () => {
    const { getByText } = render(<Home />);
    expect(getByText('CATEGORIES')).toBeTruthy();
  });

  it('renders category buttons', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Classic')).toBeTruthy();
    expect(getByText('Modern')).toBeTruthy();
    expect(getByText('Party')).toBeTruthy();
  });

  it('renders restaurant card', () => {
    const { getByText } = render(<Home />);
    expect(getByText('Fine dinning')).toBeTruthy();
  });

  it('renders card description', () => {
    const { getByText } = render(<Home />);
    expect(
      getByText(/Fine dining tables at The Grand Cellar/)
    ).toBeTruthy();
  });

  it('navigates to Detail screen when card is pressed', () => {
    const { getByText } = render(<Home />);
    fireEvent.press(getByText('Fine dinning'));
    expect(router.push).toHaveBeenCalledWith('/screens/Detail');
  });

  it('can switch category', () => {
    const { getByText } = render(<Home />);
    fireEvent.press(getByText('Modern'));
    // Category button should still be rendered
    expect(getByText('Modern')).toBeTruthy();
  });
});
