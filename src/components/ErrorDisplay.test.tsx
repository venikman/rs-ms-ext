import { describe, test, expect, afterEach } from '@rstest/core';
import { render, cleanup } from '@testing-library/react';
import { ErrorDisplay } from './ErrorDisplay';

describe('ErrorDisplay', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders lightweight alert in test env', () => {
    render(<ErrorDisplay message="Something went wrong" />);
    expect(document.querySelector('[role="alert"]')).toBeTruthy();
  });

  test('renders azure-devops-ui card when forceFullUi is true', () => {
    render(<ErrorDisplay message="UI branch" forceFullUi />);
    expect(document.querySelector('.bolt-messagecard')).toBeTruthy();
  });
});
