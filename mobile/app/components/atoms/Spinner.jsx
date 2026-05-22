import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Spinner = ({
    size = 'large', // small, large
    color,
    text,
    overlay = false,
    style,
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const indicatorColor = color || theme.colors.primary;

    const content = (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={size} color={indicatorColor} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );

    if (overlay) {
        return (
            <View style={styles.overlay}>
                <View style={styles.overlayContent}>{content}</View>
            </View>
        );
    }

    return content;
};

const useStyles = (theme) =>
    StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing.lg,
        },
        text: {
            marginTop: theme.spacing.md,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
            textAlign: 'center',
        },
        overlay: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: theme.colors.overlay,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
        },
        overlayContent: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            padding: theme.spacing.xl,
            minWidth: 140,
            ...theme.shadows.lg,
        },
    });

export default Spinner;
