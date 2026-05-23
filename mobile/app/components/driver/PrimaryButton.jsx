import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, gradients, typography, spacing, radii, shadows } from '../../theme';

/**
 * Theme-aware button with five variants:
 *  - primary   solid blue
 *  - gradient  branded blue gradient (default)
 *  - success   emerald
 *  - danger    rose
 *  - outline   blue border on white
 *  - ghost     transparent
 *  - dark      slate (for on-gradient placement)
 */
const PrimaryButton = ({
  title,
  onPress,
  variant = 'gradient',
  size = 'md',
  iconLeft,
  iconRight,
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const sizeStyles = SIZE[size] ?? SIZE.md;

  const content = (
    <>
      {iconLeft ? <View style={styles.iconWrap}>{iconLeft}</View> : null}
      {loading ? (
        <ActivityIndicator color={getTextColor(variant)} size="small" />
      ) : (
        <Text
          style={[
            styles.label,
            { color: getTextColor(variant), fontSize: sizeStyles.fontSize },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
      {iconRight ? <View style={styles.iconWrap}>{iconRight}</View> : null}
    </>
  );

  const containerBase = [
    styles.base,
    { paddingHorizontal: sizeStyles.padX, paddingVertical: sizeStyles.padY, minHeight: sizeStyles.minHeight },
    fullWidth && styles.fullWidth,
    disabled && styles.disabled,
    style,
  ];

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        activeOpacity={0.85}
        disabled={disabled || loading}
        onPress={onPress}
        style={[...containerBase, styles.gradientShadow]}
      >
        <LinearGradient
          colors={gradients.brand}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { paddingHorizontal: sizeStyles.padX, paddingVertical: sizeStyles.padY }]}
        >
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[...containerBase, getVariantStyle(variant)]}
    >
      {content}
    </TouchableOpacity>
  );
};

const SIZE = {
  sm: { padX: spacing.md, padY: spacing.sm, fontSize: typography.size.sm, minHeight: 36 },
  md: { padX: spacing.lg, padY: spacing.md, fontSize: typography.size.md, minHeight: 48 },
  lg: { padX: spacing.xl, padY: spacing.lg - 2, fontSize: typography.size.lg, minHeight: 56 },
};

function getTextColor(variant) {
  switch (variant) {
    case 'outline':
    case 'ghost':
      return colors.primary;
    case 'success':
    case 'danger':
    case 'gradient':
    case 'primary':
    case 'dark':
      return colors.onPrimary;
    default:
      return colors.textPrimary;
  }
}

function getVariantStyle(variant) {
  switch (variant) {
    case 'primary':
      return { backgroundColor: colors.primary };
    case 'success':
      return { backgroundColor: colors.success };
    case 'danger':
      return { backgroundColor: colors.danger };
    case 'outline':
      return {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: colors.primary,
      };
    case 'ghost':
      return { backgroundColor: 'transparent' };
    case 'dark':
      return { backgroundColor: colors.palette.slate[800] };
    default:
      return { backgroundColor: colors.primary };
  }
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.md,
    gap: spacing.sm,
    overflow: 'hidden',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    width: '100%',
    height: '100%',
  },
  gradientShadow: {
    padding: 0,
    ...shadows.brand,
  },
  fullWidth: { width: '100%' },
  disabled: { opacity: 0.5 },
  label: {
    fontFamily: typography.fontFamily.bold,
  },
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
});

export default PrimaryButton;
