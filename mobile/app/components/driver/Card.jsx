import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, radii, shadows } from '../../theme';

/**
 * Generic surface card. Use `tone="elevated"` for prominent containers,
 * `tone="muted"` for low-emphasis panels, and `tone="outlined"` for bordered
 * variants. `onPress` makes it a button.
 */
const Card = ({
  children,
  tone = 'default', // default | elevated | muted | outlined
  padding = 'md',   // none | sm | md | lg
  onPress,
  style,
  ...props
}) => {
  const Container = onPress ? TouchableOpacity : View;

  const padMap = {
    none: 0,
    sm: spacing.sm,
    md: spacing.lg,
    lg: spacing.xl,
  };

  const toneStyle =
    tone === 'elevated' ? styles.elevated :
    tone === 'muted' ? styles.muted :
    tone === 'outlined' ? styles.outlined :
    styles.default;

  return (
    <Container
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.base,
        toneStyle,
        { padding: padMap[padding] ?? padMap.md },
        style,
      ]}
      {...props}
    >
      {children}
    </Container>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
  },
  default: {
    ...shadows.sm,
  },
  elevated: {
    ...shadows.md,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export default Card;
