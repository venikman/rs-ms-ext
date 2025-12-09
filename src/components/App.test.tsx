import { describe, test, expect, afterEach } from '@rstest/core';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { App } from './App';

describe('App Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders header and navigation', () => {
    render(<App />);
    expect(screen.getByText('Azure DevOps Extension')).toBeTruthy();
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Work items')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
    expect(
      screen.getByText(/Running in standalone demo mode\. Deploy to Azure DevOps to see live project data\./i)
    ).toBeTruthy();
  });

  test('shows work items when navigating', () => {
    render(<App initialTab="work-items" />);
    expect(screen.getByText((text) => text.includes('#1234'))).toBeTruthy();
    expect(screen.getByText((text) => text.includes('#1239'))).toBeTruthy();
    expect(screen.getAllByText(/Active/i).length).toBeGreaterThan(0);
  });

  test('renders error state when provided', () => {
    render(<App initialError="Test error message" />);
    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.getByText('Test error message')).toBeTruthy();
  });
});

describe('App Component (full UI mode)', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders overview with azure-devops-ui components', () => {
    render(<App forceFullUi />);
    expect(screen.getByText('Azure DevOps Extension')).toBeTruthy();
    expect(screen.getByText('Project summary')).toBeTruthy();
    expect(screen.getByText('Work item health')).toBeTruthy();
    expect(screen.getByText('Demo environment')).toBeTruthy();
  });

  test('switches tabs and shows work items and settings in full UI', () => {
    render(<App forceFullUi />);

    fireEvent.click(screen.getByText('Work items'));
    expect(screen.getByText((text) => text.includes('#1234'))).toBeTruthy();
    expect(screen.getAllByText(/Active/i).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Email notifications')).toBeTruthy();

    fireEvent.click(screen.getByText('Manual only'));
    expect(screen.getByText(/Current cadence: Manual only/)).toBeTruthy();
  });
});
