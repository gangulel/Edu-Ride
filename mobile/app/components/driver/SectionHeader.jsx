import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowRight2 } from 'iconsax-react-native';
import { colors, typography, spacing, fs } from '../../theme';

const SectionHeader = ({ title, action, onActionPress, hideChevron = false, style }) => {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={onActionPress}
          activeOpacity={0.7}
          hitSlop={8}
        >
          <Text style={styles.actionText}>{action}</Text>
          {hideChevron ? null : <ArrowRight2 size={fs(14)} color={colors.primary} variant="Linear" />}
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: typography.size.lg,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.bold,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    fontSize: typography.size.sm,
    color: colors.primary,
    fontFamily: typography.fontFamily.medium,
  },
});

export default SectionHeader;
