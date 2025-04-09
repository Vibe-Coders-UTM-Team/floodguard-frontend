import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X, MapPin, Clock, AlertTriangle, Navigation, Info, Bell } from 'lucide-react-native';
import { getAddressFromCoordinates } from '@/services/mapService';
import { getAlertSeverityColor, formatTimestamp } from '@/services/alertsService';

interface AlertDetailsProps {
  alert: any;
  theme: any;
  onClose: () => void;
  onNavigate?: (latitude: number, longitude: number) => void;
}

const AlertDetails: React.FC<AlertDetailsProps> = ({ 
  alert, 
  theme, 
  onClose,
  onNavigate 
}) => {
  const [address, setAddress] = React.useState(alert?.location || 'Loading address...');
  
  React.useEffect(() => {
    const fetchAddress = async () => {
      if (alert && alert.latitude && alert.longitude) {
        const addr = await getAddressFromCoordinates(
          alert.latitude,
          alert.longitude
        );
        if (addr && addr !== 'Unknown location') {
          setAddress(addr);
        }
      }
    };
    
    if (!alert?.location) {
      fetchAddress();
    }
  }, [alert]);
  
  if (!alert) return null;
  
  const handleNavigate = () => {
    if (onNavigate && alert.latitude && alert.longitude) {
      onNavigate(alert.latitude, alert.longitude);
    }
  };
  
  const severityColor = getAlertSeverityColor(alert.severity, theme);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Bell color={severityColor} size={24} />
          <Text style={[styles.title, { color: theme.text }]}>
            {alert.title}
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
            Issued: {formatTimestamp(alert.timestamp || alert.createdAt)}
          </Text>
        </View>
        
        <View style={[styles.severityContainer, { backgroundColor: `${severityColor}20` }]}>
          <AlertTriangle color={severityColor} size={20} />
          <Text style={[styles.severityText, { color: severityColor }]}>
            {alert.severity.toUpperCase()} ALERT - {alert.type.replace('_', ' ').toUpperCase()}
          </Text>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={[styles.descriptionTitle, { color: theme.text }]}>Description</Text>
          <Text style={[styles.descriptionText, { color: theme.text }]}>
            {alert.description}
          </Text>
        </View>
        
        <View style={styles.actionsContainer}>
          <Text style={[styles.actionsTitle, { color: theme.text }]}>Recommended Actions</Text>
          <View style={[styles.actionsBox, { backgroundColor: theme.background }]}>
            <Text style={[styles.actionsText, { color: theme.text }]}>
              {alert.actions}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.navigateButton, { backgroundColor: theme.primary }]}
          onPress={handleNavigate}
        >
          <Navigation color="white" size={18} />
          <Text style={styles.navigateButtonText}>Navigate to Location</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  actionsBox: {
    padding: 12,
    borderRadius: 8,
  },
  actionsText: {
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

export default AlertDetails;
