import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import DriverBottomNav from '../components/DriverBottomNav';
import { colors } from '../theme';

export default function DriverLayout() {
  return (
    <View style={styles.root}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Tab roots */}
        <Stack.Screen name="index" />
        <Stack.Screen name="rides" />
        <Stack.Screen name="messages" />
        <Stack.Screen name="earnings" />
        <Stack.Screen name="Profile" />

        {/* Detail screens */}
        <Stack.Screen name="students" />
        <Stack.Screen name="booking-requests" />
        <Stack.Screen name="route-management" />
        <Stack.Screen name="active-trip" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="chat" />
      </Stack>
      <DriverBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
