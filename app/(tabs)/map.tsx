import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, Alert, Linking } from 'react-native';
import MapView, { Marker, Polygon, Callout, PROVIDER_GOOGLE, Circle } from 'react-native-maps';
import { MapPin, Chrome as Home, TriangleAlert as AlertTriangle, Shield, HelpCircle, Navigation, Layers, Info, Bell, Brain } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import {
  getCurrentLocation,
  getFloodZones,
  getShelters,
  getIncidents,
  DEFAULT_LOCATION
} from '@/services/mapService';
import MapSearchBar from '@/components/MapSearchBar';
import MapLegend from '@/components/MapLegend';
import ShelterDetails from '@/components/ShelterDetails';
import IncidentDetails from '@/components/IncidentDetails';
import FloodZoneDetails from '@/components/FloodZoneDetails';
import AlertDetails from '@/components/AlertDetails';
import AIReportDetails from '@/components/AIReportDetails';
import { getAllAlerts, getAllAIReports, getAlertSeverityColor, getRiskLevelColor } from '@/services/alertsService';

// Map data will be loaded dynamically from services

type MapLayer = 'flood-zones' | 'shelters' | 'incidents' | 'user-location' | 'alerts' | 'ai-reports';

export default function MapScreen() {
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);
  const [selectedLayers, setSelectedLayers] = useState<MapLayer[]>(['flood-zones', 'shelters', 'incidents', 'user-location', 'alerts', 'ai-reports']);
  const [mapError, setMapError] = useState(false);
  const [region, setRegion] = useState(DEFAULT_LOCATION);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [floodZones, setFloodZones] = useState<any[]>([]);
  const [shelters, setShelters] = useState<any[]>([]);
  const [incidents, setIncidents] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [aiReports, setAIReports] = useState<any[]>([]);
  const [selectedShelter, setSelectedShelter] = useState<any>(null);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [selectedZone, setSelectedZone] = useState<any>(null);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [selectedAIReport, setSelectedAIReport] = useState<any>(null);
  const [showLegend, setShowLegend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Check if we're on iOS and show a warning about Google Maps setup
  useEffect(() => {
    if (Platform.OS === 'ios') {
      // This is just a warning for development - in production you would properly set up Google Maps
      setMapError(true);
    }
  }, []);

  // Get user's current location and load map data
  useEffect(() => {
    const loadLocationAndData = async () => {
      try {
        // Get user's current location
        const location = await getCurrentLocation();
        setRegion(location);
        setUserLocation(location);

        // Load map data based on location
        loadMapData(location.latitude, location.longitude);
      } catch (error) {
        console.error('Error loading location:', error);
        // Load map data with default location if user location fails
        loadMapData(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
      }
    };

    loadLocationAndData();
  }, []);

  // Load map data (flood zones, shelters, incidents, alerts, AI reports)
  const loadMapData = async (latitude: number, longitude: number) => {
    setIsLoading(true);
    try {
      // Get flood zones
      const zones = getFloodZones(latitude, longitude);
      setFloodZones(zones);

      // Get shelters
      const shelterData = getShelters(latitude, longitude);
      setShelters(shelterData);

      // Get incidents
      const incidentData = getIncidents(latitude, longitude);
      setIncidents(incidentData);

      // Get alerts from API
      const alertsData = await getAllAlerts();
      setAlerts(alertsData);

      // Get AI reports from API
      const aiReportsData = await getAllAIReports();
      setAIReports(aiReportsData);
    } catch (error) {
      console.error('Error loading map data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle location selection from search
  const handleLocationSelected = async (location: any) => {
    if (!location) {
      // Use current location
      try {
        const currentLocation = await getCurrentLocation();
        setRegion(currentLocation);
        setUserLocation(currentLocation);
        mapRef.current?.animateToRegion(currentLocation, 1000);
        loadMapData(currentLocation.latitude, currentLocation.longitude);
      } catch (error) {
        console.error('Error getting current location:', error);
      }
      return;
    }

    // Use selected location
    setRegion(location);
    mapRef.current?.animateToRegion(location, 1000);
    loadMapData(location.latitude, location.longitude);
  };

  // Handle navigation to a location
  const handleNavigate = (latitude: number, longitude: number) => {
    const url = Platform.select({
      ios: `maps:?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });

    if (url) {
      Linking.canOpenURL(url)
        .then((supported) => {
          if (supported) {
            return Linking.openURL(url);
          } else {
            Alert.alert(
              'Navigation Error',
              'Could not open maps application. Please make sure you have a maps app installed.',
              [{ text: 'OK' }]
            );
          }
        })
        .catch((error) => {
          console.error('Error opening maps:', error);
        });
    }
  };

  const toggleLayer = (layer: MapLayer) => {
    setSelectedLayers(prev =>
      prev.includes(layer)
        ? prev.filter(l => l !== layer)
        : [...prev, layer]
    );
  };

  // Get color for flood zone based on risk level
  const getZoneColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return `${theme.error}4D`; // 30% opacity
      case 'moderate':
        return `${theme.warning}4D`;
      case 'low':
        return `${theme.success}4D`;
      default:
        return `${theme.primary}4D`;
    }
  };

  // Get color for incident marker based on severity
  const getIncidentColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return theme.error;
      case 'moderate':
        return theme.warning;
      default:
        return theme.success;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {mapError ? (
        <View style={styles.errorContainer}>
          <AlertTriangle color={theme.error} size={48} />
          <Text style={[styles.errorTitle, { color: theme.text }]}>Map Configuration Required</Text>
          <Text style={[styles.errorMessage, { color: theme.secondary }]}>
            Google Maps for iOS requires additional setup. We've switched to Apple Maps for now.
            See the GOOGLE_MAPS_IOS_SETUP.md file for complete setup instructions.
          </Text>
          <View style={styles.errorButtonsContainer}>
            <TouchableOpacity
              style={[styles.errorButton, { backgroundColor: theme.primary }]}
              onPress={() => setMapError(false)}
            >
              <Text style={styles.errorButtonText}>Continue with Apple Maps</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <MapSearchBar
            onLocationSelected={handleLocationSelected}
            theme={theme}
          />

          <MapView
            ref={mapRef}
            provider={null} // Use Apple Maps instead of Google Maps
            style={styles.map}
            initialRegion={region}
            showsUserLocation={selectedLayers.includes('user-location')}
            showsMyLocationButton={true}
            showsCompass={true}
            showsScale={true}
          >
            {/* Flood Risk Zones */}
            {selectedLayers.includes('flood-zones') && floodZones.map(zone => (
              <Polygon
                key={zone.id}
                coordinates={zone.coordinates}
                fillColor={getZoneColor(zone.riskLevel)}
                strokeColor={getZoneColor(zone.riskLevel).replace('4D', '80')}
                strokeWidth={2}
                tappable={true}
                onPress={() => setSelectedZone(zone)}
              />
            ))}

            {/* Shelters */}
            {selectedLayers.includes('shelters') && shelters.map(shelter => (
              <Marker
                key={shelter.id}
                coordinate={shelter.coordinate}
                title={shelter.name}
                onPress={() => {
                  setSelectedShelter(shelter);
                  setSelectedIncident(null);
                  setSelectedZone(null);
                }}
              >
                <View style={styles.markerContainer}>
                  <Shield color={theme.primary} size={24} />
                </View>
              </Marker>
            ))}

            {/* Incidents */}
            {selectedLayers.includes('incidents') && incidents.map(incident => (
              <Marker
                key={incident.id}
                coordinate={incident.coordinate}
                title={incident.description}
                onPress={() => {
                  setSelectedIncident(incident);
                  setSelectedShelter(null);
                  setSelectedZone(null);
                }}
              >
                <View style={styles.markerContainer}>
                  <AlertTriangle color={getIncidentColor(incident.severity)} size={24} />
                </View>
              </Marker>
            ))}

            {/* User Location Marker (custom) */}
            {selectedLayers.includes('user-location') && userLocation && (
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Your Location"
              >
                <View style={styles.userLocationMarker}>
                  <View style={[styles.userLocationDot, { backgroundColor: theme.primary }]} />
                </View>
                <Circle
                  center={{
                    latitude: userLocation.latitude,
                    longitude: userLocation.longitude,
                  }}
                  radius={100}
                  fillColor={`${theme.primary}20`}
                  strokeColor={theme.primary}
                  strokeWidth={1}
                />
              </Marker>
            )}

            {/* Alerts */}
            {selectedLayers.includes('alerts') && alerts && alerts.map(alert => (
              <Marker
                key={`alert-${alert.id}`}
                coordinate={{
                  latitude: alert.latitude,
                  longitude: alert.longitude,
                }}
                title={alert.title}
                onPress={() => {
                  setSelectedAlert(alert);
                  setSelectedAIReport(null);
                  setSelectedShelter(null);
                  setSelectedIncident(null);
                  setSelectedZone(null);
                }}
              >
                <View style={styles.markerContainer}>
                  <Bell color={getAlertSeverityColor(alert.severity, theme)} size={24} />
                </View>
              </Marker>
            ))}

            {/* AI Reports */}
            {selectedLayers.includes('ai-reports') && aiReports && aiReports.map(report => (
              <Marker
                key={`report-${report.id}`}
                coordinate={{
                  latitude: report.latitude,
                  longitude: report.longitude,
                }}
                title={report.title}
                onPress={() => {
                  setSelectedAIReport(report);
                  setSelectedAlert(null);
                  setSelectedShelter(null);
                  setSelectedIncident(null);
                  setSelectedZone(null);
                }}
              >
                <View style={styles.markerContainer}>
                  <Brain color={getRiskLevelColor(report.riskLevel, theme)} size={24} />
                </View>
              </Marker>
            ))}
          </MapView>

          {/* Layer Controls */}
          <View style={styles.layerControls}>
            <LinearGradient
              colors={[`${theme.card}E6`, `${theme.card}F2`]} // 90% and 95% opacity
              style={styles.controlsContainer}
            >
              <TouchableOpacity
                style={[
                  styles.layerButton,
                  { backgroundColor: theme.isDarkMode ? theme.background : '#f3f4f6' },
                  selectedLayers.includes('flood-zones') && styles.layerButtonActive
                ]}
                onPress={() => toggleLayer('flood-zones')}
              >
                <MapPin color={selectedLayers.includes('flood-zones') ? theme.primary : theme.secondary} size={20} />
                <Text style={[
                  styles.layerButtonText,
                  { color: selectedLayers.includes('flood-zones') ? theme.primary : theme.secondary }
                ]}>Flood Zones</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.layerButton,
                  { backgroundColor: theme.isDarkMode ? theme.background : '#f3f4f6' },
                  selectedLayers.includes('shelters') && styles.layerButtonActive
                ]}
                onPress={() => toggleLayer('shelters')}
              >
                <Shield color={selectedLayers.includes('shelters') ? theme.primary : theme.secondary} size={20} />
                <Text style={[
                  styles.layerButtonText,
                  { color: selectedLayers.includes('shelters') ? theme.primary : theme.secondary }
                ]}>Shelters</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.layerButton,
                  { backgroundColor: theme.isDarkMode ? theme.background : '#f3f4f6' },
                  selectedLayers.includes('incidents') && styles.layerButtonActive
                ]}
                onPress={() => toggleLayer('incidents')}
              >
                <AlertTriangle color={selectedLayers.includes('incidents') ? theme.primary : theme.secondary} size={20} />
                <Text style={[
                  styles.layerButtonText,
                  { color: selectedLayers.includes('incidents') ? theme.primary : theme.secondary }
                ]}>Incidents</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.layerButton,
                  { backgroundColor: theme.isDarkMode ? theme.background : '#f3f4f6' },
                  selectedLayers.includes('user-location') && styles.layerButtonActive
                ]}
                onPress={() => toggleLayer('user-location')}
              >
                <MapPin color={selectedLayers.includes('user-location') ? theme.primary : theme.secondary} size={20} />
                <Text style={[
                  styles.layerButtonText,
                  { color: selectedLayers.includes('user-location') ? theme.primary : theme.secondary }
                ]}>My Location</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.layerButton,
                  { backgroundColor: theme.isDarkMode ? theme.background : '#f3f4f6' },
                  selectedLayers.includes('alerts') && styles.layerButtonActive
                ]}
                onPress={() => toggleLayer('alerts')}
              >
                <Bell color={selectedLayers.includes('alerts') ? theme.primary : theme.secondary} size={20} />
                <Text style={[
                  styles.layerButtonText,
                  { color: selectedLayers.includes('alerts') ? theme.primary : theme.secondary }
                ]}>Alerts</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.layerButton,
                  { backgroundColor: theme.isDarkMode ? theme.background : '#f3f4f6' },
                  selectedLayers.includes('ai-reports') && styles.layerButtonActive
                ]}
                onPress={() => toggleLayer('ai-reports')}
              >
                <Brain color={selectedLayers.includes('ai-reports') ? theme.primary : theme.secondary} size={20} />
                <Text style={[
                  styles.layerButtonText,
                  { color: selectedLayers.includes('ai-reports') ? theme.primary : theme.secondary }
                ]}>AI Reports</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>

          {/* Legend Button */}
          <TouchableOpacity
            style={[styles.legendButton, { backgroundColor: theme.primary }]}
            onPress={() => setShowLegend(!showLegend)}
          >
            <HelpCircle color="white" size={24} />
          </TouchableOpacity>

          {/* Map Legend */}
          <MapLegend
            theme={theme}
            isVisible={showLegend}
            onClose={() => setShowLegend(false)}
          />

          {/* Shelter Details */}
          <ShelterDetails
            shelter={selectedShelter}
            theme={theme}
            onClose={() => setSelectedShelter(null)}
            onNavigate={handleNavigate}
          />

          {/* Incident Details */}
          <IncidentDetails
            incident={selectedIncident}
            theme={theme}
            onClose={() => setSelectedIncident(null)}
            onNavigate={handleNavigate}
          />

          {/* Flood Zone Details */}
          <FloodZoneDetails
            zone={selectedZone}
            theme={theme}
            onClose={() => setSelectedZone(null)}
            onNavigate={handleNavigate}
          />

          {/* Alert Details */}
          <AlertDetails
            alert={selectedAlert}
            theme={theme}
            onClose={() => setSelectedAlert(null)}
            onNavigate={handleNavigate}
          />

          {/* AI Report Details */}
          <AIReportDetails
            report={selectedAIReport}
            theme={theme}
            onClose={() => setSelectedAIReport(null)}
            onNavigate={handleNavigate}
          />

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <View style={[styles.loadingBox, { backgroundColor: theme.card }]}>
                <Text style={[styles.loadingText, { color: theme.text }]}>Loading map data...</Text>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
}

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#242f3e' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#746855' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#242f3e' }],
  },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  layerControls: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  layerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  layerButtonActive: {
    backgroundColor: '#e0f2fe',
  },
  layerButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  callout: {
    padding: 10,
    minWidth: 150,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  calloutSubtitle: {
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  errorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    gap: 12,
  },
  errorButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  errorButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  userLocationMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  userLocationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingBox: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
  },
});