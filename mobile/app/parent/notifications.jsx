import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../utils/responsive';

// Components
import { Badge } from '../components/atoms';
import { NotificationItem, EmptyState } from '../components/molecules';
import { Header } from '../components/organisms';

export default function NotificationsScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState('all');

    // Mock notifications
    const notifications = [
        {
            id: 1,
            type: 'info',
            title: 'Bus Arriving Soon',
            message: 'Your bus is 5 minutes away from the pickup point.',
            time: '2026-01-24T08:25:00',
            read: false,
        },
        {
            id: 2,
            type: 'payment',
            title: 'Payment Reminder',
            message: 'Your monthly subscription payment of LKR 8,500 is due on Feb 1, 2026.',
            time: '2026-01-23T10:00:00',
            read: false,
            actionLabel: 'Pay Now',
        },
        {
            id: 3,
            type: 'success',
            title: 'Payment Successful',
            message: 'Your payment of LKR 8,500 for January subscription has been processed.',
            time: '2026-01-01T09:30:00',
            read: true,
        },
        {
            id: 4,
            type: 'message',
            title: 'New Message from Kasun Perera',
            message: 'Good morning! I wanted to let you know that the bus will be arriving...',
            time: '2026-01-24T08:30:00',
            read: false,
            avatar: null,
        },
        {
            id: 5,
            type: 'warning',
            title: 'Schedule Change',
            message: 'The morning pickup time has been changed to 7:15 AM due to road construction.',
            time: '2026-01-22T18:00:00',
            read: true,
        },
        {
            id: 6,
            type: 'success',
            title: 'Booking Confirmed',
            message: 'Your booking request for Kasun Perera has been accepted. Service starts Feb 1.',
            time: '2026-01-20T14:00:00',
            read: true,
        },
    ];

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'unread', label: 'Unread' },
        { key: 'payment', label: 'Payments' },
        { key: 'message', label: 'Messages' },
    ];

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.type === filter;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationPress = (notification) => {
        // Handle navigation based on notification type
        switch (notification.type) {
            case 'payment':
                router.push('/parent/payments');
                break;
            case 'message':
                router.push('/parent/messages');
                break;
            default:
                // Mark as read
                console.log('Notification pressed:', notification.id);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Notifications"
                showBack
                rightAction="Mark all read"
                rightActionIcon="checkmark-done-outline"
                onRightAction={() => console.log('Mark all read')}
            />

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                {filters.map(f => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.filterTab, filter === f.key && styles.filterTabActive]}
                        onPress={() => setFilter(f.key)}
                    >
                        <Text style={[styles.filterText, filter === f.key && styles.filterTextActive]}>
                            {f.label}
                        </Text>
                        {f.key === 'unread' && unreadCount > 0 && (
                            <Badge label={String(unreadCount)} variant="danger" size="small" />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {filteredNotifications.length > 0 ? (
                <FlatList
                    data={filteredNotifications}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <NotificationItem
                            notification={item}
                            onPress={() => handleNotificationPress(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <EmptyState
                    icon="notifications-outline"
                    title="No notifications"
                    message={filter === 'all'
                        ? "You're all caught up! New notifications will appear here."
                        : `No ${filter} notifications at the moment.`
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingSM,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingSM,
        marginRight: responsive.paddingSM,
        borderRadius: responsive.radiusFull,
        gap: responsive.paddingXS,
    },
    filterTabActive: {
        backgroundColor: '#E3F2FD',
    },
    filterText: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        fontWeight: '500',
    },
    filterTextActive: {
        color: '#007AFF',
    },
    listContent: {
        paddingBottom: hp(40),
    },
});
