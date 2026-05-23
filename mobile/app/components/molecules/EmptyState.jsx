import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../atoms/Button';
import { useTheme } from '../../contexts/ThemeContext';
import { wp } from '../../utils/responsive';

const EmptyState = ({
    icon = 'folder-open-outline',
    iconElement,
    title = 'Nothing here yet',
    message,
    actionLabel,
    onAction,
    style,
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    return (
        <View style={[styles.container, style]}>
            <View style={styles.iconContainer}>
                {iconElement || <Ionicons name={icon} size={48} color={theme.colors.primary} />}
            </View>
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            {actionLabel && onAction && (
                <Button title={actionLabel} onPress={onAction} variant="primary" style={styles.button} />
            )}
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: theme.spacing['3xl'],
            paddingHorizontal: theme.spacing.xl,
        },
        iconContainer: {
            width: wp(96),
            height: wp(96),
            borderRadius: wp(48),
            backgroundColor: theme.colors.primarySoft,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.lg,
        },
        title: {
            fontFamily: theme.fontFamily.bold,
            fontSize: theme.fontSize.lg,
            color: theme.colors.textPrimary,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
        },
        message: {
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
            textAlign: 'center',
            lineHeight: theme.fontSize.sm * 1.5,
            marginBottom: theme.spacing.lg,
        },
        button: {
            marginTop: theme.spacing.sm,
            minWidth: wp(150),
        },
    });

export default EmptyState;
