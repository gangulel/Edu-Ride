import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Car,
  Edit,
  ShieldTick,
  TickCircle,
  Warning2,
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
import { getVehicle } from '../../../services/mock/driver';

export default function VehicleInfo() {
  const router = useRouter();
  const initial = useMemo(() => getVehicle(), []);
  const [vehicle, setVehicle] = useState(initial);
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (k, v) => {
    setVehicle((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: null }));
  };

  const validate = () => {
    const next = {};
    if (!vehicle.make.trim()) next.make = 'Required';
    if (!vehicle.model.trim()) next.model = 'Required';
    if (!/^\d{4}$/.test(vehicle.year)) next.year = 'Enter a 4-digit year';
    if (!vehicle.licensePlate.trim()) next.licensePlate = 'Required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setEditing(false);
      Alert.alert('Saved', 'Vehicle information updated.');
    }, 600);
  };

  const insuranceStatus = expiryStatus(vehicle.insuranceExpiry);
  const registrationStatus = expiryStatus(vehicle.registrationExpiry);
  const inspectionStatus = expiryStatus(vehicle.inspectionDue);

  return (
    <ScreenContainer>
      <PageHeader
        title="Vehicle Information"
        subtitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
        onBack={() => router.back()}
        rightSlot={
          !editing ? (
            <TouchableOpacity onPress={() => setEditing(true)} hitSlop={6} style={styles.editBtn}>
              <Edit size={fs(18)} color={colors.primary} variant="Bold" />
            </TouchableOpacity>
          ) : null
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['3xl'] }}
        >
          {/* Vehicle hero */}
          <View style={styles.heroShadow}>
            <LinearGradient
              colors={gradients.headerHero}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.hero}
            >
              <View style={styles.heroIcon}>
                <Car size={fs(40)} color="#fff" variant="Bold" />
              </View>
              <Text style={styles.heroTitle}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </Text>
              <Text style={styles.heroPlate}>{vehicle.licensePlate}</Text>
              <View style={styles.heroBadges}>
                <Badge label={vehicle.vehicleType} tone="primary" variant="soft" style={{ backgroundColor: colors.onDark.surface }} />
                <Badge label={`${vehicle.capacity} seats`} tone="primary" variant="soft" style={{ backgroundColor: colors.onDark.surface }} />
                <Badge label={vehicle.color} tone="primary" variant="soft" style={{ backgroundColor: colors.onDark.surface }} />
              </View>
            </LinearGradient>
          </View>

          {/* Status row */}
          <View style={styles.statusGrid}>
            <StatusCard
              label="Insurance"
              date={vehicle.insuranceExpiry}
              status={insuranceStatus}
            />
            <StatusCard
              label="Registration"
              date={vehicle.registrationExpiry}
              status={registrationStatus}
            />
            <StatusCard
              label="Inspection"
              date={vehicle.inspectionDue}
              status={inspectionStatus}
            />
          </View>

          {/* Details */}
          <FormSection title="Vehicle Details">
            <Field label="Make" value={vehicle.make} editing={editing} onChange={(v) => set('make', v)} error={errors.make} />
            <Field label="Model" value={vehicle.model} editing={editing} onChange={(v) => set('model', v)} error={errors.model} />
            <Field label="Year" value={vehicle.year} editing={editing} onChange={(v) => set('year', v)} error={errors.year} keyboardType="number-pad" />
            <Field label="Color" value={vehicle.color} editing={editing} onChange={(v) => set('color', v)} />
            <Field label="License Plate" value={vehicle.licensePlate} editing={editing} onChange={(v) => set('licensePlate', v)} error={errors.licensePlate} />
            <Field label="VIN" value={vehicle.vin} editing={editing} onChange={(v) => set('vin', v)} />
            <Field label="Capacity" value={vehicle.capacity} editing={editing} onChange={(v) => set('capacity', v)} keyboardType="number-pad" isLast />
          </FormSection>

          <FormSection title="Insurance">
            <Field label="Provider" value={vehicle.insuranceProvider} editing={editing} onChange={(v) => set('insuranceProvider', v)} />
            <Field label="Policy" value={vehicle.insurancePolicy} editing={editing} onChange={(v) => set('insurancePolicy', v)} />
            <Field label="Expires" value={vehicle.insuranceExpiry} editing={editing} onChange={(v) => set('insuranceExpiry', v)} isLast />
          </FormSection>

          {/* Features list */}
          <FormSection title="Safety Features">
            <View style={styles.featuresRow}>
              {vehicle.features.map((feature) => (
                <View key={feature} style={styles.feature}>
                  <TickCircle size={fs(14)} color={colors.success} variant="Bold" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </FormSection>

          {editing ? (
            <View style={styles.editActions}>
              <PrimaryButton
                title="Cancel"
                variant="outline"
                size="md"
                style={{ flex: 1 }}
                onPress={() => {
                  setVehicle(initial);
                  setEditing(false);
                  setErrors({});
                }}
              />
              <PrimaryButton
                title="Save Changes"
                variant="gradient"
                size="md"
                style={{ flex: 1 }}
                loading={saving}
                onPress={save}
              />
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function expiryStatus(dateStr) {
  if (!dateStr) return { tone: 'neutral', label: 'Unknown', color: colors.textTertiary };
  const today = new Date();
  const expiry = new Date(dateStr);
  const days = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
  if (days < 0) return { tone: 'danger', label: 'Expired', color: colors.danger };
  if (days < 30) return { tone: 'warning', label: `${days}d left`, color: colors.warning };
  return { tone: 'success', label: 'Valid', color: colors.success };
}

const StatusCard = ({ label, date, status }) => (
  <Card padding="md" style={styles.statusCard}>
    <View style={[styles.statusIcon, { backgroundColor: status.tone === 'danger' ? colors.dangerSurface : status.tone === 'warning' ? colors.warningSurface : colors.successSurface }]}>
      {status.tone === 'success' ? (
        <ShieldTick size={fs(18)} color={status.color} variant="Bold" />
      ) : (
        <Warning2 size={fs(18)} color={status.color} variant="Bold" />
      )}
    </View>
    <Text style={styles.statusLabel}>{label}</Text>
    <Text style={[styles.statusValue, { color: status.color }]}>{status.label}</Text>
    <Text style={styles.statusDate}>{date}</Text>
  </Card>
);

const FormSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Card padding="lg">{children}</Card>
  </View>
);

const Field = ({ label, value, editing, onChange, error, keyboardType, isLast }) => (
  <View style={[styles.field, !isLast && styles.fieldDivider]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    {editing ? (
      <>
        <TextInput
          style={[styles.input, error && styles.inputError]}
          value={value}
          onChangeText={onChange}
          keyboardType={keyboardType ?? 'default'}
          placeholderTextColor={colors.textTertiary}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </>
    ) : (
      <Text style={styles.fieldValue}>{value || '—'}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  editBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },

  heroShadow: { ...shadows.brand, borderRadius: radii.xl, marginBottom: spacing.lg },
  hero: { borderRadius: radii.xl, padding: spacing.xl, alignItems: 'center' },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: { color: '#fff', fontSize: typography.size.xl, fontFamily: typography.fontFamily.bold },
  heroPlate: { color: colors.onDark.textMuted, fontSize: typography.size.lg, fontFamily: typography.fontFamily.semibold, marginTop: 4, letterSpacing: 2 },
  heroBadges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md, flexWrap: 'wrap', justifyContent: 'center' },

  statusGrid: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statusCard: { flex: 1, alignItems: 'flex-start' },
  statusIcon: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statusLabel: { fontSize: typography.size.xs, color: colors.textSecondary, fontFamily: typography.fontFamily.medium },
  statusValue: { fontSize: typography.size.sm, fontFamily: typography.fontFamily.bold, marginTop: 2 },
  statusDate: { fontSize: 10, color: colors.textTertiary, marginTop: 2 },

  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },

  field: { paddingVertical: spacing.sm },
  fieldDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  fieldLabel: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: spacing.sm - 2,
  },
  fieldValue: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    paddingVertical: 6,
  },
  input: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputError: { borderColor: colors.danger },
  errorText: { color: colors.danger, fontSize: typography.size.xs, marginTop: 4 },

  featuresRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  feature: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.successSurface,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderRadius: radii.full,
  },
  featureText: { color: colors.successDark, fontSize: typography.size.xs, fontFamily: typography.fontFamily.semibold },

  editActions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
});
