import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const Rating = ({ rating = 0, count, size = 16, showCount = true, style }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stars}>
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            return <Ionicons key={index} name="star" size={size} color="#fbbf24" />;
          } else if (index === fullStars && hasHalfStar) {
            return <Ionicons key={index} name="star-half" size={size} color="#fbbf24" />;
          } else {
            return <Ionicons key={index} name="star-outline" size={size} color="#d1d5db" />;
          }
        })}
      </View>
      {showCount && (
        <Text style={styles.rating}>
          {rating.toFixed(1)}{count ? ` (${count})` : ''}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 6,
  },
  rating: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});
