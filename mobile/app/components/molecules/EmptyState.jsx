import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../atoms/Button';
import { responsive, wp } from '../../utils/responsive';

const EmptyState = ({
    icon = 'folder-open-outline',
    title = 'No data found',
    message,
    actionLabel,
    onAction,
    style,
}) => {
    return (
        <View style={[styles.container, style]}>
            <View style={styles.iconContainer}>
                <Ionicons name={icon} size={64} color="#C7C7CC" />
            </View>

            <Text style={styles.title}>{title}</Text>

            {message && (
                <Text style={styles.message}>{message}</Text>
            )}

            {actionLabel && onAction && (
                <Button
                    title={actionLabel}
                    onPress={onAction}
                    variant="primary"
                    style={styles.button}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: responsive.padding2XL,
        paddingHorizontal: responsive.paddingXL,
    },
    iconContainer: {
        marginBottom: responsive.paddingLG,
    },
    title: {
        fontSize: responsive.fontXL,
        fontWeight: '600',
        color: '#000',
        textAlign: 'center',
        marginBottom: responsive.paddingSM,
    },
    message: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: responsive.fontMD * 1.5,
        marginBottom: responsive.paddingLG,
    },
    button: {
        marginTop: responsive.paddingSM,
        minWidth: wp(150),
    },
});

export default EmptyState;
