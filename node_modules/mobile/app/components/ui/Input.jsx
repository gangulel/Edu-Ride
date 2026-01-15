import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { responsive } from "../../utils/responsive";

export function Input(props) {
  // Thin wrapper around TextInput so we can reuse web-like API
  return <TextInput {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: responsive.paddingMD,
    borderRadius: responsive.radiusMD,
    marginBottom: responsive.paddingMD,
    fontSize: responsive.fontLG,
    minHeight: responsive.inputHeight,
  },
});

export default Input;
