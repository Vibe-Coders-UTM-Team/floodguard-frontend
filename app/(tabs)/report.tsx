import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  FadeIn,
  FadeOut,
  Layout,
  interpolate,
  Extrapolate,
  SlideInRight,
} from 'react-native-reanimated';
import {
  Camera,
  MapPin,
  TriangleAlert as AlertTriangle,
  ChevronRight,
  Clock,
  CircleCheck as CheckCircle2,
  Circle as XCircle,
  ImagePlus,
  Send,
  Ruler,
  Info,
  X,
  MessageCircle,
  Share2,
  Users,
  Heart,
  PawPrint,
  Plus,
  Minus,
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { floodReportApi } from '@/services/api';
import { getCurrentLocation, getAddressFromCoordinates } from '@/services/location';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';

const FLOOD_LEVELS = [
  { id: 'minor', label: 'Minor (0-1 ft)', color: '#059669', icon: Ruler },
  { id: 'moderate', label: 'Moderate (1-3 ft)', color: '#d97706', icon: Ruler },
  { id: 'severe', label: 'Severe (3+ ft)', color: '#dc2626', icon: Ruler },
];

// Sample data for UI testing - will be replaced with API data
const SAMPLE_REPORTS = [
  {
    id: '1',
    status: 'verified',
    description: 'Street completely flooded, water level about 2 feet high. Multiple vehicles stranded.',
    location: 'Main Street & 5th Avenue',
    timestamp: '2 hours ago',
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
    level: 'moderate',
    stats: {
      views: 245,
      responses: 12,
      shares: 34
    },
    updates: [
      {
        time: '1 hour ago',
        message: 'Emergency services deployed'
      },
      {
        time: '30 mins ago',
        message: 'Water level rising steadily'
      }
    ]
  },
  {
    id: '2',
    status: 'pending',
    description: 'Storm drain overflow causing local flooding. Water accumulating rapidly near residential areas.',
    location: 'Cedar Park Area',
    timestamp: '5 hours ago',
    image: 'https://images.unsplash.com/photo-1535184247325-379595aeb8e6?w=800&q=80',
    level: 'severe',
    stats: {
      views: 189,
      responses: 8,
      shares: 27
    },
    updates: [
      {
        time: '4 hours ago',
        message: 'Municipal team notified'
      },
      {
        time: '2 hours ago',
        message: 'Drainage team en route'
      }
    ]
  },
  {
    id: '3',
    status: 'verified',
    description: 'Flash flood warning in effect. Several streets experiencing rapid water accumulation.',
    location: 'Downtown District',
    timestamp: '8 hours ago',
    image: 'https://images.unsplash.com/photo-1547683905-f686c993c4ac?w=800&q=80',
    level: 'severe',
    stats: {
      views: 567,
      responses: 23,
      shares: 89
    },
    updates: [
      {
        time: '7 hours ago',
        message: 'Emergency evacuation initiated'
      },
      {
        time: '5 hours ago',
        message: 'Rescue operations ongoing'
      }
    ]
  }
];

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function ReportScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('new');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [coordinates, setCoordinates] = useState<{latitude: number, longitude: number} | null>(null);
  const [reports, setReports] = useState([]);
  const submitScale = useSharedValue(1);
  const [expandedReport, setExpandedReport] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Household information
  const [childrenUnder5, setChildrenUnder5] = useState(0);
  const [elderlyMembers, setElderlyMembers] = useState(0);
  const [householdSize, setHouseholdSize] = useState(1);
  const [disabledMembers, setDisabledMembers] = useState(0);
  const [hasMedicalConditions, setHasMedicalConditions] = useState(false);
  const [petsLivestock, setPetsLivestock] = useState(0);

  const formAnimation = useSharedValue(0);

  // Load user reports when the screen is focused or when the active tab changes to history
  useEffect(() => {
    formAnimation.value = withSpring(1, {
      damping: 15,
      stiffness: 100,
    });

    if (activeTab === 'history') {
      fetchUserReports();
    }
  }, [activeTab]);

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
    }
  };

  const formStyle = useAnimatedStyle(() => ({
    opacity: formAnimation.value,
    transform: [
      {
        translateY: interpolate(formAnimation.value, [0, 1], [50, 0]),
      },
    ],
  }));

  // Handle image picking
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your photos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        setImages([...images, selectedImage.uri]);
        setImageFiles([...imageFiles, selectedImage]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  // Upload images to Firebase Storage
  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];

    try {
      const uploadPromises = imageFiles.map(async (file, index) => {
        try {
          console.log(`Starting upload for image ${index}`);

          // Create a unique filename
          const filename = `flood_report_${user.uid}_${Date.now()}_${index}.jpg`;
          console.log(`Generated filename: ${filename}`);

          // Convert image to blob
          console.log(`Fetching image from URI: ${file.uri}`);
          const response = await fetch(file.uri);
          const blob = await response.blob();
          console.log(`Created blob of size: ${blob.size} bytes`);

          // Create storage reference with metadata
          const storageRef = ref(storage, `flood_reports/${filename}`);
          console.log(`Created storage reference: flood_reports/${filename}`);

          // Set metadata
          const metadata = {
            contentType: 'image/jpeg',
          };

          // Upload image with metadata
          console.log('Starting uploadBytes operation...');
          const uploadResult = await uploadBytes(storageRef, blob, metadata);
          console.log('Upload completed successfully:', uploadResult);

          // Get download URL
          console.log('Getting download URL...');
          const downloadURL = await getDownloadURL(storageRef);
          console.log(`Got download URL: ${downloadURL}`);

          return downloadURL;
        } catch (uploadError) {
          console.error(`Error uploading image ${index}:`, uploadError);
          console.error('Error details:', JSON.stringify(uploadError));
          throw uploadError;
        }
      });

      console.log(`Waiting for ${uploadPromises.length} uploads to complete...`);
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error('Error in uploadImages function:', error);
      console.error('Error details:', JSON.stringify(error));
      Alert.alert(
        'Upload Error',
        'Failed to upload images. Please check your internet connection and try again.'
      );
      throw new Error('Failed to upload images');
    }
  };

  // Get current location
  const handleGetCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCoordinates(location);

      // Get address from coordinates
      const address = await getAddressFromCoordinates(location.latitude, location.longitude);
      setLocation(address);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get your current location');
    }
  };

  // Submit report to the API
  const handleSubmit = async () => {
    // Validate form
    if (!description) {
      setErrorMessage('Please provide a description');
      return;
    }

    if (!selectedLevel) {
      setErrorMessage('Please select a flood level');
      return;
    }

    if (!location || !coordinates) {
      setErrorMessage('Please provide a location');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);
    submitScale.value = withSpring(0.95, {}, () => {
      submitScale.value = withSpring(1);
    });

    try {
      // Upload images if any
      let imageUrls = [];
      if (images.length > 0) {
        imageUrls = await uploadImages();
      }

      // Prepare report data
      const reportData = {
        userId: user.uid,
        description,
        level: selectedLevel,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        location,
        imageUrls,
        // Household information
        children_under_5: childrenUnder5,
        elderly_members: elderlyMembers,
        household_size: householdSize,
        disabled_bedridden_members: disabledMembers,
        has_medical_conditions: hasMedicalConditions,
        pets_livestock: petsLivestock,
      };

      // Submit report to API
      await floodReportApi.createReport(reportData);

      // Reset form
      setDescription('');
      setLocation('');
      setSelectedLevel('');
      setImages([]);
      setImageFiles([]);
      setCoordinates(null);
      setChildrenUnder5(0);
      setElderlyMembers(0);
      setHouseholdSize(1);
      setDisabledMembers(0);
      setHasMedicalConditions(false);
      setPetsLivestock(0);

      // Show success message
      Alert.alert('Success', 'Your flood report has been submitted successfully', [
        {
          text: 'View History',
          onPress: () => router.push('/report-history')
        },
        {
          text: 'OK',
          style: 'cancel'
        }
      ]);
    } catch (error) {
      console.error('Error submitting report:', error);
      Alert.alert('Error', 'Failed to submit your report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReportPress = (reportId: string) => {
    const isExpanding = expandedReport !== reportId;
    setExpandedReport(isExpanding ? reportId : null);

    if (isExpanding) {
      // Simulate loading more details
      setSelectedReport(reportId);
    }
  };

  const submitButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: submitScale.value }],
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 color={theme.success} size={24} />;
      case 'rejected':
        return <XCircle color={theme.error} size={24} />;
      default:
        return <Clock color={theme.warning} size={24} />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient colors={[theme.primary, theme.accent]} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Report Flooding</Text>
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: theme.error }]}
          >
            <AlertTriangle color="white" size={20} />
            <Text style={styles.emergencyButtonText}>Emergency</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.tabContainer, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'new' && styles.activeTab]}
            onPress={() => setActiveTab('new')}
          >
            <Text style={[styles.tabText, activeTab === 'new' && { color: theme.primary }]}>
              New Report
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.activeTab]}
            onPress={() => router.push('/report-history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && { color: theme.primary }]}>
              History
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'new' ? (
          <Animated.View
            style={[styles.formContainer, { backgroundColor: theme.card }]}
            entering={FadeIn.duration(300)}
            exiting={FadeOut.duration(200)}
            layout={Layout.springify()}
          >
            {/* Image Upload Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Camera size={20} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Add Photos</Text>
                </View>
                <Text style={[styles.sectionSubtitle, { color: theme.secondary }]}>
                  Add photos to help assess the situation
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.imageScroll}
                contentContainerStyle={styles.imageScrollContent}
              >
                <TouchableOpacity
                  style={[styles.addImageButton, { backgroundColor: theme.background, borderColor: theme.border }]}
                  onPress={pickImage}
                >
                  <ImagePlus color={theme.primary} size={32} />
                  <Text style={[styles.addImageText, { color: theme.text }]}>Add Photo</Text>
                </TouchableOpacity>
                {images.map((image, index) => (
                  <View key={index} style={styles.imagePreview}>
                    <Image source={{ uri: image }} style={styles.previewImage} />
                    <TouchableOpacity
                      style={styles.removeImageButton}
                      onPress={() => {
                        setImages(images.filter((_, i) => i !== index));
                        setImageFiles(imageFiles.filter((_, i) => i !== index));
                      }}
                    >
                      <X size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Flood Level Selection */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Ruler size={20} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Flood Level</Text>
                </View>
                <Text style={[styles.sectionSubtitle, { color: theme.secondary }]}>
                  Select the current water level in your area
                </Text>
              </View>
              <View style={styles.levelContainer}>
                {FLOOD_LEVELS.map((level) => {
                  const isSelected = selectedLevel === level.id;
                  return (
                    <TouchableOpacity
                      key={level.id}
                      style={[
                        styles.levelButton,
                        {
                          backgroundColor: isSelected
                            ? `${level.color}10`
                            : theme.background,
                          borderColor: isSelected
                            ? level.color
                            : theme.border,
                        },
                      ]}
                      onPress={() => setSelectedLevel(level.id)}
                    >
                      <level.icon
                        size={20}
                        color={isSelected ? level.color : theme.secondary}
                      />
                      <Text style={[
                        styles.levelText,
                        { color: isSelected ? level.color : theme.text },
                      ]}>
                        {level.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Location Input */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <MapPin size={20} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Location</Text>
                </View>
                <Text style={[styles.sectionSubtitle, { color: theme.secondary }]}>
                  Specify where the flooding is occurring
                </Text>
              </View>
              <View style={[styles.locationInputContainer, { backgroundColor: theme.background }]}>
                <TextInput
                  style={[styles.locationInput, { color: theme.text }]}
                  placeholder="Enter location or use current location"
                  placeholderTextColor={theme.secondary}
                  value={location}
                  onChangeText={setLocation}
                />
                <TouchableOpacity
                  style={[styles.currentLocationButton, { backgroundColor: `${theme.primary}10` }]}
                  onPress={handleGetCurrentLocation}
                >
                  <MapPin size={16} color={theme.primary} />
                  <Text style={[styles.currentLocationText, { color: theme.primary }]}>
                    Current Location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Description Input */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Info size={20} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
                </View>
                <Text style={[styles.sectionSubtitle, { color: theme.secondary }]}>
                  Provide additional details about the situation
                </Text>
              </View>
              <TextInput
                style={[
                  styles.descriptionInput,
                  { backgroundColor: theme.background, color: theme.text },
                ]}
                placeholder="Describe the flooding situation in detail..."
                placeholderTextColor={theme.secondary}
                multiline
                numberOfLines={4}
                value={description}
                onChangeText={setDescription}
                textAlignVertical="top"
              />
            </View>

            {/* Household Information */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleContainer}>
                  <Users size={20} color={theme.primary} />
                  <Text style={[styles.sectionTitle, { color: theme.text }]}>Household Information</Text>
                </View>
                <Text style={[styles.sectionSubtitle, { color: theme.secondary }]}>
                  Help us understand who needs assistance
                </Text>
              </View>

              {/* Household Size */}
              <View style={styles.householdRow}>
                <View style={styles.householdLabelContainer}>
                  <Users size={16} color={theme.secondary} />
                  <Text style={[styles.householdLabel, { color: theme.text }]}>Household Size</Text>
                </View>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setHouseholdSize(Math.max(1, householdSize - 1))}
                  >
                    <Minus size={16} color={theme.secondary} />
                  </TouchableOpacity>
                  <Text style={[styles.counterValue, { color: theme.text }]}>{householdSize}</Text>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setHouseholdSize(householdSize + 1)}
                  >
                    <Plus size={16} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Children Under 5 */}
              <View style={styles.householdRow}>
                <View style={styles.householdLabelContainer}>
                  <Users size={16} color={theme.secondary} />
                  <Text style={[styles.householdLabel, { color: theme.text }]}>Children Under 5</Text>
                </View>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setChildrenUnder5(Math.max(0, childrenUnder5 - 1))}
                  >
                    <Minus size={16} color={theme.secondary} />
                  </TouchableOpacity>
                  <Text style={[styles.counterValue, { color: theme.text }]}>{childrenUnder5}</Text>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setChildrenUnder5(childrenUnder5 + 1)}
                  >
                    <Plus size={16} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Elderly Members */}
              <View style={styles.householdRow}>
                <View style={styles.householdLabelContainer}>
                  <Users size={16} color={theme.secondary} />
                  <Text style={[styles.householdLabel, { color: theme.text }]}>Elderly Members</Text>
                </View>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setElderlyMembers(Math.max(0, elderlyMembers - 1))}
                  >
                    <Minus size={16} color={theme.secondary} />
                  </TouchableOpacity>
                  <Text style={[styles.counterValue, { color: theme.text }]}>{elderlyMembers}</Text>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setElderlyMembers(elderlyMembers + 1)}
                  >
                    <Plus size={16} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Disabled/Bedridden Members */}
              <View style={styles.householdRow}>
                <View style={styles.householdLabelContainer}>
                  <Users size={16} color={theme.secondary} />
                  <Text style={[styles.householdLabel, { color: theme.text }]}>Disabled/Bedridden</Text>
                </View>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setDisabledMembers(Math.max(0, disabledMembers - 1))}
                  >
                    <Minus size={16} color={theme.secondary} />
                  </TouchableOpacity>
                  <Text style={[styles.counterValue, { color: theme.text }]}>{disabledMembers}</Text>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setDisabledMembers(disabledMembers + 1)}
                  >
                    <Plus size={16} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Medical Conditions */}
              <View style={styles.householdRow}>
                <View style={styles.householdLabelContainer}>
                  <Heart size={16} color={theme.secondary} />
                  <Text style={[styles.householdLabel, { color: theme.text }]}>Medical Conditions</Text>
                </View>
                <TouchableOpacity
                  style={[styles.toggleButton, { backgroundColor: hasMedicalConditions ? theme.primary : theme.background }]}
                  onPress={() => setHasMedicalConditions(!hasMedicalConditions)}
                >
                  <Text style={[styles.toggleText, { color: hasMedicalConditions ? 'white' : theme.text }]}>
                    {hasMedicalConditions ? 'Yes' : 'No'}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Pets/Livestock */}
              <View style={styles.householdRow}>
                <View style={styles.householdLabelContainer}>
                  <PawPrint size={16} color={theme.secondary} />
                  <Text style={[styles.householdLabel, { color: theme.text }]}>Pets/Livestock</Text>
                </View>
                <View style={styles.counterContainer}>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setPetsLivestock(Math.max(0, petsLivestock - 1))}
                  >
                    <Minus size={16} color={theme.secondary} />
                  </TouchableOpacity>
                  <Text style={[styles.counterValue, { color: theme.text }]}>{petsLivestock}</Text>
                  <TouchableOpacity
                    style={[styles.counterButton, { backgroundColor: theme.background }]}
                    onPress={() => setPetsLivestock(petsLivestock + 1)}
                  >
                    <Plus size={16} color={theme.primary} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Submit Button */}
            <AnimatedTouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.primary },
                submitButtonStyle,
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <View style={styles.loadingContainer}>
                  <Animated.View
                    style={styles.loadingDot}
                    entering={FadeIn}
                  />
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                </View>
              ) : (
                <>
                  <Send color="white" size={20} />
                  <Text style={styles.submitButtonText}>Submit Report</Text>
                </>
              )}
            </AnimatedTouchableOpacity>
          </Animated.View>
        ) : (
          <View style={styles.historyContainer}>
            {isLoading ? (
              <View style={styles.loadingHistoryContainer}>
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
                  onPress={() => setActiveTab('new')}
                >
                  <Text style={styles.createReportButtonText}>Create New Report</Text>
                </TouchableOpacity>
              </View>
            ) : reports.map(report => (
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
                  <Image source={{ uri: report.image }} style={styles.reportImage} />
                  <View style={styles.reportContent}>
                    <View style={styles.reportHeader}>
                      {getStatusIcon(report.status)}
                      <View style={styles.reportTitleContainer}>
                        <Text style={[styles.reportStatus, {
                          color: report.status === 'verified' ? theme.success : theme.warning
                        }]}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Text>
                        <Text style={[styles.reportTime, { color: theme.secondary }]}>
                          {report.timestamp}
                        </Text>
                      </View>
                      <View style={[
                        styles.levelIndicator,
                        { backgroundColor: report.level === 'severe' ? `${theme.error}20` : `${theme.warning}20` }
                      ]}>
                        <Ruler size={14} color={report.level === 'severe' ? theme.error : theme.warning} />
                        <Text style={[
                          styles.levelText,
                          { color: report.level === 'severe' ? theme.error : theme.warning }
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
                        <View style={[styles.statsContainer, { borderTopColor: theme.border }]}>
                          <View style={styles.statItem}>
                            <AlertTriangle size={16} color={theme.primary} />
                            <Text style={[styles.statValue, { color: theme.text }]}>
                              {report.stats.views}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.secondary }]}>
                              Views
                            </Text>
                          </View>
                          <View style={styles.statItem}>
                            <MessageCircle size={16} color={theme.primary} />
                            <Text style={[styles.statValue, { color: theme.text }]}>
                              {report.stats.responses}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.secondary }]}>
                              Responses
                            </Text>
                          </View>
                          <View style={styles.statItem}>
                            <Share2 size={16} color={theme.primary} />
                            <Text style={[styles.statValue, { color: theme.text }]}>
                              {report.stats.shares}
                            </Text>
                            <Text style={[styles.statLabel, { color: theme.secondary }]}>
                              Shares
                            </Text>
                          </View>
                        </View>

                        <View style={[styles.updatesContainer, { borderTopColor: theme.border }]}>
                          <Text style={[styles.updatesTitle, { color: theme.text }]}>
                            Recent Updates
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    gap: 6,
  },
  emergencyButtonText: {
    color: 'white',
    fontWeight: '600',
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
  formContainer: {
    borderRadius: 24,
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
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  sectionSubtitle: {
    fontSize: 14,
  },
  imageScroll: {
    marginHorizontal: -20,
  },
  imageScrollContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  addImageButton: {
    width: 120,
    height: 120,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  addImageText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
  imagePreview: {
    width: 120,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  levelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  levelText: {
    fontSize: 14,
    fontWeight: '500',
  },
  locationInputContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  locationInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    gap: 6,
  },
  currentLocationText: {
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionInput: {
    borderRadius: 12,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    gap: 8,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  historyContainer: {
    gap: 16,
  },
  reportCard: {
    borderRadius: 16,
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'white',
    opacity: 0.7,
  },
  expandedCard: {
    transform: [{ scale: 1.02 }],
  },
  levelIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  expandedContent: {
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  statItem: {
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  statLabel: {
    fontSize: 12,
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
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
  },
  householdRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  householdLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  householdLabel: {
    fontSize: 16,
  },
  counterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValue: {
    fontSize: 16,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loadingHistoryContainer: {
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
});