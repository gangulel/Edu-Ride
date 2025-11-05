import React, { useId, useMemo, useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { AntDesign, Feather } from "@expo/vector-icons";

export default function PasswordInput({ id, password, setPassword, showOnlyStrengthBar = false, showStrength = true }) {
  const generatedId = useId();
  const _id = id || generatedId;
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible((s) => !s);

  const checkStrength = (pass) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({ met: req.regex.test(pass), text: req.text }));
  };

  const strength = useMemo(() => checkStrength(password), [password]);
  const strengthScore = useMemo(() => strength.filter((r) => r.met).length, [strength]);

  const getStrengthColor = (score) => {
    if (score === 0) return "#e6eef7";
    if (score <= 1) return "#ef4444";
    if (score <= 2) return "#f97316";
    if (score === 3) return "#f59e0b";
    return "#10b981";
  };

  const getStrengthText = (score) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <View>
      {!showOnlyStrengthBar ? (
        <Text nativeID={`${_id}-password-label`} style={localStyles.label} accessibilityRole="text">
          Password
        </Text>
      ) : null}

      <View style={localStyles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isVisible}
          style={[localStyles.input, { paddingRight: 44 }]}
          placeholderTextColor="#999"
          nativeID={`${_id}-password`}
          accessibilityLabelledBy={`${_id}-password-label`}
          accessible
        />
        <TouchableOpacity
          onPress={toggleVisibility}
          accessibilityLabel={isVisible ? "Hide password" : "Show password"}
          accessibilityRole="button"
          style={localStyles.toggleButton}
        >
          {isVisible ? (
            <Feather name="eye-off" size={18} color="#616161" />
          ) : (
            <Feather name="eye" size={18} color="#616161" />
          )}
        </TouchableOpacity>
      </View>

      {showStrength ? (
        <>
          <View style={localStyles.strengthBarWrap} accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: 4, now: strengthScore }}>
            <View style={[localStyles.strengthBar, { backgroundColor: '#e6eef7' }]}>
              <View style={[localStyles.strengthFill, { backgroundColor: getStrengthColor(strengthScore), width: `${(strengthScore / 4) * 100}%` }]} />
            </View>
          </View>
          {!showOnlyStrengthBar ? (
            <>
              <Text style={localStyles.strengthText} nativeID={`${_id}-password-description`}>
                {getStrengthText(strengthScore)}. Must contain:
              </Text>

              <View style={localStyles.requirementsList} accessibilityLabel="Password requirements">
                {strength.map((req, index) => (
                  <View key={index} style={localStyles.requirementRow}>
                    {req.met ? <AntDesign name="checkcircle" size={16} color="#10b981" /> : <AntDesign name="closecircleo" size={16} color="#9aa0a6" />}
                    <Text style={[localStyles.requirementText, { color: req.met ? '#065f46' : '#9aa0a6' }]}>
                      {req.text}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const localStyles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
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
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#111",
  },
});
