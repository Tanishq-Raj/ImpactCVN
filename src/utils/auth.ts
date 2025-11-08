/**
 * Authentication utility functions
 */

export interface User {
  id: number;
  name: string;
  email: string;
}

/**
 * Get the authentication token from sessionStorage
 * @returns {string | null} JWT token or null if not found
 */
export const getAuthToken = (): string | null => {
  return sessionStorage.getItem('authToken');
};

/**
 * Get the user object from sessionStorage
 * @returns {User | null} User object or null if not found
 */
export const getUser = (): User | null => {
  const userStr = sessionStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as User;
  } catch (error) {
    console.error('Error parsing user from sessionStorage:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if user has a valid token
 */
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  return token !== null && token !== '';
};

/**
 * Store authentication data in sessionStorage
 * @param {string} token - JWT token
 * @param {User} user - User object
 */
export const setAuthData = (token: string, user: User): void => {
  sessionStorage.setItem('authToken', token);
  sessionStorage.setItem('user', JSON.stringify(user));
};

/**
 * Clear authentication data from sessionStorage
 */
export const clearAuthData = (): void => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('user');
};

/**
 * Logout user by clearing auth data
 */
export const logout = (): void => {
  clearAuthData();
};

/**
 * Get authorization header for API requests
 * @returns {Object} Headers object with Authorization header
 */
export const getAuthHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  
  if (!token) {
    return {
      'Content-Type': 'application/json'
    };
  }
  
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};
