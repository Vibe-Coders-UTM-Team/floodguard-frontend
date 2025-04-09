import { auth } from '@/config/firebase';
import { Alert } from 'react-native';
import {
  mockGetAllAlerts,
  mockGetUserAlerts,
  mockGetAllAIReports,
  mockGetUserAIReports,
  mockGenerateSampleData
} from './mockApiService';

// Replace with your actual API base URL when available
const API_BASE_URL = 'https://your-api-base-url.com/api/v1';

// Set this to false to use the mock API for testing
const USE_REAL_API = false;

/**
 * Fetch all alerts
 * @returns {Promise<Array>} Array of alert objects
 */
export const getAllAlerts = async () => {
  try {
    // Use mock API for testing
    if (!USE_REAL_API) {
      return await mockGetAllAlerts();
    }

    const response = await fetch(`${API_BASE_URL}/alerts`);

    if (!response.ok) {
      throw new Error(`Error fetching alerts: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return [];
  }
};

/**
 * Fetch alerts for the current authenticated user
 * @returns {Promise<Array>} Array of alert objects for the user
 */
export const getUserAlerts = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Use mock API for testing
    if (!USE_REAL_API) {
      return await mockGetUserAlerts(user.uid);
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_BASE_URL}/alerts/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching user alerts: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user alerts:', error);
    return [];
  }
};

/**
 * Fetch all AI reports
 * @returns {Promise<Array>} Array of AI report objects
 */
export const getAllAIReports = async () => {
  try {
    // Use mock API for testing
    if (!USE_REAL_API) {
      return await mockGetAllAIReports();
    }

    const response = await fetch(`${API_BASE_URL}/ai-reports`);

    if (!response.ok) {
      throw new Error(`Error fetching AI reports: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching AI reports:', error);
    return [];
  }
};

/**
 * Fetch AI reports for the current authenticated user
 * @returns {Promise<Array>} Array of AI report objects for the user
 */
export const getUserAIReports = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Use mock API for testing
    if (!USE_REAL_API) {
      return await mockGetUserAIReports(user.uid);
    }

    const token = await user.getIdToken();

    const response = await fetch(`${API_BASE_URL}/ai-reports/user`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Error fetching user AI reports: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user AI reports:', error);
    return [];
  }
};

/**
 * Generate sample data for testing
 * @param {number} alertCount - Number of sample alerts to generate
 * @param {number} reportCount - Number of sample AI reports to generate
 * @param {string} userId - User ID to associate with the sample data
 * @returns {Promise<Object>} Result of the sample data generation
 */
export const generateSampleData = async (alertCount = 5, reportCount = 5, userId = 'system') => {
  try {
    // Use mock API for testing
    if (!USE_REAL_API) {
      return await mockGenerateSampleData(alertCount, reportCount, userId);
    }

    const response = await fetch(`${API_BASE_URL}/generate-sample-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        alertCount,
        reportCount,
        userId
      })
    });

    if (!response.ok) {
      throw new Error(`Error generating sample data: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating sample data:', error);
    Alert.alert('Error', 'Failed to generate sample data. Please try again.');
    return null;
  }
};

/**
 * Get the severity color for an alert
 * @param {string} severity - The severity level of the alert
 * @param {Object} theme - The current theme object
 * @returns {string} Color code for the severity
 */
export const getAlertSeverityColor = (severity, theme) => {
  switch (severity.toLowerCase()) {
    case 'critical':
      return theme.error;
    case 'severe':
      return '#FF4500'; // Orange Red
    case 'moderate':
      return theme.warning;
    case 'minor':
      return theme.success;
    default:
      return theme.primary;
  }
};

/**
 * Get the risk level color for an AI report
 * @param {string} riskLevel - The risk level of the AI report
 * @param {Object} theme - The current theme object
 * @returns {string} Color code for the risk level
 */
export const getRiskLevelColor = (riskLevel, theme) => {
  switch (riskLevel.toLowerCase()) {
    case 'extreme':
      return theme.error;
    case 'high':
      return '#FF4500'; // Orange Red
    case 'moderate':
      return theme.warning;
    case 'low':
      return theme.success;
    default:
      return theme.primary;
  }
};

/**
 * Format a timestamp to a readable date string
 * @param {string|number|Date} timestamp - The timestamp to format
 * @returns {string} Formatted date string
 */
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown';

  const date = typeof timestamp === 'object' ? timestamp : new Date(timestamp);
  return date.toLocaleString();
};
