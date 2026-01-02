import { apiClient } from './client';
import type {
  ProjectRequest,
  CreateProjectRequestRequest,
  ProjectRequestListResponse,
} from '@/types/projectRequest';

/**
 * ProjectRequest API
 */

export const projectRequestApi = {
  /**
   * Get all project requests
   */
  getAll: async (): Promise<ProjectRequest[]> => {
    const response = await apiClient.get<ProjectRequestListResponse>(
      '/project-requests'
    );
    return response.data.projectRequests;
  },

  /**
   * Get project request by ID
   */
  getById: async (id: string): Promise<ProjectRequest> => {
    const response = await apiClient.get<ProjectRequest>(
      `/project-requests/${id}`
    );
    return response.data;
  },

  /**
   * Create new project request
   */
  create: async (data: CreateProjectRequestRequest): Promise<{ projectRequestId: string }> => {
    const response = await apiClient.post('/project-requests', data);
    return response.data;
  },

  /**
   * Submit project request for approval
   */
  submit: async (id: string): Promise<void> => {
    await apiClient.post(`/project-requests/${id}/submit`);
  },

  /**
   * Approve project request (admin only)
   */
  approve: async (id: string, notes: string): Promise<void> => {
    await apiClient.post(`/project-requests/${id}/approve`, { notes });
  },

  /**
   * Deny project request (admin only)
   */
  deny: async (id: string, reason: string): Promise<void> => {
    await apiClient.post(`/project-requests/${id}/deny`, { reason });
  },

  /**
   * Cancel project request
   */
  cancel: async (id: string, reason: string): Promise<void> => {
    await apiClient.post(`/project-requests/${id}/cancel`, { reason });
  },

  /**
   * Convert to project (admin only)
   */
  convertToProject: async (id: string): Promise<{ projectId: string }> => {
    const response = await apiClient.post(`/project-requests/${id}/convert`);
    return response.data;
  },
};
