import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Divider = ({
    text,
    orientation = 'horizontal',
    color,
    thickness = 1,
    spacing = 'medium', // none, small, medium, large
    style,
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const dividerColor = color || theme.colors.divider;

    const spacingValue = (() => {
        switch (spacing) {
            case 'none': return 0;
            case 'small': return theme.spacing.sm;
            case 'large': return theme.spacing.xl;
            default: return theme.spacing.md;
        }
    })();

    if (orientation === 'vertical') {
        return (
            <View
                style={[
                    styles.vertical,
                    { backgroundColor: dividerColor, width: thickness, marginHorizontal: spacingValue },
                    style,
                ]}
            />
        );
    }

    if (text) {
        return (
            <View style={[styles.withText, { marginVertical: spacingValue }, style]}>
                <View style={[styles.line, { backgroundColor: dividerColor, height: thickness }]} />
                <Text style={styles.text}>{text}</Text>
                <View style={[styles.line, { backgroundColor: dividerColor, height: thickness }]} />
            </View>
        );
    }

    return (
        <View
            style={[
                styles.horizontal,
                { backgroundColor: dividerColor, height: thickness, marginVertical: spacingValue },
                style,
            ]}
        />
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        horizontal: { width: '100%' },
        vertical: { height: '100%' },
        withText: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        line: { flex: 1 },
        text: {
            paddingHorizontal: theme.spacing.lg,
            fontFamily: theme.fontFamily.regular,
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
        },
    });

export default Divider;
