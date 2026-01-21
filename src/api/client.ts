import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

/**
 * Axios API Client for APEX
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Convert PascalCase string to camelCase
 */
const toCamelCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Recursively transform object keys from PascalCase to camelCase
 * Handles ASP.NET API responses which use PascalCase by default
 */
const transformKeysToCamelCase = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(transformKeysToCamelCase);
  }

  if (typeof obj === 'object') {
    const transformed: Record<string, unknown> = {};
    for (const key of Object.keys(obj as Record<string, unknown>)) {
      const camelKey = toCamelCase(key);
      transformed[camelKey] = transformKeysToCamelCase((obj as Record<string, unknown>)[key]);
    }
    return transformed;
  }

  return obj;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

/**
 * Request Interceptor - Add auth token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('apex_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Transform keys and handle errors
 */
apiClient.interceptors.response.use(
  (response) => {
    // Transform PascalCase keys from ASP.NET API to camelCase
    if (response.data) {
      response.data = transformKeysToCamelCase(response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    // Handle 401 Unauthorized - logout
    if (error.response?.status === 401) {
      localStorage.removeItem('apex_token');
      localStorage.removeItem('apex_user');
      window.location.href = '/login';
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Access denied');
    }

    return Promise.reject(error);
  }
);

/**
 * API Error Response Type
 */
export interface ApiError {
  message: string;
  errors?: string[];
  validationErrors?: Array<{
    identifier: string;
    errorMessage: string;
  }>;
}

/**
 * Extract error message from API response
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const apiError = error.response?.data as ApiError;
    
    if (apiError?.errors && apiError.errors.length > 0) {
      return apiError.errors[0];
    }
    
    if (apiError?.validationErrors && apiError.validationErrors.length > 0) {
      return apiError.validationErrors[0].errorMessage;
    }
    
    if (apiError?.message) {
      return apiError.message;
    }
    
    return error.message || 'An unexpected error occurred';
  }
  
  return 'An unexpected error occurred';
};
