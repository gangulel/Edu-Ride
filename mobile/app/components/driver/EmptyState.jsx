import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Box1 } from 'iconsax-react-native';
import { colors, typography, spacing, radii } from '../../theme';
import PrimaryButton from './PrimaryButton';

const EmptyState = ({
  icon: IconCmp = Box1,
  title,
  description,
  actionLabel,
  onAction,
  tone = colors.primary,
  style,
}) => {
  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.iconWrap, { backgroundColor: hexAlpha(tone, 0.12) }]}>
        <IconCmp size={36} color={tone} variant="Bulk" />
      </View>
      <Text style={styles.title}>{title}</Text>
      {description ? <Text style={styles.description}>{description}</Text> : null}
      {actionLabel ? (
        <PrimaryButton
          title={actionLabel}
          onPress={onAction}
          style={styles.action}
        />
      ) : null}
    </View>
  );
};

function hexAlpha(hex, alpha) {
  if (!hex || typeof hex !== 'string' || !hex.startsWith('#')) return colors.primarySurface;
  const clean = hex.replace('#', '');
  if (clean.length !== 6) return colors.primarySurface;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing['3xl'],
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.size.xl,
    fontFamily: typography.fontFamily.bold,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    lineHeight: typography.size.sm * 1.5,
  },
  action: {
    marginTop: spacing.lg,
    minWidth: 200,
  },
});

export default EmptyState;
