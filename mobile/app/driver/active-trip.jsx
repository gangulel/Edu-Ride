import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Call,
  Danger,
  Flash,
  Location,
  Map1,
  MessageNotif,
  People,
  Routing2,
  TickCircle,
  TickSquare,
  Timer1,
  Warning2,
} from 'iconsax-react-native';

import ScreenContainer from '../components/driver/ScreenContainer';
import HeroHeader from '../components/driver/HeroHeader';
import SectionHeader from '../components/driver/SectionHeader';
import Card from '../components/driver/Card';
import Badge from '../components/driver/Badge';
import PrimaryButton from '../components/driver/PrimaryButton';
import {
  colors,
  gradients,
  spacing,
  typography,
  radii,
  shadows,
  fs,
  layout,
  hp,
} from '../theme';
import { getActiveTrip } from '../../services/mock/driver';

const STATUS_CYCLE = {
  waiting: 'picked-up',
  'picked-up': 'dropped-off',
  'dropped-off': 'waiting',
};

const STATUS_META = {
  waiting: { label: 'Waiting', color: colors.textTertiary, surface: colors.surfaceMuted, icon: Timer1, tone: 'neutral' },
  'picked-up': { label: 'Picked Up', color: colors.success, surface: colors.successSurface, icon: TickCircle, tone: 'success' },
  'dropped-off': { label: 'Dropped Off', color: colors.primary, surface: colors.primarySurface, icon: TickSquare, tone: 'primary' },
};

export default function ActiveTrip() {
  const router = useRouter();
  const initial = useMemo(() => getActiveTrip(), []);
  const [tripStatus, setTripStatus] = useState('in-progress'); // not-started | in-progress | completed
  const [students, setStudents] = useState(initial.students);

  const totalStudents = students.length;
  const pickedUpCount = students.filter((s) => s.status === 'picked-up' || s.status === 'dropped-off').length;
  const progress = totalStudents > 0 ? pickedUpCount / totalStudents : 0;
  const progressPct = Math.round(progress * 100);

  const toggle = (id) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: STATUS_CYCLE[s.status] } : s))
    );
  };

  const startTrip = () => setTripStatus('in-progress');
  const endTrip = () => {
    setTripStatus('completed');
    router.back();
  };

  return (
    <ScreenContainer edges={['left', 'right']} statusBarStyle="light-content">
      <HeroHeader
        showBack
        onBack={() => router.back()}
        title={initial.label}
        subtitle={initial.school}
        rightSlot={
          <TouchableOpacity style={styles.emergencyBtn} hitSlop={6} activeOpacity={0.85}>
            <Warning2 size={fs(20)} color={colors.danger} variant="Bold" />
          </TouchableOpacity>
        }
      >
        <View style={styles.heroStats}>
          <HeroStat icon={People} value={`${pickedUpCount}/${totalStudents}`} label="Students" />
          <View style={styles.heroDivider} />
          <HeroStat icon={Timer1} value={`${initial.durationMins}m`} label="Duration" />
          <View style={styles.heroDivider} />
          <HeroStat icon={Routing2} value={`${initial.distanceKm} km`} label="Covered" />
        </View>
      </HeroHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['3xl'] + 80 }}
      >
        {/* Progress */}
        <View style={styles.section}>
          <Card padding="lg">
            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.progressTitle}>Trip Progress</Text>
                <Text style={styles.progressSubtitle}>
                  {pickedUpCount} of {totalStudents} students on board
                </Text>
              </View>
              <Text style={styles.progressPct}>{progressPct}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View style={[styles.progressFill, { width: `${progressPct}%` }]} />
            </View>
          </Card>
        </View>

        {/* Student Checklist */}
        <View style={styles.section}>
          <SectionHeader
            title="Student Checklist"
            action={`${pickedUpCount}/${totalStudents}`}
            hideChevron
          />
          {students.map((student, idx) => {
            const meta = STATUS_META[student.status];
            const StatusIcon = meta.icon;
            return (
              <Card key={student.id} padding="md" style={styles.studentCard}>
                <View style={styles.studentRow}>
                  <View style={styles.studentNum}>
                    <Text style={styles.studentNumText}>{idx + 1}</Text>
                  </View>
                  <View style={styles.studentInfo}>
                    <Text style={styles.studentName} numberOfLines={1}>{student.name}</Text>
                    <View style={styles.studentDetailRow}>
                      <Location size={fs(13)} color={colors.textTertiary} variant="Linear" />
                      <Text style={styles.studentDetailText} numberOfLines={1}>
                        {student.pickup}
                      </Text>
                    </View>
                    <View style={styles.studentDetailRow}>
                      <Timer1 size={fs(13)} color={colors.textTertiary} variant="Linear" />
                      <Text style={styles.studentDetailText}>{student.pickupTime}</Text>
                    </View>
                  </View>
                  <View style={styles.studentActions}>
                    <TouchableOpacity
                      style={[styles.statusBtn, { backgroundColor: meta.surface }]}
                      activeOpacity={0.85}
                      onPress={() => toggle(student.id)}
                    >
                      <StatusIcon size={fs(22)} color={meta.color} variant="Bold" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.callBtn} hitSlop={6}>
                      <Call size={fs(16)} color={colors.primary} variant="Bold" />
                    </TouchableOpacity>
                  </View>
                </View>
                {student.status !== 'waiting' ? (
                  <View style={styles.studentStatusRow}>
                    <Badge label={meta.label} tone={meta.tone} variant="soft" size="xs" />
                  </View>
                ) : null}
              </Card>
            );
          })}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <SectionHeader title="Quick Actions" />
          <ActionRow
            icon={Map1}
            tone={colors.primary}
            label="Open Navigation"
            description="Pickup turn-by-turn directions"
          />
          <ActionRow
            icon={MessageNotif}
            tone={colors.warning}
            label="Send Broadcast Message"
            description="Notify all parents on this route"
          />
          <ActionRow
            icon={Danger}
            tone={colors.danger}
            label="Report Issue"
            description="Flag a safety or vehicle concern"
            isLast
          />
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={styles.bottomBar}>
        {tripStatus === 'not-started' ? (
          <PrimaryButton
            title="Start Trip"
            variant="gradient"
            size="lg"
            fullWidth
            iconLeft={<Flash size={fs(20)} color="#fff" variant="Bold" />}
            onPress={startTrip}
          />
        ) : (
          <PrimaryButton
            title={`Complete Trip (${pickedUpCount}/${totalStudents})`}
            variant="success"
            size="lg"
            fullWidth
            iconLeft={<TickCircle size={fs(20)} color="#fff" variant="Bold" />}
            onPress={endTrip}
          />
        )}
      </View>
    </ScreenContainer>
  );
}

const HeroStat = ({ icon: Icon, value, label }) => (
  <View style={styles.heroStat}>
    <View style={styles.heroStatIcon}>
      <Icon size={fs(16)} color={colors.onDark.text} variant="Bold" />
    </View>
    <Text style={styles.heroStatValue}>{value}</Text>
    <Text style={styles.heroStatLabel}>{label}</Text>
  </View>
);

const ActionRow = ({ icon: Icon, tone, label, description, isLast }) => (
  <Card
    onPress={() => {}}
    padding="md"
    style={{ marginBottom: isLast ? 0 : spacing.sm }}
  >
    <View style={styles.actionRow}>
      <View style={[styles.actionIcon, { backgroundColor: hexAlpha(tone, 0.12) }]}>
        <Icon size={fs(20)} color={tone} variant="Bold" />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.actionLabel}>{label}</Text>
        <Text style={styles.actionDescription}>{description}</Text>
      </View>
    </View>
  </Card>
);

function hexAlpha(hex, alpha) {
  const clean = (hex ?? '').replace('#', '');
  if (clean.length !== 6) return 'rgba(59,130,246,0.12)';
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  emergencyBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  heroStats: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.onDark.surface,
    borderRadius: radii.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroStat: { flex: 1, alignItems: 'center' },
  heroDivider: { width: 1, height: 36, backgroundColor: colors.onDark.border },
  heroStatIcon: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center', marginBottom: 6,
  },
  heroStatValue: { color: colors.onDark.text, fontFamily: typography.fontFamily.bold, fontSize: typography.size.lg },
  heroStatLabel: { color: colors.onDark.textMuted, fontSize: 11, marginTop: 2 },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  progressTitle: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  progressSubtitle: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },
  progressPct: { fontSize: typography.size.xl, color: colors.primary, fontFamily: typography.fontFamily.bold },
  progressTrack: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: radii.sm,
  },

  studentCard: { marginBottom: spacing.sm },
  studentRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  studentNum: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  studentNumText: { color: colors.primary, fontFamily: typography.fontFamily.bold, fontSize: typography.size.md },
  studentInfo: { flex: 1 },
  studentName: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  studentDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  studentDetailText: { fontSize: typography.size.xs, color: colors.textSecondary, flex: 1 },
  studentActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  statusBtn: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  callBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  studentStatusRow: {
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },

  actionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  actionIcon: {
    width: 44, height: 44, borderRadius: radii.md,
    alignItems: 'center', justifyContent: 'center',
  },
  actionLabel: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  actionDescription: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },

  bottomBar: {
    position: 'absolute',
    bottom: layout.tabBarHeight,
    left: 0, right: 0,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    ...shadows.lg,
  },
});
