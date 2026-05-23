import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Sms, InfoCircle, TickCircle } from 'iconsax-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { wp, hp, fs } from '../utils/responsive';
import { useAuth } from '../contexts/AuthContext';
import { isValidEmail } from '../utils/validation';

export default function Forgot() {
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useRouter();
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordReset(email);
      // Identical message whether the email exists or not — prevents account
      // enumeration via the reset endpoint.
      setMessage('If an account with that email exists, a reset link was sent.');
    } catch (err) {
      // Even on failure, surface a generic message (but log the real error).
      console.warn('Password reset failed:', err.message);
      setMessage('If an account with that email exists, a reset link was sent.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <View style={styles.backButtonCircle}>
          <ArrowLeft size={20} color={theme.colors.textPrimary} />
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password?</Text>
        <Text style={styles.subtitle}>
          Enter the email associated with your account and we'll send you a reset link.
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email address</Text>
          <View style={styles.inputWrapper}>
            <Sms size={20} color={theme.colors.textMuted} variant="Outline" />
            <TextInput
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.inputPlaceholder}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.input}
            />
          </View>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <InfoCircle size={18} color={theme.colors.danger} variant="Bold" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {message ? (
          <View style={styles.successContainer}>
            <TickCircle size={18} color={theme.colors.success} variant="Bold" />
            <Text style={styles.successText}>{message}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          onPress={onSubmit}
          activeOpacity={0.85}
          disabled={loading}
          style={styles.button}
        >
          <LinearGradient
            colors={theme.colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send reset link</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace('/login/login')}
          style={styles.link}
          activeOpacity={0.7}
        >
          <Text style={styles.linkText}>Back to sign in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      paddingTop: hp(60),
      paddingHorizontal: wp(24),
    },
    backButton: {
      marginBottom: hp(20),
    },
    backButtonCircle: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      paddingTop: hp(16),
    },
    title: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(28),
      color: theme.colors.textPrimary,
      marginBottom: 8,
    },
    subtitle: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(14),
      color: theme.colors.textMuted,
      lineHeight: 20,
      marginBottom: hp(28),
    },
    inputContainer: {
      marginBottom: hp(16),
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
    successContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.successSoft,
      paddingHorizontal: 14,
      paddingVertical: 12,
      borderRadius: theme.radius.md,
      marginBottom: hp(14),
      gap: 10,
    },
    successText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(13),
      color: theme.colors.successDark,
      flex: 1,
    },
    button: {
      borderRadius: theme.radius.pill,
      overflow: 'hidden',
      ...theme.shadows.primaryMd,
      marginTop: hp(6),
    },
    buttonGradient: {
      paddingVertical: 18,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontFamily: theme.fontFamily.bold,
      color: '#fff',
      fontSize: fs(16),
      letterSpacing: 0.3,
    },
    link: {
      marginTop: hp(20),
      alignItems: 'center',
    },
    linkText: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(14),
      color: theme.colors.primary,
    },
  });
