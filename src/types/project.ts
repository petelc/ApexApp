/**
 * Project Types
 */

export type ProjectStatus =
  | 'Planning'
  | 'Active'
  | 'OnHold'
  | 'Completed'
  | 'Cancelled';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  priority: string;
  projectManagerUserId?: string;
  projectManagerName?: string;
  startDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  createdByUserId: string;
  createdByName?: string;
  createdDate: string;
  lastModifiedDate?: string;
  convertedFromRequestId?: string;
}

/**
 * Task Types
 */

export type TaskStatus =
  | 'NotStarted'
  | 'InProgress'
  | 'Blocked'
  | 'Completed'
  | 'Cancelled';

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  assignedToDepartmentId?: string;
  assignedToDepartmentName?: string;
  createdByUserId: string;
  createdByName?: string;
  estimatedHours?: number;
  actualHours: number;
  dueDate?: string;
  startedDate?: string;
  completedDate?: string;
  blockedReason?: string;
  blockedDate?: string;
  createdDate: string;
  lastModifiedDate?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: string;
  estimatedHours?: number;
  dueDate?: string;
}

/**
 * Department Types
 */

export interface Department {
  id: string;
  name: string;
  description: string;
  departmentManagerUserId?: string;
  departmentManagerName?: string;
  isActive: boolean;
  memberCount?: number;
  createdDate: string;
}
