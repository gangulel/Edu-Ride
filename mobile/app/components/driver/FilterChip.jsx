import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../../theme';

const FilterChip = ({
  label,
  count,
  active = false,
  onPress,
  variant = 'pill', // pill | tab
  style,
}) => {
  const isTab = variant === 'tab';

  return (
    <TouchableOpacity
      style={[
        isTab ? styles.tab : styles.pill,
        active && (isTab ? styles.tabActive : styles.pillActive),
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.label,
          active ? styles.labelActive : styles.labelInactive,
        ]}
        numberOfLines={1}
      >
        {label}
      </Text>
      {typeof count === 'number' ? (
        <View
          style={[
            styles.countWrap,
            active ? styles.countActive : styles.countInactive,
          ]}
        >
          <Text
            style={[
              styles.countText,
              active ? styles.countTextActive : styles.countTextInactive,
            ]}
          >
            {count}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  pillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.md,
    backgroundColor: colors.surfaceMuted,
    gap: spacing.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: typography.size.sm,
    fontFamily: typography.fontFamily.medium,
  },
  labelActive: { color: colors.onPrimary },
  labelInactive: { color: colors.textSecondary },
  countWrap: {
    minWidth: 20,
    paddingHorizontal: 6,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
  countInactive: { backgroundColor: colors.primarySurface },
  countText: {
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.bold,
  },
  countTextActive: { color: colors.onPrimary },
  countTextInactive: { color: colors.primary },
});

export default FilterChip;
