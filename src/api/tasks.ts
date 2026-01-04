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
    const response = await apiClient.get(`/projects/${projectId}/tasks`);
    
    console.log('API Response for getByProject Tasks:', response.data);
    
    // ✅ Handle paginated response with 'items'
    if (response.data && Array.isArray(response.data.items)) {
      return response.data.items;
    }
    
    // Handle legacy format with 'tasks'
    if (response.data && Array.isArray(response.data.tasks)) {
      return response.data.tasks;
    }
    
    // Handle direct array
    if (Array.isArray(response.data)) {
      return response.data;
    }
    
    console.warn('Unexpected API response format:', response.data);
    return [];
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
    await apiClient.post(`/tasks/${taskId}/claim`, {});  // ✅ Send empty object
  },

  /**
   * Start task
   */
  start: async (taskId: string): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/start`, {});  // ✅ Send empty object
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
    await apiClient.post(`/tasks/${taskId}/unblock`, {});  // ✅ Send empty object
  },

  /**
   * Complete task
   */
  complete: async (taskId: string): Promise<void> => {
    await apiClient.post(`/tasks/${taskId}/complete`, {});  // ✅ Send empty object
  },
};
