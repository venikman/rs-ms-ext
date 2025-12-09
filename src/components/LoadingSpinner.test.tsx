import { describe, test, expect, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import { LoadingSpinner } from './LoadingSpinner';

describe('LoadingSpinner', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders loading label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading data')).toBeTruthy();
  });

  test('exposes aria label for spinner', () => {
    render(<LoadingSpinner />);
    expect(screen.getByLabelText('Loading data')).toBeTruthy();
  });
});
