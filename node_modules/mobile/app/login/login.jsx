import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Input } from "../components/ui/Input";
import PasswordInput from "../components/PasswordInput";
import { responsive, wp, hp } from "../utils/responsive";

export default function Login() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const onSubmit = () => {
    setError("");
    if (!validate()) return;
    setLoading(true);
    // Real login: call backend API. Use emulator-friendly host for Android.
    const baseUrl = Platform.OS === "android" ? "http://10.0.2.2:3000" : "http://localhost:3000";

    (async () => {
      try {
        const res = await fetch(`${baseUrl}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const text = await res.text();

        if (!res.ok) {
          // backend returns plain text in current placeholder implementation
          setError(text || "Login failed");
          return;
        }

        // On success navigate to the home screen (replace so user can't go back to login)
        router.replace("/");
      } catch (err) {
        console.error(err);
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.select({ ios: 0, android: 20 })}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end", padding: responsive.paddingXL, paddingBottom: hp(48), backgroundColor: "#fff" }}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <Text style={styles.title}>Sign in</Text>

          <View style={{ marginBottom: 8 }}>
            <Text style={styles.label}>Email</Text>
            <Input
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholderTextColor="#999"
              autoFocus={true}
              onFocus={() => scrollRef.current?.scrollTo({ y: 0, animated: true })}
            />
          </View>

          <View style={{ marginBottom: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity onPress={() => router.push("/login/forgot") }>
                <Text style={styles.linkText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <PasswordInput password={password} setPassword={setPassword} showOnlyStrengthBar={true} showStrength={false} />
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Log in</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace("/login/register")} style={styles.link}>
            <Text style={styles.linkText}>Don't have an account? Sign up</Text>
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
    paddingBottom: hp(48),
    justifyContent: "flex-end",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: responsive.font4XL,
    fontWeight: "700",
    marginBottom: responsive.paddingLG,
    color: "#111",
    textAlign: "center",
  },
  label: {
    fontSize: responsive.fontMD,
    fontWeight: "600",
    marginBottom: responsive.paddingSM,
    color: "#111",
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
    textAlign: "center",
    fontSize: responsive.fontMD,
  },
  link: {
    marginTop: responsive.paddingMD,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
    fontSize: responsive.fontMD,
  },
};
