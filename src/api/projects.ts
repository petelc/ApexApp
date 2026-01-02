import { apiClient } from './client';
import type { Project } from '@/types/project';

/**
 * Project API
 */

export const projectApi = {
  /**
   * Get all projects
   */
  getAll: async (): Promise<Project[]> => {
    const response = await apiClient.get<{ projects: Project[] }>('/projects');
    return response.data.projects;
  },

  /**
   * Get project by ID
   */
  getById: async (id: string): Promise<Project> => {
    const response = await apiClient.get<Project>(`/projects/${id}`);
    return response.data;
  },

  /**
   * Start project
   */
  start: async (id: string): Promise<void> => {
    await apiClient.post(`/projects/${id}/start`);
  },

  /**
   * Complete project
   */
  complete: async (id: string): Promise<void> => {
    await apiClient.post(`/projects/${id}/complete`);
  },

  /**
   * Put project on hold
   */
  hold: async (id: string, reason: string): Promise<void> => {
    await apiClient.post(`/projects/${id}/hold`, { reason });
  },

  /**
   * Cancel project
   */
  cancel: async (id: string, reason: string): Promise<void> => {
    await apiClient.post(`/projects/${id}/cancel`, { reason });
  },
};
