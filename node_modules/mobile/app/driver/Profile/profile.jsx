import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Car,
  Card as CardIcon,
  DocumentText,
  Global,
  Information,
  Location,
  Lock1,
  LogoutCurve,
  Logout,
  Message,
  Notification as NotificationIcon,
  Profile as ProfileIcon,
  SecurityUser,
  Star1,
  Routing2,
  Sms,
  TickCircle,
  Award,
  Edit,
} from 'iconsax-react-native';

import ScreenContainer from '../../components/driver/ScreenContainer';
import Card from '../../components/driver/Card';
import MenuListItem from '../../components/driver/MenuListItem';
import Badge from '../../components/driver/Badge';
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
import { getDriverProfile } from '../../../services/mock/driver';

export default function DriverProfile() {
  const router = useRouter();
  const profile = useMemo(() => getDriverProfile(), []);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [locEnabled, setLocEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert('Log out?', 'You will need to sign in again to access your trips.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => router.replace('/onboarding'),
      },
    ]);
  };

  return (
    <ScreenContainer edges={['left', 'right']} statusBarStyle="light-content">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: spacing['3xl'] }}
      >
        {/* Hero */}
        <LinearGradient
          colors={gradients.headerHero}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroAvatarWrap}>
            <LinearGradient
              colors={['#fff', '#E0E7FF']}
              style={styles.heroAvatar}
            >
              <Text style={styles.heroAvatarText}>{profile.initials}</Text>
            </LinearGradient>
            <TouchableOpacity
              style={styles.editAvatar}
              activeOpacity={0.85}
              onPress={() => router.push('/driver/Profile/edit-profile')}
            >
              <Edit size={fs(14)} color="#fff" variant="Bold" />
            </TouchableOpacity>
            {profile.isVerified ? (
              <View style={styles.verifiedBadge}>
                <TickCircle size={fs(14)} color="#fff" variant="Bold" />
              </View>
            ) : null}
          </View>
          <Text style={styles.heroName}>{profile.fullName}</Text>
          <Text style={styles.heroEmail}>{profile.email}</Text>
          <View style={styles.heroBadges}>
            <Badge label={`${profile.yearsActive} yrs active`} tone="primary" variant="soft" style={{ backgroundColor: colors.onDark.surface }} />
            <Badge label="Verified driver" tone="success" variant="soft" style={{ backgroundColor: 'rgba(16,185,129,0.22)' }} />
          </View>

          <Card padding="lg" style={styles.statsCard} tone="elevated">
            <ProfileStat icon={Star1} label="Rating" value={String(profile.rating)} color={colors.warning} />
            <View style={styles.statsDivider} />
            <ProfileStat icon={Routing2} label="Trips" value={String(profile.totalTrips)} color={colors.primary} />
            <View style={styles.statsDivider} />
            <ProfileStat icon={Award} label="Acceptance" value={`${profile.acceptanceRate}%`} color={colors.success} />
          </Card>
        </LinearGradient>

        {/* Account */}
        <SectionGroup title="Account">
          <MenuListItem
            icon={ProfileIcon}
            iconColor={colors.primary}
            label="Edit Profile"
            description="Name, contact details, address"
            onPress={() => router.push('/driver/Profile/edit-profile')}
          />
          <MenuListItem
            icon={Car}
            iconColor={colors.success}
            label="Vehicle Information"
            description={`${profile.fullName ? '' : ''}Toyota HiAce • CAB-1234`}
            onPress={() => router.push('/driver/Profile/vehicle-info')}
          />
          <MenuListItem
            icon={DocumentText}
            iconColor={colors.warning}
            label="Documents"
            description="License, insurance, certificates"
            onPress={() => router.push('/driver/Profile/documents')}
          />
          <MenuListItem
            icon={CardIcon}
            iconColor={colors.info}
            label="Payment Methods"
            description="Bank, cards & wallets"
            divider={false}
            onPress={() => router.push('/driver/Profile/payment-methods')}
          />
        </SectionGroup>

        {/* Preferences */}
        <SectionGroup title="Preferences">
          <MenuListItem
            icon={NotificationIcon}
            iconColor={colors.danger}
            label="Push Notifications"
            description="Trip reminders & messages"
            showChevron={false}
            rightSlot={
              <Switch
                value={notifEnabled}
                onValueChange={setNotifEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          <MenuListItem
            icon={Location}
            iconColor={colors.primary}
            label="Location Services"
            description="Required to start trips"
            showChevron={false}
            rightSlot={
              <Switch
                value={locEnabled}
                onValueChange={setLocEnabled}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#fff"
              />
            }
          />
          <MenuListItem
            icon={Global}
            iconColor={colors.textSecondary}
            label="Language"
            value="English"
            divider={false}
          />
        </SectionGroup>

        {/* Support */}
        <SectionGroup title="Support">
          <MenuListItem
            icon={Message}
            iconColor={colors.primary}
            label="Help Center"
            description="FAQs & contact us"
          />
          <MenuListItem
            icon={SecurityUser}
            iconColor={colors.success}
            label="Safety Centre"
            description="Emergency contacts & tips"
          />
          <MenuListItem
            icon={Information}
            iconColor={colors.textSecondary}
            label="About Edu-Ride"
            divider={false}
          />
        </SectionGroup>

        {/* Legal */}
        <SectionGroup title="Legal">
          <MenuListItem
            icon={DocumentText}
            iconColor={colors.textSecondary}
            label="Terms of Service"
          />
          <MenuListItem
            icon={Lock1}
            iconColor={colors.textSecondary}
            label="Privacy Policy"
            divider={false}
          />
        </SectionGroup>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85} onPress={handleLogout}>
            <Logout size={fs(20)} color={colors.danger} variant="Bold" />
            <Text style={styles.logoutText}>Log Out</Text>
          </TouchableOpacity>
          <Text style={styles.version}>Version 1.0.0 • Phase 1 build</Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const SectionGroup = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <Card padding="none">{children}</Card>
  </View>
);

const ProfileStat = ({ icon: Icon, label, value, color }) => (
  <View style={styles.statItem}>
    <Icon size={fs(18)} color={color} variant="Bold" />
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  hero: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing['3xl'] + spacing.md,
    paddingBottom: spacing['3xl'],
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
    alignItems: 'center',
    ...shadows.brand,
  },
  heroAvatarWrap: { position: 'relative', marginBottom: spacing.md },
  heroAvatar: {
    width: wp(96),
    height: wp(96),
    borderRadius: wp(48),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  heroAvatarText: { fontSize: fs(32), color: colors.primary, fontFamily: typography.fontFamily.bold },
  editAvatar: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#fff',
  },
  verifiedBadge: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.success,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  heroName: { color: '#fff', fontSize: typography.size['2xl'], fontFamily: typography.fontFamily.bold },
  heroEmail: { color: colors.onDark.textMuted, fontSize: typography.size.sm, marginTop: 4 },
  heroBadges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },

  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: spacing.lg,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: typography.size.lg, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  statLabel: { fontSize: typography.size.xs, color: colors.textSecondary },
  statsDivider: { width: 1, height: 36, backgroundColor: colors.divider },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionTitle: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },

  logoutSection: { paddingHorizontal: spacing.lg, marginTop: spacing.xl, alignItems: 'center' },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.danger,
    width: '100%',
  },
  logoutText: { color: colors.danger, fontSize: typography.size.md, fontFamily: typography.fontFamily.bold },
  version: { fontSize: typography.size.xs, color: colors.textTertiary, marginTop: spacing.lg },
});
