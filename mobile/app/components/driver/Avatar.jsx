import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, typography } from '../../theme';

const TONE_GRADIENTS = {
  blue: ['#3B82F6', '#1D4ED8'],
  emerald: ['#10B981', '#047857'],
  amber: ['#F59E0B', '#B45309'],
  rose: ['#F87171', '#B91C1C'],
  violet: ['#8B5CF6', '#6D28D9'],
  cyan: ['#06B6D4', '#0E7490'],
  slate: ['#64748B', '#1E293B'],
};

const Avatar = ({
  initials,
  name,
  tone = 'blue',
  size = 48,
  online = false,
  border = false,
  style,
}) => {
  const gradient = TONE_GRADIENTS[tone] ?? TONE_GRADIENTS.blue;
  const computedInitials = initials ?? getInitials(name);
  const dim = { width: size, height: size, borderRadius: size / 2 };
  const onlineDim = { width: size * 0.28, height: size * 0.28, borderRadius: size * 0.14 };

  return (
    <View style={[{ width: size, height: size }, style]}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, dim, border && styles.border]}
      >
        <Text
          style={[
            styles.text,
            { fontSize: Math.max(12, size * 0.36) },
          ]}
        >
          {computedInitials}
        </Text>
      </LinearGradient>
      {online ? (
        <View
          style={[
            styles.onlineDot,
            onlineDim,
            { right: 0, bottom: 0 },
          ]}
        />
      ) : null}
    </View>
  );
};

function getInitials(name = '') {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

const styles = StyleSheet.create({
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  border: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  text: {
    color: '#fff',
    fontFamily: typography.fontFamily.bold,
    letterSpacing: 0.5,
  },
  onlineDot: {
    position: 'absolute',
    backgroundColor: colors.success,
    borderWidth: 2,
    borderColor: '#fff',
  },
});

export default Avatar;
