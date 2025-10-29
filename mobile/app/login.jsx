import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const validate = () => {
    if (!email || !password) {
      setError("Please enter email and password.");
      return false;
    }
    // simple email check
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
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
    // Mock API request
    setTimeout(() => {
      setLoading(false);
      // For now, treat any credentials as valid
      router.replace("/");
    }, 900);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header} />

      <View style={styles.card}>
        <Text style={styles.heading}>Sign in to your{"\n"}Account</Text>
        <Text style={styles.subheading}>Enter your email and password to log in</Text>

        <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
          <View style={styles.googleInner}>
            <AntDesign name="google" size={18} color="#DB4437" />
            <Text style={styles.googleText}>  Continue with Google</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.line} />
          <Text style={styles.orText}>Or login with</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="email-outline" size={20} color="#9aa0a6" />
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
            placeholderTextColor="#9aa0a6"
          />
        </View>

        <View style={styles.inputWrap}>
          <MaterialCommunityIcons name="lock-outline" size={20} color="#9aa0a6" />
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            placeholderTextColor="#9aa0a6"
          />
          <Pressable onPress={() => setShowPassword((s) => !s)} style={styles.eye}>
            <AntDesign name={showPassword ? "eye" : "eyeo"} size={18} color="#9aa0a6" />
          </Pressable>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.rowBetween}>
          <Pressable style={styles.rememberRow} onPress={() => setRemember((r) => !r)}>
            <View style={[styles.checkbox, remember && styles.checkboxChecked]}>
              {remember && <AntDesign name="check" size={12} color="#fff" />}
            </View>
            <Text style={styles.rememberText}>Remember me</Text>
          </Pressable>

          <TouchableOpacity onPress={() => {}}>
            <Text style={styles.forgot}>Forgot Password ?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={onSubmit} activeOpacity={0.9} style={{ marginTop: 12 }}>
          <LinearGradient colors={["#3A7BD5", "#007AFF"]} style={styles.primaryBtn} start={[0, 0]} end={[1, 1]}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryText}>Log In</Text>}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.bottomRow}>
          <Text style={styles.noAccount}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.signUp}> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f2f6fb",
  },
  header: {
    height: 180,
    backgroundColor: "#2f7bff",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -90,
    borderRadius: 12,
    padding: 20,
    // shadow
    ...Platform.select({
      ios: { shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
      android: { elevation: 6 },
    }),
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#17324d",
    textAlign: "center",
  },
  subheading: {
    color: "#6b7a86",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  googleBtn: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#eef2f6",
    marginBottom: 12,
  },
  googleInner: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  googleText: { fontSize: 15, color: "#222" },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 10 },
  line: { flex: 1, height: 1, backgroundColor: "#e6eef7" },
  orText: { marginHorizontal: 10, color: "#9aa0a6", fontSize: 13 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fafbfd",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eef2f6",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 10,
    fontSize: 15,
    color: "#222",
  },
  eye: { padding: 8 },
  error: { color: "#c0392b", marginBottom: 8 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 6 },
  rememberRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#cfd8e3",
    marginRight: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  rememberText: { color: "#556675" },
  forgot: { color: "#2f7bff" },
  primaryBtn: { paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  bottomRow: { flexDirection: "row", justifyContent: "center", marginTop: 14 },
  noAccount: { color: "#9aa0a6" },
  signUp: { color: "#2f7bff", fontWeight: "600" },
});
