export type QueryType = 'Athena' | 'Practice' | 'Custom';

export interface Folder {
  id: string;
  name: string;
  description?: string;
}

export interface QueryFilter {
  name: string;
  value: string;
}

export interface QueryConfig {
  columns: string[];
  filters: QueryFilter[];
}

export interface ActivityEvent {
  at: string; // ISO
  by: string;
  action: string; // e.g., 'Executed', 'Updated', 'Schedule Modified'
  details?: string;
}

export interface QueryItem {
  id: string;
  name: string;
  description?: string;
  type: QueryType;
  folderId: string;
  tags: string[];
  owner: string;
  sql: string;
  createdBy: string;
  createdOn: string; // ISO
  lastRun?: string; // ISO
  lastModified: string; // ISO
  favorite?: boolean;
  sharedBy?: string;
  accessLevel?: 'Viewer' | 'Editor' | 'Owner';
  config?: QueryConfig;
  activity?: ActivityEvent[];
  editableFilterPolicy?: 'date-only' | 'full';
}

export interface ScheduleItem {
  id: string;
  queryId: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Ad-hoc';
  nextRun?: string; // ISO
  lastRun?: string; // ISO
  status: 'Scheduled' | 'Success' | 'Failed' | 'Paused';
  recipients?: string[];
  scheduledBy?: string;
}

export interface InboxItem {
  id: string;
  queryId: string;
  date: string; // ISO
  status: 'New' | 'Read' | 'Archived' | 'Failed' | 'Paused';
  hasAttachment?: boolean;
  recipients?: string[];
  scheduledBy?: string;
}
