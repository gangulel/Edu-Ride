import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const Badge = ({ 
  children, 
  variant = 'default', 
  icon, 
  style 
}) => {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      {icon && <Ionicons name={icon} size={12} color={styles[`${variant}Text`].color} style={styles.icon} />}
      <Text style={[styles.text, styles[`${variant}Text`]]}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  default: {
    backgroundColor: '#e5e7eb',
  },
  success: {
    backgroundColor: '#d1fae5',
  },
  warning: {
    backgroundColor: '#fef3c7',
  },
  danger: {
    backgroundColor: '#fee2e2',
  },
  info: {
    backgroundColor: '#dbeafe',
  },
  icon: {
    marginRight: 4,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
  defaultText: {
    color: '#374151',
  },
  successText: {
    color: '#065f46',
  },
  warningText: {
    color: '#92400e',
  },
  dangerText: {
    color: '#991b1b',
  },
  infoText: {
    color: '#1e40af',
  },
});
