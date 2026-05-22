import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp } from '../../utils/responsive';

const RatingStars = ({
    rating = 0,
    maxRating = 5,
    size = 'medium', // small, medium, large
    interactive = false,
    onRatingChange,
    color = '#FF9500',
    showEmpty = true,
    style,
}) => {
    const getSizeValue = () => {
        switch (size) {
            case 'small':
                return wp(16);
            case 'large':
                return wp(32);
            default:
                return wp(24);
        }
    };

    const sizeValue = getSizeValue();

    const handlePress = (index) => {
        if (interactive && onRatingChange) {
            onRatingChange(index + 1);
        }
    };

    const renderStar = (index) => {
        const isFilled = index < Math.floor(rating);
        const isHalfFilled = index === Math.floor(rating) && rating % 1 >= 0.5;

        const iconName = isFilled
            ? 'star'
            : isHalfFilled
                ? 'star-half'
                : showEmpty
                    ? 'star-outline'
                    : null;

        if (!iconName) return null;

        const star = (
            <Ionicons
                name={iconName}
                size={sizeValue}
                color={isFilled || isHalfFilled ? color : '#E5E5EA'}
            />
        );

        if (interactive) {
            return (
                <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(index)}
                    activeOpacity={0.7}
                    style={styles.starButton}
                >
                    {star}
                </TouchableOpacity>
            );
        }

        return (
            <View key={index} style={styles.star}>
                {star}
            </View>
        );
    };

    return (
        <View style={[styles.container, style]}>
            {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    star: {
        marginRight: 2,
    },
    starButton: {
        marginRight: 4,
        padding: 2,
    },
});

export default RatingStars;
