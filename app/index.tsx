import React, { useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  withSequence,
  withRepeat,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useTheme } from '@/context/ThemeContext';

const { width, height } = Dimensions.get('window');

const BACKGROUND_IMAGES = [
  {
    uri: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&q=80',
    translateX: 20,
    translateY: 10,
    opacity: 0.3,
  },
  {
    uri: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=1200&q=80',
    translateX: -15,
    translateY: -8,
    opacity: 0.2,
  },
  {
    uri: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80',
    translateX: 10,
    translateY: -12,
    opacity: 0.15,
  },
];

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function SplashScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Animation values for content
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(20);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslateY = useSharedValue(20);

  // Animation values for parallax
  const parallaxValues = BACKGROUND_IMAGES.map(() => ({
    x: useSharedValue(0),
    y: useSharedValue(0),
  }));

  useEffect(() => {
    // Start parallax animations
    parallaxValues.forEach((values, index) => {
      const duration = 8000 + index * 1000;
      
      values.x.value = withRepeat(
        withSequence(
          withTiming(BACKGROUND_IMAGES[index].translateX, {
            duration: duration,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(-BACKGROUND_IMAGES[index].translateX, {
            duration: duration,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      );

      values.y.value = withRepeat(
        withSequence(
          withTiming(BACKGROUND_IMAGES[index].translateY, {
            duration: duration + 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(-BACKGROUND_IMAGES[index].translateY, {
            duration: duration + 1000,
            easing: Easing.inOut(Easing.ease),
          })
        ),
        -1,
        true
      );
    });

    // Animate content
    const animate = async () => {
      logoScale.value = withSpring(1, { 
        damping: 12,
        stiffness: 100,
        mass: 1,
      });
      logoOpacity.value = withTiming(1, { duration: 1000 });
      
      textOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
      textTranslateY.value = withDelay(400, withSequence(
        withSpring(-10, { damping: 8 }),
        withSpring(0, { damping: 12 })
      ));
      
      taglineOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
      taglineTranslateY.value = withDelay(800, withSpring(0, { 
        damping: 15,
        stiffness: 80,
      }));

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
    <View style={styles.container}>
      {/* Parallax Background Images */}
      {BACKGROUND_IMAGES.map((image, index) => (
        <Animated.View
          key={index}
          style={[
            styles.backgroundImageContainer,
            useAnimatedStyle(() => ({
              transform: [
                { translateX: parallaxValues[index].x.value },
                { translateY: parallaxValues[index].y.value },
              ],
            })),
          ]}
        >
          <Image
            source={{ uri: image.uri }}
            style={[styles.backgroundImage, { opacity: image.opacity }]}
          />
        </Animated.View>
      ))}

      {/* Gradient Overlay */}
      <LinearGradient
        colors={[
          `${theme.primary}CC`,
          `${theme.accent}CC`,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
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
        colors={['transparent', 'rgba(0,0,0,0.4)']}
        style={styles.bottomGradient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImageContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  backgroundImage: {
    width: width + 40,
    height: height + 40,
    position: 'absolute',
    top: -20,
    left: -20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
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
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  tagline: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  bottomGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 160,
    zIndex: 1,
  },
});