import { auth } from '@/config/firebase';

// Base URL for the API
// Note: Replace this with your actual API URL when deploying
// For local development with Expo, use your machine's IP address instead of localhost
const BASE_URL = 'http://192.168.1.100:3000/api/v1'; // Replace with your actual API URL

/**
 * Get the current user's ID token for authentication
 * @returns {Promise<string>} The ID token
 */
const getAuthToken = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  return await user.getIdToken();
};

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint
 * @param {string} method - HTTP method (GET, POST, etc.)
 * @param {Object} data - Request body data (for POST, PUT, etc.)
 * @returns {Promise<Object>} Response data
 */
const apiRequest = async (endpoint, method = 'GET', data = null) => {
  try {
    const token = await getAuthToken();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    const options = {
      method,
      headers
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'API request failed');
    }

    return responseData;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

/**
 * Flood report API service
 */
export const floodReportApi = {
  /**
   * Create a new flood report
   * @param {Object} reportData - Flood report data
   * @returns {Promise<Object>} Created report
   */
  createReport: async (reportData) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Add user ID to report data
    const reportWithUserId = {
      ...reportData,
      userId: user.uid
    };

    return apiRequest('/report', 'POST', reportWithUserId);
  },

  /**
   * Get all flood reports
   * @returns {Promise<Array>} List of all flood reports
   */
  getAllReports: async () => {
    return apiRequest('/reports');
  },

  /**
   * Get flood reports for the current user
   * @returns {Promise<Array>} List of user's flood reports
   */
  getUserReports: async () => {
    return apiRequest('/reports/user');
  }
};
