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
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { Alert } from 'react-native';
import { updateProfile } from 'firebase/auth';

const { width } = Dimensions.get('window');

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1547683905-f686c993c4ac?w=800&q=80',
  'https://images.unsplash.com/photo-1583245177184-4ab53e5e391a?w=800&q=80',
];

export default function RegisterScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const userCredential = await register(email, password);

      // Update user profile with display name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }

      setSuccessMessage('Account created successfully!');

      // Short delay to show success message before redirecting
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
    } catch (error: any) {
      console.error('Registration error:', error);
      let message = 'Failed to create account';
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password is too weak';
      } else if (error.code === 'auth/operation-not-allowed') {
        message = 'Account creation is disabled';
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

        {/* Back Button */}
        <Animated.View
          entering={FadeIn.delay(200)}
          style={styles.backButton}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButtonInner, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}
          >
            <ChevronLeft color="white" size={24} />
          </TouchableOpacity>
        </Animated.View>

        {/* Content */}
        <View style={styles.content}>
          <Animated.View
            entering={FadeInDown.delay(200)}
            style={styles.header}
          >
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join our community of flood awareness and prevention
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(400)}
            style={styles.form}
          >
            <View style={[styles.inputContainer, { backgroundColor: theme.card }]}>
              <User size={20} color={theme.secondary} />
              <TextInput
                style={[styles.input, { color: theme.text }]}
                placeholder="Full Name"
                placeholderTextColor={theme.secondary}
                value={name}
                onChangeText={setName}
              />
            </View>

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
              style={[
                styles.registerButton,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                isLoading && styles.registerButtonLoading,
              ]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.registerButtonText}>
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
              {!isLoading && <ArrowRight color="white" size={20} />}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                Already have an account?
              </Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={[styles.loginLink, { color: 'white' }]}>
                  Sign In
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
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    zIndex: 10,
  },
  backButtonInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  registerButton: {
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
  registerButtonLoading: {
    opacity: 0.8,
  },
  registerButtonText: {
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    gap: 8,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
  },
});