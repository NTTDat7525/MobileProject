import React from 'react';
import { render } from '@testing-library/react-native';
import Search from '../app/screens/Search';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

describe('Search Screen', () => {
  it('renders header title', () => {
    const { getByText } = render(<Search />);
    expect(getByText('Type of Tables')).toBeTruthy();
  });

  it('renders search input', () => {
    const { getByPlaceholderText } = render(<Search />);
    expect(getByPlaceholderText('Search')).toBeTruthy();
  });

  it('renders table type cards', () => {
    const { getByText } = render(<Search />);
    expect(getByText('Classic')).toBeTruthy();
    expect(getByText('Modern')).toBeTruthy();
    expect(getByText('Private')).toBeTruthy();
  });

  it('renders correct number of cards', () => {
    const { getAllByText } = render(<Search />);
    // 3 cards total
    const cards = ['Classic', 'Modern', 'Private'];
    cards.forEach((card) => {
      expect(getAllByText(card).length).toBe(1);
    });
  });
});
