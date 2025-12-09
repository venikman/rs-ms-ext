import { describe, test, expect, afterEach } from '@rstest/core';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from './App';

describe('App smoke', () => {
  afterEach(() => cleanup());

  test('renders header', () => {
    render(<App />);
    expect(screen.getByText('Azure DevOps Extension')).toBeTruthy();
  });
});
