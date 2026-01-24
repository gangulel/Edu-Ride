import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { responsive } from '../../utils/responsive';

const Divider = ({
    text,
    orientation = 'horizontal', // horizontal, vertical
    color = '#E5E5EA',
    thickness = 1,
    spacing = 'medium', // none, small, medium, large
    style,
}) => {
    const getSpacing = () => {
        switch (spacing) {
            case 'none':
                return 0;
            case 'small':
                return responsive.marginSM;
            case 'large':
                return responsive.marginXL;
            default:
                return responsive.marginMD;
        }
    };

    const spacingValue = getSpacing();

    if (orientation === 'vertical') {
        return (
            <View
                style={[
                    styles.vertical,
                    {
                        backgroundColor: color,
                        width: thickness,
                        marginHorizontal: spacingValue,
                    },
                    style,
                ]}
            />
        );
    }

    if (text) {
        return (
            <View
                style={[
                    styles.withText,
                    { marginVertical: spacingValue },
                    style,
                ]}
            >
                <View style={[styles.line, { backgroundColor: color, height: thickness }]} />
                <Text style={styles.text}>{text}</Text>
                <View style={[styles.line, { backgroundColor: color, height: thickness }]} />
            </View>
        );
    }

    return (
        <View
            style={[
                styles.horizontal,
                {
                    backgroundColor: color,
                    height: thickness,
                    marginVertical: spacingValue,
                },
                style,
            ]}
        />
    );
};

const styles = StyleSheet.create({
    horizontal: {
        width: '100%',
    },
    vertical: {
        height: '100%',
    },
    withText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    line: {
        flex: 1,
    },
    text: {
        paddingHorizontal: responsive.paddingMD,
        fontSize: responsive.fontSM,
        color: '#8E8E93',
    },
});

export default Divider;
