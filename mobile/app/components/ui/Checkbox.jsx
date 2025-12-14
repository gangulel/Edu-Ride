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

import { responsive, wp } from "../../utils/responsive";

const styles = StyleSheet.create({
  touch: {
    padding: responsive.paddingXS,
  },
  box: {
    width: wp(20),
    height: wp(20),
    borderRadius: responsive.radiusXS,
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
    fontSize: responsive.fontMD,
    lineHeight: responsive.fontLG,
    fontWeight: "700",
  },
});
