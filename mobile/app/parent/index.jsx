import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
    Image,
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
    Location,
    Shield,
    Clock,
    Heart,
    Setting2,
} from 'iconsax-react-native';
import { responsive, wp, hp, fs } from '../utils/responsive';

export default function ParentHome() {
    const router = useRouter();
    const [refreshing, setRefreshing] = useState(false);

    // Mock data
    const user = {
        name: 'Samantha',
        fullName: 'Samantha Fernando',
    };

    const children = [
        {
            id: 1,
            name: 'Kavindi',
            fullName: 'Kavindi Fernando',
            grade: 'Grade 5',
            school: 'Royal College',
            hasSubscription: true,
            driverName: 'Mr. Perera',
            nextPickup: '7:15 AM',
        },
        {
            id: 2,
            name: 'Dineth',
            fullName: 'Dineth Fernando',
            grade: 'Grade 3',
            school: 'Royal College',
            hasSubscription: false,
        },
    ];

    const activeSubscription = {
        driverName: 'Kasun Perera',
        vehicleInfo: 'Toyota HiAce • CAB-1234',
        nextPickup: '7:15 AM Tomorrow',
        monthlyFee: 'Rs. 8,500',
        status: 'active',
    };

    const quickStats = [
        { icon: Profile2User, value: '2', label: 'Children', color: '#3B82F6', bg: '#EFF6FF' },
        { icon: Bus, value: '1', label: 'Active Rides', color: '#10B981', bg: '#ECFDF5' },
        { icon: Star1, value: '4.8', label: 'Rating', color: '#F59E0B', bg: '#FFFBEB' },
        { icon: Calendar, value: '23', label: 'Days Left', color: '#8B5CF6', bg: '#F5F3FF' },
    ];

    const quickActions = [
        { icon: SearchNormal1, label: 'Find Service', route: '/parent/search', color: '#3B82F6', bg: '#EFF6FF' },
        { icon: Wallet3, label: 'Payments', route: '/parent/payments', color: '#10B981', bg: '#ECFDF5' },
        { icon: Message, label: 'Messages', route: '/parent/messages', color: '#F59E0B', bg: '#FFFBEB' },
        { icon: Star1, label: 'Rate Service', route: '/parent/write-review', color: '#8B5CF6', bg: '#F5F3FF' },
    ];

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 1500);
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header with Gradient */}
            <LinearGradient
                colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.greeting}>Good Morning 👋</Text>
                            <Text style={styles.userName}>{user.name}</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.notificationBtn}
                                onPress={() => router.push('/parent/notifications')}
                            >
                                <Notification size={24} color="#fff" variant="Outline" />
                                <View style={styles.notificationBadge}>
                                    <Text style={styles.notificationCount}>3</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.avatarBtn}
                                onPress={() => router.push('/parent/profile')}
                            >
                                <LinearGradient
                                    colors={['#fff', '#F1F5F9']}
                                    style={styles.avatarGradient}
                                >
                                    <Text style={styles.avatarText}>{getInitials(user.fullName)}</Text>
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
                        {quickStats.map((stat, index) => (
                            <View key={index} style={styles.statCard}>
                                <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
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
                {/* Active Subscription Card */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Active Subscription</Text>
                        <TouchableOpacity
                            style={styles.seeAllBtn}
                            onPress={() => router.push('/parent/my-bookings')}
                        >
                            <Text style={styles.seeAllText}>View All</Text>
                            <ArrowRight2 size={16} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>

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
                                <Text style={styles.subscriptionFee}>{activeSubscription.monthlyFee}/mo</Text>
                            </View>

                            <View style={styles.driverInfo}>
                                <View style={styles.driverAvatar}>
                                    <Text style={styles.driverInitials}>KP</Text>
                                </View>
                                <View style={styles.driverDetails}>
                                    <Text style={styles.driverName}>{activeSubscription.driverName}</Text>
                                    <Text style={styles.vehicleInfo}>{activeSubscription.vehicleInfo}</Text>
                                </View>
                            </View>

                            <View style={styles.subscriptionFooter}>
                                <View style={styles.nextPickup}>
                                    <Clock size={16} color="rgba(255,255,255,0.8)" />
                                    <Text style={styles.nextPickupText}>Next: {activeSubscription.nextPickup}</Text>
                                </View>
                                <TouchableOpacity style={styles.messageBtn}>
                                    <Message size={18} color="#10B981" variant="Bold" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* My Children */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Children</Text>
                        <TouchableOpacity
                            style={styles.seeAllBtn}
                            onPress={() => router.push('/parent/profile/children')}
                        >
                            <Text style={styles.seeAllText}>Manage</Text>
                            <ArrowRight2 size={16} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.childrenContainer}>
                        {children.map((child, index) => (
                            <TouchableOpacity
                                key={child.id}
                                style={styles.childCard}
                                activeOpacity={0.7}
                            >
                                <View style={styles.childAvatar}>
                                    <Text style={styles.childInitials}>{getInitials(child.fullName)}</Text>
                                </View>
                                <View style={styles.childInfo}>
                                    <Text style={styles.childName}>{child.fullName}</Text>
                                    <Text style={styles.childDetails}>{child.grade} • {child.school}</Text>
                                </View>
                                <View style={[
                                    styles.childStatus,
                                    { backgroundColor: child.hasSubscription ? '#ECFDF5' : '#FEF3C7' }
                                ]}>
                                    <View style={[
                                        styles.statusDot,
                                        { backgroundColor: child.hasSubscription ? '#10B981' : '#F59E0B' }
                                    ]} />
                                    <Text style={[
                                        styles.statusText,
                                        { color: child.hasSubscription ? '#10B981' : '#F59E0B' }
                                    ]}>
                                        {child.hasSubscription ? 'Active' : 'No Ride'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        {quickActions.map((action, index) => (
                            <TouchableOpacity
                                key={index}
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

                {/* Find a Service CTA */}
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

                {/* Bottom Spacing */}
                <View style={{ height: hp(100) }} />
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Bus size={24} color="#3B82F6" variant="Bold" />
                    <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/parent/search')}
                >
                    <SearchNormal1 size={24} color="#64748B" variant="Outline" />
                    <Text style={styles.navLabel}>Search</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/parent/my-bookings')}
                >
                    <Calendar size={24} color="#64748B" variant="Outline" />
                    <Text style={styles.navLabel}>Bookings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/parent/messages')}
                >
                    <Message size={24} color="#64748B" variant="Outline" />
                    <Text style={styles.navLabel}>Messages</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/parent/profile')}
                >
                    <Setting2 size={24} color="#64748B" variant="Outline" />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    headerGradient: {
        paddingBottom: hp(20),
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(20),
        paddingTop: hp(10),
    },
    headerLeft: {},
    greeting: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.8)',
    },
    userName: {
        fontSize: fs(24),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        marginTop: 4,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#EF4444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    notificationCount: {
        fontSize: fs(10),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
    avatarBtn: {},
    avatarGradient: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#3B82F6',
    },
    statsContainer: {
        paddingHorizontal: wp(20),
        paddingTop: hp(20),
        gap: 12,
    },
    statCard: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: 16,
        minWidth: wp(90),
        marginRight: 12,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statValue: {
        fontSize: fs(20),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
    statLabel: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    scrollView: {
        flex: 1,
        marginTop: -hp(10),
    },
    section: {
        paddingHorizontal: wp(20),
        marginTop: hp(20),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: hp(12),
    },
    sectionTitle: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
    },
    seeAllBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    seeAllText: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Medium',
        color: '#3B82F6',
    },
    subscriptionCard: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
    },
    subscriptionGradient: {
        padding: 20,
    },
    subscriptionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    subscriptionBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    subscriptionBadgeText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
        color: '#10B981',
    },
    subscriptionFee: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    driverAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    driverInitials: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
    driverDetails: {},
    driverName: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
    vehicleInfo: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.8)',
        marginTop: 2,
    },
    subscriptionFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.2)',
        paddingTop: 12,
    },
    nextPickup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    nextPickupText: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Medium',
        color: 'rgba(255,255,255,0.9)',
    },
    messageBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    childrenContainer: {
        gap: 12,
    },
    childCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    childAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    childInitials: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#3B82F6',
    },
    childInfo: {
        flex: 1,
    },
    childName: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Medium',
        color: '#1E293B',
    },
    childDetails: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
        marginTop: 2,
    },
    childStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    statusText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 12,
        marginHorizontal: -6,
    },
    actionCard: {
        width: '25%',
        alignItems: 'center',
        paddingHorizontal: 6,
        marginBottom: 16,
    },
    actionIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    actionLabel: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
        color: '#475569',
        textAlign: 'center',
    },
    ctaCard: {
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 6,
    },
    ctaGradient: {
        padding: 20,
    },
    ctaContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    ctaTextContainer: {
        flex: 1,
    },
    ctaTitle: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
    ctaSubtitle: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    ctaIconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        paddingVertical: 12,
        paddingBottom: hp(30),
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 8,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    navLabel: {
        fontSize: fs(11),
        fontFamily: 'Roboto-Medium',
        color: '#64748B',
    },
    navLabelActive: {
        color: '#3B82F6',
    },
});
