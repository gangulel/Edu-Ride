import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp, hp } from '../utils/responsive';
import { Card, Badge, Button } from '../components/atoms';
import { StatCard, EmptyState } from '../components/molecules';
import { Header, ParentBottomNav } from '../components/organisms';
import { getBookings } from '../../services/parentApi';

function formatDate(dateStr) {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getNextPaymentDate() {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    d.setDate(1);
    return d.toISOString().split('T')[0];
}

export default function PaymentsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const res = await getBookings();
            setBookings(res?.bookings || []);
        } catch (err) {
            setError(err.message || 'Failed to load payment data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const activeBookings = bookings.filter(b => b.status === 'accepted');

    const totalDueThisMonth = activeBookings.reduce((sum, b) => sum + (b.monthlyFee || 0), 0);

    const upcomingPayments = activeBookings.map(b => ({
        id: b._id,
        driverName: b.driver?.fullName || 'Driver',
        amount: b.monthlyFee || 0,
        dueDate: getNextPaymentDate(),
        child: b.child?.fullName || 'Child',
    }));

    const getStatusColor = (status) => {
        if (status === 'accepted') return 'success';
        if (status === 'pending') return 'warning';
        if (status === 'cancelled' || status === 'rejected') return 'danger';
        return 'neutral';
    };

    const getStatusLabel = (status) => {
        const labels = { accepted: 'Active', pending: 'Pending', cancelled: 'Cancelled', rejected: 'Rejected', expired: 'Expired' };
        return labels[status] || status;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Payments" showBack />

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.loadingText}>Loading payment data...</Text>
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {/* Summary Stats */}
                    <View style={styles.statsSection}>
                        <View style={styles.statsRow}>
                            <StatCard
                                icon="wallet"
                                iconColor="#007AFF"
                                value={totalDueThisMonth > 0 ? `LKR ${totalDueThisMonth.toLocaleString()}` : '—'}
                                label="Due This Month"
                                style={styles.statCard}
                            />
                            <StatCard
                                icon="people"
                                iconColor="#34C759"
                                value={String(activeBookings.length)}
                                label="Active Subscriptions"
                                style={styles.statCard}
                            />
                        </View>
                    </View>

                    {/* Upcoming Payments */}
                    {upcomingPayments.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Upcoming Payments</Text>
                            {upcomingPayments.map(payment => (
                                <Card key={payment.id} style={styles.upcomingCard}>
                                    <View style={styles.upcomingContent}>
                                        <View style={styles.upcomingInfo}>
                                            <Text style={styles.upcomingDriver}>{payment.driverName}</Text>
                                            <Text style={styles.upcomingMeta}>
                                                Due: {formatDate(payment.dueDate)} • {payment.child}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.upcomingPrice}>
                                                LKR {payment.amount.toLocaleString()}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={styles.paymentNote}>
                                        <Ionicons name="information-circle-outline" size={16} color="#64748B" />
                                        <Text style={styles.paymentNoteText}>
                                            Pay directly to your driver. Online payments coming soon.
                                        </Text>
                                    </View>
                                </Card>
                            ))}
                        </View>
                    )}

                    {/* Subscription History */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Subscription History</Text>

                        {bookings.length > 0 ? (
                            bookings.map(booking => (
                                <Card key={booking._id} style={styles.transactionCard}>
                                    <View style={styles.transactionHeader}>
                                        <View style={[
                                            styles.transactionIcon,
                                            { backgroundColor: booking.status === 'accepted' ? '#E8F8ED' : '#F1F5F9' }
                                        ]}>
                                            <Ionicons
                                                name={booking.status === 'accepted' ? 'checkmark-circle' : 'time-outline'}
                                                size={20}
                                                color={booking.status === 'accepted' ? '#34C759' : '#64748B'}
                                            />
                                        </View>
                                        <View style={styles.transactionInfo}>
                                            <Text style={styles.transactionDescription} numberOfLines={1}>
                                                {booking.driver?.fullName || 'Driver'} – {booking.child?.fullName || 'Child'}
                                            </Text>
                                            <Text style={styles.transactionMeta}>
                                                From {formatDate(booking.startDate)} • {booking.pickupAddress}
                                            </Text>
                                        </View>
                                        <View style={styles.transactionAmount}>
                                            <Text style={styles.amountText}>
                                                LKR {(booking.monthlyFee || 0).toLocaleString()}
                                            </Text>
                                            <Badge label={getStatusLabel(booking.status)} variant={getStatusColor(booking.status)} size="small" />
                                        </View>
                                    </View>
                                </Card>
                            ))
                        ) : (
                            <EmptyState
                                icon="receipt-outline"
                                title="No subscriptions yet"
                                message="Your booking history will appear here once you subscribe to a service."
                                actionLabel="Find Service"
                                onAction={() => router.push('/parent/search')}
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
    scrollView: { flex: 1 },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    loadingText: { marginTop: 12, fontSize: responsive.fontMD, color: '#64748B' },
    errorText: { fontSize: responsive.fontMD, color: '#EF4444', textAlign: 'center', marginBottom: 12 },
    retryBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
    retryText: { color: '#fff', fontWeight: '600' },
    statsSection: { padding: responsive.paddingLG },
    statsRow: { flexDirection: 'row', gap: responsive.paddingMD },
    statCard: { flex: 1 },
    section: { paddingHorizontal: responsive.paddingLG, marginBottom: responsive.paddingLG },
    sectionTitle: { fontSize: responsive.fontXL, fontWeight: '600', color: '#000', marginBottom: responsive.paddingMD },
    upcomingCard: { marginBottom: responsive.paddingMD },
    upcomingContent: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: responsive.paddingSM,
    },
    upcomingInfo: {},
    upcomingDriver: { fontSize: responsive.fontLG, fontWeight: '600', color: '#000' },
    upcomingMeta: { fontSize: responsive.fontSM, color: '#8E8E93', marginTop: 2 },
    upcomingPrice: { fontSize: responsive.fontXL, fontWeight: 'bold', color: '#007AFF' },
    paymentNote: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        backgroundColor: '#F8FAFC', borderRadius: 8, padding: 10,
    },
    paymentNoteText: { fontSize: responsive.fontSM, color: '#64748B', flex: 1 },
    transactionCard: { marginBottom: responsive.paddingSM },
    transactionHeader: { flexDirection: 'row', alignItems: 'center' },
    transactionIcon: {
        width: wp(40), height: wp(40), borderRadius: wp(20),
        alignItems: 'center', justifyContent: 'center',
    },
    transactionInfo: { flex: 1, marginLeft: responsive.paddingMD },
    transactionDescription: { fontSize: responsive.fontMD, fontWeight: '500', color: '#000' },
    transactionMeta: { fontSize: responsive.fontSM, color: '#8E8E93', marginTop: 2 },
    transactionAmount: { alignItems: 'flex-end' },
    amountText: { fontSize: responsive.fontMD, fontWeight: '600', marginBottom: 4, color: '#000' },
});
