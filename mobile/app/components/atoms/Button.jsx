import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { responsive, wp, hp } from '../../utils/responsive';

const Button = ({
    title,
    onPress,
    variant = 'primary', // primary, secondary, outline, ghost, danger
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
    const getButtonStyle = () => {
        const baseStyle = [styles.button, styles[`button_${size}`]];

        switch (variant) {
            case 'secondary':
                baseStyle.push(styles.buttonSecondary);
                break;
            case 'outline':
                baseStyle.push(styles.buttonOutline);
                break;
            case 'ghost':
                baseStyle.push(styles.buttonGhost);
                break;
            case 'danger':
                baseStyle.push(styles.buttonDanger);
                break;
            default:
                baseStyle.push(styles.buttonPrimary);
        }

        if (disabled) baseStyle.push(styles.buttonDisabled);
        if (fullWidth) baseStyle.push(styles.buttonFullWidth);

        return baseStyle;
    };

    const getTextStyle = () => {
        const baseStyle = [styles.text, styles[`text_${size}`]];

        switch (variant) {
            case 'outline':
            case 'ghost':
                baseStyle.push(styles.textPrimary);
                break;
            case 'secondary':
                baseStyle.push(styles.textDark);
                break;
            default:
                baseStyle.push(styles.textWhite);
        }

        if (disabled) baseStyle.push(styles.textDisabled);

        return baseStyle;
    };

    return (
        <TouchableOpacity
            style={[...getButtonStyle(), style]}
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.7}
            {...props}
        >
            {loading ? (
                <ActivityIndicator
                    color={variant === 'outline' || variant === 'ghost' ? '#007AFF' : '#fff'}
                    size="small"
                />
            ) : (
                <>
                    {icon && iconPosition === 'left' && icon}
                    <Text style={[...getTextStyle(), textStyle]}>{title}</Text>
                    {icon && iconPosition === 'right' && icon}
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: responsive.radiusMD,
        gap: responsive.paddingSM,
    },
    // Sizes
    button_small: {
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingSM,
        minHeight: hp(36),
    },
    button_medium: {
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingMD,
        minHeight: hp(48),
    },
    button_large: {
        paddingHorizontal: responsive.paddingXL,
        paddingVertical: responsive.paddingLG,
        minHeight: hp(56),
    },
    // Variants
    buttonPrimary: {
        backgroundColor: '#007AFF',
    },
    buttonSecondary: {
        backgroundColor: '#F2F2F7',
    },
    buttonOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#007AFF',
    },
    buttonGhost: {
        backgroundColor: 'transparent',
    },
    buttonDanger: {
        backgroundColor: '#FF3B30',
    },
    buttonDisabled: {
        backgroundColor: '#E5E5EA',
        opacity: 0.6,
    },
    buttonFullWidth: {
        width: '100%',
    },
    // Text
    text: {
        fontWeight: '600',
    },
    text_small: {
        fontSize: responsive.fontSM,
    },
    text_medium: {
        fontSize: responsive.fontMD,
    },
    text_large: {
        fontSize: responsive.fontLG,
    },
    textWhite: {
        color: '#fff',
    },
    textPrimary: {
        color: '#007AFF',
    },
    textDark: {
        color: '#000',
    },
    textDisabled: {
        color: '#8E8E93',
    },
});

export default Button;
