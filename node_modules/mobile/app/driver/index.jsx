import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Profile2User,
  Star1,
  Calendar,
  Notification,
  Sun1,
  ArrowRight2,
  RouteSquare,
  Sms,
  Message,
  Play,
  Wallet3,
  Setting2,
  Clock,
  TickCircle,
} from 'iconsax-react-native';
import { wp, hp, fs } from '../utils/responsive';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  getStudents,
  getDriver,
  getBookingRequests,
  getConversations,
  getEarnings,
  getRoutesForDriver,
} from '../../services/mock';

const DEMO_DRIVER_ID = 'd-1';
const DEMO_USER_ID = 'u-driver-1';

export default function DriverHome() {
  const theme = useTheme();
  const styles = useStyles(theme);
  const router = useRouter();
  const { user } = useAuth();

  const driverUserId = user?.id || DEMO_USER_ID;
  const fullName = user?.name || 'Kasun Perera';
  const initials = fullName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const [studentsCount, setStudentsCount] = useState(0);
  const [driver, setDriver] = useState(null);
  const [pendingRequests, setPendingRequests] = useState(0);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [earnings, setEarnings] = useState(null);
  const [nextRoute, setNextRoute] = useState(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const loadData = useCallback(async () => {
    const [students, d, requests, convos, earn, routes] = await Promise.all([
      getStudents(),
      getDriver(DEMO_DRIVER_ID),
      getBookingRequests(DEMO_DRIVER_ID),
      getConversations(driverUserId),
      getEarnings(DEMO_DRIVER_ID),
      getRoutesForDriver(DEMO_DRIVER_ID),
    ]);
    setStudentsCount(students.length);
    setDriver(d);
    setPendingRequests(requests.length);
    setUnreadMessages(convos.reduce((acc, c) => acc + (c.unreadCount || 0), 0));
    setEarnings(earn);
    setNextRoute(routes.find((r) => r.direction === 'pickup') || routes[0] || null);
  }, [driverUserId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const c = theme.colors;

  const stats = [
    {
      Icon: Profile2User,
      value: String(studentsCount),
      label: 'Students',
      color: c.primary,
      bg: c.primarySoft,
    },
    {
      Icon: Star1,
      value: driver?.rating ? driver.rating.toFixed(1) : '—',
      label: 'Rating',
      color: c.warning,
      bg: c.warningSoft,
    },
    {
      Icon: Calendar,
      value: earnings ? String(earnings.history?.length * 20 ?? 0) : '—',
      label: 'Trips',
      color: c.success,
      bg: c.successSoft,
    },
  ];

  const quickActions = [
    {
      Icon: RouteSquare,
      label: 'Routes',
      subtitle: 'Manage stops',
      route: '/driver/route-management',
      color: c.primary,
      bg: c.primarySoft,
    },
    {
      Icon: Profile2User,
      label: 'Students',
      subtitle: `${studentsCount} enrolled`,
      route: '/driver/students',
      color: c.success,
      bg: c.successSoft,
    },
    {
      Icon: Sms,
      label: 'Requests',
      subtitle: `${pendingRequests} pending`,
      route: '/driver/booking-requests',
      color: c.warning,
      bg: c.warningSoft,
      badge: pendingRequests || null,
    },
    {
      Icon: Message,
      label: 'Messages',
      subtitle: `${unreadMessages} unread`,
      route: '/driver/messages',
      color: c.accent,
      bg: c.accentSoft,
      badge: unreadMessages || null,
    },
  ];

  const menuItems = [
    {
      Icon: Play,
      label: 'Start Active Trip',
      route: '/driver/active-trip',
      color: c.danger,
    },
    { Icon: Clock, label: 'Ride History', route: '/driver/rides', color: c.primary },
    { Icon: Wallet3, label: 'Earnings', route: '/driver/earnings', color: c.success },
    { Icon: Setting2, label: 'Settings', route: '/driver/Profile', color: c.textMuted },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{getGreeting()} 👋</Text>
              <Text style={styles.userName}>{fullName}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationBtn} activeOpacity={0.85}>
                <Notification size={22} color={theme.colors.textPrimary} variant="Outline" />
                {pendingRequests > 0 && <View style={styles.notificationDot} />}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatarBtn}
                onPress={() => router.push('/driver/Profile')}
                activeOpacity={0.85}
              >
                <LinearGradient colors={theme.colors.primaryGradient} style={styles.avatarGradient}>
                  <Text style={styles.avatarText}>{initials}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsRow}>
            {stats.map((stat, index) => {
              const StatIcon = stat.Icon;
              return (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.bg }]}>
                    <StatIcon size={20} color={stat.color} variant="Bold" />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Next Scheduled Trip</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push('/driver/rides')}>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.tripCard}
              onPress={() => router.push('/driver/active-trip')}
              activeOpacity={0.95}
            >
              <LinearGradient
                colors={theme.colors.primaryGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tripCardGradient}
              >
                <View style={styles.tripBadge}>
                  <Sun1 size={12} color="#fff" variant="Bold" />
                  <Text style={styles.tripBadgeText}>
                    {nextRoute?.name || 'Morning Route'}
                  </Text>
                </View>

                <View style={styles.tripTimeRow}>
                  <Text style={styles.tripTime}>
                    {nextRoute?.stops?.[0]?.time || '7:00 AM'}
                  </Text>
                  <View style={styles.tripArrow}>
                    <ArrowRight2 size={16} color="rgba(255,255,255,0.75)" />
                  </View>
                  <Text style={styles.tripTimeEnd}>
                    {nextRoute?.stops?.[nextRoute.stops.length - 1]?.time || '7:45 AM'}
                  </Text>
                </View>

                <View style={styles.tripDetails}>
                  <View style={styles.tripDetail}>
                    <TickCircle size={14} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.tripDetailText}>Royal College, Colombo</Text>
                  </View>
                  <View style={styles.tripDetail}>
                    <Profile2User size={14} color="rgba(255,255,255,0.85)" />
                    <Text style={styles.tripDetailText}>{studentsCount} students</Text>
                  </View>
                </View>

                <View style={styles.tripAction}>
                  <View style={styles.startTripBtn}>
                    <Play size={16} color={theme.colors.primary} variant="Bold" />
                    <Text style={styles.startTripText}>Start Trip</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => {
                const ActionIcon = action.Icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.actionCard}
                    onPress={() => router.push(action.route)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.actionIcon, { backgroundColor: action.bg }]}>
                      <ActionIcon size={22} color={action.color} variant="Bold" />
                      {action.badge ? (
                        <View style={styles.actionBadge}>
                          <Text style={styles.actionBadgeText}>{action.badge}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Text style={styles.actionLabel}>{action.label}</Text>
                    <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More Options</Text>
            <View style={styles.menuCard}>
              {menuItems.map((item, index) => {
                const MenuIcon = item.Icon;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
                    onPress={() => router.push(item.route)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.menuIcon, { backgroundColor: `${item.color}1A` }]}>
                      <MenuIcon size={20} color={item.color} variant="Bold" />
                    </View>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    <ArrowRight2 size={18} color={theme.colors.borderStrong} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {earnings && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>This Month</Text>
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>
                      Rs. {Math.round(earnings.thisMonth / 1000)}K
                    </Text>
                    <Text style={styles.summaryLabel}>Earned</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={styles.summaryValue}>{studentsCount}</Text>
                    <Text style={styles.summaryLabel}>Students</Text>
                  </View>
                  <View style={styles.summaryDivider} />
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: theme.colors.success }]}>
                      Rs. {Math.round((earnings.pendingPayout || 0) / 1000)}K
                    </Text>
                    <Text style={styles.summaryLabel}>Pending</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const useStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: hp(40),
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: wp(20),
      paddingTop: hp(8),
      paddingBottom: hp(18),
      backgroundColor: theme.colors.surface,
    },
    headerLeft: {
      flex: 1,
    },
    greeting: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(13),
      color: theme.colors.textMuted,
      marginBottom: 4,
    },
    userName: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(22),
      color: theme.colors.textPrimary,
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
      backgroundColor: theme.colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationDot: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.danger,
      borderWidth: 2,
      borderColor: theme.colors.surface,
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
      fontSize: fs(14),
      color: '#fff',
    },
    statsRow: {
      flexDirection: 'row',
      paddingHorizontal: wp(20),
      marginTop: hp(8),
      gap: 10,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: 14,
      alignItems: 'center',
      ...theme.shadows.sm,
    },
    statIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    statValue: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(18),
      color: theme.colors.textPrimary,
    },
    statLabel: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(11),
      color: theme.colors.textMuted,
      marginTop: 2,
    },
    section: {
      marginTop: hp(20),
      paddingHorizontal: wp(20),
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
      marginBottom: hp(12),
    },
    seeAllText: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(13),
      color: theme.colors.primary,
      marginBottom: hp(12),
    },
    tripCard: {
      borderRadius: theme.radius.xl,
      overflow: 'hidden',
      ...theme.shadows.primaryMd,
    },
    tripCardGradient: {
      padding: 18,
    },
    tripBadge: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.22)',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: theme.radius.pill,
      alignSelf: 'flex-start',
      marginBottom: 14,
      gap: 6,
    },
    tripBadgeText: {
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(11),
      color: '#fff',
    },
    tripTimeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: 14,
      gap: 8,
    },
    tripTime: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(26),
      color: '#fff',
    },
    tripArrow: {
      paddingHorizontal: 6,
    },
    tripTimeEnd: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(26),
      color: 'rgba(255,255,255,0.75)',
    },
    tripDetails: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 16,
      marginBottom: 16,
    },
    tripDetail: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    tripDetailText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(12),
      color: 'rgba(255,255,255,0.85)',
    },
    tripAction: {
      alignItems: 'flex-start',
    },
    startTripBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: theme.radius.pill,
      gap: 6,
    },
    startTripText: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(13),
      color: theme.colors.primary,
    },
    actionsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -5,
    },
    actionCard: {
      width: '50%',
      paddingHorizontal: 5,
      marginBottom: 12,
    },
    actionIcon: {
      width: 52,
      height: 52,
      borderRadius: theme.radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    actionBadge: {
      position: 'absolute',
      top: -6,
      right: -6,
      backgroundColor: theme.colors.danger,
      borderRadius: 10,
      minWidth: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 6,
    },
    actionBadgeText: {
      fontFamily: theme.fontFamily.bold,
      fontSize: 10,
      color: '#fff',
    },
    actionLabel: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(14),
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },
    actionSubtitle: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(12),
      color: theme.colors.textMuted,
    },
    menuCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      ...theme.shadows.sm,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 14,
      gap: 12,
    },
    menuItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.divider,
    },
    menuIcon: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuLabel: {
      flex: 1,
      fontFamily: theme.fontFamily.medium,
      fontSize: fs(14),
      color: theme.colors.textPrimary,
    },
    summaryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.lg,
      padding: 18,
      ...theme.shadows.sm,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    summaryItem: {
      flex: 1,
      alignItems: 'center',
    },
    summaryValue: {
      fontFamily: theme.fontFamily.bold,
      fontSize: fs(18),
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    summaryLabel: {
      fontFamily: theme.fontFamily.regular,
      fontSize: fs(11),
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    summaryDivider: {
      width: 1,
      height: 36,
      backgroundColor: theme.colors.divider,
    },
  });
