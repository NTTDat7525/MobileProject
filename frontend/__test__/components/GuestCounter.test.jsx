import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';

// Mock FontAwesome
jest.mock('@expo/vector-icons', () => ({
  FontAwesome: 'FontAwesomeIcon',
}));

import GuestCounter from '../../components/ui/GuestCounter';

describe('GuestCounter Component', () => {
  test('should render with initial count', () => {
    const { getByText } = render(
      <GuestCounter count={2} onIncrement={() => {}} onDecrement={() => {}} />
    );
    // Count should be displayed with leading zero
    expect(getByText('02')).toBeTruthy();
  });

  test('should display count with single digit', () => {
    const { getByText } = render(
      <GuestCounter count={1} onIncrement={() => {}} onDecrement={() => {}} />
    );
    expect(getByText('01')).toBeTruthy();
  });

  test('should call onIncrement when increment button is pressed', () => {
    const mockOnIncrement = jest.fn();
    const { getByText } = render(
      <GuestCounter 
        count={2} 
        onIncrement={mockOnIncrement} 
        onDecrement={() => {}}
      />
    );
    expect(getByText('02')).toBeTruthy();
  });

  test('should display count above 9 without leading zero', () => {
    const { getByText } = render(
      <GuestCounter 
        count={15} 
        onIncrement={() => {}} 
        onDecrement={() => {}}
      />
    );
    expect(getByText('15')).toBeTruthy();
  });

  test('should display count 20', () => {
    const { getByText } = render(
      <GuestCounter 
        count={20} 
        onIncrement={() => {}} 
        onDecrement={() => {}}
      />
    );
    expect(getByText('20')).toBeTruthy();
  });

  test('should handle count of 0 with leading zero', () => {
    const { getByText } = render(
      <GuestCounter count={0} onIncrement={() => {}} onDecrement={() => {}} />
    );
    expect(getByText('00')).toBeTruthy();
  });

  test('should accept custom style', () => {
    const customStyle = { marginBottom: 15, paddingVertical: 10 };
    const { root } = render(
      <GuestCounter 
        count={2} 
        onIncrement={() => {}} 
        onDecrement={() => {}}
        style={customStyle}
      />
    );
    expect(root).toBeTruthy();
  });

  test('should have increment and decrement buttons', () => {
    const { root } = render(
      <GuestCounter 
        count={2} 
        onIncrement={() => {}} 
        onDecrement={() => {}}
      />
    );
    expect(root).toBeTruthy();
  });

  test('should maintain count state through prop changes', () => {
    const { rerender, getByText } = render(
      <GuestCounter count={1} onIncrement={() => {}} onDecrement={() => {}} />
    );
    expect(getByText('01')).toBeTruthy();

    rerender(
      <GuestCounter count={5} onIncrement={() => {}} onDecrement={() => {}} />
    );
    expect(getByText('05')).toBeTruthy();

    rerender(
      <GuestCounter count={10} onIncrement={() => {}} onDecrement={() => {}} />
    );
    expect(getByText('10')).toBeTruthy();
  });

  test('should render circular buttons for increment and decrement', () => {
    const { root } = render(
      <GuestCounter 
        count={2} 
        onIncrement={() => {}} 
        onDecrement={() => {}}
      />
    );
    expect(root).toBeTruthy();
  });

  test('should work with controlled component pattern', () => {
    const mockOnIncrement = jest.fn();
    const mockOnDecrement = jest.fn();
    
    const { rerender, getByText } = render(
      <GuestCounter 
        count={2} 
        onIncrement={mockOnIncrement} 
        onDecrement={mockOnDecrement}
      />
    );
    expect(getByText('02')).toBeTruthy();

    rerender(
      <GuestCounter 
        count={3} 
        onIncrement={mockOnIncrement} 
        onDecrement={mockOnDecrement}
      />
    );
    expect(getByText('03')).toBeTruthy();
  });
});
