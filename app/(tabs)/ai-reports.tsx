import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Brain, Languages, Settings, ChevronRight, ChartBar as BarChart3, CloudRain, Waves, Timer, MapPin, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ms', name: 'Bahasa Malaysia' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ta', name: 'Tamil' },
];

const AI_REPORTS = [
  {
    id: '1',
    title: 'Flood Risk Analysis',
    type: 'prediction',
    summary: 'High probability of flooding in low-lying areas within the next 48 hours',
    severity: 'high',
    timestamp: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    details: {
      rainfall: '150mm expected',
      affected_areas: ['Downtown', 'Riverside', 'Harbor District'],
      duration: '48-72 hours',
      recommendations: [
        'Prepare emergency kit',
        'Monitor local news',
        'Review evacuation routes',
      ],
    },
  },
  {
    id: '2',
    title: 'Water Level Trends',
    type: 'analysis',
    summary: 'River levels rising steadily at 2cm per hour',
    severity: 'moderate',
    timestamp: '4 hours ago',
    image: 'https://images.unsplash.com/photo-1535184247325-379595aeb8e6?w=800&q=80',
    details: {
      current_level: '3.2m',
      trend: 'Rising',
      critical_point: '4.5m',
      estimated_time: '18 hours until critical',
    },
  },
  {
    id: '3',
    title: 'Infrastructure Impact',
    type: 'assessment',
    summary: 'Potential impact on transportation and utilities in affected areas',
    severity: 'moderate',
    timestamp: '6 hours ago',
    image: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=800&q=80',
    details: {
      affected_services: ['Public Transport', 'Power Supply', 'Road Access'],
      duration: '24-48 hours',
      alternative_routes: ['Route A', 'Route B'],
    },
  },
];

export default function AIReportsScreen() {
  const { theme } = useTheme();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [expandedReport, setExpandedReport] = useState<string | null>(null);

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

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'prediction':
        return <Brain size={24} color={theme.primary} />;
      case 'analysis':
        return <BarChart3 size={24} color={theme.primary} />;
      case 'assessment':
        return <CloudRain size={24} color={theme.primary} />;
      default:
        return <AlertTriangle size={24} color={theme.primary} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <LinearGradient colors={[theme.primary, theme.accent]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI-Generated Reports</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings color="white" size={24} />
          </TouchableOpacity>
        </View>

        {/* Language Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.languageScroll}
        >
          {LANGUAGES.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                { backgroundColor: selectedLanguage === lang.code ? 'white' : 'rgba(255, 255, 255, 0.2)' },
              ]}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <Languages
                size={16}
                color={selectedLanguage === lang.code ? theme.primary : 'white'}
              />
              <Text
                style={[
                  styles.languageButtonText,
                  { color: selectedLanguage === lang.code ? theme.primary : 'white' },
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </LinearGradient>

      <ScrollView style={styles.content}>
        {/* AI Reports */}
        {AI_REPORTS.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={[styles.reportCard, { backgroundColor: theme.card }]}
            onPress={() => setExpandedReport(
              expandedReport === report.id ? null : report.id
            )}
          >
            <Image source={{ uri: report.image }} style={styles.reportImage} />
            <View style={styles.reportContent}>
              <View style={styles.reportHeader}>
                {getReportIcon(report.type)}
                <View style={styles.reportTitleContainer}>
                  <Text style={[styles.reportTitle, { color: theme.text }]}>{report.title}</Text>
                  <Text style={[styles.reportTime, { color: theme.secondary }]}>{report.timestamp}</Text>
                </View>
                <ChevronRight color={theme.secondary} size={20} />
              </View>

              <Text style={[styles.reportSummary, { color: theme.text }]}>{report.summary}</Text>

              <View style={[styles.severityIndicator, { borderTopColor: theme.border }]}>
                <AlertTriangle
                  size={16}
                  color={getSeverityColor(report.severity)}
                />
                <Text
                  style={[
                    styles.severityText,
                    { color: getSeverityColor(report.severity) },
                  ]}
                >
                  {report.severity.toUpperCase()} SEVERITY
                </Text>
              </View>

              {expandedReport === report.id && (
                <View style={[styles.expandedContent, { borderTopColor: theme.border }]}>
                  {report.details.rainfall && (
                    <View style={styles.detailItem}>
                      <CloudRain size={16} color={theme.secondary} />
                      <Text style={[styles.detailText, { color: theme.text }]}>{report.details.rainfall}</Text>
                    </View>
                  )}

                  {report.details.affected_areas && (
                    <View style={styles.detailItem}>
                      <MapPin size={16} color={theme.secondary} />
                      <Text style={[styles.detailText, { color: theme.text }]}>
                        Affected Areas: {report.details.affected_areas.join(', ')}
                      </Text>
                    </View>
                  )}

                  {report.details.duration && (
                    <View style={styles.detailItem}>
                      <Timer size={16} color={theme.secondary} />
                      <Text style={[styles.detailText, { color: theme.text }]}>
                        Duration: {report.details.duration}
                      </Text>
                    </View>
                  )}

                  {report.details.recommendations && (
                    <View style={styles.recommendations}>
                      <Text style={[styles.recommendationsTitle, { color: theme.text }]}>
                        Recommended Actions:
                      </Text>
                      {report.details.recommendations.map((rec, index) => (
                        <View key={index} style={styles.recommendationItem}>
                          <AlertTriangle size={14} color={theme.primary} />
                          <Text style={[styles.recommendationText, { color: theme.text }]}>{rec}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
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
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  settingsButton: {
    padding: 8,
  },
  languageScroll: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  languageButtonText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  reportCard: {
    borderRadius: 16,
    marginBottom: 16,
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
  reportImage: {
    width: '100%',
    height: 160,
  },
  reportContent: {
    padding: 16,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  reportTime: {
    fontSize: 14,
    marginTop: 2,
  },
  reportSummary: {
    fontSize: 16,
    marginTop: 12,
    lineHeight: 24,
  },
  severityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  severityText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  expandedContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
  },
  recommendations: {
    marginTop: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  recommendationText: {
    marginLeft: 8,
    fontSize: 14,
  },
});