import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, SafeAreaView,
    TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp, hp } from '../utils/responsive';
import { Button, Badge, Avatar, RatingStars, Card } from '../components/atoms';
import { ReviewCard } from '../components/molecules';
import { Header, ScheduleTimeline } from '../components/organisms';
import { getRouteById } from '../../services/parentApi';

function formatTime(hhmm) {
    if (!hhmm) return '—';
    const [h, m] = hhmm.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

function buildInsuranceLabel(vehicle) {
    if (!vehicle) return null;
    if (vehicle.insuranceExpiry) {
        const exp = new Date(vehicle.insuranceExpiry);
        return `Valid until ${exp.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`;
    }
    if (vehicle.insuranceProvider) return vehicle.insuranceProvider;
    return null;
}

function buildSafetyFeatures(vehicle) {
    const features = [];
    if (!vehicle) return features;
    if (vehicle.isAC) features.push('Air Conditioning');
    features.push('GPS Tracking');
    features.push('First Aid Kit');
    if (vehicle.insuranceProvider || vehicle.insuranceExpiry) features.push('Fully Insured');
    return features.length ? features : ['GPS Tracking', 'First Aid Kit'];
}

export default function ServiceDetailScreen() {
    const router = useRouter();
    const { id, routeId } = useLocalSearchParams();
    const [activeTab, setActiveTab] = useState('info');
    const [route, setRoute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRoute = useCallback(async () => {
        const targetId = routeId || id;
        if (!targetId) {
            setError('No route information provided.');
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            setError(null);
            const data = await getRouteById(targetId);
            setRoute(data?.route || data);
        } catch (err) {
            setError(err.message || 'Failed to load service details.');
        } finally {
            setLoading(false);
        }
    }, [routeId, id]);

    useEffect(() => { fetchRoute(); }, [fetchRoute]);

    const tabs = [
        { key: 'info', label: 'Info' },
        { key: 'schedule', label: 'Schedule' },
        { key: 'reviews', label: 'Reviews' },
    ];

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Service Details" showBack />
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Loading details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error || !route) {
        return (
            <SafeAreaView style={styles.container}>
                <Header title="Service Details" showBack />
                <View style={styles.centered}>
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text style={styles.errorTitle}>Unable to load</Text>
                    <Text style={styles.errorText}>{error || 'Service details not available.'}</Text>
                    <Button title="Try Again" onPress={fetchRoute} style={{ marginTop: 16 }} />
                </View>
            </SafeAreaView>
        );
    }

    const driver = route.driver || {};
    const vehicle = route.vehicle || {};
    const stops = (route.stops || []).slice().sort((a, b) => a.order - b.order);
    const daysOfOperation = route.daysOfOperation || [];
    const safetyFeatures = buildSafetyFeatures(vehicle);
    const insuranceLabel = buildInsuranceLabel(vehicle);
    const driverId = driver._id || id;
    const monthlyFee = driver.monthlyFee || 0;

    // Map stops to ScheduleTimeline format
    const timelineStops = stops.map((s) => ({
        ...s,
        pickupTime: formatTime(s.pickupTime),
        dropoffTime: s.dropoffTime ? formatTime(s.dropoffTime) : null,
    }));

    const schoolArrivalDisplay = route.schoolArrival ? formatTime(route.schoolArrival) : null;
    const schoolDepartureDisplay = route.schoolDeparture ? formatTime(route.schoolDeparture) : null;

    const renderTabContent = () => {
        switch (activeTab) {
            case 'schedule':
                return (
                    <View style={styles.tabContent}>
                        {stops.length === 0 ? (
                            <Card style={styles.infoCard}>
                                <Text style={styles.emptyText}>No stops have been added to this route yet.</Text>
                            </Card>
                        ) : (
                            <>
                                <ScheduleTimeline
                                    stops={timelineStops}
                                    school={route.school}
                                    schoolArrival={schoolArrivalDisplay}
                                    schoolDeparture={schoolDepartureDisplay}
                                    type="morning"
                                />
                                <ScheduleTimeline
                                    stops={timelineStops}
                                    school={route.school}
                                    schoolArrival={schoolArrivalDisplay}
                                    schoolDeparture={schoolDepartureDisplay}
                                    type="afternoon"
                                />
                            </>
                        )}

                        <Card style={styles.daysCard}>
                            <Text style={styles.cardTitle}>Days of Operation</Text>
                            <View style={styles.daysRow}>
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                                    <View
                                        key={day}
                                        style={[
                                            styles.dayBadge,
                                            daysOfOperation.includes(day) && styles.dayBadgeActive,
                                        ]}
                                    >
                                        <Text
                                            style={[
                                                styles.dayText,
                                                daysOfOperation.includes(day) && styles.dayTextActive,
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
                                <Text style={styles.ratingBig}>{(driver.rating || 0).toFixed(1)}</Text>
                                <RatingStars rating={driver.rating || 0} size="medium" />
                                <Text style={styles.reviewCountText}>{driver.reviewCount || 0} reviews</Text>
                            </View>
                        </Card>
                        <Card style={styles.infoCard}>
                            <Text style={styles.emptyText}>
                                Reviews will appear here once parents submit them after trips.
                            </Text>
                        </Card>
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
                                        {vehicle.make && vehicle.model
                                            ? `${vehicle.make} ${vehicle.model}${vehicle.year ? ` (${vehicle.year})` : ''}`
                                            : 'Not specified'}
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="document-text" size={20} color="#8E8E93" />
                                    <Text style={styles.infoLabel}>License Plate</Text>
                                    <Text style={styles.infoValue}>{vehicle.licensePlate || '—'}</Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="people" size={20} color="#8E8E93" />
                                    <Text style={styles.infoLabel}>Capacity</Text>
                                    <Text style={styles.infoValue}>
                                        {vehicle.capacity
                                            ? `${vehicle.capacity} seats`
                                            : '—'}
                                    </Text>
                                </View>
                                {insuranceLabel ? (
                                    <View style={styles.infoItem}>
                                        <Ionicons name="shield-checkmark" size={20} color="#8E8E93" />
                                        <Text style={styles.infoLabel}>Insurance</Text>
                                        <Text style={styles.infoValue}>{insuranceLabel}</Text>
                                    </View>
                                ) : null}
                            </View>
                        </Card>

                        {/* Safety Features */}
                        <Card style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Safety Features</Text>
                            <View style={styles.featuresList}>
                                {safetyFeatures.map((feature, index) => (
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
                                    <Text style={styles.priceValue}>
                                        {monthlyFee ? `LKR ${monthlyFee.toLocaleString()}` : 'Contact driver'}
                                    </Text>
                                </View>
                            </View>
                        </Card>

                        {/* Payment Methods */}
                        <Card style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Accepted Payments</Text>
                            <View style={styles.paymentMethods}>
                                {['Cash', 'Bank Transfer'].map((method, index) => (
                                    <Badge key={index} label={method} variant="neutral" size="medium" />
                                ))}
                            </View>
                        </Card>

                        {/* Cancellation Policy */}
                        <Card style={styles.infoCard}>
                            <Text style={styles.cardTitle}>Cancellation Policy</Text>
                            <Text style={styles.policyText}>
                                Cancellations with 7+ days notice receive a full refund. 3–7 days: 50% refund. Less than 3 days: no refund.
                            </Text>
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
                    <Avatar
                        source={driver.profilePhoto ? { uri: driver.profilePhoto } : null}
                        name={driver.fullName}
                        size="xlarge"
                        verified={driver.isVerified}
                    />
                    <Text style={styles.driverName}>{driver.fullName || 'Driver'}</Text>

                    <View style={styles.ratingRow}>
                        <RatingStars rating={driver.rating || 0} size="small" />
                        <Text style={styles.rating}>{(driver.rating || 0).toFixed(1)}</Text>
                        <Text style={styles.reviewCount}>({driver.reviewCount || 0} reviews)</Text>
                    </View>

                    <View style={styles.statsRow}>
                        {driver.experience != null && (
                            <>
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{driver.experience}</Text>
                                    <Text style={styles.statLabel}>Years Exp.</Text>
                                </View>
                                <View style={styles.statDivider} />
                            </>
                        )}
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{route.studentCount || 0}</Text>
                            <Text style={styles.statLabel}>Students</Text>
                        </View>
                        {vehicle.capacity != null && (
                            <>
                                <View style={styles.statDivider} />
                                <View style={styles.statItem}>
                                    <Text style={styles.statValue}>{vehicle.capacity}</Text>
                                    <Text style={styles.statLabel}>Capacity</Text>
                                </View>
                            </>
                        )}
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.quickActions}>
                        <TouchableOpacity
                            style={styles.quickAction}
                            onPress={() => router.push(`/parent/chat?driverId=${driverId}`)}
                        >
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
                    <Text style={styles.priceFromValue}>
                        {monthlyFee ? `LKR ${monthlyFee.toLocaleString()}/mo` : 'Contact driver'}
                    </Text>
                </View>
                <Button
                    title="Book Service"
                    onPress={() => router.push(`/parent/booking?driverId=${driverId}&routeId=${route._id}`)}
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
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    loadingText: {
        marginTop: 12,
        fontSize: responsive.fontMD,
        color: '#64748B',
    },
    errorTitle: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
        marginTop: 12,
    },
    errorText: {
        fontSize: responsive.fontMD,
        color: '#64748B',
        textAlign: 'center',
        marginTop: 8,
    },
    emptyText: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        textAlign: 'center',
        paddingVertical: 8,
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
