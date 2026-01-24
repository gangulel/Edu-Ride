import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { responsive } from '../../utils/responsive';

const Card = ({
    children,
    onPress,
    variant = 'default', // default, elevated, outlined
    padding = 'medium', // none, small, medium, large
    style,
    ...props
}) => {
    const getCardStyle = () => {
        const baseStyle = [styles.card];

        // Padding
        switch (padding) {
            case 'none':
                break;
            case 'small':
                baseStyle.push(styles.paddingSmall);
                break;
            case 'large':
                baseStyle.push(styles.paddingLarge);
                break;
            default:
                baseStyle.push(styles.paddingMedium);
        }

        // Variant
        switch (variant) {
            case 'elevated':
                baseStyle.push(styles.elevated);
                break;
            case 'outlined':
                baseStyle.push(styles.outlined);
                break;
            default:
                baseStyle.push(styles.default);
        }

        return baseStyle;
    };

    if (onPress) {
        return (
            <TouchableOpacity
                style={[...getCardStyle(), style]}
                onPress={onPress}
                activeOpacity={0.7}
                {...props}
            >
                {children}
            </TouchableOpacity>
        );
    }

    return (
        <View style={[...getCardStyle(), style]} {...props}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: responsive.radiusLG,
    },
    // Padding variants
    paddingSmall: {
        padding: responsive.paddingSM,
    },
    paddingMedium: {
        padding: responsive.paddingLG,
    },
    paddingLarge: {
        padding: responsive.paddingXL,
    },
    // Style variants
    default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    elevated: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    outlined: {
        borderWidth: 1,
        borderColor: '#E5E5EA',
    },
});

export default Card;
