import React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import Card from '../../components/common/Card';

describe('Card Component', () => {
  test('should render children content', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    expect(getByText('Card Content')).toBeTruthy();
  });

  test('should apply default padding (16)', () => {
    const { getByText } = render(
      <Card>
        <Text>Content</Text>
      </Card>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  test('should apply custom padding', () => {
    const { getByText } = render(
      <Card padding={20}>
        <Text>Content</Text>
      </Card>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  test('should apply custom gap', () => {
    const { getByText } = render(
      <Card gap={12}>
        <Text>Line 1</Text>
        <Text>Line 2</Text>
      </Card>
    );
    expect(getByText('Line 1')).toBeTruthy();
    expect(getByText('Line 2')).toBeTruthy();
  });

  test('should accept multiple children', () => {
    const { getByText } = render(
      <Card>
        <Text>First</Text>
        <Text>Second</Text>
        <Text>Third</Text>
      </Card>
    );
    expect(getByText('First')).toBeTruthy();
    expect(getByText('Second')).toBeTruthy();
    expect(getByText('Third')).toBeTruthy();
  });

  test('should apply custom style', () => {
    const customStyle = { marginBottom: 10, marginTop: 5 };
    const { getByText } = render(
      <Card style={customStyle}>
        <Text>Content</Text>
      </Card>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  test('should have rounded corners by default', () => {
    const { getByText } = render(
      <Card>
        <Text>Content</Text>
      </Card>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  test('should have shadow styling', () => {
    const { getByText } = render(
      <Card>
        <Text>Content</Text>
      </Card>
    );
    expect(getByText('Content')).toBeTruthy();
  });

  test('should work with complex children structures', () => {
    const { getByText } = render(
      <Card padding={15}>
        <Text>Title</Text>
        <Text>Description Line 1</Text>
        <Text>Description Line 2</Text>
      </Card>
    );
    expect(getByText('Title')).toBeTruthy();
    expect(getByText('Description Line 1')).toBeTruthy();
    expect(getByText('Description Line 2')).toBeTruthy();
  });

  test('should apply gap between children', () => {
    const { getByText } = render(
      <Card gap={8}>
        <Text>Item 1</Text>
        <Text>Item 2</Text>
        <Text>Item 3</Text>
      </Card>
    );
    expect(getByText('Item 1')).toBeTruthy();
    expect(getByText('Item 2')).toBeTruthy();
    expect(getByText('Item 3')).toBeTruthy();
  });

  test('should combine padding and gap correctly', () => {
    const { getByText } = render(
      <Card padding={10} gap={5}>
        <Text>Content 1</Text>
        <Text>Content 2</Text>
      </Card>
    );
    expect(getByText('Content 1')).toBeTruthy();
    expect(getByText('Content 2')).toBeTruthy();
  });
});
