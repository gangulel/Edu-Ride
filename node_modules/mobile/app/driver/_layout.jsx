import React from "react";
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import DriverBottomNav from "../components/DriverBottomNav";

export default function DriverLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="rides" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="earnings" />
        <Stack.Screen name="Profile" />
        <Stack.Screen name="chat" />
      </Stack>
      <DriverBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
