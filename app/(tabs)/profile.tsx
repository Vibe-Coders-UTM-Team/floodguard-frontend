import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Switch,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { User, Bell, Moon, Globe as Globe2, Mail, Phone, CircleHelp as HelpCircle, Info, LogOut, ChevronRight, Shield } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/config/firebase';
import { updateProfile } from 'firebase/auth';

const NOTIFICATION_PREFERENCES = [
  { id: 'push', title: 'Push Notifications', description: 'Receive push alerts for emergencies' },
  { id: 'sms', title: 'SMS Alerts', description: 'Get critical updates via SMS' },
  { id: 'email', title: 'Email Updates', description: 'Receive detailed reports via email' },
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'ms', name: 'Bahasa Malaysia' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ta', name: 'Tamil' },
];

export default function ProfileScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [notifications, setNotifications] = useState({
    push: true,
    sms: false,
    email: true,
  });
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load user profile image if available
  useEffect(() => {
    if (user?.photoURL) {
      setProfileImage(user.photoURL);
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
        mediaTypes: [ImagePicker.MediaType.IMAGE],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        await uploadProfileImage(selectedImage.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const uploadProfileImage = async (uri: string) => {
    if (!user) return;

    try {
      setUploading(true);

      // Create a unique filename
      const filename = `profile_${user.uid}_${Date.now()}.jpg`;

      // Convert image to blob
      const response = await fetch(uri);
      const blob = await response.blob();

      // Create storage reference with metadata
      const storageRef = ref(storage, `profile_images/${filename}`);

      // Set metadata
      const metadata = {
        contentType: 'image/jpeg',
      };

      // Upload image with metadata
      await uploadBytes(storageRef, blob, metadata);

      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);

      // Update user profile
      await updateProfile(user, {
        photoURL: downloadURL
      });

      // Update local state
      setProfileImage(downloadURL);

      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload profile picture', [{ text: 'OK' }]);
    } finally {
      setUploading(false);
    }
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev => ({
      ...prev,
      [id]: !prev[id as keyof typeof notifications],
    }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={[theme.primary, theme.accent]}
        style={styles.header}
      >
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {uploading ? (
              <View style={[styles.avatar, styles.avatarLoading]}>
                <ActivityIndicator size="large" color={theme.primary} />
              </View>
            ) : (
              <Image
                source={{
                  uri: profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&q=80'
                }}
                style={styles.avatar}
              />
            )}
            <TouchableOpacity style={styles.editButton} onPress={pickImage}>
              <Text style={[styles.editButtonText, { color: theme.primary }]}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{user?.displayName || 'User'}</Text>
          <Text style={styles.email}>{user?.email || 'No email'}</Text>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Appearance</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={toggleTheme}
          >
            <View style={styles.settingLeft}>
              <Moon size={24} color={theme.text} />
              <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={isDarkMode ? theme.card : '#f4f4f5'}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Language</Text>
          {LANGUAGES.map(lang => (
            <TouchableOpacity
              key={lang.code}
              style={styles.settingItem}
              onPress={() => setSelectedLanguage(lang.code)}
            >
              <View style={styles.settingLeft}>
                <Globe2 size={24} color={theme.text} />
                <Text style={[styles.settingText, { color: theme.text }]}>{lang.name}</Text>
              </View>
              {selectedLanguage === lang.code && (
                <View style={[styles.selectedIndicator, { backgroundColor: theme.primary }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Notifications</Text>
          {NOTIFICATION_PREFERENCES.map(pref => (
            <TouchableOpacity
              key={pref.id}
              style={styles.settingItem}
              onPress={() => toggleNotification(pref.id)}
            >
              <View style={styles.settingLeft}>
                <Bell size={24} color={theme.text} />
                <View>
                  <Text style={[styles.settingText, { color: theme.text }]}>{pref.title}</Text>
                  <Text style={[styles.settingDescription, { color: theme.secondary }]}>
                    {pref.description}
                  </Text>
                </View>
              </View>
              <Switch
                value={notifications[pref.id as keyof typeof notifications]}
                onValueChange={() => toggleNotification(pref.id)}
                trackColor={{ false: theme.border, true: theme.primary }}
                thumbColor={notifications[pref.id as keyof typeof notifications] ? theme.card : '#f4f4f5'}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <HelpCircle size={24} color={theme.text} />
              <Text style={[styles.settingText, { color: theme.text }]}>Help Center</Text>
            </View>
            <ChevronRight size={20} color={theme.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Shield size={24} color={theme.text} />
              <Text style={[styles.settingText, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <ChevronRight size={20} color={theme.secondary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Info size={24} color={theme.text} />
              <Text style={[styles.settingText, { color: theme.text }]}>About</Text>
            </View>
            <View style={styles.versionContainer}>
              <Text style={[styles.versionText, { color: theme.secondary }]}>Version 1.0.0</Text>
              <ChevronRight size={20} color={theme.secondary} />
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { backgroundColor: theme.error }]}
          onPress={handleLogout}
        >
          <LogOut size={24} color="white" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
  profileHeader: {
    alignItems: 'center',
    padding: 20,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'white',
  },
  avatarLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  editButton: {
    position: 'absolute',
    bottom: -10,
    right: -10,
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    borderRadius: 16,
    marginBottom: 20,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  selectedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  versionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  versionText: {
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 40,
    gap: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});