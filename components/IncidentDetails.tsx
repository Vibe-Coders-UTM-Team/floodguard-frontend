import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X, Clock, AlertTriangle, MapPin, Navigation } from 'lucide-react-native';
import { getAddressFromCoordinates } from '@/services/mapService';

interface IncidentDetailsProps {
  incident: any;
  theme: any;
  onClose: () => void;
  onNavigate?: (latitude: number, longitude: number) => void;
}

const IncidentDetails: React.FC<IncidentDetailsProps> = ({ 
  incident, 
  theme, 
  onClose,
  onNavigate 
}) => {
  const [address, setAddress] = React.useState('Loading address...');
  
  React.useEffect(() => {
    const fetchAddress = async () => {
      if (incident && incident.coordinate) {
        const addr = await getAddressFromCoordinates(
          incident.coordinate.latitude,
          incident.coordinate.longitude
        );
        setAddress(addr);
      }
    };
    
    fetchAddress();
  }, [incident]);
  
  if (!incident) return null;
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return theme.error;
      case 'moderate':
        return theme.warning;
      default:
        return theme.success;
    }
  };
  
  const handleNavigate = () => {
    if (onNavigate && incident.coordinate) {
      onNavigate(incident.coordinate.latitude, incident.coordinate.longitude);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <AlertTriangle color={getSeverityColor(incident.severity)} size={24} />
          <Text style={[styles.title, { color: theme.text }]}>
            {incident.description}
          </Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X color={theme.secondary} size={20} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.infoRow}>
          <MapPin color={theme.secondary} size={18} />
          <Text style={[styles.infoText, { color: theme.text }]}>{address}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Clock color={theme.secondary} size={18} />
          <Text style={[styles.infoText, { color: theme.text }]}>
            Reported: {formatDate(incident.reportedAt)}
          </Text>
        </View>
        
        <View style={[styles.severityContainer, { backgroundColor: `${getSeverityColor(incident.severity)}20` }]}>
          <Text style={[styles.severityText, { color: getSeverityColor(incident.severity) }]}>
            {incident.severity.toUpperCase()} SEVERITY
          </Text>
        </View>
        
        <View style={[styles.statusContainer, { 
          backgroundColor: incident.status === 'active' ? `${theme.error}20` : `${theme.success}20` 
        }]}>
          <Text style={[styles.statusText, { 
            color: incident.status === 'active' ? theme.error : theme.success 
          }]}>
            {incident.status === 'active' ? 'ACTIVE INCIDENT' : 'RESOLVED'}
          </Text>
        </View>
        
        <TouchableOpacity 
          style={[styles.navigateButton, { backgroundColor: theme.primary }]}
          onPress={handleNavigate}
        >
          <Navigation color="white" size={18} />
          <Text style={styles.navigateButtonText}>Navigate to Incident</Text>
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
  severityContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 12,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusContainer: {
    padding: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
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

export default IncidentDetails;
