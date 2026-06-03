import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Badge = ({
    label,
    variant = 'primary', // primary, success, warning, danger, info, neutral, accent
    tone = 'solid', // solid, soft
    size = 'medium', // small, medium, large
    dot = false,
    icon,
    style,
    textStyle,
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    const colorFor = (key) => {
        const c = theme.colors;
        switch (key) {
            case 'success': return { bg: c.success, soft: c.successSoft, text: c.success, solidText: c.textOnPrimary };
            case 'warning': return { bg: c.warning, soft: c.warningSoft, text: c.warningDark, solidText: c.textOnPrimary };
            case 'danger':  return { bg: c.danger, soft: c.dangerSoft, text: c.danger, solidText: c.textOnPrimary };
            case 'info':    return { bg: c.info, soft: c.infoSoft, text: c.info, solidText: c.textOnPrimary };
            case 'accent':  return { bg: c.accent, soft: c.accentSoft, text: c.accent, solidText: c.textOnPrimary };
            case 'neutral': return { bg: c.surfaceMuted, soft: c.surfaceMuted, text: c.textSecondary, solidText: c.textPrimary };
            default:        return { bg: c.primary, soft: c.primarySoft, text: c.primary, solidText: c.textOnPrimary };
        }
    };

    const palette = colorFor(variant);

    if (dot) {
        return (
            <View
                style={[
                    styles.dot,
                    styles[`dot_${size}`],
                    { backgroundColor: palette.bg },
                    style,
                ]}
            />
        );
    }

    const bg = tone === 'soft' ? palette.soft : palette.bg;
    const color = tone === 'soft' ? palette.text : palette.solidText;

    return (
        <View style={[styles.badge, styles[`badge_${size}`], { backgroundColor: bg }, style]}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.text, styles[`text_${size}`], { color }, textStyle]}>{label}</Text>
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        badge: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.radius.pill,
            gap: 4,
        },
        badge_small: {
            paddingHorizontal: theme.spacing.sm,
            paddingVertical: 2,
        },
        badge_medium: {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
        },
        badge_large: {
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.sm,
        },
        text: {
            fontFamily: theme.fontFamily.medium,
            textAlign: 'center',
        },
        text_small: {
            fontSize: theme.fontSize.xs,
        },
        text_medium: {
            fontSize: theme.fontSize.xs,
        },
        text_large: {
            fontSize: theme.fontSize.sm,
        },
        iconWrap: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        dot: {
            borderRadius: 999,
        },
        dot_small: { width: 6, height: 6 },
        dot_medium: { width: 8, height: 8 },
        dot_large: { width: 10, height: 10 },
    });

export default Badge;
