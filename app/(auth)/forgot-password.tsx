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
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import { Mail, ArrowRight, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/config/firebase';

const { width } = Dimensions.get('window');

const BACKGROUND_IMAGES = [
  'https://images.unsplash.com/photo-1583245177184-4ab53e5e391a?w=800&q=80',
  'https://images.unsplash.com/photo-1583245177184-4ab53e5e391a?w=800&q=80',
];

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccessMessage('Password reset email sent! Check your inbox.');
    } catch (error: any) {
      console.error('Reset password error:', error);
      let message = 'Failed to send reset email';
      if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email';
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
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a link to reset your password
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

            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            
            {successMessage ? (
              <Text style={styles.successText}>{successMessage}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.resetButton,
                { backgroundColor: 'rgba(255, 255, 255, 0.2)' },
                isLoading && styles.resetButtonLoading,
              ]}
              onPress={handleResetPassword}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>
                {isLoading ? 'Sending...' : 'Reset Password'}
              </Text>
              {!isLoading && <ArrowRight color="white" size={20} />}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={[styles.loginText, { color: 'rgba(255, 255, 255, 0.8)' }]}>
                Remember your password?
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
  resetButton: {
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
  resetButtonLoading: {
    opacity: 0.8,
  },
  resetButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
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
