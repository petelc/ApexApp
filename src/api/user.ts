import { apiClient } from './client';
import { UserInfo } from '@/types/auth';

/**
 * User API - used for user select options and user management
 */

export const userApi = {
  /**
   * Get All Users
   */
  getAllUsers: async (): Promise<UserInfo[]> => {
    const response = await apiClient.get<UserInfo[]>('/users');
    return response.data;
  },

  /**
   * Get User by ID
   */
  getUserById: async (userId: string): Promise<UserInfo> => {
    const response = await apiClient.get<UserInfo>(`/users/${userId}`);
    return response.data;
  },

  /**
   * Get Project Managers
   */
  getProjectManagers: async (): Promise<UserInfo[]> => {
    const response = await apiClient.get<UserInfo[]>('/users/project-managers');
    return response.data;
  },
};
