import React, { useState, useId, useRef } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
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
} from "iconsax-react-native";
import { responsive, wp, hp, fs } from "../utils/responsive";
import { apiFetch } from "../../services/api";

export default function Register() {
  const router = useRouter();
  const id = useId();
  const scrollRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [userType, setUserType] = useState(""); // "parent" or "driver"
  const [emailTouched, setEmailTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);

  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;

  const validate = () => {
    if (!name || !email || !mobile || !password || !userType) {
      setError("All fields are required.");
      return false;
    }
    if (!re.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!/^\+?\d{7,15}$/.test(mobile)) {
      setError("Please enter a valid mobile number.");
      return false;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return false;
    }
    if (!termsChecked) {
      setError("You must agree to the terms of service.");
      return false;
    }
    return true;
  };

  const onSubmit = async () => {
    setError("");
    if (!validate()) return;
    setLoading(true);

    try {
      const payload = await apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          fullName: name,
          email,
          phone: mobile,
          password,
          role: userType,
        }),
      });

      setLoading(false);
      const resolvedRole = payload?.user?.role || userType;

      if (resolvedRole === "parent") {
        router.replace("/parent");
      } else if (resolvedRole === "driver") {
        router.replace("/driver");
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || "Registration failed. Please try again.");
    }
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
              />
            </View>

            {/* Title */}
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join Edu-Ride today</Text>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            {/* User Type Selection */}
            <Text style={[styles.label, { marginBottom: 12 }]}>I am a</Text>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "parent" && styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType("parent")}
                activeOpacity={0.7}
              >
                <Teacher
                  size={24}
                  color={userType === "parent" ? "#fff" : "#666"}
                  variant={userType === "parent" ? "Bold" : "Outline"}
                />
                <Text
                  style={[
                    styles.userTypeText,
                    userType === "parent" && styles.userTypeTextActive,
                  ]}
                >
                  Parent
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "driver" && styles.userTypeButtonActive,
                ]}
                onPress={() => setUserType("driver")}
                activeOpacity={0.7}
              >
                <Car
                  size={24}
                  color={userType === "driver" ? "#fff" : "#666"}
                  variant={userType === "driver" ? "Bold" : "Outline"}
                />
                <Text
                  style={[
                    styles.userTypeText,
                    userType === "driver" && styles.userTypeTextActive,
                  ]}
                >
                  Driver
                </Text>
              </TouchableOpacity>
            </View>

            {/* Full Name Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { marginBottom: 8 }]}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <User size={20} color="#666" variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Email</Text>
                {emailTouched && !re.test(email) && email.length > 0 ? (
                  <Text style={styles.errorInline}>Invalid email</Text>
                ) : null}
              </View>
              <View
                style={[
                  styles.inputWrapper,
                  emailTouched && !re.test(email) && email.length > 0 && styles.inputWrapperError,
                ]}
              >
                <Sms size={20} color="#666" variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  onBlur={() => setEmailTouched(true)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Mobile Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { marginBottom: 8 }]}>Mobile Number</Text>
              <View style={styles.inputWrapper}>
                <Call size={20} color="#666" variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your mobile number"
                  placeholderTextColor="#999"
                  value={mobile}
                  onChangeText={setMobile}
                  keyboardType="phone-pad"
                  maxLength={15}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { marginBottom: 8 }]}>Password</Text>
              <View style={styles.inputWrapper}>
                <Lock size={20} color="#666" variant="Outline" />
                <TextInput
                  style={styles.input}
                  placeholder="Create a password"
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
              <Text style={styles.passwordHint}>Minimum 6 characters</Text>
            </View>

            {/* Terms of Service Checkbox */}
            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setTermsChecked(!termsChecked)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.checkbox,
                  termsChecked && styles.checkboxChecked,
                ]}
              >
                {termsChecked && (
                  <TickCircle size={18} color="#fff" variant="Bold" />
                )}
              </View>
              <Text style={styles.termsText}>
                I agree to the{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => Linking.openURL("https://eduride.com/terms")}
                >
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text
                  style={styles.termsLink}
                  onPress={() => Linking.openURL("https://eduride.com/privacy")}
                >
                  Privacy Policy
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Error Message */}
            {error ? (
              <View style={styles.errorContainer}>
                <InfoCircle size={18} color="#E53935" variant="Bold" />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {/* Sign Up Button */}
            <TouchableOpacity
              style={styles.signUpButton}
              onPress={onSubmit}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.signUpButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity
                onPress={() => router.replace("/login/login")}
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
    marginTop: hp(20),
    marginBottom: hp(20),
    alignItems: "center",
    justifyContent: "center",
    minHeight: 60,
    width: "100%",
  },
  headerImage: {
    width: wp(160),
    height: 60,
    minHeight: 50,
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
    paddingTop: hp(24),
  },
  userTypeContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: hp(20),
  },
  userTypeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    backgroundColor: "#fff",
    gap: 10,
  },
  userTypeButtonActive: {
    borderColor: "#3B82F6",
    backgroundColor: "#3B82F6",
  },
  userTypeText: {
    fontSize: fs(15),
    fontFamily: "Roboto-Medium",
    color: "#666",
  },
  userTypeTextActive: {
    color: "#fff",
  },
  inputContainer: {
    marginBottom: hp(16),
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
  errorInline: {
    fontSize: fs(12),
    fontFamily: "Roboto-Medium",
    color: "#E53935",
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
  inputWrapperError: {
    borderColor: "#E53935",
    backgroundColor: "#FFF5F5",
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
  passwordHint: {
    fontSize: fs(12),
    fontFamily: "Roboto-Regular",
    color: "#999",
    marginTop: 6,
    marginLeft: 4,
  },
  termsContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: hp(16),
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  termsText: {
    flex: 1,
    fontSize: fs(13),
    fontFamily: "Roboto-Regular",
    color: "#666",
    lineHeight: 20,
  },
  termsLink: {
    color: "#3B82F6",
    fontFamily: "Roboto-Medium",
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
  signUpButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp(20),
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: fs(16),
    fontFamily: "Roboto-Medium",
  },
  loginContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: fs(14),
    fontFamily: "Roboto-Regular",
    color: "#666",
  },
  loginLink: {
    fontSize: fs(14),
    fontFamily: "Roboto-Bold",
    color: "#3B82F6",
  },
});
