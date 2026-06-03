import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { responsive, wp, hp } from "../utils/responsive";
import { apiFetch } from "../../services/api";

export default function Forgot() {
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError("Please enter your email address.");
      return false;
    }
    if (!re.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    setLoading(true);
    try {
      await apiFetch("/auth/forgot", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      setMessage("If an account with that email exists, a reset link was sent.");
    } catch (err) {
      setError(err.message || "Unable to contact server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot password</Text>

      <Text style={styles.info}>Enter the email associated with your account and we'll send a reset link.</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
        placeholderTextColor="#999"
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}

      <TouchableOpacity onPress={onSubmit} activeOpacity={0.9} style={{ marginTop: responsive.paddingSM }} disabled={loading}>
        <LinearGradient colors={["#3A7BD5", "#007AFF"]} style={styles.button} start={[0, 0]} end={[1, 1]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send reset link</Text>}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login/login")} style={styles.link}>
        <Text style={styles.linkText}>Back to login</Text>
      </TouchableOpacity>
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
