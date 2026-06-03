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
  ArrowDown2,
  Card as CardIcon,
  Clock,
  Routing2,
  Star1,
  TrendUp,
  Wallet3,
  Add,
  ArrowUp,
  Bank,
} from 'iconsax-react-native';

import ScreenContainer from '../components/driver/ScreenContainer';
import HeroHeader from '../components/driver/HeroHeader';
import SectionHeader from '../components/driver/SectionHeader';
import Card from '../components/driver/Card';
import Badge from '../components/driver/Badge';
import FilterChip from '../components/driver/FilterChip';
import PrimaryButton from '../components/driver/PrimaryButton';
import StatTile from '../components/driver/StatTile';
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
  getEarningsForPeriod,
  getEarningsTransactions,
  getPaymentMethods,
} from '../../services/mock/driver';

const PERIODS = [
  { id: 'today', label: 'Today' },
  { id: 'week', label: 'This Week' },
  { id: 'month', label: 'This Month' },
];

export default function EarningsScreen() {
  const router = useRouter();
  const [period, setPeriod] = useState('today');
  const stats = useMemo(() => getEarningsForPeriod(period), [period]);
  const transactions = useMemo(() => getEarningsTransactions(), []);
  const paymentMethods = useMemo(() => getPaymentMethods(), []);

  return (
    <ScreenContainer edges={['left', 'right']} statusBarStyle="light-content">
      <HeroHeader
        greeting="Earnings"
        title={`Rs. ${stats.total.toLocaleString()}`}
        subtitle={`${stats.trips} trips • ${stats.hours} hrs online`}
        notificationCount={0}
        onAvatarPress={() => router.push('/driver/Profile/profile')}
        initials="KP"
      >
        <View style={styles.periodRow}>
          {PERIODS.map((p) => (
            <FilterChip
              key={p.id}
              label={p.label}
              variant="tab"
              active={period === p.id}
              onPress={() => setPeriod(p.id)}
              style={[
                { flex: 1, backgroundColor: period === p.id ? '#fff' : colors.onDark.surface },
              ]}
            />
          ))}
        </View>
      </HeroHeader>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['3xl'] }}
      >
        {/* Earnings hero card */}
        <View style={styles.section}>
          <View style={styles.earningsShadow}>
            <LinearGradient
              colors={gradients.earnings}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.earningsCard}
            >
              <View style={styles.earningsHeader}>
                <View style={styles.earningsIconWrap}>
                  <Wallet3 size={fs(26)} color="#fff" variant="Bold" />
                </View>
                <View style={styles.earningsChangeWrap}>
                  <TrendUp size={fs(12)} color="#fff" variant="Bold" />
                  <Text style={styles.earningsChangeText}>
                    {stats.change > 0 ? '+' : ''}{stats.change}%
                  </Text>
                </View>
              </View>
              <Text style={styles.earningsLabel}>Total Earnings</Text>
              <Text style={styles.earningsAmount}>Rs. {stats.total.toLocaleString()}</Text>
              <PrimaryButton
                title="Withdraw to Bank"
                variant="dark"
                size="md"
                fullWidth
                iconLeft={<ArrowDown2 size={fs(16)} color="#fff" variant="Bold" />}
                style={styles.withdrawBtn}
              />
            </LinearGradient>
          </View>
        </View>

        {/* Stat grid */}
        <View style={styles.section}>
          <View style={styles.statRow}>
            <StatTile
              icon={Routing2}
              iconColor={colors.primary}
              iconBg={colors.primarySurface}
              value={String(stats.trips)}
              label="Trips"
            />
            <StatTile
              icon={Clock}
              iconColor={colors.warning}
              iconBg={colors.warningSurface}
              value={`${stats.hours}h`}
              label="Hours online"
            />
            <StatTile
              icon={Star1}
              iconColor={colors.success}
              iconBg={colors.successSurface}
              value={`Rs. ${(stats.avgPerTrip / 1000).toFixed(1)}K`}
              label="Avg trip"
            />
          </View>
        </View>

        {/* Transactions */}
        <View style={styles.section}>
          <SectionHeader title="Recent Transactions" action="View all" />
          <Card padding="none">
            {transactions.map((tx, idx) => (
              <View
                key={tx.id}
                style={[
                  styles.txRow,
                  idx < transactions.length - 1 && styles.txDivider,
                ]}
              >
                <View style={styles.txIcon}>
                  <ArrowUp size={fs(16)} color={colors.success} variant="Bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txStudent}>{tx.studentName}</Text>
                  <Text style={styles.txDestination}>{tx.destination}</Text>
                </View>
                <View style={styles.txRight}>
                  <Text style={styles.txAmount}>+Rs. {tx.amount.toLocaleString()}</Text>
                  <Text style={styles.txTime}>{tx.time}</Text>
                </View>
              </View>
            ))}
          </Card>
        </View>

        {/* Payment methods */}
        <View style={styles.section}>
          <SectionHeader title="Payment Methods" action="Manage" />
          {paymentMethods.map((pm) => (
            <Card
              key={pm.id}
              padding="md"
              style={{ marginBottom: spacing.sm }}
              onPress={() => router.push('/driver/Profile/payment-methods')}
            >
              <View style={styles.pmRow}>
                <View style={[styles.pmIcon, { backgroundColor: pm.type === 'bank' ? colors.primarySurface : colors.infoSurface }]}>
                  {pm.type === 'bank' ? (
                    <Bank size={fs(20)} color={colors.primary} variant="Bold" />
                  ) : (
                    <CardIcon size={fs(20)} color={colors.info} variant="Bold" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.pmHeaderRow}>
                    <Text style={styles.pmLabel}>{pm.label}</Text>
                    {pm.isPrimary ? (
                      <Badge label="Primary" tone="primary" variant="soft" size="xs" />
                    ) : null}
                  </View>
                  <Text style={styles.pmDetail}>{pm.detail}</Text>
                </View>
              </View>
            </Card>
          ))}

          <TouchableOpacity
            style={styles.addPmBtn}
            activeOpacity={0.85}
            onPress={() => router.push('/driver/Profile/payment-methods')}
          >
            <Add size={fs(18)} color={colors.primary} variant="Bold" />
            <Text style={styles.addPmText}>Add Payment Method</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  periodRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },

  earningsShadow: { ...shadows.success, borderRadius: radii.xl },
  earningsCard: { borderRadius: radii.xl, padding: spacing.xl },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  earningsIconWrap: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  earningsChangeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.22)',
    paddingHorizontal: spacing.md - 2,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  earningsChangeText: { color: '#fff', fontSize: typography.size.xs, fontFamily: typography.fontFamily.bold },
  earningsLabel: { color: 'rgba(255,255,255,0.85)', fontSize: typography.size.sm, fontFamily: typography.fontFamily.medium },
  earningsAmount: {
    color: '#fff',
    fontSize: fs(34),
    fontFamily: typography.fontFamily.bold,
    marginTop: 4,
    marginBottom: spacing.lg,
    letterSpacing: -0.5,
  },
  withdrawBtn: { marginTop: 0 },

  statRow: { flexDirection: 'row', gap: spacing.sm },

  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  txDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  txIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.successSurface,
    alignItems: 'center', justifyContent: 'center',
  },
  txStudent: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  txDestination: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },
  txRight: { alignItems: 'flex-end' },
  txAmount: { fontSize: typography.size.md, color: colors.success, fontFamily: typography.fontFamily.bold },
  txTime: { fontSize: typography.size.xs, color: colors.textTertiary, marginTop: 2 },

  pmRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pmIcon: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
  },
  pmHeaderRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pmLabel: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  pmDetail: { fontSize: typography.size.sm, color: colors.textSecondary, marginTop: 2 },

  addPmBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radii.md,
    backgroundColor: colors.primarySurface,
  },
  addPmText: { color: colors.primary, fontSize: typography.size.md, fontFamily: typography.fontFamily.bold },
});
