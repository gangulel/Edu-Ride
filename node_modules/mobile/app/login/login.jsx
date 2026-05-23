import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  Sms,
  Lock,
  Eye,
  EyeSlash,
  InfoCircle,
  Apple,
} from 'iconsax-react-native';
import GoogleLogo from '../components/icons/GoogleLogo';
import { wp, hp, fs } from '../utils/responsive';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { validateAuthForm } from '../utils/validation';

export default function Login() {
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useRouter();
  const { login, user } = useAuth();
  const scrollRef = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // When Firebase fires onAuthStateChanged and our profile lands, route to
  // the right home. This handles both fresh logins and an already-signed-in
  // user landing on /login by accident.
  useEffect(() => {
    if (!user) return;
    if (user.role === 'driver') router.replace('/driver');
    else if (user.role === 'parent') router.replace('/parent');
  }, [user, router]);

  const onSubmit = async () => {
    setError('');
    const { errors, isValid } = validateAuthForm({ email, password, mode: 'login' });
    if (!isValid) {
      setError(errors.email || errors.password || 'Please fix the errors and try again.');
      return;
    }
    setLoading(true);
    try {
      // Firebase: login() returns a Firebase user. AuthContext picks up the
      // role via Firestore on the next onAuthStateChanged tick and the
      // useEffect above does the redirect.
      await login(email, password);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = (role) => {
    if (role === 'parent') {
      setEmail('parent@edu-ride.test');
      setPassword('parent123');
    } else {
      setEmail('driver@edu-ride.test');
      setPassword('driver123');
    }
    setError('');
  };

  const handleGoogleLogin = () => {
    Alert.alert('Demo mode', 'Social sign-in will be wired up in Phase 2. Use a demo account for now.');
  };

  const handleAppleLogin = () => {
    Alert.alert('Coming Soon', 'Apple Sign-In will be available soon!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <View style={styles.backButtonCircle}>
                <ArrowLeft size={20} color={theme.colors.textPrimary} />
              </View>
            </TouchableOpacity>

            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/images/bluelogo.png')}
                style={styles.headerImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue managing your rides</Text>
          </View>

          <View style={styles.formSection}>
            <View style={styles.demoChips}>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => useDemoAccount('parent')}
                activeOpacity={0.8}
              >
                <Text style={styles.demoChipText}>Demo: Parent</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.demoChip}
                onPress={() => useDemoAccount('driver')}
                activeOpacity={0.8}
              >
                <Text style={styles.demoChipText}>Demo: Driver</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email address</Text>
              <View style={styles.inputWrapper}>
                <Sms size={20} color={theme.colors.textMuted} variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity
                  onPress={() => router.push('/login/forgot')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>Forgot?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={theme.colors.textMuted} variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                >
                  {showPassword ? (
                    <EyeSlash size={22} color={theme.colors.textMuted} variant="Outline" />
                  ) : (
                    <Eye size={22} color={theme.colors.textMuted} variant="Outline" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {error ? (
              <View style={styles.errorContainer}>
                <InfoCircle size={18} color={theme.colors.danger} variant="Bold" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.continueButton}
              onPress={onSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.continueButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.continueButtonText}>Sign In</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleGoogleLogin}
                activeOpacity={0.85}
              >
                <GoogleLogo size={20} />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={handleAppleLogin}
                activeOpacity={0.85}
              >
                <Apple size={22} color={theme.colors.textPrimary} variant="Bold" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.replace('/login/register')}
                activeOpacity={0.7}
              >
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
    },
    keyboardView: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: hp(40),
    },
    headerSection: {
      paddingTop: hp(60),
      paddingHorizontal: wp(24),
      alignItems: 'center',
    },
    backButton: {
      position: 'absolute',
      top: hp(60),
      left: wp(16),
      zIndex: 10,
    },
    backButtonCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoContainer: {
      marginTop: hp(20),
      marginBottom: hp(20),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 80,
      width: '100%',
    },
    headerImage: {
      width: wp(180),
      height: 80,
      minHeight: 60,
    },
    title: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(26),
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: 6,
    },
    subtitle: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(14),
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    formSection: {
      flex: 1,
      paddingHorizontal: wp(24),
      paddingTop: hp(28),
    },
    demoChips: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: hp(20),
    },
    demoChip: {
      flex: 1,
      paddingVertical: 10,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.primarySoft,
      borderWidth: 1,
      borderColor: theme.colors.primaryLight,
      alignItems: 'center',
    },
    demoChipText: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(12),
      color: theme.colors.primaryDark,
    },
    inputContainer: {
      marginBottom: hp(16),
    },
    labelRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    label: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(13),
      color: theme.colors.textSecondary,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1.5,
      borderColor: theme.colors.inputBorder,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.inputBackground,
      paddingHorizontal: 16,
      gap: 12,
    },
    input: {
      flex: 1,
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(15),
      color: theme.colors.textPrimary,
      paddingVertical: 16,
    },
    eyeButton: {
      padding: 6,
    },
    forgotPasswordText: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(13),
      color: theme.colors.primary,
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.dangerSoft,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: theme.radius.md,
      marginBottom: hp(14),
      gap: 10,
    },
    errorText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(13),
      color: theme.colors.dangerDark,
      flex: 1,
    },
    continueButton: {
      borderRadius: theme.radius.pill,
      overflow: 'hidden',
      marginBottom: hp(22),
      ...theme.shadows.primaryMd,
    },
    continueButtonGradient: {
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    continueButtonText: {
      fontFamily: theme.fontFamily.bold,
      color: '#fff',
      fontSize: fs(16),
      letterSpacing: 0.3,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: hp(20),
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.divider,
    },
    dividerText: {
      paddingHorizontal: 16,
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(12),
      color: theme.colors.textMuted,
    },
    socialRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: hp(16),
    },
    socialButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.pill,
      paddingVertical: 14,
      backgroundColor: theme.colors.surface,
      gap: 10,
    },
    socialButtonText: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(14),
      color: theme.colors.textPrimary,
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(20),
    },
    signupText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(14),
      color: theme.colors.textMuted,
    },
    signupLink: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(14),
      color: theme.colors.primary,
    },
  });
