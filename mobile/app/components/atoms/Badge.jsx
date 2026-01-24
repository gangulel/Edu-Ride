import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responsive, wp } from '../../utils/responsive';

const Badge = ({
    label,
    variant = 'primary', // primary, success, warning, danger, info, neutral
    size = 'medium', // small, medium, large
    dot = false,
    style,
    textStyle,
}) => {
    const getBadgeStyle = () => {
        const baseStyle = [styles.badge, styles[`badge_${size}`]];

        switch (variant) {
            case 'success':
                baseStyle.push(styles.badgeSuccess);
                break;
            case 'warning':
                baseStyle.push(styles.badgeWarning);
                break;
            case 'danger':
                baseStyle.push(styles.badgeDanger);
                break;
            case 'info':
                baseStyle.push(styles.badgeInfo);
                break;
            case 'neutral':
                baseStyle.push(styles.badgeNeutral);
                break;
            default:
                baseStyle.push(styles.badgePrimary);
        }

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [styles.text, styles[`text_${size}`]];

        if (variant === 'neutral') {
            baseStyle.push(styles.textDark);
        } else {
            baseStyle.push(styles.textWhite);
        }

        return baseStyle;
    };

    if (dot) {
        return (
            <View
                style={[
                    styles.dot,
                    variant === 'success' ? styles.dotSuccess :
                        variant === 'warning' ? styles.dotWarning :
                            variant === 'danger' ? styles.dotDanger : styles.dotPrimary,
                    style
                ]}
            />
        );
    }

    return (
        <View style={[...getBadgeStyle(), style]}>
            <Text style={[...getTextStyle(), textStyle]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        borderRadius: responsive.radiusFull,
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Sizes
    badge_small: {
        paddingHorizontal: responsive.paddingSM,
        paddingVertical: 2,
        minWidth: wp(20),
    },
    badge_medium: {
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingXS,
        minWidth: wp(28),
    },
    badge_large: {
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingSM,
        minWidth: wp(36),
    },
    // Variants
    badgePrimary: {
        backgroundColor: '#007AFF',
    },
    badgeSuccess: {
        backgroundColor: '#34C759',
    },
    badgeWarning: {
        backgroundColor: '#FF9500',
    },
    badgeDanger: {
        backgroundColor: '#FF3B30',
    },
    badgeInfo: {
        backgroundColor: '#5856D6',
    },
    badgeNeutral: {
        backgroundColor: '#F2F2F7',
    },
    // Text
    text: {
        fontWeight: '600',
        textAlign: 'center',
    },
    text_small: {
        fontSize: responsive.fontXS,
    },
    text_medium: {
        fontSize: responsive.fontSM,
    },
    text_large: {
        fontSize: responsive.fontMD,
    },
    textWhite: {
        color: '#fff',
    },
    textDark: {
        color: '#000',
    },
    // Dot variants
    dot: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
    },
    dotPrimary: {
        backgroundColor: '#007AFF',
    },
    dotSuccess: {
        backgroundColor: '#34C759',
    },
    dotWarning: {
        backgroundColor: '#FF9500',
    },
    dotDanger: {
        backgroundColor: '#FF3B30',
    },
});

export default Badge;
