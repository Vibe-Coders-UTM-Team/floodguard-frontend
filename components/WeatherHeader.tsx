import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
  useSharedValue,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Cloud, Droplets, Languages } from 'lucide-react-native';

const AnimatedCloud = Animated.createAnimatedComponent(Cloud);
const AnimatedDroplets = Animated.createAnimatedComponent(Droplets);

interface WeatherHeaderProps {
  theme: any;
  selectedLanguage: string;
  languages: Array<{ code: string; name: string }>;
  onLanguageSelect: (code: string) => void;
}

export default function WeatherHeader({
  theme,
  selectedLanguage,
  languages,
  onLanguageSelect,
}: WeatherHeaderProps) {
  // Animation values
  const cloudScale = useSharedValue(1);
  const cloudRotate = useSharedValue(0);
  const dropOpacity = useSharedValue(0);
  const temperatureScale = useSharedValue(1);
  const weatherDetailsTranslateY = useSharedValue(20);

  useEffect(() => {
    // Cloud animation
    cloudScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    cloudRotate.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(-0.05, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Droplets animation
    dropOpacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.3, { duration: 1000 })
      ),
      -1,
      true
    );

    // Temperature animation
    temperatureScale.value = withSpring(1, {
      damping: 10,
      stiffness: 100,
    });

    // Weather details animation
    weatherDetailsTranslateY.value = withDelay(
      300,
      withSpring(0, {
        damping: 15,
        stiffness: 100,
      })
    );
  }, []);

  const cloudStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: cloudScale.value },
      { rotate: `${cloudRotate.value}rad` },
    ],
  }));

  const dropStyle = useAnimatedStyle(() => ({
    opacity: dropOpacity.value,
  }));

  const temperatureStyle = useAnimatedStyle(() => ({
    transform: [{ scale: temperatureScale.value }],
  }));

  const weatherDetailsStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: weatherDetailsTranslateY.value }],
    opacity: withSpring(1),
  }));

  return (
    <LinearGradient colors={[theme.primary, theme.accent]} style={styles.header}>
      <View style={styles.languageSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageButton,
                {
                  backgroundColor:
                    selectedLanguage === lang.code
                      ? 'white'
                      : 'rgba(255, 255, 255, 0.2)',
                },
              ]}
              onPress={() => onLanguageSelect(lang.code)}
            >
              <Languages
                size={16}
                color={selectedLanguage === lang.code ? theme.primary : 'white'}
              />
              <Text
                style={[
                  styles.languageButtonText,
                  {
                    color: selectedLanguage === lang.code ? theme.primary : 'white',
                  },
                ]}
              >
                {lang.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.weatherInfo}>
        <Animated.View style={[styles.cloudContainer, cloudStyle]}>
          <AnimatedCloud color="white" size={32} />
        </Animated.View>
        
        <Animated.Text style={[styles.temperature, temperatureStyle]}>
          24°C
        </Animated.Text>

        <Animated.View style={[styles.weatherDetails, weatherDetailsStyle]}>
          <View style={styles.weatherDetail}>
            <Animated.View style={dropStyle}>
              <AnimatedDroplets color="white" size={16} />
            </Animated.View>
            <Text style={styles.weatherText}>80% chance of rain</Text>
          </View>
          <View style={[styles.weatherDetail, styles.weatherDetailBorder]}>
            <Cloud color="white" size={16} />
            <Text style={styles.weatherText}>Humidity: 85%</Text>
          </View>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
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
  cloudContainer: {
    padding: 8,
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
});