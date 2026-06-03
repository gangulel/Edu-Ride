import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii, shadows } from '../../theme';

/**
 * Compact stat tile (icon + value + label).
 * `tone="onDark"` flips colors so it reads inside a gradient header.
 */
const StatTile = ({
  icon: IconCmp,
  iconColor,
  iconBg,
  value,
  label,
  tone = 'default', // default | onDark
  variant = 'card', // card | flat | inline
  style,
}) => {
  const onDark = tone === 'onDark';

  const containerStyle = [
    styles.base,
    variant === 'card' && styles.card,
    variant === 'flat' && styles.flat,
    variant === 'inline' && styles.inline,
    onDark && styles.onDark,
    style,
  ];

  return (
    <View style={containerStyle}>
      {IconCmp ? (
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: iconBg ?? (onDark ? colors.onDark.surface : colors.primarySurface) },
          ]}
        >
          <IconCmp
            size={20}
            color={iconColor ?? (onDark ? colors.onDark.text : colors.primary)}
            variant="Bold"
          />
        </View>
      ) : null}
      <Text style={[styles.value, onDark && styles.valueOnDark]}>{value}</Text>
      <Text style={[styles.label, onDark && styles.labelOnDark]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    minWidth: 96,
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  card: {
    flex: 1,
    backgroundColor: colors.surface,
    alignItems: 'flex-start',
    ...shadows.sm,
  },
  flat: {
    flex: 1,
    alignItems: 'flex-start',
  },
  inline: {
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.onDark.surface,
  },
  onDark: {
    backgroundColor: colors.onDark.surface,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  value: {
    fontSize: typography.size.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
  },
  valueOnDark: { color: colors.onDark.text },
  label: {
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.regular,
    color: colors.textSecondary,
    marginTop: 2,
  },
  labelOnDark: { color: colors.onDark.textMuted },
});

export default StatTile;
