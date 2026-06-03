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

import { useTranslation } from 'react-i18next';
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
import { useLanguage } from '../../../contexts/LanguageContext';
import { getDriverProfile } from '../../../services/mock/driver';

export default function DriverProfile() {
  const router = useRouter();
  const { t } = useTranslation();
  const { language, languages } = useLanguage();
  const profile = useMemo(() => getDriverProfile(), []);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [locEnabled, setLocEnabled] = useState(true);

  const currentLangLabel = languages.find((l) => l.code === language)?.nativeLabel || 'English';

  const handleLogout = () => {
    Alert.alert(
      t('driver.profile.logoutConfirmTitle'),
      t('driver.profile.logoutConfirmMessage'),
      [
        { text: t('driver.profile.cancel'), style: 'cancel' },
        {
          text: t('driver.profile.logOut'),
          style: 'destructive',
          onPress: () => router.replace('/onboarding'),
        },
      ]
    );
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
            <Badge
              label={t('driver.profile.yrsActive', { count: profile.yearsActive })}
              tone="primary"
              variant="soft"
              textColor="#fff"
              style={{ backgroundColor: 'rgba(255,255,255,0.22)' }}
            />
            <Badge
              label={t('driver.profile.verifiedDriver')}
              tone="success"
              variant="soft"
              textColor="#fff"
              style={{ backgroundColor: 'rgba(16,185,129,0.30)' }}
            />
          </View>

          <Card padding="lg" style={styles.statsCard} tone="elevated">
            <ProfileStat icon={Star1} label={t('driver.profile.rating')} value={String(profile.rating)} color={colors.warning} />
            <View style={styles.statsDivider} />
            <ProfileStat icon={Routing2} label={t('driver.profile.trips')} value={String(profile.totalTrips)} color={colors.primary} />
            <View style={styles.statsDivider} />
            <ProfileStat icon={Award} label={t('driver.profile.acceptance')} value={`${profile.acceptanceRate}%`} color={colors.success} />
          </Card>
        </LinearGradient>

        {/* Account */}
        <SectionGroup title={t('driver.profile.account')}>
          <MenuListItem
            icon={ProfileIcon}
            iconColor={colors.primary}
            label={t('driver.profile.editProfile')}
            description={t('driver.profile.editProfileDesc')}
            onPress={() => router.push('/driver/Profile/edit-profile')}
          />
          <MenuListItem
            icon={Car}
            iconColor={colors.success}
            label={t('driver.profile.vehicleInfo')}
            description="Toyota HiAce • CAB-1234"
            onPress={() => router.push('/driver/Profile/vehicle-info')}
          />
          <MenuListItem
            icon={DocumentText}
            iconColor={colors.warning}
            label={t('driver.profile.documents')}
            description={t('driver.profile.documentsDesc')}
            onPress={() => router.push('/driver/Profile/documents')}
          />
          <MenuListItem
            icon={CardIcon}
            iconColor={colors.info}
            label={t('driver.profile.paymentMethods')}
            description={t('driver.profile.paymentMethodsDesc')}
            divider={false}
            onPress={() => router.push('/driver/Profile/payment-methods')}
          />
        </SectionGroup>

        {/* Preferences */}
        <SectionGroup title={t('driver.profile.preferences')}>
          <MenuListItem
            icon={NotificationIcon}
            iconColor={colors.danger}
            label={t('driver.profile.pushNotifications')}
            description={t('driver.profile.pushNotificationsDesc')}
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
            label={t('driver.profile.locationServices')}
            description={t('driver.profile.locationServicesDesc')}
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
            label={t('driver.profile.language')}
            value={currentLangLabel}
            divider={false}
            onPress={() => router.push('/settings/language')}
          />
        </SectionGroup>

        {/* Support */}
        <SectionGroup title={t('driver.profile.support')}>
          <MenuListItem
            icon={Message}
            iconColor={colors.primary}
            label={t('driver.profile.helpCenter')}
            description={t('driver.profile.helpCenterDesc')}
          />
          <MenuListItem
            icon={SecurityUser}
            iconColor={colors.success}
            label={t('driver.profile.safetyCentre')}
            description={t('driver.profile.safetyCentreDesc')}
          />
          <MenuListItem
            icon={Information}
            iconColor={colors.textSecondary}
            label={t('driver.profile.aboutEduRide')}
            divider={false}
          />
        </SectionGroup>

        {/* Legal */}
        <SectionGroup title={t('driver.profile.legal')}>
          <MenuListItem
            icon={DocumentText}
            iconColor={colors.textSecondary}
            label={t('driver.profile.termsOfService')}
          />
          <MenuListItem
            icon={Lock1}
            iconColor={colors.textSecondary}
            label={t('driver.profile.privacyPolicy')}
            divider={false}
          />
        </SectionGroup>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.85} onPress={handleLogout}>
            <Logout size={fs(20)} color={colors.danger} variant="Bold" />
            <Text style={styles.logoutText}>{t('driver.profile.logOut')}</Text>
          </TouchableOpacity>
          <Text style={styles.version}>{t('driver.profile.version')}</Text>
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
  heroEmail: { color: colors.onDark.text, fontSize: typography.size.sm, marginTop: 4, opacity: 0.88 },
  heroBadges: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },

  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: spacing.lg,
  },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: typography.size.lg, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  statLabel: { fontSize: typography.size.xs, color: colors.textSecondary, fontFamily: typography.fontFamily.medium },
  statsDivider: { width: 1, height: 36, backgroundColor: colors.border },

  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionTitle: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
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
  version: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: spacing.lg },
});
