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
import {
  Call,
  Camera,
  Edit,
  Location,
  Profile as ProfileIcon,
  SecuritySafe,
  Sms,
  TickCircle,
} from 'iconsax-react-native';

import ScreenContainer from '../../components/driver/ScreenContainer';
import PageHeader from '../../components/driver/PageHeader';
import Card from '../../components/driver/Card';
import PrimaryButton from '../../components/driver/PrimaryButton';
import {
  colors,
  gradients,
  spacing,
  typography,
  radii,
  shadows,
  wp,
  fs,
} from '../../theme';
import { LinearGradient } from 'expo-linear-gradient';
import { getDriverProfile } from '../../../services/mock/driver';

export default function EditProfile() {
  const router = useRouter();
  const profile = useMemo(() => getDriverProfile(), []);
  const [form, setForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    emergencyContactName: profile.emergencyContactName,
    emergencyContact: profile.emergencyContact,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }));
  };

  const validate = () => {
    const next = {};
    if (!form.firstName.trim()) next.firstName = 'First name is required';
    if (!form.lastName.trim()) next.lastName = 'Last name is required';
    if (!form.email.trim()) next.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.phone.trim()) next.phone = 'Phone is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const save = async () => {
    if (!validate()) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      Alert.alert('Saved', 'Profile updated successfully.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 600);
  };

  return (
    <ScreenContainer>
      <PageHeader
        title="Edit Profile"
        subtitle="Keep your details up to date"
        onBack={() => router.back()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ padding: spacing.lg, paddingBottom: spacing['3xl'] }}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrap}>
              <LinearGradient
                colors={gradients.brand}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{profile.initials}</Text>
              </LinearGradient>
              <TouchableOpacity style={styles.cameraBtn} activeOpacity={0.85}>
                <Camera size={fs(16)} color="#fff" variant="Bold" />
              </TouchableOpacity>
            </View>
            <Text style={styles.changePhoto}>Change Photo</Text>
          </View>

          <FormSection title="Personal Information">
            <Field
              icon={ProfileIcon}
              label="First Name"
              value={form.firstName}
              onChange={(v) => set('firstName', v)}
              error={errors.firstName}
            />
            <Field
              icon={ProfileIcon}
              label="Last Name"
              value={form.lastName}
              onChange={(v) => set('lastName', v)}
              error={errors.lastName}
            />
            <Field
              icon={Sms}
              label="Email"
              value={form.email}
              onChange={(v) => set('email', v)}
              error={errors.email}
              keyboardType="email-address"
            />
            <Field
              icon={Call}
              label="Phone"
              value={form.phone}
              onChange={(v) => set('phone', v)}
              error={errors.phone}
              keyboardType="phone-pad"
            />
            <Field
              icon={Location}
              label="Address"
              value={form.address}
              onChange={(v) => set('address', v)}
              multiline
              isLast
            />
          </FormSection>

          <FormSection title="Emergency Contact">
            <Field
              icon={SecuritySafe}
              label="Contact Name"
              value={form.emergencyContactName}
              onChange={(v) => set('emergencyContactName', v)}
            />
            <Field
              icon={Call}
              label="Contact Phone"
              value={form.emergencyContact}
              onChange={(v) => set('emergencyContact', v)}
              keyboardType="phone-pad"
              isLast
            />
          </FormSection>

          <PrimaryButton
            title="Save Changes"
            variant="gradient"
            size="lg"
            fullWidth
            loading={saving}
            iconLeft={<TickCircle size={fs(20)} color="#fff" variant="Bold" />}
            onPress={save}
            style={{ marginTop: spacing.xl }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const FormSection = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Card padding="lg">{children}</Card>
  </View>
);

const Field = ({ icon: Icon, label, value, onChange, error, keyboardType, multiline, isLast }) => (
  <View style={[styles.field, !isLast && styles.fieldDivider]}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputWrap, error && styles.inputWrapError]}>
      {Icon ? <Icon size={fs(18)} color={colors.textTertiary} variant="Bold" /> : null}
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChange}
        keyboardType={keyboardType ?? 'default'}
        placeholderTextColor={colors.textTertiary}
        multiline={multiline}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatarWrap: { position: 'relative' },
  avatar: {
    width: wp(96), height: wp(96), borderRadius: wp(48),
    alignItems: 'center', justifyContent: 'center',
    ...shadows.brand,
  },
  avatarText: { color: '#fff', fontSize: fs(32), fontFamily: typography.fontFamily.bold },
  cameraBtn: {
    position: 'absolute', bottom: 0, right: 0,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
  },
  changePhoto: { color: colors.primary, fontSize: typography.size.sm, fontFamily: typography.fontFamily.semibold, marginTop: spacing.md },

  section: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
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
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semibold,
    marginBottom: spacing.sm - 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  inputWrapError: { borderColor: colors.danger },
  input: {
    flex: 1,
    fontSize: typography.size.md,
    color: colors.textPrimary,
    padding: 0,
  },
  inputMultiline: { minHeight: 60, textAlignVertical: 'top' },
  errorText: { color: colors.danger, fontSize: typography.size.xs, marginTop: 4 },
});
