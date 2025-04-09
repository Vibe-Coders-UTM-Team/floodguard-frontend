import React, { useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import LottieView from 'lottie-react-native';
import { useTheme } from '@/context/ThemeContext';
import {
  MapPin,
  Bell,
  Shield,
  ArrowRight,
  ChevronRight,
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

const BACKGROUND_IMAGES = [
  {
    id: '1',
    images: [
      {
        uri: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1200&q=80',
        translateX: 15,
        translateY: 8,
        opacity: 0.3,
      },
      {
        uri: 'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=1200&q=80',
        translateX: -10,
        translateY: -5,
        opacity: 0.2,
      },
    ],
  },
  {
    id: '2',
    images: [
      {
        uri: 'https://images.unsplash.com/photo-1547683905-f686c993c4ac?w=1200&q=80',
        translateX: 12,
        translateY: 6,
        opacity: 0.3,
      },
      {
        uri: 'https://images.unsplash.com/photo-1583245177184-4ab53e5e391a?w=1200&q=80',
        translateX: -8,
        translateY: -4,
        opacity: 0.2,
      },
    ],
  },
  {
    id: '3',
    images: [
      {
        uri: 'https://images.unsplash.com/photo-1523772721666-22ad3c3b6f90?w=1200&q=80',
        translateX: 10,
        translateY: 5,
        opacity: 0.3,
      },
      {
        uri: 'https://images.unsplash.com/photo-1583245177184-4ab53e5e391a?w=1200&q=80',
        translateX: -6,
        translateY: -3,
        opacity: 0.2,
      },
    ],
  },
];

const ONBOARDING_DATA = [
  {
    id: '1',
    title: 'Welcome to FloodGuard+',
    description: 'Your comprehensive flood monitoring and alert system, designed to keep you and your community safe.',
    animation: 'https://assets5.lottiefiles.com/packages/lf20_qp1q7mct.json',
  },
  {
    id: '2',
    title: 'Real-time Monitoring',
    description: 'Get instant updates on water levels, weather conditions, and potential flood risks in your area.',
    animation: 'https://assets5.lottiefiles.com/packages/lf20_q5pk6p1k.json',
    features: [
      {
        icon: MapPin,
        title: 'Interactive Maps',
        description: 'Visualize flood-prone areas and evacuation routes',
      },
      {
        icon: Bell,
        title: 'Smart Alerts',
        description: 'Receive timely notifications about potential risks',
      },
      {
        icon: Shield,
        title: 'Emergency Response',
        description: 'Quick access to emergency services and resources',
      },
    ],
  },
  {
    id: '3',
    title: 'Stay Prepared',
    description: 'Access vital resources, emergency contacts, and evacuation plans at your fingertips.',
    animation: 'https://assets3.lottiefiles.com/packages/lf20_vPnn3K.json',
  },
];

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [currentPage, setCurrentPage] = useState(0);

  // Animation values for parallax
  const parallaxValues = BACKGROUND_IMAGES.map(() => ({
    images: [
      { x: useSharedValue(0), y: useSharedValue(0) },
      { x: useSharedValue(0), y: useSharedValue(0) },
    ],
  }));

  useEffect(() => {
    // Start parallax animations for each page
    parallaxValues.forEach((page, pageIndex) => {
      page.images.forEach((values, imageIndex) => {
        const image = BACKGROUND_IMAGES[pageIndex].images[imageIndex];
        const duration = 8000 + imageIndex * 1000;

        values.x.value = withRepeat(
          withSequence(
            withTiming(image.translateX, {
              duration,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(-image.translateX, {
              duration,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          true
        );

        values.y.value = withRepeat(
          withSequence(
            withTiming(image.translateY, {
              duration: duration + 1000,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(-image.translateY, {
              duration: duration + 1000,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          true
        );
      });
    });
  }, []);

  const handleNext = () => {
    if (currentPage < ONBOARDING_DATA.length - 1) {
      scrollRef.current?.scrollTo({
        x: width * (currentPage + 1),
        animated: true,
      });
      setCurrentPage(currentPage + 1);
    } else {
      router.replace('/login');
    }
  };

  const handleScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentPage(page);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {ONBOARDING_DATA.map((page, pageIndex) => (
          <View key={page.id} style={styles.page}>
            {/* Background Images with Parallax */}
            {BACKGROUND_IMAGES[pageIndex].images.map((image, imageIndex) => (
              <Animated.View
                key={`${pageIndex}-${imageIndex}`}
                style={[
                  styles.backgroundImageContainer,
                  useAnimatedStyle(() => ({
                    transform: [
                      { translateX: parallaxValues[pageIndex].images[imageIndex].x.value },
                      { translateY: parallaxValues[pageIndex].images[imageIndex].y.value },
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
              colors={[`${theme.primary}CC`, `${theme.accent}CC`]}
              style={StyleSheet.absoluteFill}
            />

            {/* Content */}
            <Animated.View
              entering={SlideInRight.delay(pageIndex * 100)}
              exiting={SlideOutLeft}
              style={styles.content}
            >
              <View style={styles.animationContainer}>
                <LottieView
                  source={{ uri: page.animation }}
                  autoPlay
                  loop
                  style={styles.animation}
                />
              </View>

              <Text style={[styles.title, { color: 'white' }]}>{page.title}</Text>
              <Text style={[styles.description, { color: 'rgba(255, 255, 255, 0.9)' }]}>
                {page.description}
              </Text>

              {page.features && (
                <View style={styles.featuresContainer}>
                  {page.features.map((feature, idx) => (
                    <Animated.View
                      key={idx}
                      entering={FadeIn.delay(idx * 200)}
                      style={[styles.featureCard, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
                        <feature.icon size={24} color="white" />
                      </View>
                      <View style={styles.featureContent}>
                        <Text style={[styles.featureTitle, { color: 'white' }]}>
                          {feature.title}
                        </Text>
                        <Text style={[styles.featureDescription, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                          {feature.description}
                        </Text>
                      </View>
                      <ChevronRight size={20} color="rgba(255, 255, 255, 0.8)" />
                    </Animated.View>
                  ))}
                </View>
              )}
            </Animated.View>
          </View>
        ))}
      </ScrollView>

      <LinearGradient
        colors={['transparent', 'rgba(0, 0, 0, 0.4)']}
        style={styles.footer}
      >
        <View style={styles.paginationContainer}>
          {ONBOARDING_DATA.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  backgroundColor:
                    currentPage === index ? 'white' : 'rgba(255, 255, 255, 0.4)',
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>
            {currentPage === ONBOARDING_DATA.length - 1 ? 'Get Started' : 'Next'}
          </Text>
          <ArrowRight color="white" size={20} />
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  page: {
    width,
    height,
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
    padding: 24,
    paddingTop: 60,
    zIndex: 1,
  },
  animationContainer: {
    width: width * 0.8,
    height: width * 0.8,
    alignSelf: 'center',
    marginBottom: 40,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 32,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingTop: 48,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});