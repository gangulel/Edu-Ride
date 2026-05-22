import React, { useState, useRef, useEffect } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Sms,
  Lock,
  Eye,
  EyeSlash,
  InfoCircle,
  Apple,
} from "iconsax-react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import GoogleLogo from "../components/icons/GoogleLogo";
import { responsive, wp, hp, fs } from "../utils/responsive";
import { apiFetch } from "../../services/api";

// Required for web browser redirect
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Google Auth configuration
  // Note: Replace these with your actual Google OAuth Client IDs from Google Cloud Console
  const [request, response, promptAsync] = Google.useAuthRequest({
    // Get these from https://console.cloud.google.com/apis/credentials
    androidClientId: "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleGoogleAuthSuccess(authentication);
    } else if (response?.type === "error") {
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  }, [response]);

  const handleGoogleAuthSuccess = async (authentication) => {
    try {
      // Get user info from Google
      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${authentication.accessToken}` },
        }
      );
      const userInfo = await userInfoResponse.json();

      console.log("Google User Info:", userInfo);

      // Here you would typically:
      // 1. Send the token to your backend for verification
      // 2. Create/login the user in your database
      // 3. Store the session token

      setGoogleLoading(false);

      // Navigate to driver home on success
      router.replace("/driver");
    } catch (err) {
      console.error("Error fetching user info:", err);
      setError("Failed to get user information. Please try again.");
      setGoogleLoading(false);
    }
  };

  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;

  const validate = () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return false;
    }
    if (!re.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const role = payload?.user?.role;
      if (role === "parent") {
        router.replace("/parent");
      } else if (role === "driver") {
        router.replace("/driver");
      } else {
        setError("Your account role is not supported in mobile app.");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    setGoogleLoading(true);
    try {
      await promptAsync();
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      setError("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  const handleAppleLogin = () => {
    // Handle Apple login
    Alert.alert("Coming Soon", "Apple Sign-In will be available soon!");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerSection}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>

            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/images/bluelogo.png")}
                style={styles.headerImage}
                resizeMode="contain"
                onError={(e) => console.log("Logo failed to load:", e.nativeEvent.error)}
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { marginBottom: 8 }]}>Email</Text>
              <View style={styles.inputWrapper}>
                <Sms size={20} color="#666" variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Password</Text>
                <TouchableOpacity
                  onPress={() => router.push("/login/forgot")}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#666" variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#999"
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
                    <EyeSlash size={22} color="#666" variant="Outline" />
                  ) : (
                    <Eye size={22} color="#666" variant="Outline" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <InfoCircle size={18} color="#E53935" variant="Bold" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={onSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.continueButtonText}>Continue</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity
              style={[styles.socialButton, googleLoading && styles.socialButtonDisabled]}
              onPress={handleGoogleLogin}
              activeOpacity={0.7}
              disabled={googleLoading || !request}
            >
              {googleLoading ? (
                <ActivityIndicator color="#3B82F6" size="small" />
              ) : (
                <>
                  <GoogleLogo size={20} />
                  <Text style={styles.socialButtonText}>Continue with Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleLogin}
              activeOpacity={0.7}
            >
              <Apple size={22} color="#000" variant="Bold" />
              <Text style={styles.socialButtonText}>Continue with Apple</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() => router.replace("/login/register")}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: hp(60),
    left: wp(20),
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  logoContainer: {
    marginTop: hp(30),
    marginBottom: hp(30),
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    width: "100%",
  },
  headerImage: {
    width: wp(200),
    height: 80,
    minHeight: 60,
  },
  title: {
    fontSize: fs(26),
    fontFamily: "Roboto-Bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: fs(15),
    fontFamily: "Roboto-Regular",
    color: "#666",
    textAlign: "center",
  },
  formSection: {
    flex: 1,
    paddingHorizontal: wp(24),
    paddingTop: hp(30),
  },
  inputContainer: {
    marginBottom: hp(18),
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: fs(14),
    fontFamily: "Roboto-Medium",
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: fs(15),
    fontFamily: "Roboto-Regular",
    color: "#000",
    paddingVertical: 16,
  },
  eyeButton: {
    padding: 8,
  },
  forgotPasswordText: {
    fontSize: fs(13),
    fontFamily: "Roboto-Medium",
    color: "#3B82F6",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: hp(16),
    gap: 8,
  },
  errorText: {
    fontSize: fs(13),
    fontFamily: "Roboto-Regular",
    color: "#E53935",
    flex: 1,
  },
  continueButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(24),
  },
  continueButtonText: {
    color: "#fff",
    fontSize: fs(16),
    fontFamily: "Roboto-Medium",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(24),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  dividerText: {
    paddingHorizontal: 20,
    fontSize: fs(14),
    fontFamily: "Roboto-Regular",
    color: "#999",
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 30,
    paddingVertical: 16,
    marginBottom: hp(12),
    backgroundColor: "#fff",
    gap: 12,
  },
  socialButtonDisabled: {
    opacity: 0.7,
    backgroundColor: "#F5F5F5",
  },
  socialButtonText: {
    fontSize: fs(15),
    fontFamily: "Roboto-Medium",
    color: "#000",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp(24),
  },
  signupText: {
    fontSize: fs(14),
    fontFamily: "Roboto-Regular",
    color: "#666",
  },
  signupLink: {
    fontSize: fs(14),
    fontFamily: "Roboto-Bold",
    color: "#3B82F6",
  },
});
