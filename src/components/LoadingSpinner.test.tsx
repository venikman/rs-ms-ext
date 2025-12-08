import { describe, test, expect, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders loading text', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeTruthy();
  });

  test('renders spinner element', () => {
    render(<LoadingSpinner />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  test('has correct container classes', () => {
    render(<LoadingSpinner />);
    const container = document.querySelector('.min-h-screen');
    expect(container).toBeTruthy();
  });
});
