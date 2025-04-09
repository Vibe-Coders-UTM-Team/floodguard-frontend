import * as Location from 'expo-location';

/**
 * Get the current location of the device
 * @returns {Promise<Object>} Location object with latitude and longitude
 */
export const getCurrentLocation = async () => {
  try {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Location permission not granted');
    }
    
    // Get current location
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting location:', error);
    throw error;
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
