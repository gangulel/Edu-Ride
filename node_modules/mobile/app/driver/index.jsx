import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRight2,
  Bus,
  Calendar,
  Call,
  Clock,
  Flash,
  MessageText1,
  People,
  Profile2User,
  Routing2,
  Star1,
  Notification as NotificationIcon,
  Wallet3,
  Receipt1,
  Play,
  Shield,
  Sun1,
} from 'iconsax-react-native';

import HeroHeader from '../components/driver/HeroHeader';
import StatTile from '../components/driver/StatTile';
import SectionHeader from '../components/driver/SectionHeader';
import ScreenContainer from '../components/driver/ScreenContainer';
import Card from '../components/driver/Card';
import Avatar from '../components/driver/Avatar';
import Badge from '../components/driver/Badge';

import {
  colors,
  gradients,
  spacing,
  typography,
  radii,
  shadows,
  wp,
  hp,
  fs,
  layout,
} from '../theme';

import {
  getDriverProfile,
  getNextTrip,
  getStudents,
  getTodaySummary,
  getEarningsForPeriod,
  getUnreadNotificationCount,
} from '../../services/mock/driver';

const greetingFor = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  return 'Good Evening';
};

export default function DriverHome() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const profile = useMemo(() => getDriverProfile(), []);
  const nextTrip = useMemo(() => getNextTrip(), []);
  const students = useMemo(() => getStudents(), []);
  const summary = useMemo(() => getTodaySummary(), []);
  const earnings = useMemo(() => getEarningsForPeriod('today'), []);
  const unread = useMemo(() => getUnreadNotificationCount(), []);

  const fade = useRef(new Animated.Value(0)).current;
  const slide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 480, useNativeDriver: true }),
      Animated.spring(slide, { toValue: 0, useNativeDriver: true, bounciness: 4 }),
    ]).start();
  }, [fade, slide]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  const heroStats = [
    { icon: People, value: String(students.length), label: 'Students' },
    { icon: Star1, value: String(profile.rating), label: 'Rating' },
    { icon: Receipt1, value: String(profile.totalTrips), label: 'Trips' },
    { icon: Shield, value: `${profile.acceptanceRate}%`, label: 'Acceptance' },
  ];

  const quickActions = [
    { icon: Routing2, label: 'Routes', subtitle: 'Plan stops', route: '/driver/route-management', tone: colors.primary, surface: colors.primarySurface },
    { icon: Profile2User, label: 'Students', subtitle: `${students.length} enrolled`, route: '/driver/students', tone: colors.success, surface: colors.successSurface },
    { icon: Bus, label: 'Requests', subtitle: '3 pending', route: '/driver/booking-requests', tone: colors.warning, surface: colors.warningSurface, badge: 3 },
    { icon: MessageText1, label: 'Messages', subtitle: `${unread} unread`, route: '/driver/messages', tone: colors.info, surface: colors.infoSurface, badge: unread },
  ];

  return (
    <ScreenContainer edges={['left', 'right']} statusBarStyle="light-content">
      <Animated.View style={{ flex: 1, opacity: fade, transform: [{ translateY: slide }] }}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: layout.tabBarHeight + spacing.xl }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
              progressViewOffset={spacing.lg}
            />
          }
        >
          <HeroHeader
            greeting={`${greetingFor()} 👋`}
            title={profile.firstName}
            initials={profile.initials}
            notificationCount={unread}
            onNotification={() => router.push('/driver/messages')}
            onAvatarPress={() => router.push('/driver/Profile/profile')}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.statsRow}
            >
              {heroStats.map((s, i) => (
                <StatTile
                  key={i}
                  icon={s.icon}
                  value={s.value}
                  label={s.label}
                  tone="onDark"
                  variant="inline"
                  style={styles.heroStat}
                />
              ))}
            </ScrollView>
          </HeroHeader>

          {/* Next Scheduled Trip */}
          <View style={styles.section}>
            <SectionHeader
              title="Next Scheduled Trip"
              action="View all"
              onActionPress={() => router.push('/driver/rides')}
            />
            <TripHeroCard
              trip={nextTrip}
              onStart={() => router.push('/driver/active-trip')}
            />
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <SectionHeader title="Quick Actions" />
            <View style={styles.actionsGrid}>
              {quickActions.map((action, i) => (
                <QuickActionTile
                  key={i}
                  {...action}
                  onPress={() => router.push(action.route)}
                />
              ))}
            </View>
          </View>

          {/* Earnings snapshot */}
          <View style={styles.section}>
            <SectionHeader
              title="Today's Earnings"
              action="Details"
              onActionPress={() => router.push('/driver/earnings')}
            />
            <EarningsSnapshot
              earnings={earnings}
              onPress={() => router.push('/driver/earnings')}
            />
          </View>

          {/* Active Roster preview */}
          <View style={styles.section}>
            <SectionHeader
              title="Active Roster"
              action="Manage"
              onActionPress={() => router.push('/driver/students')}
            />
            <Card padding="none">
              {students.slice(0, 3).map((student, idx) => (
                <RosterRow
                  key={student.id}
                  student={student}
                  divider={idx < 2}
                  onPress={() => router.push('/driver/students')}
                />
              ))}
            </Card>
          </View>

          {/* Today's summary */}
          <View style={styles.section}>
            <SectionHeader title="Today's Summary" />
            <Card padding="lg">
              <View style={styles.summaryRow}>
                <SummaryItem
                  value={summary.tripsCompleted}
                  label="Trips Completed"
                  color={colors.primary}
                />
                <View style={styles.summaryDivider} />
                <SummaryItem
                  value={summary.studentsServed}
                  label="Students Served"
                  color={colors.info}
                />
                <View style={styles.summaryDivider} />
                <SummaryItem
                  value={`Rs. ${(summary.earnedToday / 1000).toFixed(1)}K`}
                  label="Earned"
                  color={colors.success}
                />
              </View>
            </Card>
          </View>
        </ScrollView>
      </Animated.View>
    </ScreenContainer>
  );
}

// ---------------------------------------------------------------------------
// Sub-components (kept here because they're tightly coupled to this screen)
// ---------------------------------------------------------------------------

const TripHeroCard = ({ trip, onStart }) => (
  <View style={styles.tripCardShadow}>
    <LinearGradient
      colors={gradients.headerHero}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.tripCard}
    >
      <View style={styles.tripTopRow}>
        <Badge label={trip.label} tone="primary" variant="soft" style={{ backgroundColor: colors.onDark.surface }} />
        <View style={styles.tripMetaRow}>
          <Sun1 size={fs(14)} color={colors.onDark.text} variant="Bold" />
          <Text style={styles.tripMetaText}>{trip.startTime}</Text>
        </View>
      </View>

      <View style={styles.tripTimeRow}>
        <Text style={styles.tripTimeBig}>{trip.startTime}</Text>
        <View style={styles.tripArrowWrap}>
          <ArrowRight2 size={fs(16)} color={colors.onDark.textMuted} variant="Linear" />
        </View>
        <Text style={styles.tripTimeBigMuted}>{trip.endTime}</Text>
      </View>

      <View style={styles.tripDetailsRow}>
        <View style={styles.tripDetailItem}>
          <Routing2 size={fs(14)} color={colors.onDark.textMuted} variant="Bold" />
          <Text style={styles.tripDetailText} numberOfLines={1}>{trip.school}</Text>
        </View>
        <View style={styles.tripDetailItem}>
          <People size={fs(14)} color={colors.onDark.textMuted} variant="Bold" />
          <Text style={styles.tripDetailText}>{trip.studentCount} students</Text>
        </View>
        <View style={styles.tripDetailItem}>
          <Clock size={fs(14)} color={colors.onDark.textMuted} variant="Bold" />
          <Text style={styles.tripDetailText}>{trip.estimatedDurationMins}m</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startTripBtn} activeOpacity={0.85} onPress={onStart}>
        <Play size={fs(16)} color={colors.primary} variant="Bold" />
        <Text style={styles.startTripText}>Start Trip</Text>
      </TouchableOpacity>
    </LinearGradient>
  </View>
);

const QuickActionTile = ({ icon: Icon, label, subtitle, tone, surface, badge, onPress }) => (
  <TouchableOpacity style={styles.quickAction} activeOpacity={0.8} onPress={onPress}>
    <View style={[styles.quickIconWrap, { backgroundColor: surface }]}>
      <Icon size={fs(24)} color={tone} variant="Bold" />
      {badge ? (
        <View style={styles.quickBadge}>
          <Text style={styles.quickBadgeText}>{badge}</Text>
        </View>
      ) : null}
    </View>
    <Text style={styles.quickLabel}>{label}</Text>
    <Text style={styles.quickSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

const EarningsSnapshot = ({ earnings, onPress }) => (
  <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.earningsShadow}>
    <LinearGradient
      colors={gradients.earnings}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.earningsCard}
    >
      <View style={styles.earningsLeft}>
        <View style={styles.earningsIconWrap}>
          <Wallet3 size={fs(22)} color="#fff" variant="Bold" />
        </View>
        <View>
          <Text style={styles.earningsLabel}>Earned Today</Text>
          <Text style={styles.earningsAmount}>Rs. {earnings.total.toLocaleString()}</Text>
        </View>
      </View>
      <View style={styles.earningsRight}>
        <Text style={styles.earningsChange}>
          {earnings.change > 0 ? '+' : ''}
          {earnings.change}%
        </Text>
        <Text style={styles.earningsHint}>vs. yesterday</Text>
      </View>
    </LinearGradient>
  </TouchableOpacity>
);

const RosterRow = ({ student, divider, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.85}
    onPress={onPress}
    style={[styles.rosterRow, divider && styles.rosterDivider]}
  >
    <Avatar name={student.name} tone={student.avatarColor} size={44} />
    <View style={styles.rosterBody}>
      <Text style={styles.rosterName}>{student.name}</Text>
      <Text style={styles.rosterMeta} numberOfLines={1}>
        {student.grade} • {student.pickupTime}
      </Text>
    </View>
    <TouchableOpacity style={styles.rosterCall} hitSlop={6}>
      <Call size={fs(16)} color={colors.primary} variant="Bold" />
    </TouchableOpacity>
  </TouchableOpacity>
);

const SummaryItem = ({ value, label, color }) => (
  <View style={styles.summaryItem}>
    <Text style={[styles.summaryValue, color && { color }]}>{value}</Text>
    <Text style={styles.summaryLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  statsRow: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  heroStat: {
    minWidth: wp(110),
    backgroundColor: colors.onDark.surface,
    marginRight: 0,
  },

  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },

  // Trip hero card
  tripCardShadow: { ...shadows.brand, borderRadius: radii.xl },
  tripCard: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  tripTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tripMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tripMetaText: { color: colors.onDark.text, fontSize: typography.size.xs, fontFamily: typography.fontFamily.medium },
  tripTimeRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  tripTimeBig: { color: colors.onDark.text, fontSize: fs(30), fontFamily: typography.fontFamily.bold, letterSpacing: -1 },
  tripArrowWrap: { paddingHorizontal: spacing.sm },
  tripTimeBigMuted: { color: colors.onDark.textSubtle, fontSize: fs(26), fontFamily: typography.fontFamily.bold },
  tripDetailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, marginBottom: spacing.lg },
  tripDetailItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  tripDetailText: { color: colors.onDark.textMuted, fontSize: typography.size.sm, fontFamily: typography.fontFamily.medium },
  startTripBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.full,
    alignSelf: 'flex-start',
  },
  startTripText: { color: colors.primary, fontSize: typography.size.md, fontFamily: typography.fontFamily.bold },

  // Quick actions grid
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  quickAction: {
    flexBasis: '47%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  quickIconWrap: {
    width: 52, height: 52, borderRadius: radii.md,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
    position: 'relative',
  },
  quickBadge: {
    position: 'absolute', top: -4, right: -4,
    minWidth: 20, height: 20, borderRadius: 10,
    paddingHorizontal: 4,
    backgroundColor: colors.danger,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.surface,
  },
  quickBadgeText: { color: '#fff', fontSize: 10, fontFamily: typography.fontFamily.bold },
  quickLabel: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  quickSubtitle: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },

  // Earnings snapshot
  earningsShadow: { ...shadows.success, borderRadius: radii.lg },
  earningsCard: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  earningsIconWrap: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  earningsLabel: { color: 'rgba(255,255,255,0.85)', fontSize: typography.size.sm, fontFamily: typography.fontFamily.medium },
  earningsAmount: { color: '#fff', fontSize: typography.size.xl, fontFamily: typography.fontFamily.bold, marginTop: 2 },
  earningsRight: { alignItems: 'flex-end' },
  earningsChange: { color: '#fff', fontSize: typography.size.lg, fontFamily: typography.fontFamily.bold },
  earningsHint: { color: 'rgba(255,255,255,0.8)', fontSize: typography.size.xs },

  // Roster preview
  rosterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  rosterDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  rosterBody: { flex: 1 },
  rosterName: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  rosterMeta: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },
  rosterCall: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },

  // Summary
  summaryRow: { flexDirection: 'row', alignItems: 'center' },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, height: 36, backgroundColor: colors.divider },
  summaryValue: { fontSize: typography.size.xl, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  summaryLabel: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 4, textAlign: 'center' },
});
