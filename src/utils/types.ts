export interface ProjectInfo {
  name: string;
  id: string;
}

export interface WorkItem {
  id: number;
  title: string;
  state: WorkItemState;
  type: WorkItemType;
}

export type WorkItemState = 'New' | 'Active' | 'Resolved' | 'Closed';
export type WorkItemType = 'Bug' | 'Task' | 'Feature';

export type TabType = 'overview' | 'work-items' | 'settings';
