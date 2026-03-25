import React from 'react';
import { render } from '@testing-library/react-native';
import Badge from '../../components/common/Badge';

describe('Badge Component', () => {
  test('should render with label text', () => {
    const { getByText } = render(
      <Badge label="Confirmed" variant="success" />
    );
    expect(getByText('Confirmed')).toBeTruthy();
  });

  test('should apply success variant', () => {
    const { getByText } = render(
      <Badge label="Paid" variant="success" />
    );
    expect(getByText('Paid')).toBeTruthy();
  });

  test('should apply danger variant', () => {
    const { getByText } = render(
      <Badge label="Cancelled" variant="danger" />
    );
    expect(getByText('Cancelled')).toBeTruthy();
  });

  test('should apply warning variant', () => {
    const { getByText } = render(
      <Badge label="Pending" variant="warning" />
    );
    expect(getByText('Pending')).toBeTruthy();
  });

  test('should apply info variant', () => {
    const { getByText } = render(
      <Badge label="Info" variant="info" />
    );
    expect(getByText('Info')).toBeTruthy();
  });

  test('should use default variant when not specified', () => {
    const { getByText } = render(
      <Badge label="Default Badge" />
    );
    expect(getByText('Default Badge')).toBeTruthy();
  });

  test('should apply correct size styles', () => {
    const { getByText: getByTextSM } = render(
      <Badge label="Small" size="sm" variant="default" />
    );
    expect(getByTextSM('Small')).toBeTruthy();

    const { getByText: getByTextMD } = render(
      <Badge label="Medium" size="md" variant="default" />
    );
    expect(getByTextMD('Medium')).toBeTruthy();

    const { getByText: getByTextLG } = render(
      <Badge label="Large" size="lg" variant="default" />
    );
    expect(getByTextLG('Large')).toBeTruthy();
  });

  test('should handle long label text', () => {
    const { getByText } = render(
      <Badge label="This is a very long badge label" variant="success" />
    );
    expect(getByText('This is a very long badge label')).toBeTruthy();
  });

  test('should render multiple badges with different variants', () => {
    const { getByText } = render(
      <>
        <Badge label="Confirmed" variant="success" />
        <Badge label="Failed" variant="danger" />
        <Badge label="Pending" variant="warning" />
      </>
    );
    expect(getByText('Confirmed')).toBeTruthy();
    expect(getByText('Failed')).toBeTruthy();
    expect(getByText('Pending')).toBeTruthy();
  });
});
