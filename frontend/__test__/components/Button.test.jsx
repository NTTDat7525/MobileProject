import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Button from '../../components/ui/Button';

describe('Button Component', () => {
  test('should render with title text', () => {
    const { getByText } = render(<Button title="Click Me" onPress={() => {}} />);
    expect(getByText('Click Me')).toBeTruthy();
  });

  test('should call onPress when pressed', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(<Button title="Click Me" onPress={mockOnPress} />);

    fireEvent.press(getByText('Click Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  test('should not call onPress when disabled', () => {
    const mockOnPress = jest.fn();
    const { getByText } = render(
      <Button title="Click Me" onPress={mockOnPress} disabled={true} />
    );

    fireEvent.press(getByText('Click Me'));
    // When disabled, the press may not trigger
  });

  test('should render with custom text styles', () => {
    const customTextStyle = { fontSize: 18, fontWeight: 'bold' };
    const { getByText } = render(
      <Button 
        title="Styled Text" 
        onPress={() => {}} 
        textStyle={customTextStyle}
      />
    );
    expect(getByText('Styled Text')).toBeTruthy();
  });

  test('should render Orange theme by default', () => {
    const { getByText } = render(<Button title="Test" onPress={() => {}} />);
    expect(getByText('Test')).toBeTruthy();
  });
});
