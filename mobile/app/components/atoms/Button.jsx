import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { hp } from '../../utils/responsive';

const Button = ({
    title,
    onPress,
    variant = 'primary', // primary, gradient, secondary, outline, ghost, danger, success
    size = 'medium', // small, medium, large
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    style,
    textStyle,
    ...props
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    const getButtonStyle = () => {
        const base = [styles.button, styles[`button_${size}`]];
        switch (variant) {
            case 'gradient':
                base.push(styles.buttonGradientWrap);
                break;
            case 'secondary':
                base.push(styles.buttonSecondary);
                break;
            case 'outline':
                base.push(styles.buttonOutline);
                break;
            case 'ghost':
                base.push(styles.buttonGhost);
                break;
            case 'danger':
                base.push(styles.buttonDanger);
                break;
            case 'success':
                base.push(styles.buttonSuccess);
                break;
            default:
                base.push(styles.buttonPrimary);
        }
        if (disabled) base.push(styles.buttonDisabled);
        if (fullWidth) base.push(styles.buttonFullWidth);
        return base;
    };

    const getTextColor = () => {
        if (disabled) return theme.colors.textMuted;
        if (variant === 'outline' || variant === 'ghost') return theme.colors.primary;
        if (variant === 'secondary') return theme.colors.textPrimary;
        return theme.colors.textOnPrimary;
    };

    const renderContent = () => {
        if (loading) {
            return (
                <ActivityIndicator
                    color={
                        variant === 'outline' || variant === 'ghost'
                            ? theme.colors.primary
                            : theme.colors.textOnPrimary
                    }
                    size="small"
                />
            );
        }
        return (
            <>
                {icon && iconPosition === 'left' && <View style={styles.iconWrap}>{icon}</View>}
                <Text style={[styles.text, styles[`text_${size}`], { color: getTextColor() }, textStyle]}>
                    {title}
                </Text>
                {icon && iconPosition === 'right' && <View style={styles.iconWrap}>{icon}</View>}
            </>
        );
    };

    if (variant === 'gradient') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                activeOpacity={0.85}
                style={[styles.buttonGradientWrap, fullWidth && styles.buttonFullWidth, disabled && styles.buttonDisabled, style]}
                {...props}
            >
                <LinearGradient
                    colors={disabled ? [theme.colors.borderStrong, theme.colors.borderStrong] : theme.colors.primaryGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.button, styles[`button_${size}`], styles.buttonGradient]}
                >
                    {renderContent()}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            style={[...getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.85}
            {...props}
        >
            {renderContent()}
        </TouchableOpacity>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.radius.lg,
            gap: theme.spacing.sm,
        },
        buttonGradient: {
            // gradient already provides bg
        },
        buttonGradientWrap: {
            borderRadius: theme.radius.lg,
            overflow: 'hidden',
            ...theme.shadows.primarySm,
        },
        button_small: {
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.sm,
            minHeight: hp(38),
            borderRadius: theme.radius.md,
        },
        button_medium: {
            paddingHorizontal: theme.spacing['2xl'],
            paddingVertical: theme.spacing.md,
            minHeight: hp(50),
        },
        button_large: {
            paddingHorizontal: theme.spacing['3xl'],
            paddingVertical: theme.spacing.lg,
            minHeight: hp(58),
        },
        buttonPrimary: {
            backgroundColor: theme.colors.primary,
            ...theme.shadows.primarySm,
        },
        buttonSecondary: {
            backgroundColor: theme.colors.surfaceMuted,
        },
        buttonOutline: {
            backgroundColor: 'transparent',
            borderWidth: 1.5,
            borderColor: theme.colors.primary,
        },
        buttonGhost: {
            backgroundColor: 'transparent',
        },
        buttonDanger: {
            backgroundColor: theme.colors.danger,
        },
        buttonSuccess: {
            backgroundColor: theme.colors.success,
        },
        buttonDisabled: {
            backgroundColor: theme.colors.surfaceMuted,
            opacity: 0.7,
            shadowOpacity: 0,
            elevation: 0,
        },
        buttonFullWidth: {
            width: '100%',
        },
        text: {
            fontFamily: theme.fontFamily.medium,
            letterSpacing: 0.2,
        },
        text_small: {
            fontSize: theme.fontSize.sm,
        },
        text_medium: {
            fontSize: theme.fontSize.md,
        },
        text_large: {
            fontSize: theme.fontSize.lg,
        },
        iconWrap: {
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

export default Button;
