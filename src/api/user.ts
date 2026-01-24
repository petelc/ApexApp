import { apiClient } from './client';

/**
 * User Summary - Lightweight user information for display
 * ✅ Defined here to avoid circular imports
 */
export interface UserSummary {
  id: string;
  fullName: string;
  email: string;
}

/**
 * User API
 */

export const userApi = {
  /**
   * Get users by role
   */
  getUsersByRole: async (role: string): Promise<UserSummary[]> => {
    const response = await apiClient.get<UserSummary[]>(`/users/by-role/${role}`);
    return response.data;
  },

  /**
   * Get all project managers
   */
  getProjectManagers: async (): Promise<UserSummary[]> => {
    return userApi.getUsersByRole('Project Manager');
  },

  /**
   * Get all change managers
   */
  getChangeManagers: async (): Promise<UserSummary[]> => {
    return userApi.getUsersByRole('Change Manager');
  },

  /**
   * Get all CAB members
   */
  getCABMembers: async (): Promise<UserSummary[]> => {
    return userApi.getUsersByRole('CAB Member');
  },

  /**
   * Get all CAB managers
   */
  getCABManagers: async (): Promise<UserSummary[]> => {
    return userApi.getUsersByRole('CAB Manager');
  },
};
