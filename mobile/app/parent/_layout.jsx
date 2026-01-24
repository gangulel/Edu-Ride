import React from 'react';
import { Stack } from 'expo-router';

export default function ParentLayout() {
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
            <Stack.Screen name="profile" />
        </Stack>
    );
}
