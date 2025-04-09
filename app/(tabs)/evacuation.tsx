import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Navigation, MapPin, Clock, Car, TriangleAlert as AlertTriangle, ChevronRight, ArrowRight, Shield } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

// Mock data remains the same
const EVACUATION_ROUTES = [
  {
    id: '1',
    name: 'Primary Route',
    status: 'recommended',
    description: 'Via Highland Avenue to Emergency Shelter',
    duration: '25 mins',
    distance: '5.2 miles',
    conditions: 'Clear',
    route: [
      'Head north on Highland Ave',
      'Turn right onto Main St',
      'Continue onto Emergency Center Dr',
    ],
    destination: {
      name: 'Central Emergency Shelter',
      address: '1234 Emergency Center Dr',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    },
  },
  {
    id: '2',
    name: 'Alternate Route',
    status: 'alternative',
    description: 'Via Riverside Drive to Community Center',
    duration: '35 mins',
    distance: '7.8 miles',
    conditions: 'Minor flooding on Oak St',
    route: [
      'Head east on Riverside Dr',
      'Turn left onto Oak St',
      'Right on Community Center Ave',
    ],
    destination: {
      name: 'Community Center Shelter',
      address: '5678 Community Center Ave',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80',
    },
  },
];

const NEARBY_SHELTERS = [
  {
    id: '1',
    name: 'Central High School',
    distance: '2.5 miles',
    capacity: 'Available (45%)',
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80',
  },
  {
    id: '2',
    name: 'Community Center',
    distance: '3.8 miles',
    capacity: 'Available (65%)',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  },
];

export default function EvacuationScreen() {
  const { theme } = useTheme();
  const [selectedRoute, setSelectedRoute] = useState<string>('1');

  const openInMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = Platform.select({
      ios: `maps:0,0?q=${encodedAddress}`,
      android: `geo:0,0?q=${encodedAddress}`,
      web: `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`,
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'recommended' ? theme.success : theme.warning;
  };

  const getStatusIcon = (status: string) => {
    return status === 'recommended' ? (
      <Shield color={theme.success} size={24} />
    ) : (
      <AlertTriangle color={theme.warning} size={24} />
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <LinearGradient colors={[theme.primary, theme.accent]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Evacuation Routes</Text>
          <TouchableOpacity style={[styles.emergencyButton, { backgroundColor: theme.error }]}>
            <AlertTriangle color="white" size={20} />
            <Text style={styles.emergencyButtonText}>Emergency</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Route Cards */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Available Routes</Text>
          {EVACUATION_ROUTES.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeCard,
                { backgroundColor: theme.card },
                selectedRoute === route.id && { borderColor: theme.primary },
              ]}
              onPress={() => setSelectedRoute(route.id)}
            >
              <View style={styles.routeHeader}>
                {getStatusIcon(route.status)}
                <View style={styles.routeInfo}>
                  <Text style={[styles.routeName, { color: theme.text }]}>{route.name}</Text>
                  <Text style={[styles.routeDescription, { color: theme.secondary }]}>
                    {route.description}
                  </Text>
                </View>
                <ChevronRight color={theme.secondary} size={20} />
              </View>

              <View style={[styles.routeDetails, { borderTopColor: theme.border }]}>
                <View style={styles.routeDetail}>
                  <Clock size={16} color={theme.secondary} />
                  <Text style={[styles.routeDetailText, { color: theme.secondary }]}>
                    {route.duration}
                  </Text>
                </View>
                <View style={styles.routeDetail}>
                  <Car size={16} color={theme.secondary} />
                  <Text style={[styles.routeDetailText, { color: theme.secondary }]}>
                    {route.distance}
                  </Text>
                </View>
                <View style={styles.routeDetail}>
                  <AlertTriangle size={16} color={theme.secondary} />
                  <Text style={[styles.routeDetailText, { color: theme.secondary }]}>
                    {route.conditions}
                  </Text>
                </View>
              </View>

              {selectedRoute === route.id && (
                <View style={[styles.routeExpanded, { borderTopColor: theme.border }]}>
                  <View style={styles.routeSteps}>
                    {route.route.map((step, index) => (
                      <View key={index} style={styles.routeStep}>
                        <ArrowRight size={16} color={theme.secondary} />
                        <Text style={[styles.routeStepText, { color: theme.text }]}>{step}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={[styles.destinationCard, { backgroundColor: theme.background }]}>
                    <Image
                      source={{ uri: route.destination.image }}
                      style={styles.destinationImage}
                    />
                    <View style={styles.destinationInfo}>
                      <Text style={[styles.destinationName, { color: theme.text }]}>
                        {route.destination.name}
                      </Text>
                      <Text style={[styles.destinationAddress, { color: theme.secondary }]}>
                        {route.destination.address}
                      </Text>
                      <TouchableOpacity
                        style={[styles.navigateButton, { backgroundColor: theme.primary }]}
                        onPress={() => openInMaps(route.destination.address)}
                      >
                        <Navigation size={16} color="white" />
                        <Text style={styles.navigateButtonText}>Start Navigation</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Nearby Shelters */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Nearby Shelters</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.shelterScroll}
          >
            {NEARBY_SHELTERS.map((shelter) => (
              <TouchableOpacity
                key={shelter.id}
                style={[styles.shelterCard, { backgroundColor: theme.card }]}
                onPress={() => openInMaps(shelter.name)}
              >
                <Image
                  source={{ uri: shelter.image }}
                  style={styles.shelterImage}
                />
                <View style={styles.shelterInfo}>
                  <Text style={[styles.shelterName, { color: theme.text }]}>{shelter.name}</Text>
                  <View style={styles.shelterDetails}>
                    <View style={styles.shelterDetail}>
                      <MapPin size={14} color={theme.secondary} />
                      <Text style={[styles.shelterDetailText, { color: theme.secondary }]}>
                        {shelter.distance}
                      </Text>
                    </View>
                    <View style={styles.shelterDetail}>
                      <Shield size={14} color={theme.success} />
                      <Text style={[styles.shelterDetailText, { color: theme.secondary }]}>
                        {shelter.capacity}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  routeCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  routeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
  },
  routeDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  routeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  routeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDetailText: {
    marginLeft: 6,
    fontSize: 14,
  },
  routeExpanded: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  routeSteps: {
    marginBottom: 16,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  routeStepText: {
    marginLeft: 8,
    fontSize: 14,
  },
  destinationCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
  },
  destinationImage: {
    width: 100,
    height: 100,
  },
  destinationInfo: {
    flex: 1,
    padding: 12,
  },
  destinationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  destinationAddress: {
    fontSize: 14,
    marginTop: 2,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  navigateButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  shelterScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  shelterCard: {
    width: 240,
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
    }),
  },
  shelterImage: {
    width: '100%',
    height: 120,
  },
  shelterInfo: {
    padding: 12,
  },
  shelterName: {
    fontSize: 16,
    fontWeight: '600',
  },
  shelterDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  shelterDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shelterDetailText: {
    marginLeft: 4,
    fontSize: 14,
  },
});