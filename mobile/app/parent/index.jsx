import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
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
import { wp, hp, fs } from '../utils/responsive';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ParentBottomNav } from '../components/organisms';
import {
    getChildrenForParent,
    getActiveSubscription,
    getDriver,
    getNotifications,
} from '../../services/mock';

const DEMO_PARENT_ID = 'u-parent-1';

export default function ParentHome() {
    const theme = useTheme();
    const styles = useStyles(theme);
    const router = useRouter();
    const { user } = useAuth();

    const parentId = user?.id || DEMO_PARENT_ID;
    const fullName = user?.name || 'Samantha Fernando';
    const firstName = fullName.split(' ')[0];

    const [refreshing, setRefreshing] = useState(false);
    const [children, setChildren] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [driver, setDriver] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadData = useCallback(async () => {
        const [kids, sub, notifs] = await Promise.all([
            getChildrenForParent(parentId),
            getActiveSubscription(parentId),
            getNotifications(),
        ]);
        setChildren(kids);
        setSubscription(sub);
        setUnreadCount(notifs.filter((n) => !n.read).length);
        if (sub?.driverId) {
            const d = await getDriver(sub.driverId);
            setDriver(d);
        } else {
            setDriver(null);
        }
    }, [parentId]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [loadData])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setTimeout(() => setRefreshing(false), 500);
    };

    const getInitials = (name) =>
        name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

    const quickStats = [
        {
            icon: Profile2User,
            value: String(children.length),
            label: 'Children',
        },
        {
            icon: Bus,
            value: subscription ? '1' : '0',
            label: 'Active Rides',
        },
        {
            icon: Star1,
            value: driver?.rating ? driver.rating.toFixed(1) : '—',
            label: 'Driver Rating',
        },
        {
            icon: Calendar,
            value: subscription?.daysRemaining ? String(subscription.daysRemaining) : '—',
            label: 'Days Left',
        },
    ];

    const quickActions = [
        { icon: SearchNormal1, label: 'Find Service', route: '/parent/search', color: theme.colors.primary, bg: theme.colors.primarySoft },
        { icon: Wallet3, label: 'Payments', route: '/parent/payments', color: theme.colors.success, bg: theme.colors.successSoft },
        { icon: Message, label: 'Messages', route: '/parent/messages', color: theme.colors.warning, bg: theme.colors.warningSoft },
        { icon: Star1, label: 'Rate Service', route: '/parent/write-review', color: theme.colors.accent, bg: theme.colors.accentSoft },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.headerGradient}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.greeting}>Good day 👋</Text>
                            <Text style={styles.userName}>{firstName}</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <TouchableOpacity
                                style={styles.notificationBtn}
                                onPress={() => router.push('/parent/notifications')}
                                activeOpacity={0.85}
                            >
                                <Notification size={22} color="#fff" variant="Outline" />
                                {unreadCount > 0 && (
                                    <View style={styles.notificationBadge}>
                                        <Text style={styles.notificationCount}>{unreadCount}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.avatarBtn}
                                onPress={() => router.push('/parent/profile')}
                                activeOpacity={0.85}
                            >
                                <LinearGradient
                                    colors={['#fff', theme.colors.palette.blue[100]]}
                                    style={styles.avatarGradient}
                                >
                                    <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.statsContainer}
                    >
                        {quickStats.map((stat, index) => (
                            <View key={index} style={styles.statCard}>
                                <View style={styles.statIconContainer}>
                                    <stat.icon size={18} color="#fff" variant="Bold" />
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
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
            >
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Active Subscription</Text>
                        <TouchableOpacity
                            style={styles.seeAllBtn}
                            onPress={() => router.push('/parent/my-bookings')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.seeAllText}>View All</Text>
                            <ArrowRight2 size={14} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                    {subscription && driver ? (
                        <TouchableOpacity
                            style={styles.subscriptionCard}
                            onPress={() => router.push('/parent/my-bookings')}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={theme.colors.primaryGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.subscriptionGradient}
                            >
                                <View style={styles.subscriptionHeader}>
                                    <View style={styles.subscriptionBadge}>
                                        <Shield size={12} color={theme.colors.primary} variant="Bold" />
                                        <Text style={styles.subscriptionBadgeText}>Active</Text>
                                    </View>
                                    <Text style={styles.subscriptionFee}>
                                        Rs. {subscription.monthlyFee.toLocaleString()}/mo
                                    </Text>
                                </View>

                                <View style={styles.driverInfo}>
                                    <View style={styles.driverAvatar}>
                                        <Text style={styles.driverInitials}>{driver.initials}</Text>
                                    </View>
                                    <View style={styles.driverDetails}>
                                        <Text style={styles.driverName}>{driver.name}</Text>
                                        <Text style={styles.vehicleInfo}>
                                            {driver.vehicleModel} • {driver.vehicleNumber}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.subscriptionFooter}>
                                    <View style={styles.nextPickup}>
                                        <Clock size={14} color="rgba(255,255,255,0.85)" />
                                        <Text style={styles.nextPickupText}>
                                            Next pickup {subscription.pickupTime}
                                        </Text>
                                    </View>
                                    <TouchableOpacity
                                        style={styles.messageBtn}
                                        onPress={() =>
                                            router.push({ pathname: '/parent/chat', params: { driverId: driver.id } })
                                        }
                                        activeOpacity={0.85}
                                    >
                                        <Message size={16} color={theme.colors.primary} variant="Bold" />
                                    </TouchableOpacity>
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            style={styles.emptySubscriptionCard}
                            onPress={() => router.push('/parent/search')}
                            activeOpacity={0.85}
                        >
                            <View style={styles.emptyIconWrap}>
                                <Bus size={28} color={theme.colors.primary} variant="Bold" />
                            </View>
                            <View style={styles.emptyTextWrap}>
                                <Text style={styles.emptyTitle}>No active rides yet</Text>
                                <Text style={styles.emptySubtitle}>
                                    Browse verified drivers to book your first ride.
                                </Text>
                            </View>
                            <ArrowRight2 size={20} color={theme.colors.primary} />
                        </TouchableOpacity>
                    )}
                </View>

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>My Children</Text>
                        <TouchableOpacity
                            style={styles.seeAllBtn}
                            onPress={() => router.push('/parent/profile/children')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.seeAllText}>Manage</Text>
                            <ArrowRight2 size={14} color={theme.colors.primary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.childrenContainer}>
                        {children.length === 0 ? (
                            <View style={styles.emptyChildrenCard}>
                                <Text style={styles.emptyChildrenText}>
                                    You haven't added any children yet.
                                </Text>
                            </View>
                        ) : (
                            children.map((child) => (
                                <View key={child.id} style={styles.childCard}>
                                    <View style={styles.childAvatar}>
                                        <Text style={styles.childInitials}>
                                            {getInitials(child.name)}
                                        </Text>
                                    </View>
                                    <View style={styles.childInfo}>
                                        <Text style={styles.childName}>{child.name}</Text>
                                        <Text style={styles.childDetails}>
                                            {child.grade} • {child.school}
                                        </Text>
                                    </View>
                                    <View
                                        style={[
                                            styles.childStatus,
                                            {
                                                backgroundColor: child.hasSubscription
                                                    ? theme.colors.successSoft
                                                    : theme.colors.warningSoft,
                                            },
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.statusDot,
                                                {
                                                    backgroundColor: child.hasSubscription
                                                        ? theme.colors.success
                                                        : theme.colors.warning,
                                                },
                                            ]}
                                        />
                                        <Text
                                            style={[
                                                styles.statusText,
                                                {
                                                    color: child.hasSubscription
                                                        ? theme.colors.success
                                                        : theme.colors.warningDark,
                                                },
                                            ]}
                                        >
                                            {child.hasSubscription ? 'Active' : 'No Ride'}
                                        </Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </View>
                </View>

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
                                    <action.icon size={22} color={action.color} variant="Bold" />
                                </View>
                                <Text style={styles.actionLabel}>{action.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View style={styles.section}>
                    <TouchableOpacity
                        style={styles.ctaCard}
                        onPress={() => router.push('/parent/search')}
                        activeOpacity={0.85}
                    >
                        <LinearGradient
                            colors={[theme.colors.primaryDark, theme.colors.primaryDarker]}
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
                                    <SearchNormal1 size={28} color="#fff" variant="Bold" />
                                </View>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View style={{ height: hp(110) }} />
            </ScrollView>

            <ParentBottomNav />
        </View>
    );
}

const useStyles = (theme) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        headerGradient: {
            paddingBottom: hp(18),
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
            fontFamily: theme.fontFamily.regular,
            fontSize: fs(13),
            color: 'rgba(255,255,255,0.85)',
        },
        userName: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(24),
            color: '#fff',
            marginTop: 2,
        },
        headerRight: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
        },
        notificationBtn: {
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.18)',
            alignItems: 'center',
            justifyContent: 'center',
        },
        notificationBadge: {
            position: 'absolute',
            top: 6,
            right: 6,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            paddingHorizontal: 4,
            backgroundColor: theme.colors.danger,
            alignItems: 'center',
            justifyContent: 'center',
        },
        notificationCount: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(9),
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
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(15),
            color: theme.colors.primary,
        },
        statsContainer: {
            paddingHorizontal: wp(20),
            paddingTop: hp(18),
            gap: 10,
        },
        statCard: {
            backgroundColor: 'rgba(255,255,255,0.18)',
            borderRadius: theme.radius.lg,
            padding: 14,
            minWidth: wp(96),
            marginRight: 10,
        },
        statIconContainer: {
            width: 32,
            height: 32,
            borderRadius: 10,
            backgroundColor: 'rgba(255,255,255,0.22)',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        statValue: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(20),
            color: '#fff',
        },
        statLabel: {
            fontFamily: theme.fontFamily.regular,
            fontSize: fs(11),
            color: 'rgba(255,255,255,0.85)',
            marginTop: 2,
        },
        scrollView: {
            flex: 1,
            marginTop: -hp(8),
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
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(17),
            color: theme.colors.textPrimary,
        },
        seeAllBtn: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        seeAllText: {
            fontFamily: theme.fontFamily.medium,
            fontSize: fs(13),
            color: theme.colors.primary,
        },
        subscriptionCard: {
            borderRadius: theme.radius.xl,
            overflow: 'hidden',
            ...theme.shadows.primaryMd,
        },
        subscriptionGradient: {
            padding: 18,
        },
        subscriptionHeader: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 14,
        },
        subscriptionBadge: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#fff',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: theme.radius.pill,
            gap: 4,
        },
        subscriptionBadgeText: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(11),
            color: theme.colors.primary,
        },
        subscriptionFee: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(15),
            color: '#fff',
        },
        driverInfo: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 14,
        },
        driverAvatar: {
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: 'rgba(255,255,255,0.22)',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        driverInitials: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(16),
            color: '#fff',
        },
        driverDetails: {
            flex: 1,
        },
        driverName: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(16),
            color: '#fff',
        },
        vehicleInfo: {
            fontFamily: theme.fontFamily.regular,
            fontSize: fs(12),
            color: 'rgba(255,255,255,0.85)',
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
            fontFamily: theme.fontFamily.medium,
            fontSize: fs(12),
            color: 'rgba(255,255,255,0.9)',
        },
        messageBtn: {
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptySubscriptionCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.xl,
            padding: 18,
            gap: 14,
            ...theme.shadows.sm,
        },
        emptyIconWrap: {
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: theme.colors.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
        },
        emptyTextWrap: {
            flex: 1,
        },
        emptyTitle: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(14),
            color: theme.colors.textPrimary,
        },
        emptySubtitle: {
            fontFamily: theme.fontFamily.regular,
            fontSize: fs(12),
            color: theme.colors.textMuted,
            marginTop: 2,
        },
        childrenContainer: {
            gap: 10,
        },
        emptyChildrenCard: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: 18,
            alignItems: 'center',
            ...theme.shadows.sm,
        },
        emptyChildrenText: {
            fontFamily: theme.fontFamily.regular,
            fontSize: fs(13),
            color: theme.colors.textMuted,
        },
        childCard: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: 14,
            ...theme.shadows.sm,
        },
        childAvatar: {
            width: 46,
            height: 46,
            borderRadius: 23,
            backgroundColor: theme.colors.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
        },
        childInitials: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(15),
            color: theme.colors.primary,
        },
        childInfo: {
            flex: 1,
        },
        childName: {
            fontFamily: theme.fontFamily.medium,
            fontSize: fs(15),
            color: theme.colors.textPrimary,
        },
        childDetails: {
            fontFamily: theme.fontFamily.regular,
            fontSize: fs(12),
            color: theme.colors.textMuted,
            marginTop: 2,
        },
        childStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: theme.radius.pill,
            gap: 6,
        },
        statusDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
        },
        statusText: {
            fontFamily: theme.fontFamily.medium,
            fontSize: fs(11),
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
            borderRadius: theme.radius.lg,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 8,
        },
        actionLabel: {
            fontFamily: theme.fontFamily.medium,
            fontSize: fs(11),
            color: theme.colors.textSecondary,
            textAlign: 'center',
        },
        ctaCard: {
            borderRadius: theme.radius.xl,
            overflow: 'hidden',
            ...theme.shadows.primaryMd,
        },
        ctaGradient: {
            padding: 18,
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
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(17),
            color: '#fff',
        },
        ctaSubtitle: {
            fontFamily: theme.fontFamily.regular,
            fontSize: fs(13),
            color: 'rgba(255,255,255,0.85)',
            marginTop: 4,
        },
        ctaIconContainer: {
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: 'rgba(255,255,255,0.22)',
            alignItems: 'center',
            justifyContent: 'center',
        },
    });
