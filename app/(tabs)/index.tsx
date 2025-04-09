import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Cloud,
  Droplets,
  Phone,
  TriangleAlert as AlertTriangle,
  MapPin,
  Bell,
  ChevronRight,
  BookOpen,
  Languages,
  Shield,
  ArrowUpRight,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import WeatherHeader from '@/components/WeatherHeader';

const EMERGENCY_NUMBERS = [
  { id: '1', name: 'Emergency Hotline', number: '911', type: 'emergency' },
  { id: '2', name: 'Flood Control', number: '555-0123', type: 'flood' },
  { id: '3', name: 'Medical Response', number: '555-0789', type: 'medical' },
];

const RECENT_REPORTS = [
  {
    id: '1',
    type: 'flood',
    location: 'Downtown Area',
    description: 'Street flooding reported',
    time: '10 mins ago',
    severity: 'high',
  },
  {
    id: '2',
    type: 'warning',
    location: 'Riverside District',
    description: 'Rising water levels',
    time: '25 mins ago',
    severity: 'moderate',
  },
];

const SAFETY_TIPS = [
  {
    id: '1',
    title: 'Before a Flood',
    tips: [
      'Prepare emergency kit',
      'Know evacuation routes',
      'Keep important documents safe',
    ],
  },
  {
    id: '2',
    title: 'During a Flood',
    tips: [
      'Move to higher ground',
      'Avoid walking in water',
      'Follow official instructions',
    ],
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showAllTips, setShowAllTips] = useState(false);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ms', name: 'Bahasa Malaysia' },
    { code: 'zh', name: '中文' },
    { code: 'ta', name: 'தமிழ்' },
  ];

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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
    >
      {/* User Greeting */}
      <View style={[styles.greetingContainer, { backgroundColor: theme.primary }]}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
      </View>

      <WeatherHeader
        theme={theme}
        selectedLanguage={selectedLanguage}
        languages={languages}
        onLanguageSelect={setSelectedLanguage}
      />

      {/* Risk Level Indicator */}
      <View style={[styles.riskContainer, { backgroundColor: theme.card }]}>
        <View style={styles.riskHeader}>
          <Text style={[styles.riskTitle, { color: theme.text }]}>Current Flood Risk Level</Text>
          <TouchableOpacity
            style={[styles.notificationButton, { backgroundColor: `${theme.primary}20` }]}
            onPress={() => router.push('/alerts')}
          >
            <Bell size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <View style={[styles.riskIndicator, { backgroundColor: `${theme.warning}20` }]}>
          <AlertTriangle color={theme.warning} size={24} />
          <View style={styles.riskInfo}>
            <Text style={[styles.riskLevel, { color: theme.warning }]}>MODERATE RISK</Text>
            <Text style={[styles.riskDescription, { color: theme.secondary }]}>
              Increased chance of flooding in low-lying areas
            </Text>
          </View>
          <ArrowUpRight color={theme.warning} size={24} />
        </View>
      </View>

      {/* Quick Actions Grid */}
      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.card }]}
          onPress={() => router.push('/report')}
        >
          <AlertTriangle color={theme.error} size={24} />
          <Text style={[styles.actionText, { color: theme.text }]}>Report Flooding</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.card }]}
          onPress={() => router.push('/map')}
        >
          <MapPin color={theme.primary} size={24} />
          <Text style={[styles.actionText, { color: theme.text }]}>View Map</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.card }]}
          onPress={() => router.push('/evacuation')}
        >
          <Shield color={theme.success} size={24} />
          <Text style={[styles.actionText, { color: theme.text }]}>Evacuation</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: theme.card }]}
          onPress={() => router.push('/ai-reports')}
        >
          <BookOpen color={theme.warning} size={24} />
          <Text style={[styles.actionText, { color: theme.text }]}>AI Reports</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Community Reports */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Reports</Text>
          <TouchableOpacity onPress={() => router.push('/report')}>
            <Text style={[styles.sectionLink, { color: theme.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        {RECENT_REPORTS.map((report) => (
          <TouchableOpacity
            key={report.id}
            style={[styles.reportCard, { backgroundColor: theme.card }]}
            onPress={() => router.push('/report')}
          >
            <View style={styles.reportHeader}>
              <AlertTriangle color={getSeverityColor(report.severity)} size={20} />
              <View style={styles.reportInfo}>
                <Text style={[styles.reportLocation, { color: theme.text }]}>{report.location}</Text>
                <Text style={[styles.reportTime, { color: theme.secondary }]}>{report.time}</Text>
              </View>
              <ChevronRight color={theme.secondary} size={20} />
            </View>
            <Text style={[styles.reportDescription, { color: theme.secondary }]}>
              {report.description}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Emergency Contacts */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Emergency Contacts</Text>
        {EMERGENCY_NUMBERS.map((contact) => (
          <TouchableOpacity
            key={contact.id}
            style={[styles.contactCard, { backgroundColor: theme.card }]}
          >
            <View style={[
              styles.contactIcon,
              { backgroundColor: contact.type === 'emergency' ? `${theme.error}20` : `${theme.primary}20` }
            ]}>
              <Phone
                size={20}
                color={contact.type === 'emergency' ? theme.error : theme.primary}
              />
            </View>
            <View style={styles.contactInfo}>
              <Text style={[styles.contactName, { color: theme.text }]}>{contact.name}</Text>
              <Text style={[styles.contactNumber, { color: theme.primary }]}>{contact.number}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.callButton,
                {
                  backgroundColor:
                    contact.type === 'emergency' ? theme.error : theme.primary,
                },
              ]}
            >
              <Text style={styles.callButtonText}>Call Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>

      {/* Safety Tips */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Safety Tips</Text>
          <TouchableOpacity onPress={() => setShowAllTips(!showAllTips)}>
            <Text style={[styles.sectionLink, { color: theme.primary }]}>
              {showAllTips ? 'Show Less' : 'Show All'}
            </Text>
          </TouchableOpacity>
        </View>
        {SAFETY_TIPS.map((category) => (
          <View
            key={category.id}
            style={[styles.tipsCard, { backgroundColor: theme.card }]}
          >
            <Text style={[styles.tipsTitle, { color: theme.text }]}>{category.title}</Text>
            {category.tips.slice(0, showAllTips ? undefined : 2).map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Shield size={16} color={theme.primary} />
                <Text style={[styles.tipText, { color: theme.secondary }]}>{tip}</Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greetingContainer: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '600',
    color: 'white',
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: 'white',
    marginTop: 4,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  languageSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
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
  weatherInfo: {
    alignItems: 'center',
  },
  temperature: {
    color: 'white',
    fontSize: 48,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  weatherDetails: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 10,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  weatherDetailBorder: {
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
  },
  weatherText: {
    color: 'white',
    marginLeft: 8,
    fontSize: 14,
  },
  riskContainer: {
    margin: 20,
    padding: 16,
    borderRadius: 16,
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
  riskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 12,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  riskInfo: {
    flex: 1,
    marginLeft: 12,
  },
  riskLevel: {
    fontSize: 14,
    fontWeight: '600',
  },
  riskDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  actionButton: {
    width: (Dimensions.get('window').width - 56) / 2,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  actionText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: '500',
  },
  reportCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportInfo: {
    flex: 1,
    marginLeft: 12,
  },
  reportLocation: {
    fontSize: 16,
    fontWeight: '600',
  },
  reportTime: {
    fontSize: 12,
    marginTop: 2,
  },
  reportDescription: {
    fontSize: 14,
    marginTop: 8,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '500',
  },
  contactNumber: {
    fontSize: 14,
    marginTop: 2,
  },
  callButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  callButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tipsCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipText: {
    marginLeft: 8,
    fontSize: 14,
  },
});