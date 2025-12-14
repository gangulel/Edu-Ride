import React, { useState, useId, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Linking, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import PasswordInput from "../components/PasswordInput";
import Checkbox from "../components/ui/Checkbox";
import { useRouter } from "expo-router";
import { responsive, wp, hp } from "../utils/responsive";

export default function Register() {
  const router = useRouter();
  const id = useId();
  const passwordId = `${id}-password`;
  const scrollRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState(""); // "student" or "driver"
  const [emailTouched, setEmailTouched] = useState(false);
  // confirm password removed per request
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsChecked, setTermsChecked] = useState(false);

  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;

  // password strength helpers moved to PasswordInput component

  const validate = () => {
    if (!name || !email || !mobile || !password || !userType) {
      setError("All fields are required.");
      return false;
    }
    if (!re.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    // basic mobile number check: optional +, then 7-15 digits
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

  const onSubmit = () => {
    setError("");
    if (!validate()) return;
    setLoading(true);
    // Mock API signup
    setTimeout(() => {
      setLoading(false);
      // After successful signup, navigate based on user type
      if (userType === "student") {
        router.replace("/home"); // Navigate to student page
      } else if (userType === "driver") {
        router.replace("/driver"); // Navigate to driver page
      }
    }, 1000);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}>
      <ScrollView ref={scrollRef} contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: responsive.paddingXL, backgroundColor: "#fff" }} keyboardShouldPersistTaps="handled">
        <View>
          <Text style={styles.title}>Create account</Text>

          <View style={{ marginBottom: 8 }}>
            <Label htmlFor={id}>Full name</Label>
            <Input
              nativeID={id}
              placeholder="Full name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
              autoFocus={true}
              onFocus={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
            />
          </View>

          {/* User Type Selection */}
          <View style={{ marginBottom: 12 }}>
            <Label htmlFor={`${id}-usertype`}>I am a</Label>
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "student" && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType("student")}
              >
                <Text style={[
                  styles.userTypeText,
                  userType === "student" && styles.userTypeTextActive
                ]}>
                  Student
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === "driver" && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType("driver")}
              >
                <Text style={[
                  styles.userTypeText,
                  userType === "driver" && styles.userTypeTextActive
                ]}>
                  Driver
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Labeled email input with accessibility linking; show inline error next to label */}
          <View style={styles.emailLabelRow}>
            <Text nativeID={`${id}-label`} style={styles.label} accessibilityRole="text">
              Email
            </Text>
            {emailTouched && !re.test(email) ? (
              <Text
                style={styles.errorInline}
                accessibilityRole="alert"
                accessibilityLiveRegion="polite"
              >
                Email is invalid
              </Text>
            ) : null}
          </View>

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            onBlur={() => setEmailTouched(true)}
            keyboardType="email-address"
            autoCapitalize="none"
            style={[
              styles.input,
              emailTouched && !re.test(email) ? styles.inputInvalid : null,
            ]}
            placeholderTextColor="#999"
            nativeID={id}
            accessibilityLabelledBy={`${id}-label`}
            accessible
            onFocus={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
          />

          <View style={{ marginBottom: 8 }}>
            <Label htmlFor={`${id}-mobile`}>Mobile number</Label>
            <Input
              nativeID={`${id}-mobile`}
              placeholder="Mobile number"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              placeholderTextColor="#999"
              maxLength={15}
              onFocus={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
            />
          </View>

          {/* Password input with visibility toggle and strength indicator (componentized) */}
          <View style={{ marginBottom: 8 }}>
            <Label htmlFor={passwordId}>Password</Label>
            <PasswordInput id={passwordId} password={password} setPassword={setPassword} showOnlyStrengthBar={true} onFocus={() => scrollRef.current?.scrollTo({ y: 0, animated: true })} />
          </View>

          {/* Terms of service checkbox */}
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <Checkbox id={id} value={termsChecked} onValueChange={setTermsChecked} />
            <Text
              style={{ marginLeft: responsive.paddingSM, color: "#111", fontSize: responsive.fontMD }}
              accessibilityRole="text"
            >
              I agree to the
              {' '}
              <Text
                style={{ textDecorationLine: "underline", color: "#007AFF" }}
                onPress={() => Linking.openURL("https://coss.com/origin")}
              >
                terms of service
              </Text>
            </Text>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/login/login")} style={styles.link}>
            <Text style={styles.linkText}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: responsive.paddingXL,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: responsive.font4XL,
    fontWeight: "700",
    marginBottom: responsive.paddingLG,
    color: "#111",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: responsive.paddingMD,
    borderRadius: responsive.radiusMD,
    marginBottom: responsive.paddingMD,
    fontSize: responsive.fontLG,
    minHeight: responsive.inputHeight,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: responsive.paddingMD,
    borderRadius: responsive.radiusMD,
    alignItems: "center",
    marginTop: responsive.paddingSM,
    minHeight: responsive.buttonHeight,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: responsive.fontLG,
  },
  error: {
    color: "#c0392b",
    marginBottom: responsive.paddingSM,
    fontSize: responsive.fontMD,
  },
  link: {
    marginTop: responsive.paddingLG,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: responsive.fontMD,
  },
  label: {
    fontSize: responsive.fontMD,
    fontWeight: "600",
    marginBottom: responsive.paddingSM,
    color: "#111",
  },
  inputInvalid: {
    borderColor: "#c0392b",
  },
  emailError: {
    marginBottom: responsive.paddingSM,
  },
  emailLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsive.paddingSM,
  },
  errorInline: {
    color: "#c0392b",
    fontSize: responsive.fontSM,
    marginLeft: responsive.paddingSM,
    fontWeight: "600",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: responsive.paddingMD,
  },
  toggleButton: {
    position: "absolute",
    right: wp(10),
    top: hp(12),
    height: wp(24),
    width: wp(24),
    alignItems: "center",
    justifyContent: "center",
  },
  strengthBarWrap: {
    marginTop: responsive.paddingSM,
    marginBottom: responsive.paddingSM,
  },
  strengthBar: {
    height: hp(6),
    width: "100%",
    borderRadius: responsive.radiusSM,
    backgroundColor: "#e6eef7",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: responsive.radiusSM,
  },
  strengthText: {
    marginBottom: responsive.paddingSM,
    fontSize: responsive.fontMD,
    fontWeight: "600",
    color: "#111",
  },
  requirementsList: {
    marginBottom: responsive.paddingSM,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsive.paddingSM,
    marginBottom: responsive.paddingXS,
  },
  requirementText: {
    fontSize: responsive.fontSM,
  },
  userTypeContainer: {
    flexDirection: "row",
    gap: responsive.paddingMD,
    marginTop: responsive.paddingXS,
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: responsive.paddingMD,
    paddingHorizontal: responsive.paddingLG,
    borderWidth: 1.5,
    borderColor: "#e6e6e6",
    borderRadius: responsive.radiusMD,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  userTypeButtonActive: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  userTypeText: {
    fontSize: responsive.fontLG,
    fontWeight: "600",
    color: "#666",
  },
  userTypeTextActive: {
    color: "#fff",
  },
};
