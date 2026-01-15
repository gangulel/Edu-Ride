import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

export const Avatar = ({ 
  source, 
  name, 
  size = 48, 
  verified = false,
  style 
}) => {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      {source ? (
        <Image source={source} style={[styles.image, { width: size, height: size }]} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <Text style={[styles.initials, { fontSize: size / 2.5 }]}>{initials}</Text>
        </View>
      )}
      {verified && (
        <View style={styles.verifiedBadge}>
          <Text style={styles.verifiedIcon}>✓</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    borderRadius: 100,
  },
  placeholder: {
    borderRadius: 100,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#ffffff',
    fontWeight: '600',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  verifiedIcon: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
