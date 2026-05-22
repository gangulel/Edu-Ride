import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../utils/responsive';

// Components
import { MessagePreview, EmptyState } from '../components/molecules';
import { Header, ParentBottomNav } from '../components/organisms';

export default function MessagesScreen() {
    const router = useRouter();

    // Mock conversations
    const conversations = [
        {
            id: 1,
            participant: {
                name: 'Kasun Perera',
                photo: null,
            },
            lastMessage: 'Good morning! I wanted to let you know that the bus will be arriving 5 minutes earlier today due to light traffic.',
            timestamp: '2026-01-24T08:30:00',
            unreadCount: 2,
            isOnline: true,
        },
        {
            id: 2,
            participant: {
                name: 'Anura Bandara',
                photo: null,
            },
            lastMessage: 'Thank you for your booking request. I will review it and get back to you soon.',
            timestamp: '2026-01-23T15:45:00',
            unreadCount: 0,
            isOnline: false,
        },
        {
            id: 3,
            participant: {
                name: 'Edu-Ride Support',
                photo: null,
            },
            lastMessage: 'Your support ticket #12345 has been resolved. Please let us know if you need further assistance.',
            timestamp: '2026-01-22T10:00:00',
            unreadCount: 1,
            isOnline: true,
        },
    ];

    const handleConversationPress = (conversation) => {
        router.push(`/parent/chat?driverId=${conversation.id}&name=${encodeURIComponent(conversation.participant.name)}`);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Messages" showBack showNotification />

            {conversations.length > 0 ? (
                <FlatList
                    data={conversations}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <MessagePreview
                            conversation={item}
                            onPress={() => handleConversationPress(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <EmptyState
                    icon="chatbubbles-outline"
                    title="No messages"
                    message="Start a conversation with a driver by booking a service or messaging them from their profile."
                    actionLabel="Find Service"
                    onAction={() => router.push('/parent/search')}
                />
            )}

            <ParentBottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingBottom: hp(100),
    },
});
