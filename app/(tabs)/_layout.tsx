import { Tabs, useRouter, Redirect } from 'expo-router';
import { MapPin, Chrome as Home, Bell, CircleUser as UserCircle, TriangleAlert as AlertTriangle, Navigation, Brain } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function TabLayout() {
  const { theme, isDarkMode } = useTheme();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Show loading indicator while checking authentication
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopColor: theme.border,
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.secondary,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: 'Map',
          tabBarIcon: ({ size, color }) => <MapPin size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ size, color }) => <AlertTriangle size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="report-history"
        options={{
          title: 'History',
          tabBarIcon: ({ size, color }) => <AlertTriangle size={size} color={color} />,
          href: null, // Hide from tab bar but keep in navigation
        }}
      />
      <Tabs.Screen
        name="evacuation"
        options={{
          title: 'Evacuate',
          tabBarIcon: ({ size, color }) => <Navigation size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="ai-reports"
        options={{
          title: 'AI Reports',
          tabBarIcon: ({ size, color }) => <Brain size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Alerts',
          tabBarIcon: ({ size, color }) => <Bell size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => <UserCircle size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}