import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp, hp } from '../utils/responsive';

// Components
import { Card, Badge, Avatar, RatingStars } from '../components/atoms';
import { ServiceCard, SubscriptionCard, ChildCard, StatCard } from '../components/molecules';
import { Header, ParentBottomNav } from '../components/organisms';

export default function ParentHome() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // Mock data
    const user = {
        name: 'Samantha Fernando',
        photo: null,
    };

    const children = [
        {
            id: 1,
            name: 'Kavindi Fernando',
            photo: null,
            grade: '5',
            school: 'Royal College',
            age: 10,
            subscription: {
                driverName: 'Mr. Perera',
                status: 'active',
            },
        },
        {
            id: 2,
            name: 'Dineth Fernando',
            photo: null,
            grade: '3',
            school: 'Royal College',
            age: 8,
            subscription: null,
        },
    ];

    const activeSubscription = {
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
    };

    const recommendedServices = [
        {
            id: 1,
            name: 'Anura Bandara',
            photo: null,
            verified: true,
            rating: 4.8,
            reviewCount: 156,
            monthlyFee: 7500,
            areasServed: ['Colombo 07', 'Bambalapitiya', 'Wellawatte'],
            school: 'Royal College',
            availableSeats: 5,
            totalSeats: 28,
        },
        {
            id: 2,
            name: 'Siripala Fernando',
            photo: null,
            verified: true,
            rating: 4.6,
            reviewCount: 98,
            monthlyFee: 8000,
            areasServed: ['Dehiwala', 'Mount Lavinia', 'Ratmalana'],
            school: 'Royal College',
            availableSeats: 3,
            totalSeats: 24,
        },
    ];

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                showProfile
                showNotification
                user={user}
                notificationCount={3}
            />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Quick Stats */}
                <View style={styles.statsSection}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.statsRow}>
                            <StatCard
                                icon="people"
                                iconColor="#007AFF"
                                value={children.length}
                                label="Children"
                                style={styles.statCard}
                            />
                            <StatCard
                                icon="bus"
                                iconColor="#34C759"
                                value={1}
                                label="Active"
                                style={styles.statCard}
                            />
                            <StatCard
                                icon="star"
                                iconColor="#FF9500"
                                value="4.8"
                                label="Rating"
                                style={styles.statCard}
                            />
                            <StatCard
                                icon="card"
                                iconColor="#5856D6"
                                value="LKR 8.5K"
                                label="This Month"
                                style={styles.statCard}
                            />
                        </View>
                    </ScrollView>
                </View>

                {/* Active Subscription */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Active Subscription</Text>
                        <TouchableOpacity onPress={() => router.push('/parent/my-bookings')}>
                            <Text style={styles.seeAll}>See All</Text>
                        </TouchableOpacity>
                    </View>

                    <SubscriptionCard
                        subscription={activeSubscription}
                        onPress={() => router.push('/parent/my-bookings')}
                        onMessagePress={() => router.push('/parent/chat?driverId=1')}
                        onViewSchedule={() => router.push('/parent/service-detail?id=1')}
                        onMakePayment={() => router.push('/parent/payments')}
                    />
                </View>

                {/* My Children */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Children</Text>
                        <TouchableOpacity onPress={() => router.push('/parent/profile/children')}>
                            <Text style={styles.seeAll}>Manage</Text>
                        </TouchableOpacity>
                    </View>

                    {children.map((child) => (
                        <ChildCard
                            key={child.id}
                            child={child}
                            onPress={() => router.push(`/parent/profile/child/${child.id}`)}
                            onEdit={() => router.push(`/parent/profile/edit-child/${child.id}`)}
                        />
                    ))}
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => router.push('/parent/search')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                                <Ionicons name="search" size={24} color="#007AFF" />
                            </View>
                            <Text style={styles.actionLabel}>Find Service</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => router.push('/parent/payments')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#E8F8ED' }]}>
                                <Ionicons name="wallet" size={24} color="#34C759" />
                            </View>
                            <Text style={styles.actionLabel}>Payments</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => router.push('/parent/messages')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#FFF4E5' }]}>
                                <Ionicons name="chatbubbles" size={24} color="#FF9500" />
                            </View>
                            <Text style={styles.actionLabel}>Messages</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.actionCard}
                            onPress={() => router.push('/parent/write-review')}
                        >
                            <View style={[styles.actionIcon, { backgroundColor: '#F0EFFF' }]}>
                                <Ionicons name="star" size={24} color="#5856D6" />
                            </View>
                            <Text style={styles.actionLabel}>Rate Service</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Recommended Services */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Recommended for You</Text>
                        <TouchableOpacity onPress={() => router.push('/parent/search')}>
                            <Text style={styles.seeAll}>View All</Text>
                        </TouchableOpacity>
                    </View>

                    {recommendedServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            driver={service}
                            onPress={() => router.push(`/parent/service-detail?id=${service.id}`)}
                            variant="compact"
                        />
                    ))}
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
    scrollView: {
        flex: 1,
    },
    statsSection: {
        paddingVertical: responsive.paddingMD,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: responsive.paddingLG,
        gap: responsive.paddingSM,
    },
    statCard: {
        minWidth: wp(85),
    },
    section: {
        paddingHorizontal: responsive.paddingLG,
        marginBottom: responsive.paddingMD,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsive.paddingMD,
    },
    sectionTitle: {
        fontSize: responsive.fontXL,
        fontWeight: '600',
        color: '#000',
    },
    seeAll: {
        fontSize: responsive.fontMD,
        color: '#007AFF',
        fontWeight: '500',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -responsive.paddingSM / 2,
    },
    actionCard: {
        width: '50%',
        paddingHorizontal: responsive.paddingSM / 2,
        marginBottom: responsive.paddingSM,
    },
    actionIcon: {
        width: '100%',
        aspectRatio: 2,
        borderRadius: responsive.radiusLG,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsive.paddingSM,
    },
    actionLabel: {
        fontSize: responsive.fontMD,
        fontWeight: '500',
        color: '#000',
        textAlign: 'center',
    },
});
