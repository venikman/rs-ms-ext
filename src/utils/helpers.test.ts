import { describe, test, expect, beforeEach, afterEach } from '@rstest/core';
import {
  isAzureDevOpsHost,
  getStateColorClasses,
  getTypeIcon,
  countByState,
  formatTabLabel,
  mockWorkItems,
  mockProject,
} from './helpers';
import type { WorkItem } from './types';

describe('isAzureDevOpsHost', () => {
  const originalWindow = globalThis.window;
  const originalDocument = globalThis.document;

  afterEach(() => {
    // Restore original window and document
    Object.defineProperty(globalThis, 'window', {
      value: originalWindow,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: originalDocument,
      writable: true,
    });
  });

  test('returns false when window.parent equals window (not in iframe)', () => {
    const mockWindow = { parent: null as unknown };
    mockWindow.parent = mockWindow; // self-reference
    Object.defineProperty(globalThis, 'window', {
      value: mockWindow,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: { referrer: '' },
      writable: true,
    });

    expect(isAzureDevOpsHost()).toBe(false);
  });

  test('returns false when referrer does not include dev.azure.com', () => {
    const mockParent = {};
    const mockWindow = { parent: mockParent };
    Object.defineProperty(globalThis, 'window', {
      value: mockWindow,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: { referrer: 'https://example.com' },
      writable: true,
    });

    expect(isAzureDevOpsHost()).toBe(false);
  });

  test('returns true when in iframe with dev.azure.com referrer', () => {
    const mockParent = {};
    const mockWindow = { parent: mockParent };
    Object.defineProperty(globalThis, 'window', {
      value: mockWindow,
      writable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: { referrer: 'https://dev.azure.com/myorg/myproject' },
      writable: true,
    });

    expect(isAzureDevOpsHost()).toBe(true);
  });

  test('returns false when accessing window.parent throws (cross-origin error)', () => {
    // Create a mock window that throws when accessing parent
    const mockWindow = {};
    Object.defineProperty(mockWindow, 'parent', {
      get() {
        throw new Error('Blocked a frame with origin from accessing a cross-origin frame');
      },
    });
    Object.defineProperty(globalThis, 'window', {
      value: mockWindow,
      writable: true,
    });

    expect(isAzureDevOpsHost()).toBe(false);
  });
});

describe('getStateColorClasses', () => {
  test('returns correct classes for New state', () => {
    expect(getStateColorClasses('New')).toBe('bg-blue-100 text-blue-800');
  });

  test('returns correct classes for Active state', () => {
    expect(getStateColorClasses('Active')).toBe('bg-yellow-100 text-yellow-800');
  });

  test('returns correct classes for Resolved state', () => {
    expect(getStateColorClasses('Resolved')).toBe('bg-green-100 text-green-800');
  });

  test('returns correct classes for Closed state', () => {
    expect(getStateColorClasses('Closed')).toBe('bg-gray-100 text-gray-800');
  });
});

describe('getTypeIcon', () => {
  test('returns bug emoji for Bug type', () => {
    expect(getTypeIcon('Bug')).toBe('🐛');
  });

  test('returns clipboard emoji for Task type', () => {
    expect(getTypeIcon('Task')).toBe('📋');
  });

  test('returns sparkles emoji for Feature type', () => {
    expect(getTypeIcon('Feature')).toBe('✨');
  });
});

describe('countByState', () => {
  const testWorkItems: WorkItem[] = [
    { id: 1, title: 'Item 1', state: 'New', type: 'Bug' },
    { id: 2, title: 'Item 2', state: 'New', type: 'Task' },
    { id: 3, title: 'Item 3', state: 'Active', type: 'Feature' },
    { id: 4, title: 'Item 4', state: 'Resolved', type: 'Bug' },
    { id: 5, title: 'Item 5', state: 'Closed', type: 'Task' },
  ];

  test('counts New items correctly', () => {
    expect(countByState(testWorkItems, 'New')).toBe(2);
  });

  test('counts Active items correctly', () => {
    expect(countByState(testWorkItems, 'Active')).toBe(1);
  });

  test('counts Resolved items correctly', () => {
    expect(countByState(testWorkItems, 'Resolved')).toBe(1);
  });

  test('counts Closed items correctly', () => {
    expect(countByState(testWorkItems, 'Closed')).toBe(1);
  });

  test('returns 0 for empty array', () => {
    expect(countByState([], 'New')).toBe(0);
  });

  test('returns 0 when no items match state', () => {
    const items: WorkItem[] = [
      { id: 1, title: 'Item 1', state: 'Active', type: 'Bug' },
    ];
    expect(countByState(items, 'Closed')).toBe(0);
  });
});

describe('formatTabLabel', () => {
  test('capitalizes first letter of simple word', () => {
    expect(formatTabLabel('overview')).toBe('Overview');
  });

  test('capitalizes and replaces hyphen with space', () => {
    expect(formatTabLabel('work-items')).toBe('Work items');
  });

  test('handles settings tab', () => {
    expect(formatTabLabel('settings')).toBe('Settings');
  });

  test('handles empty string', () => {
    expect(formatTabLabel('')).toBe('');
  });

  test('handles single character', () => {
    expect(formatTabLabel('a')).toBe('A');
  });
});

describe('mockWorkItems', () => {
  test('contains expected number of items', () => {
    expect(mockWorkItems).toHaveLength(5);
  });

  test('contains items with required properties', () => {
    mockWorkItems.forEach((item) => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('title');
      expect(item).toHaveProperty('state');
      expect(item).toHaveProperty('type');
    });
  });

  test('contains various states', () => {
    const states = mockWorkItems.map((item) => item.state);
    expect(states).toContain('New');
    expect(states).toContain('Active');
    expect(states).toContain('Resolved');
  });

  test('contains various types', () => {
    const types = mockWorkItems.map((item) => item.type);
    expect(types).toContain('Bug');
    expect(types).toContain('Task');
    expect(types).toContain('Feature');
  });
});

describe('mockProject', () => {
  test('has name property', () => {
    expect(mockProject.name).toBe('Demo Project');
  });

  test('has id property', () => {
    expect(mockProject.id).toBe('demo-12345-abcde');
  });
});
