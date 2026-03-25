import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Input from '../../components/ui/Input';

jest.mock('@expo/vector-icons', () => ({
  FontAwesome: 'FontAwesomeIcon',
}));

describe('Input Component', () => {
  test('should render with placeholder text', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" />
    );
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  test('should render with label', () => {
    const { getByText } = render(
      <Input label="Email" placeholder="Enter email" />
    );
    expect(getByText('Email')).toBeTruthy();
  });

  test('should update value when text changes', () => {
    const mockOnChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Enter text" 
        onChangeText={mockOnChangeText}
      />
    );

    const input = getByPlaceholderText('Enter text');
    fireEvent.changeText(input, 'Hello World');
    expect(mockOnChangeText).toHaveBeenCalledWith('Hello World');
  });

  test('should handle secureTextEntry for password fields', () => {
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Password" 
        secureTextEntry={true}
      />
    );
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });

  test('should work when editable is false', () => {
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Read only" 
        editable={false}
      />
    );
    const input = getByPlaceholderText('Read only');
    expect(input.props.editable).toBe(false);
  });

  test('should accept custom style', () => {
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="Styled" 
        style={{ marginBottom: 10 }}
      />
    );
    expect(getByPlaceholderText('Styled')).toBeTruthy();
  });

  test('should handle icon name prop', () => {
    const { getByPlaceholderText } = render(
      <Input 
        placeholder="With icon" 
        iconName="envelope"
      />
    );
    expect(getByPlaceholderText('With icon')).toBeTruthy();
  });

  test('should display label and placeholder together', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input 
        label="Username" 
        placeholder="Enter username"
      />
    );
    expect(getByText('Username')).toBeTruthy();
    expect(getByPlaceholderText('Enter username')).toBeTruthy();
  });
});
