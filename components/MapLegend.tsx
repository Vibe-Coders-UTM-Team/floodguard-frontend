import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield, AlertTriangle, MapPin, Bell, Brain } from 'lucide-react-native';

interface MapLegendProps {
  theme: any;
  isVisible: boolean;
  onClose: () => void;
}

const MapLegend: React.FC<MapLegendProps> = ({ theme, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Map Legend</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={[styles.closeButton, { color: theme.primary }]}>Close</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.legendSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Flood Risk Zones</Text>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: `${theme.error}4D` }]} />
          <Text style={[styles.legendText, { color: theme.text }]}>High Risk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: `${theme.warning}4D` }]} />
          <Text style={[styles.legendText, { color: theme.text }]}>Moderate Risk</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.colorBox, { backgroundColor: `${theme.success}4D` }]} />
          <Text style={[styles.legendText, { color: theme.text }]}>Low Risk</Text>
        </View>
      </View>

      <View style={styles.legendSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Markers</Text>
        <View style={styles.legendItem}>
          <Shield color={theme.primary} size={20} />
          <Text style={[styles.legendText, { color: theme.text }]}>Emergency Shelter</Text>
        </View>
        <View style={styles.legendItem}>
          <AlertTriangle color={theme.error} size={20} />
          <Text style={[styles.legendText, { color: theme.text }]}>Reported Incident</Text>
        </View>
        <View style={styles.legendItem}>
          <MapPin color={theme.primary} size={20} />
          <Text style={[styles.legendText, { color: theme.text }]}>Your Location</Text>
        </View>
      </View>

      <View style={styles.legendSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Alerts & Reports</Text>
        <View style={styles.legendItem}>
          <Bell color={theme.error} size={20} />
          <Text style={[styles.legendText, { color: theme.text }]}>Critical Alert</Text>
        </View>
        <View style={styles.legendItem}>
          <Bell color={theme.warning} size={20} />
          <Text style={[styles.legendText, { color: theme.text }]}>Moderate Alert</Text>
        </View>
        <View style={styles.legendItem}>
          <Brain color={theme.primary} size={20} />
          <Text style={[styles.legendText, { color: theme.text }]}>AI Risk Report</Text>
        </View>
      </View>

      <Text style={[styles.note, { color: theme.secondary }]}>
        Tap on any marker or zone for more information
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '500',
  },
  legendSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    marginLeft: 8,
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default MapLegend;
