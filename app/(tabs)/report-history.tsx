import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
} from 'react-native-reanimated';
import {
  MapPin,
  TriangleAlert as AlertTriangle,
  Clock,
  CircleCheck as CheckCircle2,
  Circle as XCircle,
  MessageCircle,
  Share2,
  Ruler,
  ArrowLeft,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { floodReportApi } from '@/services/api';
import { LinearGradient } from 'expo-linear-gradient';

export default function ReportHistoryScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [reports, setReports] = useState([]);
  const [expandedReport, setExpandedReport] = useState(null);

  // Load user reports when the screen is focused
  useEffect(() => {
    fetchUserReports();
  }, []);

  // Fetch user reports from the API
  const fetchUserReports = async () => {
    try {
      setIsLoading(true);
      const response = await floodReportApi.getUserReports();
      setReports(response.data || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
      Alert.alert('Error', 'Failed to load your reports');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Handle pull-to-refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchUserReports();
  };

  // Handle report press to expand/collapse
  const handleReportPress = (reportId) => {
    setExpandedReport(expandedReport === reportId ? null : reportId);
  };

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Get time elapsed since report was created
  const getTimeElapsed = (dateString) => {
    const now = new Date();
    const reportDate = new Date(dateString);
    const diffMs = now - reportDate;

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 30) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  };

  // Get status icon based on report status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 color={theme.success} size={24} />;
      case 'rejected':
        return <XCircle color={theme.error} size={24} />;
      default:
        return <Clock color={theme.warning} size={24} />;
    }
  };

  // Get color based on flood level
  const getLevelColor = (level) => {
    switch (level) {
      case 'minor':
        return '#059669';
      case 'moderate':
        return '#d97706';
      case 'severe':
        return '#dc2626';
      default:
        return theme.secondary;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient colors={[theme.primary, theme.accent]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft color="white" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report History</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.primary]}
            tintColor={theme.primary}
          />
        }
      >
        {isLoading && !refreshing ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>Loading your reports...</Text>
          </View>
        ) : reports.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <AlertTriangle size={48} color={theme.secondary} />
            <Text style={[styles.emptyStateTitle, { color: theme.text }]}>No Reports Yet</Text>
            <Text style={[styles.emptyStateMessage, { color: theme.secondary }]}>
              You haven't submitted any flood reports yet. Create a new report to see it here.
            </Text>
            <TouchableOpacity
              style={[styles.createReportButton, { backgroundColor: theme.primary }]}
              onPress={() => router.push('/report')}
            >
              <Text style={styles.createReportButtonText}>Create New Report</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.reportsContainer}>
            {reports.map(report => (
              <Animated.View
                key={report.id}
                entering={FadeIn.duration(300)}
                layout={Layout.springify()}
              >
                <TouchableOpacity
                  style={[
                    styles.reportCard,
                    { backgroundColor: theme.card },
                    expandedReport === report.id && styles.expandedCard
                  ]}
                  onPress={() => handleReportPress(report.id)}
                  activeOpacity={0.8}
                >
                  {report.imageUrls && report.imageUrls.length > 0 && (
                    <Image source={{ uri: report.imageUrls[0] }} style={styles.reportImage} />
                  )}

                  <View style={styles.reportContent}>
                    <View style={styles.reportHeader}>
                      {getStatusIcon(report.status || 'pending')}
                      <View style={styles.reportTitleContainer}>
                        <Text style={[styles.reportStatus, {
                          color: report.status === 'verified' ? theme.success : theme.warning
                        }]}>
                          {(report.status || 'Pending').charAt(0).toUpperCase() + (report.status || 'pending').slice(1)}
                        </Text>
                        <Text style={[styles.reportTime, { color: theme.secondary }]}>
                          {report.createdAt ? getTimeElapsed(report.createdAt) : 'Just now'}
                        </Text>
                      </View>
                      <View style={[
                        styles.levelIndicator,
                        { backgroundColor: `${getLevelColor(report.level)}20` }
                      ]}>
                        <Ruler size={14} color={getLevelColor(report.level)} />
                        <Text style={[
                          styles.levelText,
                          { color: getLevelColor(report.level) }
                        ]}>
                          {report.level.toUpperCase()}
                        </Text>
                      </View>
                    </View>

                    <Text
                      style={[styles.reportDescription, { color: theme.text }]}
                      numberOfLines={expandedReport === report.id ? undefined : 2}
                    >
                      {report.description}
                    </Text>

                    <View style={styles.locationContainer}>
                      <MapPin color={theme.secondary} size={16} />
                      <Text style={[styles.locationText, { color: theme.secondary }]}>
                        {report.location}
                      </Text>
                    </View>

                    {expandedReport === report.id && (
                      <Animated.View
                        entering={FadeIn.duration(200)}
                        style={styles.expandedContent}
                      >
                        {report.imageUrls && report.imageUrls.length > 1 && (
                          <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.imageGallery}
                          >
                            {report.imageUrls.map((imageUrl, index) => (
                              <Image
                                key={index}
                                source={{ uri: imageUrl }}
                                style={styles.galleryImage}
                              />
                            ))}
                          </ScrollView>
                        )}

                        <View style={[styles.detailsContainer, { borderTopColor: theme.border }]}>
                          <Text style={[styles.detailsTitle, { color: theme.text }]}>
                            Report Details
                          </Text>

                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme.secondary }]}>
                              Coordinates:
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                              {report.latitude.toFixed(6)}, {report.longitude.toFixed(6)}
                            </Text>
                          </View>

                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme.secondary }]}>
                              Submitted:
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                              {report.createdAt ? formatDate(report.createdAt) : 'Unknown'}
                            </Text>
                          </View>

                          {report.updatedAt && report.updatedAt !== report.createdAt && (
                            <View style={styles.detailRow}>
                              <Text style={[styles.detailLabel, { color: theme.secondary }]}>
                                Last Updated:
                              </Text>
                              <Text style={[styles.detailValue, { color: theme.text }]}>
                                {formatDate(report.updatedAt)}
                              </Text>
                            </View>
                          )}

                          {/* Household Information */}
                          <Text style={[styles.sectionSubtitle, { color: theme.primary, marginTop: 16, marginBottom: 8 }]}>
                            Household Information
                          </Text>

                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme.secondary }]}>
                              Household Size:
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                              {report.household_size || 0} people
                            </Text>
                          </View>

                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme.secondary }]}>
                              Children Under 5:
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                              {report.children_under_5 || 0}
                            </Text>
                          </View>

                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme.secondary }]}>
                              Elderly Members:
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                              {report.elderly_members || 0}
                            </Text>
                          </View>

                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme.secondary }]}>
                              Disabled/Bedridden:
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                              {report.disabled_bedridden_members || 0}
                            </Text>
                          </View>

                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme.secondary }]}>
                              Medical Conditions:
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                              {report.has_medical_conditions ? 'Yes' : 'No'}
                            </Text>
                          </View>

                          <View style={styles.detailRow}>
                            <Text style={[styles.detailLabel, { color: theme.secondary }]}>
                              Pets/Livestock:
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.text }]}>
                              {report.pets_livestock || 0}
                            </Text>
                          </View>
                        </View>

                        {report.updates && report.updates.length > 0 && (
                          <View style={[styles.updatesContainer, { borderTopColor: theme.border }]}>
                            <Text style={[styles.updatesTitle, { color: theme.text }]}>
                              Updates
                            </Text>
                            {report.updates.map((update, index) => (
                              <View key={index} style={styles.updateItem}>
                                <View style={[styles.updateDot, { backgroundColor: theme.primary }]} />
                                <View style={styles.updateContent}>
                                  <Text style={[styles.updateMessage, { color: theme.text }]}>
                                    {update.message}
                                  </Text>
                                  <Text style={[styles.updateTime, { color: theme.secondary }]}>
                                    {update.time}
                                  </Text>
                                </View>
                              </View>
                            ))}
                          </View>
                        )}
                      </Animated.View>
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  createReportButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  createReportButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  reportsContainer: {
    gap: 16,
  },
  reportCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
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
    }),
  },
  expandedCard: {
    transform: [{ scale: 1.02 }],
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
    marginBottom: 12,
  },
  reportTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  reportStatus: {
    fontSize: 16,
    fontWeight: '600',
  },
  reportTime: {
    fontSize: 14,
    marginTop: 2,
  },
  levelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '500',
  },
  reportDescription: {
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
  expandedContent: {
    marginTop: 16,
  },
  imageGallery: {
    marginBottom: 16,
  },
  galleryImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  detailsContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
  },
  detailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 100,
    fontSize: 14,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  updatesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  updatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  updateItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  updateDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 8,
  },
  updateContent: {
    flex: 1,
  },
  updateMessage: {
    fontSize: 14,
    marginBottom: 2,
  },
  updateTime: {
    fontSize: 12,
  },
});
