import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowRight2,
  Calendar,
  Flash,
  People,
  Routing2,
  Setting2,
  Sun1,
  TickCircle,
} from 'iconsax-react-native';

import ScreenContainer from '../components/driver/ScreenContainer';
import HeroHeader from '../components/driver/HeroHeader';
import SectionHeader from '../components/driver/SectionHeader';
import Card from '../components/driver/Card';
import Badge from '../components/driver/Badge';
import FilterChip from '../components/driver/FilterChip';
import PrimaryButton from '../components/driver/PrimaryButton';
import {
  colors,
  gradients,
  spacing,
  typography,
  radii,
  shadows,
  fs,
} from '../theme';
import {
  getNextTrip,
  getUpcomingTrips,
  getRoute,
} from '../../services/mock/driver';

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'past', label: 'Past' },
];

const PAST_TRIPS = [
  { id: 'p1', label: 'Morning Route', school: 'Royal College', startTime: 'Today • 6:45 AM', endTime: '8:00 AM', studentCount: 24, status: 'completed' },
  { id: 'p2', label: 'Afternoon Drop-off', school: 'Royal College', startTime: 'Yesterday • 2:15 PM', endTime: '3:45 PM', studentCount: 22, status: 'completed' },
  { id: 'p3', label: 'Morning Route', school: 'Royal College', startTime: 'Yesterday • 6:45 AM', endTime: '8:00 AM', studentCount: 24, status: 'completed' },
];

export default function RidesScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState('upcoming');
  const nextTrip = useMemo(() => getNextTrip(), []);
  const upcoming = useMemo(() => getUpcomingTrips(), []);
  const route = useMemo(() => getRoute(), []);

  const list = filter === 'upcoming' ? upcoming : PAST_TRIPS;

  return (
    <ScreenContainer edges={['left', 'right']} statusBarStyle="light-content">
      <HeroHeader
        greeting="Today's Schedule"
        title="My Trips"
        notificationCount={0}
        onNotification={() => router.push('/driver/messages')}
        onAvatarPress={() => router.push('/driver/Profile/profile')}
        initials="KP"
      >
        <View style={styles.heroStrip}>
          <View style={styles.heroStripItem}>
            <Text style={styles.heroStripValue}>{upcoming.length}</Text>
            <Text style={styles.heroStripLabel}>Upcoming</Text>
          </View>
          <View style={styles.heroStripDivider} />
          <View style={styles.heroStripItem}>
            <Text style={styles.heroStripValue}>{route.stops.length}</Text>
            <Text style={styles.heroStripLabel}>Stops</Text>
          </View>
          <View style={styles.heroStripDivider} />
          <View style={styles.heroStripItem}>
            <Text style={styles.heroStripValue}>{route.totalDistanceKm} km</Text>
            <Text style={styles.heroStripLabel}>Per loop</Text>
          </View>
        </View>
      </HeroHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['3xl'] }}
      >
        {/* Next Trip hero */}
        <View style={styles.section}>
          <SectionHeader title="Up Next" />
          <View style={styles.tripHeroShadow}>
            <LinearGradient
              colors={gradients.headerHero}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.tripHero}
            >
              <View style={styles.tripHeroTop}>
                <Badge label={nextTrip.label} tone="primary" variant="soft" style={{ backgroundColor: colors.onDark.surface }} />
                <View style={styles.tripHeroMeta}>
                  <Sun1 size={fs(14)} color={colors.onDark.text} variant="Bold" />
                  <Text style={styles.tripHeroMetaText}>Tomorrow</Text>
                </View>
              </View>
              <View style={styles.tripHeroTimeRow}>
                <Text style={styles.tripHeroTime}>{nextTrip.startTime}</Text>
                <ArrowRight2 size={fs(16)} color={colors.onDark.textMuted} variant="Linear" />
                <Text style={styles.tripHeroTimeMuted}>{nextTrip.endTime}</Text>
              </View>
              <View style={styles.tripHeroDetails}>
                <View style={styles.tripHeroDetail}>
                  <Routing2 size={fs(14)} color={colors.onDark.textMuted} variant="Bold" />
                  <Text style={styles.tripHeroDetailText}>{nextTrip.school}</Text>
                </View>
                <View style={styles.tripHeroDetail}>
                  <People size={fs(14)} color={colors.onDark.textMuted} variant="Bold" />
                  <Text style={styles.tripHeroDetailText}>{nextTrip.studentCount} students</Text>
                </View>
              </View>
              <View style={styles.tripHeroActions}>
                <TouchableOpacity
                  style={styles.startBtn}
                  activeOpacity={0.85}
                  onPress={() => router.push('/driver/active-trip')}
                >
                  <Flash size={fs(16)} color={colors.primary} variant="Bold" />
                  <Text style={styles.startBtnText}>Start Trip</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.ghostBtn}
                  activeOpacity={0.85}
                  onPress={() => router.push('/driver/route-management')}
                >
                  <Setting2 size={fs(16)} color="#fff" variant="Bold" />
                  <Text style={styles.ghostBtnText}>Edit Route</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Filter */}
        <View style={[styles.section, styles.filterSection]}>
          {FILTERS.map((f) => (
            <FilterChip
              key={f.id}
              label={f.label}
              variant="tab"
              active={filter === f.id}
              onPress={() => setFilter(f.id)}
              style={{ flex: 1 }}
            />
          ))}
        </View>

        {/* Trip list */}
        <View style={[styles.section, { marginTop: 0 }]}>
          {list.map((trip) => (
            <Card
              key={trip.id}
              padding="lg"
              onPress={() => router.push('/driver/active-trip')}
              style={{ marginBottom: spacing.md }}
            >
              <View style={styles.tripRow}>
                <View style={styles.tripIcon}>
                  {trip.status === 'completed' ? (
                    <TickCircle size={fs(22)} color={colors.success} variant="Bold" />
                  ) : (
                    <Routing2 size={fs(22)} color={colors.primary} variant="Bold" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.tripTopRow}>
                    <Text style={styles.tripLabel}>{trip.label}</Text>
                    <Badge
                      label={trip.status === 'completed' ? 'Done' : 'Scheduled'}
                      tone={trip.status === 'completed' ? 'success' : 'primary'}
                      variant="soft"
                      size="xs"
                    />
                  </View>
                  <View style={styles.tripMetaRow}>
                    <Calendar size={fs(13)} color={colors.textSecondary} variant="Bold" />
                    <Text style={styles.tripMetaText}>{trip.startTime}</Text>
                  </View>
                  <View style={styles.tripMetaRow}>
                    <Routing2 size={fs(13)} color={colors.textSecondary} variant="Bold" />
                    <Text style={styles.tripMetaText}>{trip.school}</Text>
                  </View>
                  <View style={styles.tripMetaRow}>
                    <People size={fs(13)} color={colors.textSecondary} variant="Bold" />
                    <Text style={styles.tripMetaText}>
                      {trip.studentCount ?? trip.students} students
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          ))}
        </View>

        <View style={[styles.section, { marginTop: spacing.lg }]}>
          <PrimaryButton
            title="Manage Route"
            variant="outline"
            size="md"
            fullWidth
            iconLeft={<Setting2 size={fs(16)} color={colors.primary} variant="Bold" />}
            onPress={() => router.push('/driver/route-management')}
          />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroStrip: {
    flexDirection: 'row',
    marginHorizontal: spacing.lg,
    backgroundColor: colors.onDark.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  heroStripItem: { flex: 1, alignItems: 'center' },
  heroStripValue: { color: colors.onDark.text, fontSize: typography.size.lg, fontFamily: typography.fontFamily.bold },
  heroStripLabel: { color: colors.onDark.textMuted, fontSize: 11, marginTop: 2 },
  heroStripDivider: { width: 1, height: 32, backgroundColor: colors.onDark.border },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },

  tripHeroShadow: { ...shadows.brand, borderRadius: radii.xl },
  tripHero: { borderRadius: radii.xl, padding: spacing.lg },
  tripHeroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  tripHeroMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tripHeroMetaText: { color: colors.onDark.text, fontSize: typography.size.xs, fontFamily: typography.fontFamily.medium },
  tripHeroTimeRow: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm, marginBottom: spacing.md },
  tripHeroTime: { color: colors.onDark.text, fontSize: fs(28), fontFamily: typography.fontFamily.bold },
  tripHeroTimeMuted: { color: colors.onDark.textSubtle, fontSize: fs(24), fontFamily: typography.fontFamily.bold },
  tripHeroDetails: { flexDirection: 'row', gap: spacing.lg, flexWrap: 'wrap', marginBottom: spacing.lg },
  tripHeroDetail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tripHeroDetailText: { color: colors.onDark.textMuted, fontSize: typography.size.sm, fontFamily: typography.fontFamily.medium },
  tripHeroActions: { flexDirection: 'row', gap: spacing.sm },
  startBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: '#fff',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2,
    borderRadius: radii.full,
  },
  startBtnText: { color: colors.primary, fontSize: typography.size.md, fontFamily: typography.fontFamily.bold },
  ghostBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.sm + 2,
    borderRadius: radii.full,
  },
  ghostBtnText: { color: '#fff', fontSize: typography.size.md, fontFamily: typography.fontFamily.bold },

  filterSection: { flexDirection: 'row', gap: spacing.sm },

  tripRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  tripIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  tripTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  tripLabel: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  tripMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  tripMetaText: { fontSize: typography.size.xs, color: colors.textSecondary },
});
