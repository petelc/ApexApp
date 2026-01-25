import { apiClient } from './client';

/**
 * User types
 */
export interface User {
  id: string;
  email: string;
  userName: string;
  fullName: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  timeZone?: string;
  profileImageUrl?: string;
  isActive: boolean;
  tenantId: string;
  departmentId?: string;
  lastLoginDate?: string;
  createdDate: string;
  lastModifiedDate?: string;
  roles: string[];
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  timeZone?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  timeZone?: string;
  isActive?: boolean;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  timeZone?: string;
  password: string;
  confirmPassword: string;
  isActive?: boolean;
  roles?: string[];
}

export interface AssignRoleRequest {
  roleName: string;
}

/**
 * Users API
 */
export const usersApi = {
  /**
   * Get current user profile
   */
  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },

  /**
   * Update current user profile
   */
  updateCurrentUser: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>('/users/me', data);
    return response.data;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    await apiClient.post('/users/me/change-password', data);
  },

  /**
   * Upload profile picture
   */
  uploadProfilePicture: async (
    file: File,
  ): Promise<{ profileImageUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<{ profileImageUrl: string }>(
      '/users/me/profile-picture',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response.data;
  },

  /**
   * Get users by role
   */
  getUsersByRole: async (role: string): Promise<User[]> => {
    const response = await apiClient.get<User[]>(`/users/by-role/${role}`);
    return response.data;
  },

  // Admin operations
  admin: {
    /**
     * Get all users (admin)
     */
    getAllUsers: async (): Promise<User[]> => {
      const response = await apiClient.get<User[]>('/admin/users');
      return response.data;
    },

    /**
     * Get user by ID (admin)
     */
    getUserById: async (userId: string): Promise<User> => {
      const response = await apiClient.get<User>(`/admin/users/${userId}`);
      return response.data;
    },

    /**
     * Create new user (admin)
     */
    createUser: async (data: CreateUserRequest): Promise<User> => {
      const response = await apiClient.post<User>('/admin/users', data);
      return response.data;
    },

    /**
     * Update user (admin)
     */
    updateUser: async (
      userId: string,
      data: UpdateUserRequest,
    ): Promise<User> => {
      const response = await apiClient.put<User>(
        `/admin/users/${userId}`,
        data,
      );
      return response.data;
    },

    /**
     * Assign role to user (admin)
     */
    assignRole: async (userId: string, roleName: string): Promise<void> => {
      await apiClient.post(`/admin/users/${userId}/roles`, { roleName });
    },

    /**
     * Remove role from user (admin)
     */
    removeRole: async (userId: string, roleName: string): Promise<void> => {
      await apiClient.delete(`/admin/users/${userId}/roles/${roleName}`);
    },

    /**
     * Get all roles (admin)
     */
    getAllRoles: async (): Promise<string[]> => {
      const response = await apiClient.get<string[]>('/admin/roles');
      return response.data;
    },
  },
};
