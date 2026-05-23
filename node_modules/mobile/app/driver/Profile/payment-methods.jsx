import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Add,
  ArrowDown2,
  Bank,
  Card as CardIcon,
  CloseSquare,
  EmptyWallet,
  Mobile,
  TickCircle,
  Trash,
  Wallet3,
} from 'iconsax-react-native';

import ScreenContainer from '../../components/driver/ScreenContainer';
import PageHeader from '../../components/driver/PageHeader';
import Card from '../../components/driver/Card';
import Badge from '../../components/driver/Badge';
import PrimaryButton from '../../components/driver/PrimaryButton';
import {
  colors,
  gradients,
  spacing,
  typography,
  radii,
  shadows,
  fs,
} from '../../theme';
import { getPaymentMethods } from '../../../services/mock/driver';

const TYPE_META = {
  bank: { icon: Bank, color: colors.primary, surface: colors.primarySurface, label: 'Bank Account' },
  card: { icon: CardIcon, color: colors.info, surface: colors.infoSurface, label: 'Debit Card' },
  wallet: { icon: Mobile, color: colors.success, surface: colors.successSurface, label: 'Mobile Wallet' },
};

const ADD_OPTIONS = [
  { type: 'bank', label: 'Bank Account', description: 'Direct deposit to your account', icon: Bank, color: colors.primary, surface: colors.primarySurface },
  { type: 'card', label: 'Debit Card', description: 'Visa, MasterCard, Amex', icon: CardIcon, color: colors.info, surface: colors.infoSurface },
  { type: 'wallet', label: 'Mobile Wallet', description: 'eZ Cash, mCash & more', icon: Mobile, color: colors.success, surface: colors.successSurface },
];

const EARNINGS = {
  thisWeek: 124750,
  pendingPayout: 45000,
  nextPayoutDate: 'Jun 18, 2026',
};

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const [methods, setMethods] = useState(() => getPaymentMethods());
  const [showAdd, setShowAdd] = useState(false);

  const setPrimary = (id) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isPrimary: m.id === id })));
  };

  const remove = (id, label) => {
    Alert.alert('Remove method?', `Remove ${label}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => setMethods((prev) => prev.filter((m) => m.id !== id)),
      },
    ]);
  };

  const requestPayout = () => {
    Alert.alert(
      'Request Payout',
      `Send Rs. ${EARNINGS.pendingPayout.toLocaleString()} to your primary account?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Confirm', onPress: () => Alert.alert('Requested', 'Payout will be processed in 1-2 business days.') },
      ]
    );
  };

  return (
    <ScreenContainer>
      <PageHeader
        title="Payment Methods"
        subtitle={`${methods.length} method${methods.length === 1 ? '' : 's'} linked`}
        onBack={() => router.back()}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['3xl'] }}
      >
        {/* Earnings hero */}
        <View style={styles.heroShadow}>
          <LinearGradient
            colors={gradients.earnings}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.hero}
          >
            <View style={styles.heroHeader}>
              <View style={styles.heroIcon}>
                <Wallet3 size={fs(22)} color="#fff" variant="Bold" />
              </View>
              <Badge label="Next payout" tone="primary" variant="soft" style={{ backgroundColor: 'rgba(255,255,255,0.22)' }} />
            </View>
            <Text style={styles.heroLabel}>Pending Payout</Text>
            <Text style={styles.heroAmount}>Rs. {EARNINGS.pendingPayout.toLocaleString()}</Text>
            <View style={styles.heroFooter}>
              <Text style={styles.heroDate}>Auto-payout on {EARNINGS.nextPayoutDate}</Text>
            </View>
            <PrimaryButton
              title="Request Early Payout"
              variant="dark"
              size="md"
              fullWidth
              iconLeft={<ArrowDown2 size={fs(16)} color="#fff" variant="Bold" />}
              onPress={requestPayout}
              style={{ marginTop: spacing.md }}
            />
          </LinearGradient>
        </View>

        {/* Methods list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linked Methods</Text>
          {methods.length === 0 ? (
            <Card padding="lg" tone="muted">
              <View style={styles.emptyWrap}>
                <EmptyWallet size={fs(32)} color={colors.textTertiary} variant="Bold" />
                <Text style={styles.emptyTitle}>No payment methods yet</Text>
                <Text style={styles.emptyDescription}>
                  Add at least one to receive payouts from your trips.
                </Text>
              </View>
            </Card>
          ) : (
            methods.map((pm) => {
              const meta = TYPE_META[pm.type] ?? TYPE_META.bank;
              const Icon = meta.icon;
              return (
                <Card key={pm.id} padding="lg" style={{ marginBottom: spacing.sm }}>
                  <View style={styles.pmRow}>
                    <View style={[styles.pmIcon, { backgroundColor: meta.surface }]}>
                      <Icon size={fs(22)} color={meta.color} variant="Bold" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={styles.pmHeader}>
                        <Text style={styles.pmLabel}>{pm.label}</Text>
                        {pm.isPrimary ? (
                          <Badge label="Primary" tone="success" variant="soft" size="xs" />
                        ) : null}
                      </View>
                      <Text style={styles.pmDetail}>{pm.detail}</Text>
                    </View>
                    <TouchableOpacity hitSlop={6} onPress={() => remove(pm.id, pm.label)}>
                      <Trash size={fs(18)} color={colors.danger} variant="Bold" />
                    </TouchableOpacity>
                  </View>
                  {!pm.isPrimary ? (
                    <TouchableOpacity
                      style={styles.setPrimaryBtn}
                      activeOpacity={0.85}
                      onPress={() => setPrimary(pm.id)}
                    >
                      <TickCircle size={fs(14)} color={colors.primary} variant="Bold" />
                      <Text style={styles.setPrimaryText}>Set as primary</Text>
                    </TouchableOpacity>
                  ) : null}
                </Card>
              );
            })
          )}
        </View>

        <PrimaryButton
          title="Add Payment Method"
          variant="gradient"
          size="lg"
          fullWidth
          iconLeft={<Add size={fs(20)} color="#fff" variant="Bold" />}
          onPress={() => setShowAdd(true)}
          style={{ marginTop: spacing.lg }}
        />
      </ScrollView>

      <Modal
        visible={showAdd}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAdd(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add Payment Method</Text>
              <TouchableOpacity onPress={() => setShowAdd(false)} hitSlop={6}>
                <CloseSquare size={fs(26)} color={colors.textSecondary} variant="Linear" />
              </TouchableOpacity>
            </View>
            <Text style={styles.sheetSub}>Choose how you'd like to receive payouts.</Text>

            {ADD_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              return (
                <TouchableOpacity
                  key={opt.type}
                  activeOpacity={0.85}
                  style={styles.addOption}
                  onPress={() => {
                    setShowAdd(false);
                    Alert.alert('Coming soon', `${opt.label} setup is on the way.`);
                  }}
                >
                  <View style={[styles.addOptionIcon, { backgroundColor: opt.surface }]}>
                    <Icon size={fs(22)} color={opt.color} variant="Bold" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.addOptionLabel}>{opt.label}</Text>
                    <Text style={styles.addOptionDesc}>{opt.description}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroShadow: { ...shadows.success, borderRadius: radii.xl, marginBottom: spacing.lg },
  hero: { borderRadius: radii.xl, padding: spacing.xl },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  heroIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroLabel: { color: 'rgba(255,255,255,0.85)', fontSize: typography.size.sm, fontFamily: typography.fontFamily.medium },
  heroAmount: { color: '#fff', fontSize: fs(32), fontFamily: typography.fontFamily.bold, marginTop: 4, letterSpacing: -0.5 },
  heroFooter: { marginTop: spacing.sm },
  heroDate: { color: 'rgba(255,255,255,0.85)', fontSize: typography.size.xs },

  section: { marginTop: spacing.sm },
  sectionTitle: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },

  pmRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  pmIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  pmHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  pmLabel: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  pmDetail: { fontSize: typography.size.sm, color: colors.textSecondary, marginTop: 2 },

  setPrimaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  setPrimaryText: { color: colors.primary, fontSize: typography.size.sm, fontFamily: typography.fontFamily.semibold },

  emptyWrap: { alignItems: 'center', paddingVertical: spacing.lg },
  emptyTitle: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.bold, marginTop: spacing.md },
  emptyDescription: { fontSize: typography.size.xs, color: colors.textSecondary, textAlign: 'center', marginTop: 4 },

  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    paddingTop: spacing.md,
  },
  sheetHandle: {
    alignSelf: 'center', width: 44, height: 5, borderRadius: 3,
    backgroundColor: colors.border, marginBottom: spacing.md,
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sheetTitle: { fontSize: typography.size.xl, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  sheetSub: { fontSize: typography.size.sm, color: colors.textSecondary, marginBottom: spacing.lg },

  addOption: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  addOptionIcon: {
    width: 48, height: 48, borderRadius: 24,
    alignItems: 'center', justifyContent: 'center',
  },
  addOptionLabel: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  addOptionDesc: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },
});
