import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X, MapPin, Phone, Users, Navigation, CheckCircle } from 'lucide-react-native';
import { getAddressFromCoordinates } from '@/services/mapService';

interface ShelterDetailsProps {
  shelter: any;
  theme: any;
  onClose: () => void;
  onNavigate?: (latitude: number, longitude: number) => void;
}

const ShelterDetails: React.FC<ShelterDetailsProps> = ({ 
  shelter, 
  theme, 
  onClose,
  onNavigate 
}) => {
  const [address, setAddress] = React.useState('');
  
  React.useEffect(() => {
    const fetchAddress = async () => {
      if (shelter && shelter.coordinate) {
        const addr = await getAddressFromCoordinates(
          shelter.coordinate.latitude,
          shelter.coordinate.longitude
        );
        setAddress(addr);
      }
    };
    
    fetchAddress();
  }, [shelter]);
  
  if (!shelter) return null;
  
  const handleNavigate = () => {
    if (onNavigate && shelter.coordinate) {
      onNavigate(shelter.coordinate.latitude, shelter.coordinate.longitude);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{shelter.name}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X color={theme.secondary} size={20} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.infoRow}>
          <MapPin color={theme.secondary} size={18} />
          <Text style={[styles.infoText, { color: theme.text }]}>
            {shelter.address || address}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Phone color={theme.secondary} size={18} />
          <Text style={[styles.infoText, { color: theme.text }]}>
            {shelter.contact}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Users color={theme.secondary} size={18} />
          <Text style={[styles.infoText, { color: theme.text }]}>
            Capacity: {shelter.capacity} people
          </Text>
        </View>
        
        <View style={styles.amenitiesContainer}>
          <Text style={[styles.amenitiesTitle, { color: theme.text }]}>
            Available Amenities
          </Text>
          <View style={styles.amenitiesList}>
            {shelter.amenities.map((amenity: string, index: number) => (
              <View key={index} style={styles.amenityItem}>
                <CheckCircle color={theme.success} size={16} />
                <Text style={[styles.amenityText, { color: theme.text }]}>
                  {amenity}
                </Text>
              </View>
            ))}
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.navigateButton, { backgroundColor: theme.primary }]}
          onPress={handleNavigate}
        >
          <Navigation color="white" size={18} />
          <Text style={styles.navigateButtonText}>Navigate to Shelter</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: '40%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  amenitiesContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  amenitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  amenityText: {
    fontSize: 14,
    marginLeft: 4,
  },
  navigateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  navigateButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default ShelterDetails;
