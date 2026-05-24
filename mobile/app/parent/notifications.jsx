import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../utils/responsive';
import { Badge } from '../components/atoms';
import { NotificationItem, EmptyState } from '../components/molecules';
import { Header } from '../components/organisms';
import { getBookings, getActiveTrip } from '../../services/parentApi';

function buildNotificationsFromData(bookings, activeTrip) {
    const notifications = [];
    let idCounter = 1;

    if (activeTrip) {
        notifications.push({
            id: idCounter++,
            type: 'info',
            title: 'Trip In Progress',
            message: `Your child's school bus is currently on its way. ${activeTrip.students?.length || 0} student(s) on board.`,
            time: activeTrip.startedAt || new Date().toISOString(),
            read: false,
        });
    }

    bookings.forEach(booking => {
        const driverName = booking.driver?.fullName || 'Driver';
        const childName = booking.child?.fullName || 'Child';

        if (booking.status === 'accepted') {
            notifications.push({
                id: idCounter++,
                type: 'success',
                title: 'Booking Confirmed',
                message: `Your booking request for ${driverName} (for ${childName}) has been accepted.`,
                time: booking.updatedAt || booking.createdAt,
                read: true,
                actionRoute: '/parent/my-bookings',
            });
        }

        if (booking.status === 'rejected') {
            notifications.push({
                id: idCounter++,
                type: 'warning',
                title: 'Booking Declined',
                message: `Your booking request for ${driverName} (for ${childName}) was not accepted.${booking.rejectionReason ? ` Reason: ${booking.rejectionReason}` : ''}`,
                time: booking.updatedAt || booking.createdAt,
                read: false,
                actionRoute: '/parent/search',
                actionLabel: 'Find Another',
            });
        }

        if (booking.status === 'pending') {
            notifications.push({
                id: idCounter++,
                type: 'info',
                title: 'Booking Pending',
                message: `Your booking request for ${driverName} (for ${childName}) is awaiting approval.`,
                time: booking.createdAt,
                read: true,
            });
        }

        if (booking.status === 'cancelled') {
            notifications.push({
                id: idCounter++,
                type: 'warning',
                title: 'Booking Cancelled',
                message: `Your booking for ${driverName} (for ${childName}) has been cancelled.`,
                time: booking.updatedAt || booking.createdAt,
                read: true,
            });
        }
    });

    return notifications.sort((a, b) => new Date(b.time) - new Date(a.time));
}

export default function NotificationsScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const [bookingsRes, tripRes] = await Promise.allSettled([
                getBookings(),
                getActiveTrip(),
            ]);
            const bookings = bookingsRes.status === 'fulfilled' ? bookingsRes.value?.bookings || [] : [];
            const activeTrip = tripRes.status === 'fulfilled' ? tripRes.value?.trip : null;
            setNotifications(buildNotificationsFromData(bookings, activeTrip));
        } catch (err) {
            setError(err.message || 'Failed to load notifications');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'unread', label: 'Unread' },
        { key: 'success', label: 'Confirmed' },
        { key: 'warning', label: 'Alerts' },
    ];

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'all') return true;
        if (filter === 'unread') return !n.read;
        return n.type === filter;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleNotificationPress = (notification) => {
        if (notification.actionRoute) {
            router.push(notification.actionRoute);
        }
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Notifications"
                showBack
                rightAction="Mark all read"
                rightActionIcon="checkmark-done-outline"
                onRightAction={markAllRead}
            />

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

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : filteredNotifications.length > 0 ? (
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
                        ? "You're all caught up! Activity from your bookings will appear here."
                        : `No ${filter} notifications at the moment.`
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingSM,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    filterTab: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: responsive.paddingMD, paddingVertical: responsive.paddingSM,
        marginRight: responsive.paddingSM, borderRadius: responsive.radiusFull, gap: responsive.paddingXS,
    },
    filterTabActive: { backgroundColor: '#E3F2FD' },
    filterText: { fontSize: responsive.fontSM, color: '#8E8E93', fontWeight: '500' },
    filterTextActive: { color: '#007AFF' },
    listContent: { paddingBottom: hp(40) },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    errorText: { fontSize: responsive.fontMD, color: '#EF4444', textAlign: 'center', marginBottom: 12 },
    retryBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
    retryText: { color: '#fff', fontWeight: '600' },
});
