import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Calendar,
  CloseCircle,
  InfoCircle,
  Location,
  MessageQuestion,
  Profile2User,
  Sms,
  TickCircle,
  Wallet3,
  Call,
  CloseSquare,
} from 'iconsax-react-native';

import ScreenContainer from '../components/driver/ScreenContainer';
import PageHeader from '../components/driver/PageHeader';
import Card from '../components/driver/Card';
import Badge from '../components/driver/Badge';
import Avatar from '../components/driver/Avatar';
import EmptyState from '../components/driver/EmptyState';
import PrimaryButton from '../components/driver/PrimaryButton';
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  fs,
  hp,
} from '../theme';
import { getBookingRequests } from '../../services/mock/driver';

export default function BookingRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState(() => getBookingRequests());
  const [selected, setSelected] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const pendingCount = requests.length;

  const openDetail = (req) => {
    setSelected(req);
    setShowDetail(true);
  };

  const acceptRequest = (id) => {
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setShowDetail(false);
  };

  const openReject = (req) => {
    setSelected(req);
    setShowDetail(false);
    setShowReject(true);
  };

  const confirmReject = () => {
    if (selected) {
      setRequests((prev) => prev.filter((r) => r.id !== selected.id));
    }
    setShowReject(false);
    setRejectReason('');
  };

  return (
    <ScreenContainer>
      <PageHeader
        title="Booking Requests"
        subtitle={pendingCount === 0 ? "All caught up" : `${pendingCount} pending`}
        onBack={() => router.back()}
        rightSlot={
          pendingCount > 0 ? (
            <Badge label={String(pendingCount)} tone="danger" variant="solid" />
          ) : null
        }
      />

      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['3xl'] }}
        showsVerticalScrollIndicator={false}
      >
        {pendingCount === 0 ? (
          <EmptyState
            icon={TickCircle}
            tone={colors.success}
            title="No pending requests"
            description="You're all caught up. New booking requests from parents will appear here."
          />
        ) : (
          requests.map((req) => (
            <Card key={req.id} padding="lg" style={styles.requestCard} onPress={() => openDetail(req)}>
              {/* Top: parent + status */}
              <View style={styles.row}>
                <View style={styles.parentBlock}>
                  <Avatar name={req.parentName} tone="blue" size={44} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.parentName} numberOfLines={1}>{req.parentName}</Text>
                    <Text style={styles.requestTime}>{req.requestedOn}</Text>
                  </View>
                </View>
                <Badge label="New" tone="warning" variant="solid" />
              </View>

              {/* Student summary */}
              <View style={styles.studentRow}>
                <View style={styles.studentIcon}>
                  <Profile2User size={fs(18)} color={colors.success} variant="Bold" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.studentName} numberOfLines={1}>{req.childName}</Text>
                  <Text style={styles.studentMeta} numberOfLines={1}>
                    {req.grade} • {req.school}
                  </Text>
                </View>
              </View>

              {/* Route */}
              <View style={styles.routeBlock}>
                <RouteRow icon="pickup" text={req.pickupAddress} />
                <View style={styles.routeLine} />
                <RouteRow icon="dropoff" text={req.dropoffAddress} />
              </View>

              {/* Footer */}
              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.feeLabel}>Monthly Fee</Text>
                  <Text style={styles.feeAmount}>{req.monthlyFee}</Text>
                </View>
                <View style={styles.dateRow}>
                  <Calendar size={fs(14)} color={colors.textSecondary} variant="Bold" />
                  <Text style={styles.dateText}>Starts {req.requestedDate}</Text>
                </View>
              </View>

              {/* Inline actions */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.declineBtn]}
                  activeOpacity={0.85}
                  onPress={(e) => {
                    e.stopPropagation();
                    openReject(req);
                  }}
                >
                  <CloseCircle size={fs(18)} color={colors.danger} variant="Bold" />
                  <Text style={styles.declineText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.acceptBtn]}
                  activeOpacity={0.85}
                  onPress={(e) => {
                    e.stopPropagation();
                    acceptRequest(req.id);
                  }}
                >
                  <TickCircle size={fs(18)} color="#fff" variant="Bold" />
                  <Text style={styles.acceptText}>Accept</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Detail Sheet */}
      <Modal
        visible={showDetail}
        animationType="slide"
        transparent
        onRequestClose={() => setShowDetail(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Booking Request</Text>
              <TouchableOpacity onPress={() => setShowDetail(false)} hitSlop={6}>
                <CloseSquare size={fs(26)} color={colors.textSecondary} variant="Linear" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {selected ? (
                <>
                  <DetailSection title="Parent">
                    <DetailRow icon={Profile2User} label="Name" value={selected.parentName} />
                    <DetailRow icon={Call} label="Phone" value={selected.parentPhone} />
                  </DetailSection>

                  <DetailSection title="Student">
                    <DetailRow label="Name" value={selected.childName} />
                    <DetailRow label="Grade" value={selected.grade} />
                    <DetailRow label="School" value={selected.school} />
                  </DetailSection>

                  <DetailSection title="Route">
                    <DetailRow icon={Location} label="Pickup" value={selected.pickupAddress} multiline />
                    <DetailRow icon={Location} label="Drop-off" value={selected.dropoffAddress} multiline />
                  </DetailSection>

                  <DetailSection title="Subscription">
                    <DetailRow icon={Calendar} label="Start Date" value={selected.requestedDate} />
                    <DetailRow
                      icon={Wallet3}
                      label="Monthly Fee"
                      value={selected.monthlyFee}
                      valueColor={colors.success}
                      bold
                    />
                  </DetailSection>

                  {selected.specialInstructions ? (
                    <DetailSection title="Special Instructions">
                      <View style={styles.noteCard}>
                        <InfoCircle size={fs(18)} color={colors.warning} variant="Bold" />
                        <Text style={styles.noteText}>{selected.specialInstructions}</Text>
                      </View>
                    </DetailSection>
                  ) : null}

                  <View style={styles.sheetActions}>
                    <PrimaryButton
                      title="Accept Request"
                      variant="success"
                      size="lg"
                      fullWidth
                      iconLeft={<TickCircle size={fs(20)} color="#fff" variant="Bold" />}
                      onPress={() => acceptRequest(selected.id)}
                    />
                    <View style={styles.sheetActionsRow}>
                      <PrimaryButton
                        title="Message"
                        variant="outline"
                        size="md"
                        style={{ flex: 1 }}
                        iconLeft={<MessageQuestion size={fs(16)} color={colors.primary} variant="Bold" />}
                        onPress={() => setShowDetail(false)}
                      />
                      <PrimaryButton
                        title="Decline"
                        variant="danger"
                        size="md"
                        style={{ flex: 1 }}
                        iconLeft={<CloseCircle size={fs(16)} color="#fff" variant="Bold" />}
                        onPress={() => openReject(selected)}
                      />
                    </View>
                  </View>
                </>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Reject Modal */}
      <Modal
        visible={showReject}
        animationType="fade"
        transparent
        onRequestClose={() => setShowReject(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.rejectCard}>
            <Text style={styles.rejectTitle}>Decline Request</Text>
            <Text style={styles.rejectSubtitle}>
              Let the parent know why you can't accept this trip. They'll be notified privately.
            </Text>
            <TextInput
              style={styles.rejectInput}
              value={rejectReason}
              onChangeText={setRejectReason}
              placeholder="Reason for declining..."
              placeholderTextColor={colors.textTertiary}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <View style={styles.rejectActions}>
              <PrimaryButton
                title="Cancel"
                variant="ghost"
                size="md"
                style={{ flex: 1 }}
                onPress={() => setShowReject(false)}
              />
              <PrimaryButton
                title="Decline Request"
                variant="danger"
                size="md"
                style={{ flex: 1 }}
                onPress={confirmReject}
              />
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScreenContainer>
  );
}

const RouteRow = ({ icon, text }) => (
  <View style={styles.routeRow}>
    <View style={[styles.routeDot, icon === 'dropoff' && styles.routeDotDrop]} />
    <Text style={styles.routeText} numberOfLines={1}>{text}</Text>
  </View>
);

const DetailSection = ({ title, children }) => (
  <View style={styles.detailSection}>
    <Text style={styles.detailSectionTitle}>{title}</Text>
    <View style={styles.detailSectionBody}>{children}</View>
  </View>
);

const DetailRow = ({ icon: Icon, label, value, valueColor, bold, multiline }) => (
  <View style={styles.detailRow}>
    {Icon ? <Icon size={fs(16)} color={colors.textSecondary} variant="Bold" /> : <View style={{ width: fs(16) }} />}
    <View style={{ flex: 1 }}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text
        style={[
          styles.detailValue,
          bold && { fontFamily: typography.fontFamily.bold },
          valueColor && { color: valueColor },
        ]}
        numberOfLines={multiline ? 0 : 1}
      >
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  parentBlock: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, flex: 1 },
  parentName: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  requestTime: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },

  requestCard: { marginBottom: spacing.lg },

  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceMuted,
    padding: spacing.md,
    borderRadius: radii.md,
    marginBottom: spacing.md,
  },
  studentIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.successSurface,
    alignItems: 'center', justifyContent: 'center',
  },
  studentName: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold },
  studentMeta: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },

  routeBlock: { marginBottom: spacing.md },
  routeRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  routeDot: {
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: colors.primary,
  },
  routeDotDrop: { backgroundColor: colors.success },
  routeLine: { width: 2, height: 18, backgroundColor: colors.border, marginLeft: 4, marginVertical: 4 },
  routeText: { fontSize: typography.size.sm, color: colors.textPrimary, flex: 1 },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    marginBottom: spacing.md,
  },
  feeLabel: { fontSize: typography.size.xs, color: colors.textSecondary },
  feeAmount: { fontSize: typography.size.lg, color: colors.success, fontFamily: typography.fontFamily.bold, marginTop: 2 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dateText: { fontSize: typography.size.sm, color: colors.textSecondary },

  actionRow: { flexDirection: 'row', gap: spacing.md },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md - 2,
    borderRadius: radii.md,
    gap: spacing.sm,
  },
  declineBtn: { backgroundColor: colors.dangerSurface },
  declineText: { color: colors.dangerDark, fontSize: typography.size.md, fontFamily: typography.fontFamily.bold },
  acceptBtn: { backgroundColor: colors.success },
  acceptText: { color: '#fff', fontSize: typography.size.md, fontFamily: typography.fontFamily.bold },

  modalOverlay: { flex: 1, backgroundColor: colors.overlay, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    padding: spacing.xl,
    paddingTop: spacing.md,
    maxHeight: '90%',
  },
  sheetHandle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sheetTitle: { fontSize: typography.size['2xl'], color: colors.textPrimary, fontFamily: typography.fontFamily.bold },

  detailSection: { marginBottom: spacing.lg },
  detailSectionTitle: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
  },
  detailSectionBody: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.md,
    gap: spacing.md,
  },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md },
  detailLabel: { fontSize: typography.size.xs, color: colors.textSecondary },
  detailValue: { fontSize: typography.size.md, color: colors.textPrimary, marginTop: 2 },

  noteCard: {
    backgroundColor: colors.warningSurface,
    padding: spacing.md,
    borderRadius: radii.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  noteText: { flex: 1, color: colors.warningDark, fontSize: typography.size.sm, lineHeight: typography.size.sm * 1.4 },

  sheetActions: { marginTop: spacing.md, gap: spacing.sm },
  sheetActionsRow: { flexDirection: 'row', gap: spacing.sm },

  rejectCard: {
    backgroundColor: colors.surface,
    marginHorizontal: spacing.xl,
    borderRadius: radii.xl,
    padding: spacing.xl,
    ...shadows.lg,
  },
  rejectTitle: { fontSize: typography.size.xl, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  rejectSubtitle: { fontSize: typography.size.sm, color: colors.textSecondary, marginTop: spacing.sm, marginBottom: spacing.lg, lineHeight: typography.size.sm * 1.4 },
  rejectInput: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    padding: spacing.md,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    minHeight: hp(110),
    marginBottom: spacing.lg,
  },
  rejectActions: { flexDirection: 'row', gap: spacing.sm },
});
