import React from 'react';
import { Stack } from 'expo-router';
import { useAuthGuard } from '../hooks/useAuthGuard';

export default function ParentLayout() {
    // Bounces anonymous users to /login and drivers to /driver. Loading state
    // is handled inside the hook — useAuthGuard waits for Firebase to settle
    // before deciding.
    useAuthGuard({ requireRole: 'parent' });

    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}
        >
            <Stack.Screen name="index" />
            <Stack.Screen name="search" />
            <Stack.Screen name="service-detail" />
            <Stack.Screen name="booking" />
            <Stack.Screen name="my-bookings" />
            <Stack.Screen name="payments" />
            <Stack.Screen name="add-payment" />
            <Stack.Screen name="messages" />
            <Stack.Screen name="chat" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="write-review" />
        </Stack>
    );
}
