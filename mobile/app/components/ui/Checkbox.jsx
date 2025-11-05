import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export default function Checkbox({ id, value = false, onValueChange }) {
  return (
    <TouchableOpacity
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!value }}
      onPress={() => onValueChange && onValueChange(!value)}
      style={styles.touch}
      accessible
      accessibilityLabel={`checkbox-${id}`}
    >
      <View style={[styles.box, value && styles.boxChecked]}>
        {value ? <Text style={styles.check}>✓</Text> : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touch: {
    padding: 4,
  },
  box: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  boxChecked: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  check: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "700",
  },
});
