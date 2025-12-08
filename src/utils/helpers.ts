import type { WorkItem, WorkItemState, WorkItemType } from './types';

/**
 * Detect if running inside Azure DevOps iframe
 */
export function isAzureDevOpsHost(): boolean {
  try {
    return window.parent !== window && document.referrer.includes('dev.azure.com');
  } catch {
    return false;
  }
}

/**
 * Get CSS classes for work item state badges
 */
export function getStateColorClasses(state: WorkItemState): string {
  const stateColors: Record<WorkItemState, string> = {
    New: 'bg-blue-100 text-blue-800',
    Active: 'bg-yellow-100 text-yellow-800',
    Resolved: 'bg-green-100 text-green-800',
    Closed: 'bg-gray-100 text-gray-800',
  };
  return stateColors[state];
}

/**
 * Get emoji icon for work item type
 */
export function getTypeIcon(type: WorkItemType): string {
  const typeIcons: Record<WorkItemType, string> = {
    Bug: '🐛',
    Task: '📋',
    Feature: '✨',
  };
  return typeIcons[type];
}

/**
 * Count work items by state
 */
export function countByState(workItems: WorkItem[], state: WorkItemState): number {
  return workItems.filter((item) => item.state === state).length;
}

/**
 * Format tab label from tab key
 */
export function formatTabLabel(tab: string): string {
  return tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ');
}

/**
 * Mock data for demo mode
 */
export const mockWorkItems: WorkItem[] = [
  { id: 1234, title: 'Fix login authentication flow', state: 'Active', type: 'Bug' },
  { id: 1235, title: 'Add dark mode support', state: 'New', type: 'Feature' },
  { id: 1236, title: 'Update dependencies to latest', state: 'Active', type: 'Task' },
  { id: 1237, title: 'Improve error handling', state: 'Resolved', type: 'Bug' },
  { id: 1238, title: 'Add unit tests for API', state: 'New', type: 'Task' },
];

/**
 * Mock project data for demo mode
 */
export const mockProject = {
  name: 'Demo Project',
  id: 'demo-12345-abcde',
};
