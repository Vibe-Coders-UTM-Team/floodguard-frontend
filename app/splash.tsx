import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  useSharedValue,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);

  useEffect(() => {
    const animate = async () => {
      // Animate logo
      logoScale.value = withSpring(1, { 
        damping: 12,
        stiffness: 100,
        mass: 1,
      });
      logoOpacity.value = withTiming(1, { duration: 1000 });
      
      // Animate title with bounce
      textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
      textTranslateY.value = withDelay(400, withSequence(
        withSpring(-10, { damping: 8 }),
        withSpring(0, { damping: 12 })
      ));
      
      // Animate tagline with fade and slide
      taglineOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
      taglineTranslateY.value = withDelay(800, withSpring(0, { 
        damping: 15,
        stiffness: 80,
      }));

      // Navigate after animations
      setTimeout(() => {
        router.replace('/onboarding');
      }, 2500);
    };

    animate();
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslateY.value }],
  }));

  return (
    <LinearGradient
      colors={[theme.primary, theme.accent]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <LottieView
            source={{ uri: 'https://assets10.lottiefiles.com/packages/lf20_pucv8fkn.json' }}
            autoPlay
            loop={false}
            style={styles.lottie}
          />
        </Animated.View>

        <Animated.Text style={[styles.title, { color: 'white' }, textStyle]}>
          FloodGuard+
        </Animated.Text>

        <Animated.Text style={[styles.tagline, { color: 'rgba(255, 255, 255, 0.9)' }, taglineStyle]}>
          Stay Ahead of Floods
        </Animated.Text>
      </View>

      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.2)']}
        style={styles.bottomGradient}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logoContainer: {
    width: width * 0.5,
    height: width * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 48,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
});