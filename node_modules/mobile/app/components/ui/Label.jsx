import React from "react";
import { Text, StyleSheet } from "react-native";
import { responsive } from "../../utils/responsive";

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
    fontSize: responsive.fontMD,
    fontWeight: "600",
    marginBottom: responsive.paddingSM,
    color: "#111",
  },
});

export default Label;
