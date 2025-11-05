import React, { useState, useId } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { Input } from "./components/ui/Input";
import { Label } from "./components/ui/Label";
import PasswordInput from "./components/PasswordInput";
import { useRouter } from "expo-router";

export default function Register() {
  const router = useRouter();
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailTouched, setEmailTouched] = useState(false);
  // confirm password removed per request
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;

  // password strength helpers moved to PasswordInput component

  const validate = () => {
    if (!name || !email || !password) {
      setError("All fields are required.");
      return false;
    }
    if (!re.test(email)) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
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
      // After successful signup, navigate to login so user can sign in
      router.replace("/login");
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create account</Text>

      <View style={{ marginBottom: 8 }}>
        <Label htmlFor={id}>Full name</Label>
        <Input
          nativeID={id}
          placeholder="Full name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#999"
        />
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
      />

      {/* Password input with visibility toggle and strength indicator (componentized) */}
      <PasswordInput id={id} password={password} setPassword={setPassword} />

      {/* Password strength meter */}
      {/* compute strength */}
      {/** Functions and derived values **/}
      {/* password strength calculation uses local helper below */}
      {
        /* placeholder to ensure ordering; actual values computed in variables */
      }

      {/* Confirm password removed */}

      {/* (Inline email error moved next to label) */}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Password strength UI is now rendered inside PasswordInput component */}

      <TouchableOpacity style={styles.button} onPress={onSubmit} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Sign up</Text>}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.replace("/login")} style={styles.link}>
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111",
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
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  error: {
    color: "#c0392b",
    marginBottom: 8,
  },
  link: {
    marginTop: 16,
    alignItems: "center",
  },
  linkText: {
    color: "#007AFF",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#111",
  },
  inputInvalid: {
    borderColor: "#c0392b",
  },
  emailError: {
    marginBottom: 8,
  },
  emailLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  errorInline: {
    color: "#c0392b",
    fontSize: 12,
    marginLeft: 8,
    fontWeight: "600",
  },
  passwordContainer: {
    position: "relative",
    marginBottom: 12,
  },
  toggleButton: {
    position: "absolute",
    right: 10,
    top: 12,
    height: 24,
    width: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  strengthBarWrap: {
    marginTop: 6,
    marginBottom: 6,
  },
  strengthBar: {
    height: 6,
    width: "100%",
    borderRadius: 6,
    backgroundColor: "#e6eef7",
    overflow: "hidden",
  },
  strengthFill: {
    height: "100%",
    borderRadius: 6,
  },
  strengthText: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#111",
  },
  requirementsList: {
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  requirementText: {
    fontSize: 12,
  },
};
