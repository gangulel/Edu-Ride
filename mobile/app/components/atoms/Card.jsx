import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Card = ({
    children,
    onPress,
    variant = 'default', // default, elevated, outlined, flat
    padding = 'medium', // none, small, medium, large
    style,
    activeOpacity = 0.85,
    ...props
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    const getCardStyle = () => {
        const base = [styles.card];
        switch (padding) {
            case 'none':
                break;
            case 'small':
                base.push(styles.paddingSmall);
                break;
            case 'large':
                base.push(styles.paddingLarge);
                break;
            default:
                base.push(styles.paddingMedium);
        }
        switch (variant) {
            case 'elevated':
                base.push(styles.elevated);
                break;
            case 'outlined':
                base.push(styles.outlined);
                break;
            case 'flat':
                base.push(styles.flat);
                break;
            default:
                base.push(styles.default);
        }
        return base;
    };

    if (onPress) {
        return (
            <TouchableOpacity
                style={[...getCardStyle(), style]}
                onPress={onPress}
                activeOpacity={activeOpacity}
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

const useStyles = (theme) =>
    StyleSheet.create({
        card: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
        },
        paddingSmall: {
            padding: theme.spacing.md,
        },
        paddingMedium: {
            padding: theme.spacing.lg,
        },
        paddingLarge: {
            padding: theme.spacing.xl,
        },
        default: {
            ...theme.shadows.sm,
        },
        elevated: {
            ...theme.shadows.md,
        },
        outlined: {
            borderWidth: 1,
            borderColor: theme.colors.border,
        },
        flat: {
            backgroundColor: theme.colors.surfaceMuted,
        },
    });

export default Card;
