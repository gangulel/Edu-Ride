import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../utils/responsive';

// Components
import { Badge } from '../components/atoms';
import { SubscriptionCard, FilterChip, EmptyState } from '../components/molecules';
import { Header, ParentBottomNav } from '../components/organisms';

export default function MyBookingsScreen() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('active');

    // Mock subscriptions
    const subscriptions = {
        active: [
            {
                id: 1,
                driver: {
                    name: 'Kasun Perera',
                    photo: null,
                    verified: true,
                },
                vehicle: {
                    make: 'Toyota',
                    model: 'HiAce',
                    licensePlate: 'CAB-1234',
                },
                status: 'active',
                expiryDate: 'Jan 31, 2026',
                nextPaymentDate: 'Feb 1, 2026',
                monthlyFee: 8500,
                child: { name: 'Kavindi' },
            },
        ],
        pending: [
            {
                id: 2,
                driver: {
                    name: 'Anura Bandara',
                    photo: null,
                    verified: true,
                },
                vehicle: {
                    make: 'Nissan',
                    model: 'Caravan',
                    licensePlate: 'CAD-5678',
                },
                status: 'pending',
                expiryDate: 'Awaiting approval',
                nextPaymentDate: null,
                monthlyFee: 7500,
                child: { name: 'Dineth' },
            },
        ],
        past: [
            {
                id: 3,
                driver: {
                    name: 'Siripala Fernando',
                    photo: null,
                    verified: true,
                },
                vehicle: {
                    make: 'Toyota',
                    model: 'Coaster',
                    licensePlate: 'CAC-9012',
                },
                status: 'expired',
                expiryDate: 'Dec 31, 2025',
                nextPaymentDate: null,
                monthlyFee: 8000,
                child: { name: 'Kavindi' },
            },
        ],
    };

    const tabs = [
        { key: 'active', label: 'Active', count: subscriptions.active.length },
        { key: 'pending', label: 'Pending', count: subscriptions.pending.length },
        { key: 'past', label: 'Past', count: subscriptions.past.length },
    ];

    const currentSubscriptions = subscriptions[activeTab] || [];

    return (
        <SafeAreaView style={styles.container}>
            <Header title="My Bookings" showBack />

            {/* Tabs */}
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

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {currentSubscriptions.length > 0 ? (
                        currentSubscriptions.map(subscription => (
                            <SubscriptionCard
                                key={subscription.id}
                                subscription={subscription}
                                onPress={() => router.push(`/parent/service-detail?id=${subscription.driver.id}`)}
                                onMessagePress={() => router.push(`/parent/chat?driverId=${subscription.driver.id}`)}
                                onViewSchedule={() => router.push(`/parent/service-detail?id=${subscription.driver.id}`)}
                                onMakePayment={() => router.push('/parent/payments')}
                            />
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

            <ParentBottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingSM,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsive.paddingMD,
        gap: responsive.paddingSM,
        borderRadius: responsive.radiusMD,
    },
    tabActive: {
        backgroundColor: '#E3F2FD',
    },
    tabText: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: responsive.paddingLG,
    },
});
