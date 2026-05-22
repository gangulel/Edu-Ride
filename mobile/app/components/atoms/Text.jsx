import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { responsive } from '../../utils/responsive';

const Text = ({
    children,
    variant = 'body', // heading, subheading, body, caption, label
    weight = 'regular', // regular, medium, semibold, bold
    color = '#000',
    align = 'left',
    numberOfLines,
    style,
    ...props
}) => {
    const getVariantStyle = () => {
        switch (variant) {
            case 'heading':
                return styles.heading;
            case 'subheading':
                return styles.subheading;
            case 'caption':
                return styles.caption;
            case 'label':
                return styles.label;
            default:
                return styles.body;
        }
    };

    const getWeightStyle = () => {
        switch (weight) {
            case 'medium':
                return styles.medium;
            case 'semibold':
                return styles.semibold;
            case 'bold':
                return styles.bold;
            default:
                return styles.regular;
        }
    };

    return (
        <RNText
            style={[
                getVariantStyle(),
                getWeightStyle(),
                { color, textAlign: align },
                style,
            ]}
            numberOfLines={numberOfLines}
            {...props}
        >
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    // Variants
    heading: {
        fontSize: responsive.font2XL,
        lineHeight: responsive.font2XL * 1.3,
    },
    subheading: {
        fontSize: responsive.fontXL,
        lineHeight: responsive.fontXL * 1.3,
    },
    body: {
        fontSize: responsive.fontMD,
        lineHeight: responsive.fontMD * 1.5,
    },
    caption: {
        fontSize: responsive.fontSM,
        lineHeight: responsive.fontSM * 1.4,
    },
    label: {
        fontSize: responsive.fontXS,
        lineHeight: responsive.fontXS * 1.4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Weights
    regular: {
        fontWeight: '400',
    },
    medium: {
        fontWeight: '500',
    },
    semibold: {
        fontWeight: '600',
    },
    bold: {
        fontWeight: '700',
    },
});

export default Text;
