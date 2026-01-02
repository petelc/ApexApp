import { apiClient } from './client';
import type { Task, CreateTaskRequest } from '@/types/project';

/**
 * Task API
 */

export const taskApi = {
  /**
   * Get tasks for a project
   */
  getByProject: async (projectId: string): Promise<Task[]> => {
    const response = await apiClient.get<{ tasks: Task[] }>(
      `/projects/${projectId}/tasks`
    );
    return response.data.tasks;
  },

  /**
   * Get task by ID
   */
  getById: async (taskId: string): Promise<Task> => {
    const response = await apiClient.get<Task>(`/tasks/${taskId}`);
    return response.data;
  },

  /**
   * Create task for project
   */
  create: async (projectId: string, data: CreateTaskRequest): Promise<{ taskId: string }> => {
    const response = await apiClient.post(`/projects/${projectId}/tasks`, data);
    return response.data;
  },

  /**
   * Assign task to user
   */
  assignToUser: async (taskId: string, userId: string): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/assign-to-user`, {
      assignedToUserId: userId,
    });
  },

  /**
   * Assign task to department
   */
  assignToDepartment: async (taskId: string, departmentId: string): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/assign-to-department`, {
      departmentId,
    });
  },

  /**
   * Claim a department task
   */
  claim: async (taskId: string): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/claim`);
  },

  /**
   * Start task
   */
  start: async (taskId: string): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/start`);
  },

  /**
   * Log time on task
   */
  logTime: async (taskId: string, hours: number): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/log-time`, { hours });
  },

  /**
   * Block task
   */
  block: async (taskId: string, reason: string): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/block`, { reason });
  },

  /**
   * Unblock task
   */
  unblock: async (taskId: string): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/unblock`);
  },

  /**
   * Complete task
   */
  complete: async (taskId: string): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/complete`);
  },
};
