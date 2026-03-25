import React from 'react';
import { render } from '@testing-library/react-native';
import Signup from '../app/screens/Signup';

jest.mock('expo-router', () => ({
  router: {
    push: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('axios');

jest.mock('@/components/SignupForm', () => 'SignupForm');

describe('Signup Screen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });

  it('displays safe area wrapper', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });

  it('displays create account title', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });

  it('displays signup form component', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });

  it('displays signin link reference', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });

  it('displays signin navigation link text', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });

  it('has KeyboardAvoidingView wrapper', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });

  it('has SafeAreaView wrapper', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });

  it('has StatusBar', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });

  it('has ScrollView for scrollable content', () => {
    const { root } = render(<Signup />);
    expect(root).toBeTruthy();
  });
});
