import type { IStatusProps } from 'azure-devops-ui/Status';
import { Statuses } from 'azure-devops-ui/Status';
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
 * Get Status props for work item state pills in azure-devops-ui
 */
export function getStateStatus(state: WorkItemState): IStatusProps {
  const stateStatuses: Record<WorkItemState, IStatusProps> = {
    New: { ...Statuses.Queued, text: 'New' },
    Active: { ...Statuses.Running, text: 'Active' },
    Resolved: { ...Statuses.Success, text: 'Resolved' },
    Closed: { ...Statuses.Canceled, text: 'Closed' },
  };
  return stateStatuses[state];
}

/**
 * Icon info for work item type
 */
export function getTypeIcon(type: WorkItemType): { glyph: string; label: string } {
  const typeIcons: Record<WorkItemType, { glyph: string; label: string }> = {
    Bug: { glyph: '🐛', label: 'Bug work item' },
    Task: { glyph: '📋', label: 'Task work item' },
    Feature: { glyph: '✨', label: 'Feature work item' },
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
  { id: 1239, title: 'Refine backlog grooming template', state: 'Closed', type: 'Task' },
  { id: 1240, title: 'Optimize dashboard queries', state: 'Resolved', type: 'Feature' },
];

/**
 * Mock project data for demo mode
 */
export const mockProject = {
  name: 'Demo Project',
  id: 'demo-12345-abcde',
};
