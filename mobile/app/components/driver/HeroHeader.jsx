import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Notification, ArrowLeft2 } from 'iconsax-react-native';
import { colors, gradients, typography, spacing, radii, shadows, wp, hp, fs } from '../../theme';

/**
 * Blue gradient hero header used by the Driver Home and any other screen
 * that wants the same visual identity. Renders an optional greeting,
 * notification button, avatar, and a slot for stat chips below.
 */
const HeroHeader = ({
  greeting,
  title,
  subtitle,
  initials,
  avatarColors = gradients.avatar,
  gradient = gradients.headerHero,
  showBack = false,
  onBack,
  onNotification,
  onAvatarPress,
  notificationCount = 0,
  rightSlot,
  children,
  style,
}) => {
  return (
    <View style={[styles.wrapper, style]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <StatusBar barStyle="light-content" translucent={Platform.OS === 'android'} />
        <SafeAreaView edges={['top']}>
          <View style={styles.row}>
            <View style={styles.left}>
              {showBack ? (
                <TouchableOpacity
                  style={styles.backBtn}
                  onPress={onBack}
                  activeOpacity={0.8}
                  hitSlop={8}
                >
                  <ArrowLeft2 size={fs(22)} color={colors.onDark.text} variant="Linear" />
                </TouchableOpacity>
              ) : null}
              <View style={styles.titleBlock}>
                {greeting ? <Text style={styles.greeting}>{greeting}</Text> : null}
                {title ? <Text style={styles.title}>{title}</Text> : null}
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
              </View>
            </View>

            <View style={styles.actions}>
              {rightSlot}
              {onNotification ? (
                <TouchableOpacity
                  style={styles.iconBtn}
                  onPress={onNotification}
                  activeOpacity={0.85}
                  hitSlop={8}
                >
                  <Notification size={fs(22)} color={colors.onDark.text} variant="Linear" />
                  {notificationCount > 0 ? (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </Text>
                    </View>
                  ) : null}
                </TouchableOpacity>
              ) : null}
              {initials ? (
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={onAvatarPress}
                  hitSlop={8}
                >
                  <LinearGradient
                    colors={avatarColors}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatar}
                  >
                    <Text style={styles.avatarText}>{initials}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>

          {children ? <View style={styles.childrenWrap}>{children}</View> : null}
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    ...shadows.md,
  },
  gradient: {
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radii.xl,
    borderBottomRightRadius: radii.xl,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.sm,
  },
  titleBlock: { flexShrink: 1 },
  greeting: {
    fontSize: typography.size.sm,
    color: colors.onDark.textMuted,
    fontFamily: typography.fontFamily.regular,
  },
  title: {
    fontSize: typography.size['2xl'],
    color: colors.onDark.text,
    fontFamily: typography.fontFamily.bold,
    marginTop: 2,
  },
  subtitle: {
    fontSize: typography.size.sm,
    color: colors.onDark.textMuted,
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconBtn: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    backgroundColor: colors.onDark.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: colors.onDark.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: wp(44),
    height: wp(44),
    borderRadius: wp(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.size.md,
    color: colors.primary,
    fontFamily: typography.fontFamily.bold,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontFamily: typography.fontFamily.bold,
  },
  childrenWrap: {
    marginTop: spacing.lg,
  },
});

export default HeroHeader;
