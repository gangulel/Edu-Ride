import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function Index() {
  const router = useRouter();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 12 }}>Hello world</Text>

      <TouchableOpacity
        onPress={() => router.push("/login")}
        style={{ backgroundColor: "#007AFF", padding: 12, borderRadius: 8 }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
}
