import { describe, test, expect, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import { ErrorDisplay } from './ErrorDisplay';

describe('ErrorDisplay', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders error title', () => {
    render(<ErrorDisplay message="Something went wrong" />);
    expect(screen.getByText('Error')).toBeTruthy();
  });

  test('renders error message', () => {
    render(<ErrorDisplay message="Something went wrong" />);
    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  test('renders custom error message', () => {
    render(<ErrorDisplay message="Failed to load project data" />);
    expect(screen.getByText('Failed to load project data')).toBeTruthy();
  });

  test('has error styling classes', () => {
    render(<ErrorDisplay message="Test error" />);
    const errorBox = document.querySelector('.bg-red-50');
    expect(errorBox).toBeTruthy();
  });

  test('has border styling', () => {
    render(<ErrorDisplay message="Test error" />);
    const errorBox = document.querySelector('.border-red-200');
    expect(errorBox).toBeTruthy();
  });
});
