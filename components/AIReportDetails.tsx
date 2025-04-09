import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { X, MapPin, Clock, AlertTriangle, Navigation, Brain, BarChart } from 'lucide-react-native';
import { getAddressFromCoordinates } from '@/services/mapService';
import { getRiskLevelColor, formatTimestamp } from '@/services/alertsService';

interface AIReportDetailsProps {
  report: any;
  theme: any;
  onClose: () => void;
  onNavigate?: (latitude: number, longitude: number) => void;
}

const AIReportDetails: React.FC<AIReportDetailsProps> = ({ 
  report, 
  theme, 
  onClose,
  onNavigate 
}) => {
  const [address, setAddress] = React.useState(report?.location || 'Loading address...');
  
  React.useEffect(() => {
    const fetchAddress = async () => {
      if (report && report.latitude && report.longitude) {
        const addr = await getAddressFromCoordinates(
          report.latitude,
          report.longitude
        );
        if (addr && addr !== 'Unknown location') {
          setAddress(addr);
        }
      }
    };
    
    if (!report?.location) {
      fetchAddress();
    }
  }, [report]);
  
  if (!report) return null;
  
  const handleNavigate = () => {
    if (onNavigate && report.latitude && report.longitude) {
      onNavigate(report.latitude, report.longitude);
    }
  };
  
  const riskColor = getRiskLevelColor(report.riskLevel, theme);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Brain color={theme.primary} size={24} />
          <Text style={[styles.title, { color: theme.text }]}>
            {report.title}
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
            Generated: {formatTimestamp(report.timestamp || report.createdAt)}
          </Text>
        </View>
        
        <View style={[styles.riskContainer, { backgroundColor: `${riskColor}20` }]}>
          <AlertTriangle color={riskColor} size={20} />
          <Text style={[styles.riskText, { color: riskColor }]}>
            {report.riskLevel.toUpperCase()} RISK LEVEL
          </Text>
        </View>
        
        {report.confidenceScore && (
          <View style={styles.confidenceContainer}>
            <BarChart color={theme.secondary} size={18} />
            <Text style={[styles.confidenceText, { color: theme.text }]}>
              Confidence: {report.confidenceScore}%
            </Text>
          </View>
        )}
        
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Analysis</Text>
          <Text style={[styles.sectionText, { color: theme.text }]}>
            {report.analysis}
          </Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Predicted Impact</Text>
          <Text style={[styles.sectionText, { color: theme.text }]}>
            {report.predictedImpact}
          </Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Expected Duration</Text>
          <Text style={[styles.sectionText, { color: theme.text }]}>
            {report.expectedDuration}
          </Text>
        </View>
        
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommended Actions</Text>
          <View style={[styles.actionsBox, { backgroundColor: theme.background }]}>
            <Text style={[styles.sectionText, { color: theme.text }]}>
              {report.recommendedActions}
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
    maxHeight: '50%',
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
    fontSize: 14,
    fontWeight: '600',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  confidenceText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 14,
    lineHeight: 20,
  },
  actionsBox: {
    padding: 12,
    borderRadius: 8,
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

export default AIReportDetails;
