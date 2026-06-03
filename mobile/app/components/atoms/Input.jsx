import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Eye, EyeSlash } from 'iconsax-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { hp } from '../../utils/responsive';

const Input = ({
    label,
    placeholder,
    value,
    onChangeText,
    error,
    helperText,
    leftIcon,
    rightIcon,
    secureTextEntry = false,
    multiline = false,
    numberOfLines = 1,
    editable = true,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    style,
    inputStyle,
    ...props
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const [isFocused, setIsFocused] = useState(false);
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.inputFocused,
                    error && styles.inputError,
                    !editable && styles.inputDisabled,
                    multiline && styles.inputMultiline,
                ]}
            >
                {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon && styles.inputWithLeftIcon,
                        (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
                        multiline && styles.inputMultilineText,
                        inputStyle,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor={theme.colors.inputPlaceholder}
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={isSecure}
                    multiline={multiline}
                    numberOfLines={numberOfLines}
                    editable={editable}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    {...props}
                />

                {secureTextEntry && (
                    <TouchableOpacity
                        style={styles.rightIcon}
                        onPress={() => setIsSecure(!isSecure)}
                        activeOpacity={0.7}
                    >
                        {isSecure ? (
                            <Eye size={20} color={theme.colors.textMuted} variant="Outline" />
                        ) : (
                            <EyeSlash size={20} color={theme.colors.textMuted} variant="Outline" />
                        )}
                    </TouchableOpacity>
                )}

                {rightIcon && !secureTextEntry && <View style={styles.rightIcon}>{rightIcon}</View>}
            </View>

            {(error || helperText) && (
                <Text style={[styles.helperText, error && styles.errorText]}>{error || helperText}</Text>
            )}
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        container: {
            marginBottom: theme.spacing.md,
        },
        label: {
            fontFamily: theme.fontFamily.medium,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textPrimary,
            marginBottom: theme.spacing.sm,
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.inputBackground,
            borderRadius: theme.radius.lg,
            borderWidth: 1.5,
            borderColor: theme.colors.inputBorder,
            minHeight: hp(54),
        },
        inputFocused: {
            borderColor: theme.colors.inputBorderFocused,
            backgroundColor: theme.colors.surface,
        },
        inputError: {
            borderColor: theme.colors.danger,
        },
        inputDisabled: {
            backgroundColor: theme.colors.surfaceMuted,
            opacity: 0.6,
        },
        inputMultiline: {
            minHeight: hp(110),
            alignItems: 'flex-start',
            paddingVertical: theme.spacing.md,
        },
        input: {
            flex: 1,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.md,
            color: theme.colors.textPrimary,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
        },
        inputWithLeftIcon: {
            paddingLeft: theme.spacing.sm,
        },
        inputWithRightIcon: {
            paddingRight: theme.spacing.sm,
        },
        inputMultilineText: {
            textAlignVertical: 'top',
            paddingTop: 0,
        },
        leftIcon: {
            paddingLeft: theme.spacing.lg,
            justifyContent: 'center',
        },
        rightIcon: {
            paddingRight: theme.spacing.lg,
            paddingLeft: theme.spacing.xs,
            justifyContent: 'center',
        },
        helperText: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.xs,
            color: theme.colors.textMuted,
            marginTop: theme.spacing.xs,
            marginLeft: theme.spacing.xs,
        },
        errorText: {
            color: theme.colors.danger,
        },
    });

export default Input;
