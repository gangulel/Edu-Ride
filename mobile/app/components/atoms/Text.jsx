import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

const Text = ({
    children,
    variant = 'body', // display, h1, h2, h3, bodyLg, body, bodySm, label, caption, button
    weight, // overrides variant weight: regular, medium, bold
    color, // theme key or hex
    align = 'left',
    numberOfLines,
    style,
    ...props
}) => {
    const theme = useTheme();

    const resolveVariant = () => {
        const variantStyle = theme.textStyles[variant] || theme.textStyles.body;
        return variantStyle;
    };

    const resolveWeight = () => {
        if (!weight) return null;
        return { fontFamily: theme.fontFamily[weight] || theme.fontFamily.regular };
    };

    const resolveColor = () => {
        if (!color) return { color: theme.colors.textPrimary };
        if (color.startsWith && color.startsWith('#')) return { color };
        return { color: theme.colors[color] || theme.colors.textPrimary };
    };

    return (
        <RNText
            style={[
                resolveVariant(),
                resolveWeight(),
                resolveColor(),
                { textAlign: align },
                style,
            ]}
            numberOfLines={numberOfLines}
            {...props}
        >
            {children}
        </RNText>
    );
};

export default Text;
