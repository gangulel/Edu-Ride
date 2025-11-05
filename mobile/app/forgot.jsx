import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Forgot() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;

  const validate = () => {
    if (!email) {
      setError("Please enter your email address.");
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
    setMessage("");
    if (!validate()) return;
    setLoading(true);

    try {
      // Note: backend is mounted at /api/auth. Using common emulator host for Android (10.0.2.2)
      const url = "http://10.0.2.2:3000/api/auth/forgot";
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.text();
      if (res.ok) {
        setMessage("If an account with that email exists, a reset link was sent.");
      } else {
        setError(data || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Unable to contact server. Please try again later.");
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

      <TouchableOpacity onPress={onSubmit} activeOpacity={0.9} style={{ marginTop: 8 }} disabled={loading}>
        <LinearGradient colors={["#3A7BD5", "#007AFF"]} style={styles.button} start={[0, 0]} end={[1, 1]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send reset link</Text>}
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")} style={styles.link}>
        <Text style={styles.linkText}>Back to login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111",
  },
  info: {
    color: "#6b7a86",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { marginTop: 16, alignItems: "center" },
  linkText: { color: "#007AFF" },
  error: { color: "#c0392b", marginBottom: 8 },
  message: { color: "#065f46", marginBottom: 8 },
});
