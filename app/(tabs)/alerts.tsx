import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
  Switch,
  Pressable,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  useSharedValue,
  interpolate,
  Extrapolate,
  FadeIn,
  FadeOut,
  SlideInRight,
  Layout,
} from 'react-native-reanimated';
import {
  Bell,
  MapPin,
  Shield,
  Droplet as DropletIcon,
  TriangleAlert as AlertTriangle,
  ChevronRight,
  Settings,
  Share2,
  MessageCircle,
  ThumbsUp,
  ChevronDown,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

const ALERTS = [
  {
    id: '1',
    type: 'warning',
    title: 'Flash Flood Warning',
    description: 'Heavy rainfall expected in your area. Prepare for possible flooding.',
    time: '2 hours ago',
    location: 'Downtown Area',
    image: 'https://images.unsplash.com/photo-1583245177184-4ab53e5e391a?w=800&q=80',
    likes: 24,
    comments: 8,
    shares: 15,
    isLiked: false,
    severity: 'high',
  },
  {
    id: '2',
    type: 'evacuation',
    title: 'Evacuation Notice',
    description: 'Immediate evacuation required for riverside residents.',
    time: '4 hours ago',
    location: 'Riverside District',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993c4ac?w=800&q=80',
    likes: 56,
    comments: 12,
    shares: 42,
    isLiked: true,
    severity: 'critical',
  },
  {
    id: '3',
    type: 'update',
    title: 'Water Level Update',
    description: 'River water levels rising steadily. Monitor situation closely.',
    time: '6 hours ago',
    location: 'Central Region',
    image: 'https://images.unsplash.com/photo-1523772721666-22ad3c3b6f90?w=800&q=80',
    likes: 18,
    comments: 5,
    shares: 9,
    isLiked: false,
    severity: 'moderate',
  },
];

const NOTIFICATION_PREFERENCES = [
  {
    id: '1',
    title: 'Flood Warnings',
    description: 'Receive alerts about potential flooding in your area',
    icon: DropletIcon,
    enabled: true,
  },
  {
    id: '2',
    title: 'Evacuation Notices',
    description: 'Get immediate notifications about evacuation orders',
    icon: Shield,
    enabled: true,
  },
  {
    id: '3',
    title: 'Weather Updates',
    description: 'Daily updates about weather conditions',
    icon: AlertTriangle,
    enabled: false,
  },
];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export default function AlertsScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('current');
  const [preferences, setPreferences] = useState(NOTIFICATION_PREFERENCES);
  const [alerts, setAlerts] = useState(ALERTS);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  const togglePreference = (id: string) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleLike = (alertId: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId
          ? {
              ...alert,
              likes: alert.isLiked ? alert.likes - 1 : alert.likes + 1,
              isLiked: !alert.isLiked,
            }
          : alert
      )
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return theme.error;
      case 'high':
        return theme.warning;
      case 'moderate':
        return theme.success;
      default:
        return theme.secondary;
    }
  };

  const AlertCard = ({ alert, index }: { alert: typeof ALERTS[0]; index: number }) => {
    const scale = useSharedValue(1);
    const isExpanded = expandedAlert === alert.id;

    const cardStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
      scale.value = withSpring(0.98);
    };

    const onPressOut = () => {
      scale.value = withSpring(1);
    };

    const toggleExpand = () => {
      setExpandedAlert(isExpanded ? null : alert.id);
    };

    const getAlertIcon = (type: string) => {
      switch (type) {
        case 'warning':
          return <AlertTriangle color={theme.error} size={24} />;
        case 'evacuation':
          return <Shield color={theme.primary} size={24} />;
        default:
          return <Bell color={theme.success} size={24} />;
      }
    };

    return (
      <AnimatedPressable
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={toggleExpand}
        style={[styles.alertCard, { backgroundColor: theme.card }]}
        entering={FadeIn.delay(index * 100).springify()}
        layout={Layout.springify()}
      >
        <View style={styles.severityIndicator}>
          <LinearGradient
            colors={[getSeverityColor(alert.severity), `${getSeverityColor(alert.severity)}00`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.severityGradient}
          />
        </View>
        <Animated.View style={cardStyle}>
          <Image source={{ uri: alert.image }} style={styles.alertImage} />
          <View style={styles.alertContent}>
            <View style={styles.alertHeader}>
              {getAlertIcon(alert.type)}
              <View style={styles.alertTitleContainer}>
                <Text style={[styles.alertTitle, { color: theme.text }]}>{alert.title}</Text>
                <Text style={[styles.alertTime, { color: theme.secondary }]}>{alert.time}</Text>
              </View>
              <ChevronDown
                color={theme.secondary}
                size={20}
                style={{
                  transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                }}
              />
            </View>
            <Text style={[styles.alertDescription, { color: theme.text }]}>{alert.description}</Text>
            <View style={styles.locationContainer}>
              <MapPin color={theme.secondary} size={16} />
              <Text style={[styles.locationText, { color: theme.secondary }]}>{alert.location}</Text>
            </View>

            {isExpanded && (
              <Animated.View
                entering={FadeIn.duration(200)}
                exiting={FadeOut.duration(200)}
                style={[styles.socialActions, { borderTopColor: theme.border }]}
              >
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={() => handleLike(alert.id)}
                >
                  <ThumbsUp
                    size={20}
                    color={alert.isLiked ? theme.primary : theme.secondary}
                    fill={alert.isLiked ? theme.primary : 'transparent'}
                  />
                  <Text style={[styles.socialCount, { color: theme.text }]}>{alert.likes}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <MessageCircle size={20} color={theme.secondary} />
                  <Text style={[styles.socialCount, { color: theme.text }]}>{alert.comments}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.socialButton}>
                  <Share2 size={20} color={theme.secondary} />
                  <Text style={[styles.socialCount, { color: theme.text }]}>{alert.shares}</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </View>
        </Animated.View>
      </AnimatedPressable>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AnimatedLinearGradient
        colors={[theme.primary, theme.accent]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Alerts & Notifications</Text>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings color="white" size={24} />
          </TouchableOpacity>
        </View>
        
        <View style={[styles.tabContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'current' && styles.activeTab]}
            onPress={() => setActiveTab('current')}
          >
            <Text style={[styles.tabText, activeTab === 'current' && { color: theme.primary }]}>
              Current
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'preferences' && styles.activeTab]}
            onPress={() => setActiveTab('preferences')}
          >
            <Text style={[styles.tabText, activeTab === 'preferences' && { color: theme.primary }]}>
              Preferences
            </Text>
          </TouchableOpacity>
        </View>
      </AnimatedLinearGradient>

      <ScrollView style={styles.content}>
        {activeTab === 'current' ? (
          alerts.map((alert, index) => (
            <AlertCard key={alert.id} alert={alert} index={index} />
          ))
        ) : (
          <Animated.View
            entering={SlideInRight}
            style={[styles.preferencesContainer, { backgroundColor: theme.card }]}
          >
            {preferences.map((pref, index) => (
              <Animated.View
                key={pref.id}
                entering={FadeIn.delay(index * 100).springify()}
                style={[
                  styles.preferenceItem,
                  { borderBottomColor: theme.border },
                ]}
              >
                <TouchableOpacity
                  style={styles.preferenceButton}
                  onPress={() => togglePreference(pref.id)}
                >
                  <View style={[styles.preferenceIcon, { backgroundColor: `${theme.primary}1A` }]}>
                    <pref.icon color={theme.primary} size={24} />
                  </View>
                  <View style={styles.preferenceContent}>
                    <Text style={[styles.preferenceTitle, { color: theme.text }]}>{pref.title}</Text>
                    <Text style={[styles.preferenceDescription, { color: theme.secondary }]}>
                      {pref.description}
                    </Text>
                  </View>
                  <Switch
                    value={pref.enabled}
                    onValueChange={() => togglePreference(pref.id)}
                    trackColor={{ false: theme.border, true: `${theme.primary}80` }}
                    thumbColor={pref.enabled ? theme.primary : theme.secondary}
                  />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </Animated.View>
        )}
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
  settingsButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 20,
    borderRadius: 25,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 25,
  },
  activeTab: {
    backgroundColor: 'white',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  alertCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
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
  severityIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    overflow: 'hidden',
    zIndex: 1,
  },
  severityGradient: {
    height: '100%',
    width: '100%',
  },
  alertImage: {
    width: '100%',
    height: 160,
  },
  alertContent: {
    padding: 16,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  alertTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  alertTime: {
    fontSize: 14,
    marginTop: 2,
  },
  alertDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    marginLeft: 6,
    fontSize: 14,
  },
  socialActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 6,
  },
  socialCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  preferencesContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  preferenceItem: {
    borderBottomWidth: 1,
  },
  preferenceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  preferenceContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 12,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  preferenceDescription: {
    fontSize: 14,
    marginTop: 2,
  },
});