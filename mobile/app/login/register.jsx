import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  User,
  Sms,
  Call,
  Lock,
  Eye,
  EyeSlash,
  InfoCircle,
  Teacher,
  Car,
  TickCircle,
} from 'iconsax-react-native';
import { wp, hp, fs } from '../utils/responsive';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useRouter();
  const { register } = useAuth();
  const scrollRef = useRef(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);

  const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;

  const validate = () => {
    if (!name || !email || !mobile || !password || !userType) {
      setError('All fields are required.');
      return false;
    }
    if (!emailRe.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!/^\+?[\d\s]{7,18}$/.test(mobile)) {
      setError('Please enter a valid mobile number.');
      return false;
    }
    if (password.length < 6) {
      setError('Password should be at least 6 characters.');
      return false;
    }
    if (!termsChecked) {
      setError('You must agree to the terms of service.');
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await register({ name, email, mobile, password, role: userType });
      if (user.role === 'parent') router.replace('/parent');
      else if (user.role === 'driver') router.replace('/driver');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showEmailError = emailTouched && !emailRe.test(email) && email.length > 0;

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

            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Edu-Ride to start booking safe rides</Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>I am a</Text>
            <View style={styles.userTypeContainer}>
              {[
                { value: 'parent', label: 'Parent', icon: Teacher },
                { value: 'driver', label: 'Driver', icon: Car },
              ].map((option) => {
                const isActive = userType === option.value;
                const IconComp = option.icon;
                return (
                  <TouchableOpacity
                    key={option.value}
                    style={[styles.userTypeButton, isActive && styles.userTypeButtonActive]}
                    onPress={() => setUserType(option.value)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.userTypeIconWrap, isActive && styles.userTypeIconWrapActive]}>
                      <IconComp
                        size={22}
                        color={isActive ? '#fff' : theme.colors.primary}
                        variant={isActive ? 'Bold' : 'Outline'}
                      />
                    </View>
                    <Text style={[styles.userTypeText, isActive && styles.userTypeTextActive]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full name</Text>
              <View style={styles.inputWrapper}>
                <User size={20} color={theme.colors.textMuted} variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Email</Text>
                {showEmailError && <Text style={styles.errorInline}>Invalid email</Text>}
              </View>
              <View style={[styles.inputWrapper, showEmailError && styles.inputWrapperError]}>
                <Sms size={20} color={theme.colors.textMuted} variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setEmailTouched(true)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Mobile number</Text>
              <View style={styles.inputWrapper}>
                <Call size={20} color={theme.colors.textMuted} variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="+94 77 123 4567"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  maxLength={18}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color={theme.colors.textMuted} variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
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
              <Text style={styles.passwordHint}>Minimum 6 characters</Text>
            </View>

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setTermsChecked(!termsChecked)}
              activeOpacity={0.7}
            >
              <View style={[styles.checkbox, termsChecked && styles.checkboxChecked]}>
                {termsChecked && <TickCircle size={18} color="#fff" variant="Bold" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => Linking.openURL('https://eduride.com/terms')}
                >
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text
                  style={styles.termsLink}
                  onPress={() => Linking.openURL('https://eduride.com/privacy')}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            {error ? (
              <View style={styles.errorContainer}>
                <InfoCircle size={18} color={theme.colors.danger} variant="Bold" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={styles.signUpButton}
              onPress={onSubmit}
              disabled={loading}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.signUpButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.signUpButtonText}>Create Account</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.replace('/login/login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLink}>Sign In</Text>
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
      marginBottom: hp(14),
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 60,
      width: '100%',
    },
    headerImage: {
      width: wp(160),
      height: 60,
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
      paddingTop: hp(24),
    },
    sectionLabel: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(13),
      color: theme.colors.textSecondary,
      marginBottom: 12,
    },
    userTypeContainer: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: hp(20),
    },
    userTypeButton: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.surface,
      gap: 10,
    },
    userTypeButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
      ...theme.shadows.primarySm,
    },
    userTypeIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    userTypeIconWrapActive: {
      backgroundColor: theme.colors.primary,
    },
    userTypeText: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(14),
      color: theme.colors.textSecondary,
    },
    userTypeTextActive: {
      color: theme.colors.primaryDark,
      fontFamily: theme.fontFamily.bold,
    },
    inputContainer: {
      marginBottom: hp(14),
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
    errorInline: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(12),
      color: theme.colors.danger,
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
    inputWrapperError: {
      borderColor: theme.colors.danger,
      backgroundColor: theme.colors.dangerSoft,
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
    passwordHint: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(11),
      color: theme.colors.textMuted,
      marginTop: 6,
      marginLeft: 4,
    },
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: hp(16),
      gap: 12,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxChecked: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    termsText: {
      flex: 1,
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(13),
      color: theme.colors.textMuted,
      lineHeight: 20,
    },
    termsLink: {
      color: theme.colors.primary,
      fontFamily: theme.fontFamily.medium,
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
    signUpButton: {
      borderRadius: theme.radius.pill,
      overflow: 'hidden',
      marginBottom: hp(18),
      ...theme.shadows.primaryMd,
    },
    signUpButtonGradient: {
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    signUpButtonText: {
      fontFamily: theme.fontFamily.bold,
      color: '#fff',
      fontSize: fs(16),
      letterSpacing: 0.3,
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(14),
      color: theme.colors.textMuted,
    },
    loginLink: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(14),
      color: theme.colors.primary,
    },
  });
