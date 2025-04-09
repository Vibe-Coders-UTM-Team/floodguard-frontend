import * as Location from 'expo-location';
import { Alert, Platform } from 'react-native';

// Default location (Kuala Lumpur, Malaysia)
export const DEFAULT_LOCATION = {
  latitude: 3.1390,
  longitude: 101.6869,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

/**
 * Get the current location of the device
 * @returns {Promise<Object>} Location object with latitude and longitude
 */
export const getCurrentLocation = async () => {
  try {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert(
        'Location Permission Denied',
        'Please enable location services to use this feature.',
        [{ text: 'OK' }]
      );
      return DEFAULT_LOCATION;
    }
    
    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    Alert.alert(
      'Location Error',
      'Unable to get your current location. Using default location instead.',
      [{ text: 'OK' }]
    );
    return DEFAULT_LOCATION;
  }
};

/**
 * Get the address from coordinates
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<string>} Address string
 */
export const getAddressFromCoordinates = async (latitude, longitude) => {
  try {
    const response = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    });
    
    if (response.length > 0) {
      const address = response[0];
      return [
        address.street,
        address.district,
        address.city,
        address.region,
      ]
        .filter(Boolean)
        .join(', ');
    }
    
    return 'Unknown location';
  } catch (error) {
    console.error('Error getting address:', error);
    return 'Unknown location';
  }
};

/**
 * Search for a location by name
 * @param {string} searchQuery - The location name to search for
 * @returns {Promise<Array>} Array of location objects
 */
export const searchLocation = async (searchQuery) => {
  try {
    const results = await Location.geocodeAsync(searchQuery);
    return results.map(result => ({
      latitude: result.latitude,
      longitude: result.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }));
  } catch (error) {
    console.error('Error searching location:', error);
    return [];
  }
};

/**
 * Calculate distance between two coordinates in kilometers
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

/**
 * Get flood risk zones based on location
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @returns {Array} Array of flood zone objects
 */
export const getFloodZones = (latitude, longitude) => {
  // This would normally come from an API, but for demo purposes we'll generate some sample data
  // around the provided coordinates
  return [
    {
      id: 1,
      coordinates: [
        { latitude: latitude - 0.01, longitude: longitude - 0.01 },
        { latitude: latitude - 0.01, longitude: longitude + 0.01 },
        { latitude: latitude + 0.01, longitude: longitude + 0.01 },
        { latitude: latitude + 0.01, longitude: longitude - 0.01 },
      ],
      riskLevel: 'high',
      description: 'High risk flood zone - Historical flooding area',
    },
    {
      id: 2,
      coordinates: [
        { latitude: latitude - 0.03, longitude: longitude - 0.02 },
        { latitude: latitude - 0.03, longitude: longitude - 0.01 },
        { latitude: latitude - 0.02, longitude: longitude - 0.01 },
        { latitude: latitude - 0.02, longitude: longitude - 0.02 },
      ],
      riskLevel: 'moderate',
      description: 'Moderate risk flood zone - Potential for flash flooding',
    },
    {
      id: 3,
      coordinates: [
        { latitude: latitude + 0.02, longitude: longitude + 0.02 },
        { latitude: latitude + 0.02, longitude: longitude + 0.04 },
        { latitude: latitude + 0.04, longitude: longitude + 0.04 },
        { latitude: latitude + 0.04, longitude: longitude + 0.02 },
      ],
      riskLevel: 'low',
      description: 'Low risk flood zone - Minor flooding possible during heavy rain',
    },
  ];
};

/**
 * Get nearby shelters based on location
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @returns {Array} Array of shelter objects
 */
export const getShelters = (latitude, longitude) => {
  // This would normally come from an API, but for demo purposes we'll generate some sample data
  return [
    {
      id: 1,
      coordinate: { latitude: latitude + 0.015, longitude: longitude + 0.015 },
      name: 'Central High School',
      address: '123 Main Street',
      capacity: 250,
      amenities: ['Food', 'Water', 'Medical', 'Power'],
      contact: '+123-456-7890',
    },
    {
      id: 2,
      coordinate: { latitude: latitude - 0.02, longitude: longitude + 0.01 },
      name: 'Community Center',
      address: '456 Oak Avenue',
      capacity: 150,
      amenities: ['Food', 'Water', 'Power'],
      contact: '+123-456-7891',
    },
    {
      id: 3,
      coordinate: { latitude: latitude + 0.01, longitude: longitude - 0.025 },
      name: 'Sports Stadium',
      address: '789 Stadium Road',
      capacity: 500,
      amenities: ['Food', 'Water', 'Medical', 'Power', 'Shower'],
      contact: '+123-456-7892',
    },
  ];
};

/**
 * Get reported incidents based on location
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @returns {Array} Array of incident objects
 */
export const getIncidents = (latitude, longitude) => {
  // This would normally come from an API, but for demo purposes we'll generate some sample data
  return [
    {
      id: 1,
      coordinate: { latitude: latitude - 0.005, longitude: longitude + 0.005 },
      description: 'Street Flooding',
      severity: 'high',
      reportedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      status: 'active',
    },
    {
      id: 2,
      coordinate: { latitude: latitude + 0.008, longitude: longitude - 0.003 },
      description: 'Storm Drain Overflow',
      severity: 'moderate',
      reportedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      status: 'active',
    },
    {
      id: 3,
      coordinate: { latitude: latitude - 0.015, longitude: longitude - 0.01 },
      description: 'Road Blocked by Debris',
      severity: 'moderate',
      reportedAt: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
      status: 'active',
    },
    {
      id: 4,
      coordinate: { latitude: latitude + 0.02, longitude: longitude + 0.01 },
      description: 'Power Line Down',
      severity: 'high',
      reportedAt: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
      status: 'active',
    },
  ];
};
