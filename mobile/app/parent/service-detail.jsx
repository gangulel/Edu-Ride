import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp, hp } from '../utils/responsive';

// Components
import { Button, Badge, Avatar, RatingStars, Card, Divider } from '../components/atoms';
import { ReviewCard } from '../components/molecules';
import { Header, ScheduleTimeline } from '../components/organisms';

export default function ServiceDetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('info');

    // Mock driver data
    const driver = {
        id: 1,
        name: 'Kasun Perera',
        photo: null,
        verified: true,
        yearsExperience: 8,
        totalStudents: 156,
        rating: 4.9,
        reviewCount: 234,
        monthlyFee: 8500,
        weeklyFee: 2500,
        school: 'Royal College',
        schoolArrival: '7:45 AM',
        schoolDeparture: '2:30 PM',
        vehicle: {
            make: 'Toyota',
            model: 'HiAce',
            year: 2021,
            licensePlate: 'CAB-1234',
            seatingCapacity: 28,
            availableSeats: 4,
            photos: [],
            safetyFeatures: ['Air Conditioning', 'GPS Tracking', 'First Aid Kit', 'Fire Extinguisher'],
            insurance: 'Valid until Dec 2026',
        },
        stops: [
            { id: 1, location: 'Colombo 07', pickupTime: '6:45 AM', dropoffTime: '3:30 PM' },
            { id: 2, location: 'Dehiwala', pickupTime: '7:00 AM', dropoffTime: '3:15 PM' },
            { id: 3, location: 'Mount Lavinia', pickupTime: '7:15 AM', dropoffTime: '3:00 PM' },
            { id: 4, location: 'Bambalapitiya', pickupTime: '7:30 AM', dropoffTime: '2:45 PM' },
        ],
        daysOfOperation: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        cancellationPolicy: 'Cancellations with 7+ days notice receive full refund. 3-7 days: 50% refund. Less than 3 days: no refund.',
        acceptedPayments: ['Card', 'Bank Transfer', 'Cash'],
    };

    const reviews = [
        {
            id: 1,
            author: { name: 'Parent of Grade 5 student', photo: null },
            rating: 5,
            date: '2026-01-15',
            comment: 'Excellent service! Mr. Perera is very punctual and my child loves the friendly atmosphere. Highly recommended!',
            driverResponse: {
                text: 'Thank you for your kind words! Safety and punctuality are my top priorities.',
                date: '2026-01-16',
            },
        },
        {
            id: 2,
            author: { name: 'Parent of Grade 3 student', photo: null },
            rating: 4,
            date: '2026-01-10',
            comment: 'Good service overall. The bus is clean and well-maintained. Sometimes arrives a few minutes late during traffic.',
        },
    ];

    const tabs = [
        { key: 'info', label: 'Info' },
        { key: 'schedule', label: 'Schedule' },
        { key: 'reviews', label: 'Reviews' },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'schedule':
                return (
                    <View style={styles.tabContent}>
                        <ScheduleTimeline
                            stops={driver.stops}
                            school={driver.school}
                            schoolArrival={driver.schoolArrival}
                            schoolDeparture={driver.schoolDeparture}
                            type="morning"
                        />
                        <ScheduleTimeline
                            stops={driver.stops}
                            school={driver.school}
                            schoolArrival={driver.schoolArrival}
                            schoolDeparture={driver.schoolDeparture}
                            type="afternoon"
                        />

                        <Card style={styles.daysCard}>
                            <Text style={styles.cardTitle}>Days of Operation</Text>
                            <View style={styles.daysRow}>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <View
                                        key={day}
                                        style={[
                                            styles.dayBadge,
                                            driver.daysOfOperation.includes(day) && styles.dayBadgeActive,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                driver.daysOfOperation.includes(day) && styles.dayTextActive,
                                            ]}
                                        >
                                            {day}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </Card>
                    </View>
                );

            case 'reviews':
                return (
                    <View style={styles.tabContent}>
                        <Card style={styles.ratingOverview}>
                            <View style={styles.ratingMain}>
                                <Text style={styles.ratingBig}>{driver.rating}</Text>
                                <RatingStars rating={driver.rating} size="medium" />
                                <Text style={styles.reviewCountText}>{driver.reviewCount} reviews</Text>
                            </View>
                        </Card>

                        {reviews.map((review) => (
                            <ReviewCard key={review.id} review={review} />
                        ))}

                        <Button
                            title="See All Reviews"
                            variant="outline"
                            fullWidth
                            onPress={() => { }}
                        />
                    </View>
                );

            default:
                return (
                    <View style={styles.tabContent}>
                        {/* Vehicle Information */}
                        <Card style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Vehicle Information</Text>
                            <View style={styles.infoGrid}>
                                <View style={styles.infoItem}>
                                    <Ionicons name="car" size={20} color="#8E8E93" />
                                    <Text style={styles.infoLabel}>Vehicle</Text>
                                    <Text style={styles.infoValue}>
                                        {driver.vehicle.make} {driver.vehicle.model} ({driver.vehicle.year})
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="document-text" size={20} color="#8E8E93" />
                                    <Text style={styles.infoLabel}>License Plate</Text>
                                    <Text style={styles.infoValue}>{driver.vehicle.licensePlate}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="people" size={20} color="#8E8E93" />
                                    <Text style={styles.infoLabel}>Capacity</Text>
                                    <Text style={styles.infoValue}>
                                        {driver.vehicle.seatingCapacity} seats ({driver.vehicle.availableSeats} available)
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="shield-checkmark" size={20} color="#8E8E93" />
                                    <Text style={styles.infoLabel}>Insurance</Text>
                                    <Text style={styles.infoValue}>{driver.vehicle.insurance}</Text>
                                </View>
                            </View>
                        </Card>

                        {/* Safety Features */}
                        <Card style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Safety Features</Text>
                            <View style={styles.featuresList}>
                                {driver.vehicle.safetyFeatures.map((feature, index) => (
                                    <View key={index} style={styles.featureItem}>
                                        <Ionicons name="checkmark-circle" size={18} color="#34C759" />
                                        <Text style={styles.featureText}>{feature}</Text>
                                    </View>
                                ))}
                            </View>
                        </Card>

                        {/* Pricing */}
                        <Card style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Pricing</Text>
                            <View style={styles.pricingRow}>
                                <View style={styles.priceOption}>
                                    <Text style={styles.priceLabel}>Monthly</Text>
                                    <Text style={styles.priceValue}>LKR {driver.monthlyFee.toLocaleString()}</Text>
                                </View>
                                <View style={styles.priceOption}>
                                    <Text style={styles.priceLabel}>Weekly</Text>
                                    <Text style={styles.priceValue}>LKR {driver.weeklyFee.toLocaleString()}</Text>
                                </View>
                            </View>
                        </Card>

                        {/* Payment Methods */}
                        <Card style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Accepted Payments</Text>
                            <View style={styles.paymentMethods}>
                                {driver.acceptedPayments.map((method, index) => (
                                    <Badge key={index} label={method} variant="neutral" size="medium" />
                                ))}
                            </View>
                        </Card>

                        {/* Cancellation Policy */}
                        <Card style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Cancellation Policy</Text>
                            <Text style={styles.policyText}>{driver.cancellationPolicy}</Text>
                        </Card>
                    </View>
                );
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Service Details" showBack />

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {/* Driver Profile Header */}
                <View style={styles.profileHeader}>
                    <Avatar source={driver.photo} name={driver.name} size="xlarge" verified={driver.verified} />
                    <Text style={styles.driverName}>{driver.name}</Text>

                    <View style={styles.ratingRow}>
                        <RatingStars rating={driver.rating} size="small" />
                        <Text style={styles.rating}>{driver.rating}</Text>
                        <Text style={styles.reviewCount}>({driver.reviewCount} reviews)</Text>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{driver.yearsExperience}</Text>
                            <Text style={styles.statLabel}>Years</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{driver.totalStudents}</Text>
                            <Text style={styles.statLabel}>Students Served</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{driver.vehicle.availableSeats}</Text>
                            <Text style={styles.statLabel}>Seats Left</Text>
                        </View>
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity style={styles.quickAction} onPress={() => router.push(`/parent/chat?driverId=${driver.id}`)}>
                            <Ionicons name="chatbubble-outline" size={22} color="#007AFF" />
                            <Text style={styles.quickActionText}>Message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.quickAction}>
                            <Ionicons name="call-outline" size={22} color="#007AFF" />
                            <Text style={styles.quickActionText}>Call</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                            onPress={() => setActiveTab(tab.key)}
                        >
                            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                                {tab.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {renderTabContent()}

                <View style={{ height: hp(120) }} />
            </ScrollView>

            {/* Book Service Button */}
            <View style={styles.bookingBar}>
                <View style={styles.priceInfo}>
                    <Text style={styles.priceFromLabel}>Starting from</Text>
                    <Text style={styles.priceFromValue}>LKR {driver.monthlyFee.toLocaleString()}/mo</Text>
                </View>
                <Button
                    title="Book Service"
                    onPress={() => router.push(`/parent/booking?driverId=${driver.id}`)}
                    size="large"
                    style={styles.bookButton}
                />
            </View>
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
    profileHeader: {
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: responsive.paddingXL,
        paddingHorizontal: responsive.paddingLG,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    driverName: {
        fontSize: responsive.font2XL,
        fontWeight: 'bold',
        color: '#000',
        marginTop: responsive.paddingMD,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsive.paddingSM,
    },
    rating: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
        marginLeft: responsive.paddingSM,
    },
    reviewCount: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        marginLeft: responsive.paddingXS,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsive.paddingLG,
    },
    statItem: {
        alignItems: 'center',
        paddingHorizontal: responsive.paddingLG,
    },
    statValue: {
        fontSize: responsive.fontXL,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    statLabel: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: 2,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#E5E5EA',
    },
    quickActions: {
        flexDirection: 'row',
        marginTop: responsive.paddingLG,
        gap: responsive.paddingMD,
    },
    quickAction: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingSM,
        backgroundColor: '#E3F2FD',
        borderRadius: responsive.radiusFull,
        gap: responsive.paddingSM,
    },
    quickActionText: {
        fontSize: responsive.fontMD,
        color: '#007AFF',
        fontWeight: '500',
    },
    tabs: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    tab: {
        flex: 1,
        paddingVertical: responsive.paddingMD,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: '#007AFF',
    },
    tabText: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        fontWeight: '500',
    },
    tabTextActive: {
        color: '#007AFF',
    },
    tabContent: {
        padding: responsive.paddingLG,
    },
    infoCard: {
        marginBottom: responsive.paddingMD,
    },
    cardTitle: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
        marginBottom: responsive.paddingMD,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    infoItem: {
        width: '50%',
        marginBottom: responsive.paddingMD,
    },
    infoLabel: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: responsive.paddingXS,
    },
    infoValue: {
        fontSize: responsive.fontMD,
        color: '#000',
        fontWeight: '500',
    },
    featuresList: {
        gap: responsive.paddingSM,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsive.paddingSM,
    },
    featureText: {
        fontSize: responsive.fontMD,
        color: '#000',
    },
    pricingRow: {
        flexDirection: 'row',
        gap: responsive.paddingMD,
    },
    priceOption: {
        flex: 1,
        backgroundColor: '#F9F9FB',
        borderRadius: responsive.radiusMD,
        padding: responsive.paddingMD,
        alignItems: 'center',
    },
    priceLabel: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
    },
    priceValue: {
        fontSize: responsive.fontXL,
        fontWeight: 'bold',
        color: '#007AFF',
        marginTop: responsive.paddingXS,
    },
    paymentMethods: {
        flexDirection: 'row',
        gap: responsive.paddingSM,
    },
    policyText: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        lineHeight: responsive.fontMD * 1.5,
    },
    daysCard: {
        marginTop: responsive.paddingMD,
    },
    daysRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dayBadge: {
        width: wp(38),
        height: wp(38),
        borderRadius: wp(19),
        backgroundColor: '#F2F2F7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayBadgeActive: {
        backgroundColor: '#007AFF',
    },
    dayText: {
        fontSize: responsive.fontXS,
        color: '#8E8E93',
        fontWeight: '500',
    },
    dayTextActive: {
        color: '#fff',
    },
    ratingOverview: {
        marginBottom: responsive.paddingMD,
    },
    ratingMain: {
        alignItems: 'center',
    },
    ratingBig: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#000',
    },
    reviewCountText: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        marginTop: responsive.paddingSM,
    },
    bookingBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingMD,
        paddingBottom: hp(32),
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    priceInfo: {},
    priceFromLabel: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
    },
    priceFromValue: {
        fontSize: responsive.fontXL,
        fontWeight: 'bold',
        color: '#007AFF',
    },
    bookButton: {
        minWidth: wp(150),
    },
});
