import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { wp } from '../../utils/responsive';

const RatingStars = ({
    rating = 0,
    maxRating = 5,
    size = 'medium', // small, medium, large
    interactive = false,
    onRatingChange,
    color,
    showEmpty = true,
    style,
}) => {
    const theme = useTheme();

    const sizeValue = (() => {
        switch (size) {
            case 'small': return wp(14);
            case 'large': return wp(28);
            default: return wp(20);
        }
    })();

    const filledColor = color || theme.colors.warning;
    const emptyColor = theme.colors.borderStrong;

    const handlePress = (index) => {
        if (interactive && onRatingChange) onRatingChange(index + 1);
    };

    const renderStar = (index) => {
        const isFilled = index < Math.floor(rating);
        const isHalf = index === Math.floor(rating) && rating % 1 >= 0.5;
        const iconName = isFilled ? 'star' : isHalf ? 'star-half' : showEmpty ? 'star-outline' : null;
        if (!iconName) return null;

        const star = (
            <Ionicons
                name={iconName}
                size={sizeValue}
                color={isFilled || isHalf ? filledColor : emptyColor}
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
