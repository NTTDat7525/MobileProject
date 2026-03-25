import React from 'react';
import { render } from '@testing-library/react-native';
import EmptyState from '../../components/common/EmptyState';

jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcon',
}));

describe('EmptyState Component', () => {
  test('should render with icon, title, and message', () => {
    const { getByText } = render(
      <EmptyState 
        icon="inbox"
        title="No Bookings" 
        message="You don't have any bookings yet"
        color="#ff9e6b"
      />
    );
    expect(getByText('No Bookings')).toBeTruthy();
    expect(getByText("You don't have any bookings yet")).toBeTruthy();
  });

  test('should render title only', () => {
    const { getByText } = render(
      <EmptyState 
        icon="alert-circle"
        title="Error Occurred" 
      />
    );
    expect(getByText('Error Occurred')).toBeTruthy();
  });

  test('should render with custom color', () => {
    const { getByText } = render(
      <EmptyState 
        icon="search"
        title="Not Found" 
        message="No results match your search"
        color="#ff0000"
      />
    );
    expect(getByText('Not Found')).toBeTruthy();
    expect(getByText('No results match your search')).toBeTruthy();
  });

  test('should use default color when not provided', () => {
    const { getByText } = render(
      <EmptyState 
        icon="folder-open"
        title="Empty" 
        message="No items here"
      />
    );
    expect(getByText('Empty')).toBeTruthy();
    expect(getByText('No items here')).toBeTruthy();
  });

  test('should render with long title text', () => {
    const { getByText } = render(
      <EmptyState 
        icon="content-duplicate"
        title="This is a very long title that might wrap to multiple lines" 
        message="Supporting message text"
      />
    );
    expect(getByText('This is a very long title that might wrap to multiple lines')).toBeTruthy();
  });

  test('should render with long message text', () => {
    const { getByText } = render(
      <EmptyState 
        icon="information"
        title="Important" 
        message="This is a very long message that provides detailed information about why the list is empty"
      />
    );
    expect(getByText('Important')).toBeTruthy();
  });

  test('should support no bookings state', () => {
    const { getByText } = render(
      <EmptyState 
        icon="calendar-blank"
        title="No Bookings" 
        message="Start by booking a table"
        color="#ff9e6b"
      />
    );
    expect(getByText('No Bookings')).toBeTruthy();
    expect(getByText('Start by booking a table')).toBeTruthy();
  });

  test('should support no search results state', () => {
    const { getByText } = render(
      <EmptyState 
        icon="magnify"
        title="No Results Found" 
        message="Try searching with different keywords"
        color="#ff9e6b"
      />
    );
    expect(getByText('No Results Found')).toBeTruthy();
    expect(getByText('Try searching with different keywords')).toBeTruthy();
  });

  test('should support error state', () => {
    const { getByText } = render(
      <EmptyState 
        icon="alert-circle"
        title="Error Loading Data" 
        message="Please try again later"
        color="#ff0000"
      />
    );
    expect(getByText('Error Loading Data')).toBeTruthy();
    expect(getByText('Please try again later')).toBeTruthy();
  });

  test('should support network error state', () => {
    const { getByText } = render(
      <EmptyState 
        icon="wifi-off"
        title="No Connection" 
        message="Check your internet connection"
        color="#ff9e6b"
      />
    );
    expect(getByText('No Connection')).toBeTruthy();
    expect(getByText('Check your internet connection')).toBeTruthy();
  });

  test('should accept multiple icon types', () => {
    const icons = ['inbox', 'search', 'alert-circle', 'calendar', 'home'];
    
    icons.forEach(icon => {
      const { getByText } = render(
        <EmptyState 
          icon={icon}
          title="Empty State" 
          message="No content available"
        />
      );
      expect(getByText('Empty State')).toBeTruthy();
    });
  });

  test('should accept multiple color variants', () => {
    const colors = ['#ff9e6b', '#ff0000', '#4CAF50', '#2196F3', '#FFC107'];
    
    colors.forEach(color => {
      const { getByText } = render(
        <EmptyState 
          icon="info"
          title="State" 
          message="Message"
          color={color}
        />
      );
      expect(getByText('State')).toBeTruthy();
    });
  });

  test('should center content alignment', () => {
    const { getByText } = render(
      <EmptyState 
        icon="folder"
        title="Centered" 
        message="This content should be centered"
      />
    );
    expect(getByText('Centered')).toBeTruthy();
  });
});
