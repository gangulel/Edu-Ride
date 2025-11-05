import React from "react";
import { Text, StyleSheet } from "react-native";

export function Label({ children, htmlFor, style }) {
  // htmlFor kept for parity with web API; use nativeID on inputs
  return (
    <Text nativeID={htmlFor ? `${htmlFor}-label` : undefined} style={[styles.label, style]} accessibilityRole="text">
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#111",
  },
});

export default Label;
