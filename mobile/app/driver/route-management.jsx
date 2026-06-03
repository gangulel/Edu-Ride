import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  Add,
  AddCircle,
  Calendar,
  Clock,
  CloseSquare,
  Flag,
  Location,
  Map1,
  People,
  Routing2,
  Buildings2,
  Trash,
  TickCircle,
} from 'iconsax-react-native';

import ScreenContainer from '../components/driver/ScreenContainer';
import PageHeader from '../components/driver/PageHeader';
import SectionHeader from '../components/driver/SectionHeader';
import Card from '../components/driver/Card';
import Badge from '../components/driver/Badge';
import PrimaryButton from '../components/driver/PrimaryButton';
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  fs,
} from '../theme';
import { getRoute } from '../../services/mock/driver';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function RouteManagementScreen() {
  const router = useRouter();
  const initial = useMemo(() => getRoute(), []);
  const [route, setRoute] = useState(initial);
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStop, setNewStop] = useState({ location: '', pickupTime: '' });

  const toggleDay = (day) => {
    setRoute((r) => ({
      ...r,
      daysOfOperation: r.daysOfOperation.includes(day)
        ? r.daysOfOperation.filter((d) => d !== day)
        : [...r.daysOfOperation, day],
    }));
  };

  const addStop = () => {
    if (!newStop.location.trim()) return;
    setRoute((r) => ({
      ...r,
      stops: [
        ...r.stops,
        {
          id: `s${r.stops.length + 1}`,
          location: newStop.location,
          address: newStop.location,
          pickupTime: newStop.pickupTime || 'TBD',
          dropoffTime: 'TBD',
          studentCount: 0,
        },
      ],
    }));
    setNewStop({ location: '', pickupTime: '' });
    setShowAddStop(false);
  };

  const removeStop = (id) => {
    setRoute((r) => ({ ...r, stops: r.stops.filter((s) => s.id !== id) }));
  };

  return (
    <ScreenContainer>
      <PageHeader
        title="Route Management"
        subtitle={route.name}
        onBack={() => router.back()}
        rightSlot={
          <PrimaryButton
            title="Save"
            variant="primary"
            size="sm"
            onPress={() => router.back()}
          />
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['3xl'] }}
      >
        {/* Summary */}
        <View style={styles.section}>
          <Card padding="lg" tone="elevated">
            <View style={styles.summaryHeader}>
              <View style={styles.summarySchoolIcon}>
                <Buildings2 size={fs(22)} color={colors.primary} variant="Bold" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.summarySchool}>{route.school}</Text>
                <Text style={styles.summaryRouteName}>{route.name}</Text>
              </View>
              <Badge label="Active" tone="success" variant="soft" />
            </View>

            <View style={styles.summaryStats}>
              <SummaryStat icon={Routing2} label="Stops" value={String(route.stops.length)} />
              <View style={styles.summaryDivider} />
              <SummaryStat icon={People} label="Students" value={String(route.totalStudents)} />
              <View style={styles.summaryDivider} />
              <SummaryStat icon={Map1} label="Distance" value={`${route.totalDistanceKm} km`} />
            </View>

            <View style={styles.summaryTimes}>
              <View style={styles.summaryTimeItem}>
                <Text style={styles.summaryTimeLabel}>Morning arrival</Text>
                <Text style={styles.summaryTimeValue}>{route.schoolArrival}</Text>
              </View>
              <View style={styles.summaryTimeDivider} />
              <View style={styles.summaryTimeItem}>
                <Text style={styles.summaryTimeLabel}>Afternoon departure</Text>
                <Text style={styles.summaryTimeValue}>{route.schoolDeparture}</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Days */}
        <View style={styles.section}>
          <SectionHeader title="Days of Operation" />
          <View style={styles.daysRow}>
            {ALL_DAYS.map((day) => {
              const active = route.daysOfOperation.includes(day);
              return (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayBtn, active && styles.dayBtnActive]}
                  onPress={() => toggleDay(day)}
                  activeOpacity={0.85}
                >
                  <Text
                    style={[styles.dayBtnText, active && styles.dayBtnTextActive]}
                  >
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Stops Timeline */}
        <View style={styles.section}>
          <SectionHeader
            title="Route Stops"
            action="Add stop"
            onActionPress={() => setShowAddStop(true)}
          />

          <Card padding="lg">
            {route.stops.map((stop, idx) => {
              const isFirst = idx === 0;
              const isLast = idx === route.stops.length - 1;
              return (
                <View key={stop.id} style={styles.stopRow}>
                  <View style={styles.stopMarkerCol}>
                    <View
                      style={[
                        styles.stopMarker,
                        isFirst && styles.stopMarkerStart,
                        isLast && styles.stopMarkerEnd,
                      ]}
                    >
                      {isFirst ? (
                        <Flag size={fs(14)} color="#fff" variant="Bold" />
                      ) : isLast ? (
                        <Buildings2 size={fs(14)} color="#fff" variant="Bold" />
                      ) : (
                        <Location size={fs(14)} color="#fff" variant="Bold" />
                      )}
                    </View>
                    {isLast ? null : <View style={styles.stopLine} />}
                  </View>

                  <View style={styles.stopContent}>
                    <View style={styles.stopHeaderRow}>
                      <Text style={styles.stopLocation} numberOfLines={1}>
                        {stop.location}
                      </Text>
                      {!isFirst && !isLast ? (
                        <TouchableOpacity
                          onPress={() => removeStop(stop.id)}
                          hitSlop={6}
                        >
                          <Trash size={fs(16)} color={colors.danger} variant="Bold" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    {stop.address ? (
                      <Text style={styles.stopAddress}>{stop.address}</Text>
                    ) : null}
                    <View style={styles.stopMeta}>
                      <View style={styles.stopMetaItem}>
                        <Clock size={fs(13)} color={colors.textSecondary} variant="Bold" />
                        <Text style={styles.stopMetaText}>{stop.pickupTime}</Text>
                      </View>
                      <View style={styles.stopMetaItem}>
                        <Calendar size={fs(13)} color={colors.textSecondary} variant="Bold" />
                        <Text style={styles.stopMetaText}>Return {stop.dropoffTime}</Text>
                      </View>
                      <View style={styles.stopMetaItem}>
                        <People size={fs(13)} color={colors.textSecondary} variant="Bold" />
                        <Text style={styles.stopMetaText}>{stop.studentCount}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}

            <TouchableOpacity
              style={styles.addStopBtn}
              onPress={() => setShowAddStop(true)}
              activeOpacity={0.85}
            >
              <AddCircle size={fs(18)} color={colors.primary} variant="Bold" />
              <Text style={styles.addStopText}>Add Stop</Text>
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.section}>
          <PrimaryButton
            title="Save Route"
            variant="gradient"
            size="lg"
            fullWidth
            iconLeft={<TickCircle size={fs(20)} color="#fff" variant="Bold" />}
            onPress={() => router.back()}
          />
        </View>
      </ScrollView>

      <Modal
        visible={showAddStop}
        animationType="slide"
        transparent
        onRequestClose={() => setShowAddStop(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>Add Stop</Text>
              <TouchableOpacity onPress={() => setShowAddStop(false)} hitSlop={6}>
                <CloseSquare size={fs(26)} color={colors.textSecondary} variant="Linear" />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Location name</Text>
              <TextInput
                style={styles.input}
                value={newStop.location}
                onChangeText={(t) => setNewStop((s) => ({ ...s, location: t }))}
                placeholder="e.g. Mount Lavinia Junction"
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Pickup time</Text>
              <TextInput
                style={styles.input}
                value={newStop.pickupTime}
                onChangeText={(t) => setNewStop((s) => ({ ...s, pickupTime: t }))}
                placeholder="e.g. 7:30 AM"
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <PrimaryButton
              title="Add Stop"
              variant="gradient"
              size="lg"
              fullWidth
              iconLeft={<Add size={fs(20)} color="#fff" variant="Bold" />}
              onPress={addStop}
              style={{ marginTop: spacing.md }}
            />
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const SummaryStat = ({ icon: Icon, label, value }) => (
  <View style={styles.summaryStat}>
    <Icon size={fs(18)} color={colors.primary} variant="Bold" />
    <Text style={styles.summaryStatValue}>{value}</Text>
    <Text style={styles.summaryStatLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.lg },

  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  summarySchoolIcon: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },
  summarySchool: { fontSize: typography.size.lg, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  summaryRouteName: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },

  summaryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  summaryStat: { flex: 1, alignItems: 'center' },
  summaryStatValue: { fontSize: typography.size.lg, color: colors.textPrimary, fontFamily: typography.fontFamily.bold, marginTop: spacing.sm - 2 },
  summaryStatLabel: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },
  summaryDivider: { width: 1, height: 32, backgroundColor: colors.divider },

  summaryTimes: {
    flexDirection: 'row',
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  summaryTimeItem: { flex: 1 },
  summaryTimeLabel: { fontSize: typography.size.xs, color: colors.textSecondary },
  summaryTimeValue: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.bold, marginTop: 2 },
  summaryTimeDivider: { width: 1, marginHorizontal: spacing.md, backgroundColor: colors.divider },

  daysRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 6 },
  dayBtn: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: radii.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  dayBtnActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dayBtnText: { fontSize: typography.size.sm, color: colors.textSecondary, fontFamily: typography.fontFamily.semibold },
  dayBtnTextActive: { color: colors.onPrimary },

  stopRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md },
  stopMarkerCol: { alignItems: 'center' },
  stopMarker: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  stopMarkerStart: { backgroundColor: colors.success },
  stopMarkerEnd: { backgroundColor: colors.info },
  stopLine: { width: 2, flex: 1, backgroundColor: colors.border, marginTop: 4 },

  stopContent: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  stopHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stopLocation: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.semibold, flex: 1 },
  stopAddress: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },
  stopMeta: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.sm, flexWrap: 'wrap' },
  stopMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  stopMetaText: { fontSize: typography.size.xs, color: colors.textSecondary },

  addStopBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: radii.md,
    marginTop: spacing.sm,
  },
  addStopText: { color: colors.primary, fontSize: typography.size.md, fontFamily: typography.fontFamily.bold },

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
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  sheetTitle: { fontSize: typography.size.xl, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },

  fieldGroup: { marginBottom: spacing.md },
  fieldLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
