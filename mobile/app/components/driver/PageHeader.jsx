import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft2 } from 'iconsax-react-native';
import { colors, typography, spacing, wp, fs } from '../../theme';

/**
 * Subtle white-on-light header for detail screens (Active Trip, Booking
 * Requests, Profile sub-pages, etc.). Lower visual weight than HeroHeader.
 */
const PageHeader = ({
  title,
  subtitle,
  onBack,
  rightSlot,
  bare = false,
  style,
}) => {
  return (
    <View style={[styles.wrap, bare && styles.bare, style]}>
      <StatusBar barStyle="dark-content" translucent={Platform.OS === 'android'} />
      <SafeAreaView edges={['top']}>
        <View style={styles.row}>
          {onBack ? (
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onBack}
              activeOpacity={0.8}
              hitSlop={8}
            >
              <ArrowLeft2 size={fs(22)} color={colors.textPrimary} variant="Linear" />
            </TouchableOpacity>
          ) : (
            <View style={styles.backBtn} />
          )}

          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
          </View>

          <View style={styles.rightSlot}>{rightSlot}</View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  bare: {
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  backBtn: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: { flex: 1 },
  title: {
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bold,
  },
  subtitle: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  rightSlot: {
    minWidth: wp(40),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default PageHeader;
