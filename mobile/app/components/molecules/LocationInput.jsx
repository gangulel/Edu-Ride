import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsive, hp } from '../../utils/responsive';

const LocationInput = ({
    label,
    placeholder = 'Enter location',
    value,
    onChangeText,
    onLocationPress,
    icon = 'location',
    iconColor = '#007AFF',
    error,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View style={[styles.inputContainer, error && styles.inputError]}>
                <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
                    <Ionicons name={icon} size={18} color={iconColor} />
                </View>

                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#C7C7CC"
                    value={value}
                    onChangeText={onChangeText}
                />

                {onLocationPress && (
                    <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
                        <Ionicons name="navigate" size={20} color="#007AFF" />
                    </TouchableOpacity>
                )}
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}
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
        paddingHorizontal: responsive.paddingMD,
        minHeight: hp(52),
        borderWidth: 1.5,
        borderColor: 'transparent',
    },
    inputError: {
        borderColor: '#FF3B30',
    },
    iconContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        fontSize: responsive.fontMD,
        color: '#000',
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingMD,
    },
    locationButton: {
        padding: responsive.paddingSM,
    },
    errorText: {
        fontSize: responsive.fontSM,
        color: '#FF3B30',
        marginTop: responsive.paddingXS,
    },
});

export default LocationInput;
