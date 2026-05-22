import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp, hp } from '../../utils/responsive';

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
                {leftIcon && (
                    <View style={styles.leftIcon}>
                        {typeof leftIcon === 'string' ? (
                            <Ionicons name={leftIcon} size={20} color="#8E8E93" />
                        ) : (
                            leftIcon
                        )}
                    </View>
                )}

                <TextInput
                    style={[
                        styles.input,
                        leftIcon && styles.inputWithLeftIcon,
                        (rightIcon || secureTextEntry) && styles.inputWithRightIcon,
                        multiline && styles.inputMultilineText,
                        inputStyle,
                    ]}
                    placeholder={placeholder}
                    placeholderTextColor="#C7C7CC"
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
                    >
                        <Ionicons
                            name={isSecure ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color="#8E8E93"
                        />
                    </TouchableOpacity>
                )}

                {rightIcon && !secureTextEntry && (
                    <View style={styles.rightIcon}>
                        {typeof rightIcon === 'string' ? (
                            <Ionicons name={rightIcon} size={20} color="#8E8E93" />
                        ) : (
                            rightIcon
                        )}
                    </View>
                )}
            </View>

            {(error || helperText) && (
                <Text style={[styles.helperText, error && styles.errorText]}>
                    {error || helperText}
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: responsive.paddingMD,
    },
    label: {
        fontSize: responsive.fontMD,
        fontWeight: '600',
        color: '#000',
        marginBottom: responsive.paddingSM,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: responsive.radiusMD,
        borderWidth: 1.5,
        borderColor: 'transparent',
        minHeight: hp(52),
    },
    inputFocused: {
        borderColor: '#007AFF',
        backgroundColor: '#fff',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    inputDisabled: {
        backgroundColor: '#E5E5EA',
        opacity: 0.6,
    },
    inputMultiline: {
        minHeight: hp(100),
        alignItems: 'flex-start',
        paddingVertical: responsive.paddingMD,
    },
    input: {
        flex: 1,
        fontSize: responsive.fontMD,
        color: '#000',
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingMD,
    },
    inputWithLeftIcon: {
        paddingLeft: responsive.paddingSM,
    },
    inputWithRightIcon: {
        paddingRight: responsive.paddingSM,
    },
    inputMultilineText: {
        textAlignVertical: 'top',
        paddingTop: 0,
    },
    leftIcon: {
        paddingLeft: responsive.paddingMD,
    },
    rightIcon: {
        paddingRight: responsive.paddingMD,
    },
    helperText: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: responsive.paddingXS,
    },
    errorText: {
        color: '#FF3B30',
    },
});

export default Input;
