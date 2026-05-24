import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, SafeAreaView,
    TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../utils/responsive';
import { Badge } from '../components/atoms';
import { SubscriptionCard, FilterChip, EmptyState } from '../components/molecules';
import { Header, ParentBottomNav } from '../components/organisms';
import { getBookings, cancelBooking } from '../../services/parentApi';

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function mapBookingToSubscription(booking) {
    return {
        id: booking._id,
        driver: {
            id: booking.driver?._id || booking.driver,
            name: booking.driver?.fullName || 'Driver',
            photo: booking.driver?.profilePhoto || null,
            verified: booking.driver?.isVerified || false,
        },
        vehicle: null,
        status: booking.status,
        expiryDate: booking.status === 'pending' ? 'Awaiting approval' : formatDate(booking.startDate),
        nextPaymentDate: null,
        monthlyFee: booking.monthlyFee,
        child: { name: booking.child?.fullName || 'Child' },
        pickupAddress: booking.pickupAddress,
        startDate: booking.startDate,
    };
}

export default function MyBookingsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('active');
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);

    const fetchBookings = useCallback(async () => {
        try {
            setError(null);
            const res = await getBookings();
            setBookings(res?.bookings || []);
        } catch (err) {
            setError(err.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const handleCancel = (bookingId) => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking?',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Yes, Cancel',
                    style: 'destructive',
                    onPress: async () => {
                        setCancellingId(bookingId);
                        try {
                            await cancelBooking(bookingId);
                            await fetchBookings();
                        } catch (err) {
                            Alert.alert('Error', err.message || 'Failed to cancel booking');
                        } finally {
                            setCancellingId(null);
                        }
                    },
                },
            ]
        );
    };

    const grouped = {
        active: bookings.filter(b => b.status === 'accepted').map(mapBookingToSubscription),
        pending: bookings.filter(b => b.status === 'pending').map(mapBookingToSubscription),
        past: bookings.filter(b => ['rejected', 'cancelled', 'expired'].includes(b.status)).map(mapBookingToSubscription),
    };

    const tabs = [
        { key: 'active', label: 'Active', count: grouped.active.length },
        { key: 'pending', label: 'Pending', count: grouped.pending.length },
        { key: 'past', label: 'Past', count: grouped.past.length },
    ];

    const current = grouped[activeTab] || [];

    return (
        <SafeAreaView style={styles.container}>
            <Header title="My Bookings" />

            <View style={styles.tabsContainer}>
                {tabs.map(tab => (
                    <TouchableOpacity
                        key={tab.key}
                        style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                        onPress={() => setActiveTab(tab.key)}
                    >
                        <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                            {tab.label}
                        </Text>
                        {tab.count > 0 && (
                            <Badge
                                label={String(tab.count)}
                                variant={activeTab === tab.key ? 'primary' : 'neutral'}
                                size="small"
                            />
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.loadingText}>Loading bookings...</Text>
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchBookings}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    <View style={styles.content}>
                        {current.length > 0 ? (
                            current.map(subscription => (
                                <View key={subscription.id} style={styles.bookingWrapper}>
                                    <SubscriptionCard
                                        subscription={subscription}
                                        onPress={() => {}}
                                        onMessagePress={() => router.push('/parent/messages')}
                                        onViewSchedule={() => {}}
                                        onMakePayment={() => router.push('/parent/payments')}
                                    />
                                    {(activeTab === 'active' || activeTab === 'pending') && (
                                        <TouchableOpacity
                                            style={[styles.cancelBtn, cancellingId === subscription.id && styles.cancelBtnDisabled]}
                                            onPress={() => handleCancel(subscription.id)}
                                            disabled={cancellingId === subscription.id}
                                        >
                                            {cancellingId === subscription.id ? (
                                                <ActivityIndicator size="small" color="#EF4444" />
                                            ) : (
                                                <Text style={styles.cancelBtnText}>Cancel Booking</Text>
                                            )}
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))
                        ) : (
                            <EmptyState
                                icon="calendar-outline"
                                title={`No ${activeTab} bookings`}
                                message={
                                    activeTab === 'active'
                                        ? "You don't have any active subscriptions. Find a bus service to get started."
                                        : activeTab === 'pending'
                                            ? "No pending booking requests at the moment."
                                            : "Your past subscriptions will appear here."
                                }
                                actionLabel={activeTab === 'active' ? 'Find Service' : null}
                                onAction={activeTab === 'active' ? () => router.push('/parent/search') : null}
                            />
                        )}
                    </View>
                    <View style={{ height: hp(100) }} />
                </ScrollView>
            )}

            <ParentBottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    tabsContainer: {
        flexDirection: 'row', backgroundColor: '#fff',
        paddingHorizontal: responsive.paddingLG, paddingVertical: responsive.paddingSM,
        borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
    },
    tab: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: responsive.paddingMD, gap: responsive.paddingSM, borderRadius: responsive.radiusMD,
    },
    tabActive: { backgroundColor: '#E3F2FD' },
    tabText: { fontSize: responsive.fontMD, color: '#8E8E93', fontWeight: '500' },
    tabTextActive: { color: '#007AFF', fontWeight: '600' },
    scrollView: { flex: 1 },
    content: { padding: responsive.paddingLG },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    loadingText: { marginTop: 12, fontSize: responsive.fontMD, color: '#64748B' },
    errorText: { fontSize: responsive.fontMD, color: '#EF4444', textAlign: 'center', marginBottom: 12 },
    retryBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
    retryText: { color: '#fff', fontWeight: '600' },
    bookingWrapper: { marginBottom: responsive.paddingMD },
    cancelBtn: {
        marginTop: 8, borderWidth: 1, borderColor: '#EF4444',
        borderRadius: responsive.radiusMD, paddingVertical: 10,
        alignItems: 'center', backgroundColor: '#FEF2F2',
    },
    cancelBtnDisabled: { opacity: 0.5 },
    cancelBtnText: { color: '#EF4444', fontWeight: '600', fontSize: responsive.fontMD },
});
