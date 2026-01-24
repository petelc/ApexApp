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
  budget?: number;
  projectManagerUserId?: string;
  projectManagerUser?: {
    id: string;
    fullName: string;
    email: string;
  };
  // projectManagerName?: string;
  startDate?: string;
  endDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  targetCompletionDate?: string;
  actualCompletionDate?: string;
  createdByUserId: string;
  createdByUser?: {
    id: string;
    fullName: string;
    email: string;
  };
  //createdByName?: string;
  createdDate: string;
  lastModifiedDate?: string;
  isOverdue?: boolean;
  durationDays?: number;
  daysRemaining?: number;
  totalTasks?: number;
  completedTasks?: number;
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
  assignedToUser?: {
    id: string;
    fullName: string;
    email: string;
  };
  // assignedToName?: string;
  assignedToDepartmentId?: string;
  assignedToDepartmentName?: string;
  createdByUserId: string;
  createdByUser?: {
    id: string;
    fullName: string;
    email: string;
  };
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

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
  priority?: string;
  assignedToUserId?: string;
  assignedToDepartmentId?: string;
  estimatedHours?: number;
  createdDate?: string;
  startedDate?: string;
  completedDate?: string;
  dueDate?: string;
  blockedReason?: string;
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
