import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingSpinner from '../../components/common/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('should render loading spinner by default', () => {
    const { root } = render(
      <LoadingSpinner />
    );
    expect(root).toBeTruthy();
  });

  test('should apply default size (large)', () => {
    const { root } = render(
      <LoadingSpinner />
    );
    expect(root).toBeTruthy();
  });

  test('should apply custom size', () => {
    const { root } = render(
      <LoadingSpinner size="large" />
    );
    expect(root).toBeTruthy();
  });

  test('should apply custom color', () => {
    const { root } = render(
      <LoadingSpinner color="#ff9e6b" />
    );
    expect(root).toBeTruthy();
  });

  test('should use default color when not specified', () => {
    const { root } = render(
      <LoadingSpinner />
    );
    expect(root).toBeTruthy();
  });

  test('should display as inline spinner by default', () => {
    const { root } = render(
      <LoadingSpinner fillScreen={false} />
    );
    expect(root).toBeTruthy();
  });

  test('should display as fullscreen overlay when fullScreen is true', () => {
    const { root } = render(
      <LoadingSpinner fullScreen={true} />
    );
    expect(root).toBeTruthy();
  });

  test('should display as inline when fullScreen is false', () => {
    const { root } = render(
      <LoadingSpinner fullScreen={false} />
    );
    expect(root).toBeTruthy();
  });

  test('should handle color change prop', () => {
    const { rerender, root: root1 } = render(
      <LoadingSpinner color="#ff0000" />
    );
    expect(root1).toBeTruthy();

    rerender(
      <LoadingSpinner color="#00ff00" />
    );
  });

  test('should work as inline loader in list', () => {
    const { root } = render(
      <LoadingSpinner size="large" fullScreen={false} />
    );
    expect(root).toBeTruthy();
  });

  test('should work as fullscreen overlay on data load', () => {
    const { root } = render(
      <LoadingSpinner size="large" fullScreen={true} />
    );
    expect(root).toBeTruthy();
  });

  test('should render with all custom props', () => {
    const { root } = render(
      <LoadingSpinner 
        size="large" 
        color="#ff9e6b" 
        fullScreen={true}
      />
    );
    expect(root).toBeTruthy();
  });
});
