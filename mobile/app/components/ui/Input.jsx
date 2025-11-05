import React from "react";
import { TextInput, StyleSheet } from "react-native";

export function Input(props) {
  // Thin wrapper around TextInput so we can reuse web-like API
  return <TextInput {...props} style={[styles.input, props.style]} />;
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
  },
});

export default Input;
