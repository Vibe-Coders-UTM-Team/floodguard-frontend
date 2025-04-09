import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';

const { width } = Dimensions.get('window');

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80',
  'https://images.unsplash.com/photo-1446776858070-70c3d5ed6758?w=800&q=80',
];

export default function LoginScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await login(email, password);
      setSuccessMessage('Login successful!');

      // Short delay to show success message before redirecting
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
    } catch (error: any) {
      console.error('Login error:', error);
      let message = 'Failed to sign in';
      if (error.code === 'auth/invalid-credential') {
        message = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/user-disabled') {
        message = 'This account has been disabled';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please try again later';
      }
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Background Images */}
        <View style={styles.backgroundContainer}>
          {BACKGROUND_IMAGES.map((image, index) => (
            <Image
              key={index}
              source={{ uri: image }}
              style={[
                styles.backgroundImage,
                { opacity: index === 0 ? 0.3 : 0.2 },
              ]}
            />
          ))}
          <LinearGradient
            colors={[
              `${theme.primary}CC`,
              `${theme.accent}CC`,
            ]}
            style={StyleSheet.absoluteFill}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Animated.View
            entering={FadeInDown.delay(200)}
            style={styles.header}
          >
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue protecting your community
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400)}
            style={styles.form}
          >
            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
              <Mail size={20} color={theme.secondary} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Email"
                placeholderTextColor={theme.secondary}
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
              <Lock size={20} color={theme.secondary} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Password"
                placeholderTextColor={theme.secondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                {showPassword ? (
                  <EyeOff size={20} color={theme.secondary} />
                ) : (
                  <Eye size={20} color={theme.secondary} />
                )}
              </TouchableOpacity>
            </View>

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}

            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}

            <TouchableOpacity
              onPress={() => router.push('/forgot-password')}
              style={styles.forgotPassword}
            >
              <Text style={[styles.forgotPasswordText, { color: 'white' }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.loginButton,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                isLoading && styles.loginButtonLoading,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.loginButtonText}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Text>
              {!isLoading && <ArrowRight color="white" size={20} />}
            </TouchableOpacity>

            <View style={styles.registerContainer}>
              <Text style={[styles.registerText, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                Don't have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={[styles.registerLink, { color: 'white' }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
  },
  backgroundContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 4,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  loginButtonLoading: {
    opacity: 0.8,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  successText: {
    color: '#4BB543',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  registerText: {
    fontSize: 14,
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});