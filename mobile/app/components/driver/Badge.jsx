import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, radii } from '../../theme';

const TONES = {
  primary: { bg: colors.primarySurface, fg: colors.primary },
  success: { bg: colors.successSurface, fg: colors.successDark },
  warning: { bg: colors.warningSurface, fg: colors.warningDark },
  danger: { bg: colors.dangerSurface, fg: colors.dangerDark },
  info: { bg: colors.infoSurface, fg: colors.infoDark },
  neutral: { bg: colors.surfaceMuted, fg: colors.textSecondary },
  emerald: { bg: colors.successSurface, fg: colors.successDark },
};

const SOLID = {
  primary: { bg: colors.primary, fg: colors.onPrimary },
  success: { bg: colors.success, fg: colors.onPrimary },
  warning: { bg: colors.warning, fg: colors.onPrimary },
  danger: { bg: colors.danger, fg: colors.onPrimary },
  info: { bg: colors.info, fg: colors.onPrimary },
  neutral: { bg: colors.palette.slate[200], fg: colors.textPrimary },
};

const Badge = ({
  label,
  tone = 'primary',
  variant = 'soft', // soft | solid
  size = 'sm',     // xs | sm | md
  dotColor,
  style,
}) => {
  const palette = variant === 'solid' ? SOLID[tone] ?? SOLID.primary : TONES[tone] ?? TONES.primary;

  const sizeStyle =
    size === 'xs' ? styles.xs : size === 'md' ? styles.md : styles.sm;

  return (
    <View style={[styles.base, sizeStyle, { backgroundColor: palette.bg }, style]}>
      {dotColor ? <View style={[styles.dot, { backgroundColor: dotColor }]} /> : null}
      <Text
        style={[
          styles.text,
          size === 'xs' && { fontSize: 10 },
          size === 'md' && { fontSize: typography.size.sm },
          { color: palette.fg },
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radii.full,
    alignSelf: 'flex-start',
    gap: 4,
  },
  xs: { paddingHorizontal: 6, paddingVertical: 2 },
  sm: { paddingHorizontal: spacing.sm + 2, paddingVertical: 4 },
  md: { paddingHorizontal: spacing.md, paddingVertical: 6 },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.size.xs,
    letterSpacing: 0.2,
  },
});

export default Badge;
