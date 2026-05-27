import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    SearchNormal1,
    Wallet3,
    Message,
    Star1,
    Notification,
    Profile2User,
    Bus,
    Calendar,
    ArrowRight2,
    Shield,
    Clock,
} from 'iconsax-react-native';
import { responsive, wp, hp, fs } from '../utils/responsive';
import { useAuth } from '../../contexts/AuthContext';
import { getChildren, getBookings, getMe } from '../../services/parentApi';
import { ParentBottomNav, FirstTimeHomeScreen } from '../components/organisms';

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning 👋';
    if (h < 17) return 'Good Afternoon 👋';
    return 'Good Evening 👋';
}

function getInitials(name = '') {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

export default function ParentHome() {
    const router = useRouter();
    const { user, updateUser } = useAuth();

    const [children, setChildren] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setError(null);
            const [childrenRes, bookingsRes, meRes] = await Promise.all([
                getChildren(),
                getBookings(),
                getMe().catch(() => null),
            ]);
            setChildren(childrenRes?.children || []);
            setBookings(bookingsRes?.bookings || []);
            if (meRes?.user) updateUser(meRes.user);
        } catch (err) {
            setError(err.message || 'Failed to load data');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [updateUser]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const activeBookings = bookings.filter(b => b.status === 'accepted');
    const activeBooking = activeBookings[0] || null;

    // ── First-time user detection ──────────────────────────────────────────
    // Set PREVIEW_FIRST_TIME=true to force the onboarding screen during dev.
    // In production it shows automatically when the account has no children
    // and no bookings (data loaded successfully with empty results).
    const PREVIEW_FIRST_TIME = true; // ← toggle to false when done testing

    const isFirstTimeUser =
        PREVIEW_FIRST_TIME ||
        (!loading && !error && children.length === 0 && bookings.length === 0);

    if (isFirstTimeUser) {
        return <FirstTimeHomeScreen user={user} />;
    }

    const quickActions = [
        { icon: SearchNormal1, label: 'Find Service', route: '/parent/search', color: '#3B82F6', bg: '#EFF6FF' },
        { icon: Wallet3, label: 'Payments', route: '/parent/payments', color: '#10B981', bg: '#ECFDF5' },
        { icon: Message, label: 'Messages', route: '/parent/messages', color: '#F59E0B', bg: '#FFFBEB' },
        { icon: Star1, label: 'Rate Service', route: '/parent/write-review', color: '#8B5CF6', bg: '#F5F3FF' },
    ];

    const firstName = user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Parent';
    const fullName = user?.fullName || 'Parent';

    // Derive stats from real data
    const activeRides = activeBookings.length;
    const totalChildren = children.length;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.greeting}>{getGreeting()}</Text>
                            <Text style={styles.userName}>{firstName}</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.notificationBtn}
                                onPress={() => router.push('/parent/notifications')}
                            >
                                <Notification size={24} color="#fff" variant="Outline" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.avatarBtn}
                                onPress={() => router.push('/parent/profile')}
                            >
                                <LinearGradient
                                    colors={['#fff', '#F1F5F9']}
                                    style={styles.avatarGradient}
                                >
                                    <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Quick Stats */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statsContainer}
                    >
                        {[
                            { icon: Profile2User, value: String(totalChildren), label: 'Children', },
                            { icon: Bus, value: String(activeRides), label: 'Active Rides', },
                            { icon: Calendar, value: String(bookings.filter(b => b.status === 'pending').length), label: 'Pending', },
                        ].map((stat, i) => (
                            <View key={i} style={styles.statCard}>
                                <View style={styles.statIconContainer}>
                                    <stat.icon size={20} color="#fff" variant="Bold" />
                                </View>
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#3B82F6']} />
                }
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#3B82F6" />
                        <Text style={styles.loadingText}>Loading your dashboard...</Text>
                    </View>
                ) : error ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryBtn} onPress={fetchData}>
                            <Text style={styles.retryText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Active Subscription */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>Active Subscription</Text>
                                <TouchableOpacity style={styles.seeAllBtn} onPress={() => router.push('/parent/my-bookings')}>
                                    <Text style={styles.seeAllText}>View All</Text>
                                    <ArrowRight2 size={16} color="#3B82F6" />
                                </TouchableOpacity>
                            </View>

                            {activeBooking ? (
                                <TouchableOpacity
                                    style={styles.subscriptionCard}
                                    onPress={() => router.push('/parent/my-bookings')}
                                    activeOpacity={0.7}
                                >
                                    <LinearGradient
                                        colors={['#10B981', '#059669']}
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 1 }}
                                        style={styles.subscriptionGradient}
                                    >
                                        <View style={styles.subscriptionHeader}>
                                            <View style={styles.subscriptionBadge}>
                                                <Shield size={14} color="#10B981" variant="Bold" />
                                                <Text style={styles.subscriptionBadgeText}>Active</Text>
                                            </View>
                                            <Text style={styles.subscriptionFee}>
                                                Rs. {activeBooking.monthlyFee?.toLocaleString()}/mo
                                            </Text>
                                        </View>

                                        <View style={styles.driverInfo}>
                                            <View style={styles.driverAvatar}>
                                                <Text style={styles.driverInitials}>
                                                    {getInitials(activeBooking.driver?.fullName || '')}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text style={styles.driverName}>
                                                    {activeBooking.driver?.fullName || 'Driver'}
                                                </Text>
                                                <Text style={styles.vehicleInfo}>
                                                    For {activeBooking.child?.fullName || 'Child'}
                                                </Text>
                                            </View>
                                        </View>

                                        <View style={styles.subscriptionFooter}>
                                            <View style={styles.nextPickup}>
                                                <Clock size={16} color="rgba(255,255,255,0.8)" />
                                                <Text style={styles.nextPickupText}>
                                                    Pickup: {activeBooking.pickupAddress}
                                                </Text>
                                            </View>
                                            <TouchableOpacity
                                                style={styles.messageBtn}
                                                onPress={() => router.push('/parent/messages')}
                                            >
                                                <Message size={18} color="#10B981" variant="Bold" />
                                            </TouchableOpacity>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={styles.emptySubscription}
                                    onPress={() => router.push('/parent/search')}
                                    activeOpacity={0.8}
                                >
                                    <Bus size={32} color="#94A3B8" variant="Outline" />
                                    <Text style={styles.emptySubscriptionText}>No active subscription</Text>
                                    <Text style={styles.emptySubscriptionSub}>Find a bus service to get started</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* My Children */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>My Children</Text>
                                <TouchableOpacity style={styles.seeAllBtn} onPress={() => router.push('/parent/profile/children')}>
                                    <Text style={styles.seeAllText}>Manage</Text>
                                    <ArrowRight2 size={16} color="#3B82F6" />
                                </TouchableOpacity>
                            </View>

                            {children.length > 0 ? (
                                <View style={styles.childrenContainer}>
                                    {children.map((child) => {
                                        const hasActiveBooking = activeBookings.some(b => b.child?._id === child._id || b.child === child._id);
                                        return (
                                            <TouchableOpacity key={child._id} style={styles.childCard} activeOpacity={0.7}>
                                                <View style={styles.childAvatar}>
                                                    <Text style={styles.childInitials}>{getInitials(child.fullName)}</Text>
                                                </View>
                                                <View style={styles.childInfo}>
                                                    <Text style={styles.childName}>{child.fullName}</Text>
                                                    <Text style={styles.childDetails}>
                                                        Grade {child.grade} • {child.school}
                                                    </Text>
                                                </View>
                                                <View style={[
                                                    styles.childStatus,
                                                    { backgroundColor: hasActiveBooking ? '#ECFDF5' : '#FEF3C7' }
                                                ]}>
                                                    <View style={[
                                                        styles.statusDot,
                                                        { backgroundColor: hasActiveBooking ? '#10B981' : '#F59E0B' }
                                                    ]} />
                                                    <Text style={[
                                                        styles.statusText,
                                                        { color: hasActiveBooking ? '#10B981' : '#F59E0B' }
                                                    ]}>
                                                        {hasActiveBooking ? 'Active' : 'No Ride'}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={styles.emptyChildren}
                                    onPress={() => router.push('/parent/profile/add-child')}
                                >
                                    <Profile2User size={28} color="#94A3B8" variant="Outline" />
                                    <Text style={styles.emptyChildrenText}>No children added yet</Text>
                                    <Text style={styles.emptyChildrenSub}>Tap to add a child</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Quick Actions */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Quick Actions</Text>
                            <View style={styles.actionsGrid}>
                                {quickActions.map((action, i) => (
                                    <TouchableOpacity
                                        key={i}
                                        style={styles.actionCard}
                                        onPress={() => router.push(action.route)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.actionIconContainer, { backgroundColor: action.bg }]}>
                                            <action.icon size={24} color={action.color} variant="Bold" />
                                        </View>
                                        <Text style={styles.actionLabel}>{action.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Find Service CTA */}
                        <View style={styles.section}>
                            <TouchableOpacity
                                style={styles.ctaCard}
                                onPress={() => router.push('/parent/search')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#2563EB']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.ctaGradient}
                                >
                                    <View style={styles.ctaContent}>
                                        <View style={styles.ctaTextContainer}>
                                            <Text style={styles.ctaTitle}>Find a School Bus Service</Text>
                                            <Text style={styles.ctaSubtitle}>Browse verified drivers near you</Text>
                                        </View>
                                        <View style={styles.ctaIconContainer}>
                                            <SearchNormal1 size={32} color="#fff" variant="Bold" />
                                        </View>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                <View style={{ height: hp(100) }} />
            </ScrollView>

            <ParentBottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    headerGradient: { paddingBottom: hp(20) },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(20),
        paddingTop: hp(10),
    },
    headerLeft: {},
    greeting: { fontSize: fs(14), fontFamily: 'Roboto-Regular', color: 'rgba(255,255,255,0.8)' },
    userName: { fontSize: fs(24), fontFamily: 'Roboto-Bold', color: '#fff', marginTop: 4 },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    notificationBtn: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center', justifyContent: 'center',
    },
    avatarBtn: {},
    avatarGradient: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
    avatarText: { fontSize: fs(16), fontFamily: 'Roboto-Bold', color: '#3B82F6' },
    statsContainer: { paddingHorizontal: wp(20), paddingTop: hp(20), gap: 12 },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16, padding: 16, minWidth: wp(90), marginRight: 12,
    },
    statIconContainer: {
        width: 36, height: 36, borderRadius: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    },
    statValue: { fontSize: fs(20), fontFamily: 'Roboto-Bold', color: '#fff' },
    statLabel: { fontSize: fs(12), fontFamily: 'Roboto-Regular', color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    scrollView: { flex: 1, marginTop: -hp(10) },
    loadingContainer: { alignItems: 'center', paddingTop: hp(60) },
    loadingText: { marginTop: 12, fontSize: fs(14), fontFamily: 'Roboto-Regular', color: '#64748B' },
    errorContainer: { alignItems: 'center', paddingTop: hp(60), paddingHorizontal: wp(24) },
    errorText: { fontSize: fs(14), fontFamily: 'Roboto-Regular', color: '#EF4444', textAlign: 'center' },
    retryBtn: {
        marginTop: 16, backgroundColor: '#3B82F6',
        paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20,
    },
    retryText: { fontSize: fs(14), fontFamily: 'Roboto-Medium', color: '#fff' },
    section: { paddingHorizontal: wp(20), marginTop: hp(20) },
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: hp(12),
    },
    sectionTitle: { fontSize: fs(18), fontFamily: 'Roboto-Bold', color: '#1E293B' },
    seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    seeAllText: { fontSize: fs(14), fontFamily: 'Roboto-Medium', color: '#3B82F6' },
    subscriptionCard: {
        borderRadius: 20, overflow: 'hidden',
        shadowColor: '#10B981', shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2, shadowRadius: 16, elevation: 8,
    },
    subscriptionGradient: { padding: 20 },
    subscriptionHeader: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 16,
    },
    subscriptionBadge: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, gap: 4,
    },
    subscriptionBadgeText: { fontSize: fs(12), fontFamily: 'Roboto-Medium', color: '#10B981' },
    subscriptionFee: { fontSize: fs(16), fontFamily: 'Roboto-Bold', color: '#fff' },
    driverInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    driverAvatar: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    driverInitials: { fontSize: fs(18), fontFamily: 'Roboto-Bold', color: '#fff' },
    driverName: { fontSize: fs(18), fontFamily: 'Roboto-Bold', color: '#fff' },
    vehicleInfo: { fontSize: fs(14), fontFamily: 'Roboto-Regular', color: 'rgba(255,255,255,0.8)', marginTop: 2 },
    subscriptionFooter: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)', paddingTop: 12,
    },
    nextPickup: { flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 },
    nextPickupText: { fontSize: fs(13), fontFamily: 'Roboto-Medium', color: 'rgba(255,255,255,0.9)', flex: 1 },
    messageBtn: {
        width: 40, height: 40, borderRadius: 20,
        backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center',
    },
    emptySubscription: {
        backgroundColor: '#fff', borderRadius: 20, padding: 32,
        alignItems: 'center', borderWidth: 2, borderColor: '#E2E8F0', borderStyle: 'dashed',
    },
    emptySubscriptionText: { fontSize: fs(16), fontFamily: 'Roboto-Medium', color: '#475569', marginTop: 12 },
    emptySubscriptionSub: { fontSize: fs(13), fontFamily: 'Roboto-Regular', color: '#94A3B8', marginTop: 4 },
    childrenContainer: { gap: 12 },
    childCard: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: 16, padding: 16,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
    },
    childAvatar: {
        width: 48, height: 48, borderRadius: 24,
        backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: 12,
    },
    childInitials: { fontSize: fs(16), fontFamily: 'Roboto-Bold', color: '#3B82F6' },
    childInfo: { flex: 1 },
    childName: { fontSize: fs(16), fontFamily: 'Roboto-Medium', color: '#1E293B' },
    childDetails: { fontSize: fs(13), fontFamily: 'Roboto-Regular', color: '#64748B', marginTop: 2 },
    childStatus: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 6,
    },
    statusDot: { width: 6, height: 6, borderRadius: 3 },
    statusText: { fontSize: fs(12), fontFamily: 'Roboto-Medium' },
    emptyChildren: {
        backgroundColor: '#fff', borderRadius: 16, padding: 24,
        alignItems: 'center', borderWidth: 1, borderColor: '#E2E8F0',
    },
    emptyChildrenText: { fontSize: fs(15), fontFamily: 'Roboto-Medium', color: '#475569', marginTop: 8 },
    emptyChildrenSub: { fontSize: fs(13), fontFamily: 'Roboto-Regular', color: '#94A3B8', marginTop: 4 },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, marginHorizontal: -6 },
    actionCard: { width: '25%', alignItems: 'center', paddingHorizontal: 6, marginBottom: 16 },
    actionIconContainer: {
        width: 56, height: 56, borderRadius: 16,
        alignItems: 'center', justifyContent: 'center', marginBottom: 8,
    },
    actionLabel: { fontSize: fs(12), fontFamily: 'Roboto-Medium', color: '#475569', textAlign: 'center' },
    ctaCard: {
        borderRadius: 20, overflow: 'hidden',
        shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2, shadowRadius: 12, elevation: 6,
    },
    ctaGradient: { padding: 20 },
    ctaContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    ctaTextContainer: { flex: 1 },
    ctaTitle: { fontSize: fs(18), fontFamily: 'Roboto-Bold', color: '#fff' },
    ctaSubtitle: { fontSize: fs(14), fontFamily: 'Roboto-Regular', color: 'rgba(255,255,255,0.8)', marginTop: 4 },
    ctaIconContainer: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center',
    },
});
