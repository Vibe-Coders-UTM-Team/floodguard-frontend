import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X, AlertTriangle, Info, Droplets, Navigation } from 'lucide-react-native';

interface FloodZoneDetailsProps {
  zone: any;
  theme: any;
  onClose: () => void;
  onNavigate?: (latitude: number, longitude: number) => void;
}

const FloodZoneDetails: React.FC<FloodZoneDetailsProps> = ({ 
  zone, 
  theme, 
  onClose,
  onNavigate 
}) => {
  if (!zone) return null;
  
  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return theme.error;
      case 'moderate':
        return theme.warning;
      default:
        return theme.success;
    }
  };
  
  const handleNavigate = () => {
    if (onNavigate && zone.coordinates && zone.coordinates.length > 0) {
      // Navigate to the center of the flood zone
      const latitudes = zone.coordinates.map((coord: any) => coord.latitude);
      const longitudes = zone.coordinates.map((coord: any) => coord.longitude);
      
      const centerLat = latitudes.reduce((a: number, b: number) => a + b, 0) / latitudes.length;
      const centerLng = longitudes.reduce((a: number, b: number) => a + b, 0) / longitudes.length;
      
      onNavigate(centerLat, centerLng);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AlertTriangle color={getRiskColor(zone.riskLevel)} size={24} />
          <Text style={[styles.title, { color: theme.text }]}>
            {zone.riskLevel.charAt(0).toUpperCase() + zone.riskLevel.slice(1)} Risk Flood Zone
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X color={theme.secondary} size={20} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={[styles.riskContainer, { backgroundColor: `${getRiskColor(zone.riskLevel)}20` }]}>
          <Droplets color={getRiskColor(zone.riskLevel)} size={20} />
          <Text style={[styles.riskText, { color: getRiskColor(zone.riskLevel) }]}>
            {zone.riskLevel.toUpperCase()} FLOOD RISK
          </Text>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Info color={theme.secondary} size={18} />
          <Text style={[styles.descriptionText, { color: theme.text }]}>
            {zone.description}
          </Text>
        </View>
        
        <View style={styles.recommendationsContainer}>
          <Text style={[styles.recommendationsTitle, { color: theme.text }]}>
            Recommendations
          </Text>
          
          {zone.riskLevel === 'high' && (
            <View style={styles.recommendationsList}>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Evacuate if authorities advise
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Move to higher ground immediately
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Avoid walking or driving through flood waters
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Prepare emergency supplies
                </Text>
              </View>
            </View>
          )}
          
          {zone.riskLevel === 'moderate' && (
            <View style={styles.recommendationsList}>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Stay informed about weather updates
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Prepare for possible evacuation
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Move valuables to higher levels
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Check emergency supplies
                </Text>
              </View>
            </View>
          )}
          
          {zone.riskLevel === 'low' && (
            <View style={styles.recommendationsList}>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Stay informed about weather updates
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Be aware of your surroundings
                </Text>
              </View>
              <View style={styles.recommendationItem}>
                <Text style={[styles.recommendationText, { color: theme.text }]}>
                  • Know your evacuation routes
                </Text>
              </View>
            </View>
          )}
        </View>
        
        <TouchableOpacity 
          style={[styles.navigateButton, { backgroundColor: theme.primary }]}
          onPress={handleNavigate}
        >
          <Navigation color="white" size={18} />
          <Text style={styles.navigateButtonText}>Navigate to Zone</Text>
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 16,
  },
  riskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  riskText: {
    fontSize: 16,
    fontWeight: '600',
  },
  descriptionContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 8,
  },
  descriptionText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  recommendationsContainer: {
    marginBottom: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  recommendationsList: {
    marginLeft: 8,
  },
  recommendationItem: {
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 14,
    lineHeight: 20,
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

export default FloodZoneDetails;
