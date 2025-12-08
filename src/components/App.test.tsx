import { describe, test, expect, afterEach } from '@rstest/core';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { App } from './App';

describe('App Component', () => {
  afterEach(() => {
    cleanup();
  });

  test('renders header with title', () => {
    render(<App />);
    expect(screen.getByText('Azure DevOps Extension')).toBeTruthy();
  });

  test('shows demo mode badge', () => {
    render(<App />);
    expect(screen.getByText('DEMO MODE')).toBeTruthy();
  });

  test('shows demo notice', () => {
    render(<App />);
    expect(screen.getByText(/Running in standalone demo mode/i)).toBeTruthy();
  });

  test('shows build info', () => {
    render(<App />);
    expect(screen.getByText('Built with React 19 + Rsbuild')).toBeTruthy();
  });

  test('renders navigation tabs', () => {
    render(<App />);
    expect(screen.getByText('Overview')).toBeTruthy();
    expect(screen.getByText('Work items')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  test('shows overview by default', () => {
    render(<App />);
    expect(screen.getByText('Project Information')).toBeTruthy();
    expect(screen.getByText('Work Item Stats')).toBeTruthy();
    expect(screen.getByText('Quick Actions')).toBeTruthy();
  });

  test('displays project info', () => {
    render(<App />);
    expect(screen.getByText('Demo Project')).toBeTruthy();
    expect(screen.getByText('demo-12345-abcde')).toBeTruthy();
  });

  test('switches to work items tab', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Work items'));
    expect(screen.getByText('#1234')).toBeTruthy();
    expect(screen.getByText('Fix login authentication flow')).toBeTruthy();
  });

  test('displays work item icons', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Work items'));
    // Multiple bugs and tasks exist, use getAllByText
    expect(screen.getAllByText('🐛').length).toBeGreaterThan(0);
    expect(screen.getAllByText('📋').length).toBeGreaterThan(0);
    expect(screen.getByText('✨')).toBeTruthy();
  });

  test('switches to settings tab', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Refresh interval')).toBeTruthy();
    expect(screen.getByText('Save Settings')).toBeTruthy();
  });

  test('shows settings checkboxes', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Settings'));
    expect(screen.getByText('Show notifications for work item updates')).toBeTruthy();
    expect(screen.getByText('Enable dark mode (coming soon)')).toBeTruthy();
  });

  test('can switch back to overview', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Settings'));
    fireEvent.click(screen.getByText('Overview'));
    expect(screen.getByText('Project Information')).toBeTruthy();
  });

  test('renders error state with initialError prop', () => {
    render(<App initialError="Test error message" />);
    expect(screen.getByText('Error')).toBeTruthy();
    expect(screen.getByText('Test error message')).toBeTruthy();
  });

  test('renders error display styling with initialError', () => {
    render(<App initialError="Connection failed" />);
    const errorBox = document.querySelector('.bg-red-50');
    expect(errorBox).toBeTruthy();
  });

  test('does not show loading when initialError is set', () => {
    render(<App initialError="Some error" />);
    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeFalsy();
  });

  test('forceDemo prop forces demo mode', () => {
    render(<App forceDemo={true} />);
    expect(screen.getByText('DEMO MODE')).toBeTruthy();
    expect(screen.getByText('Demo Project')).toBeTruthy();
  });

  test('forceDemo shows mock work items', () => {
    render(<App forceDemo={true} />);
    fireEvent.click(screen.getByText('Work items'));
    expect(screen.getByText('#1234')).toBeTruthy();
    expect(screen.getByText('#1235')).toBeTruthy();
  });
});
