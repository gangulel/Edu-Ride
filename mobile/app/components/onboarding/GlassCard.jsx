import React from 'react';
import { View, StyleSheet } from 'react-native';
import { radii } from '../../theme';

/**
 * Glassmorphism card. React Native has no backdrop-filter, so we fake it
 * with a high-opacity white surface, a soft inner ring, and a layered
 * shadow that matches the prototype's `.er-glass` look.
 */
const GlassCard = ({ style, children, padding = 12 }) => {
  return (
    <View style={[styles.base, { padding }, style]}>{children}</View>
  );
};

const styles = StyleSheet.create({
  base: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 6,
  },
});

export default GlassCard;
