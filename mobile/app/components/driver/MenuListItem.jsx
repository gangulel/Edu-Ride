import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';
import { colors, typography, spacing, radii, fs } from '../../theme';

/**
 * Row item for menu/settings lists.
 * Supports leading icon (Iconsax component), label, optional value/right
 * slot (badge, switch, chevron), and an onPress handler.
 */
const MenuListItem = ({
  icon: IconCmp,
  iconColor = colors.primary,
  iconTone, // background colour; defaults to a tinted version of iconColor
  label,
  description,
  value,
  rightSlot,
  showChevron = true,
  onPress,
  divider = true,
  style,
}) => {
  const Container = onPress ? TouchableOpacity : View;
  const tone = iconTone ?? hexAlpha(iconColor, 0.12);

  return (
    <Container
      style={[styles.row, divider && styles.withDivider, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      {IconCmp ? (
        <View style={[styles.iconWrap, { backgroundColor: tone }]}>
          <IconCmp size={fs(20)} color={iconColor} variant="Bold" />
        </View>
      ) : null}

      <View style={styles.body}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>

      {rightSlot ? (
        <View style={styles.rightSlot}>{rightSlot}</View>
      ) : value ? (
        <Text style={styles.value}>{value}</Text>
      ) : null}

      {showChevron && !rightSlot ? (
        <ArrowRight2 size={fs(18)} color={colors.textTertiary} variant="Linear" />
      ) : null}
    </Container>
  );
};

// Add transparency to a hex color for icon tinting. Falls back to the
// theme primary surface if parsing fails.
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.md,
  },
  withDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { flex: 1 },
  label: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.medium,
  },
  description: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  value: {
    fontSize: typography.size.sm,
    color: colors.textSecondary,
    fontFamily: typography.fontFamily.medium,
  },
  rightSlot: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});

export default MenuListItem;
