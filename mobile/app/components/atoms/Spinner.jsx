import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { responsive } from '../../utils/responsive';

const Spinner = ({
    size = 'medium', // small, medium, large
    color = '#007AFF',
    text,
    overlay = false,
    style,
}) => {
    const getSize = () => {
        switch (size) {
            case 'small':
                return 'small';
            case 'large':
                return 'large';
            default:
                return 'large';
        }
    };

    const content = (
        <View style={[styles.container, style]}>
            <ActivityIndicator size={getSize()} color={color} />
            {text && <Text style={styles.text}>{text}</Text>}
        </View>
    );

    if (overlay) {
        return (
            <View style={styles.overlay}>
                <View style={styles.overlayContent}>
                    {content}
                </View>
            </View>
        );
    }

    return content;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: responsive.paddingLG,
    },
    text: {
        marginTop: responsive.marginMD,
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        textAlign: 'center',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    overlayContent: {
        backgroundColor: '#fff',
        borderRadius: responsive.radiusLG,
        padding: responsive.paddingXL,
        minWidth: 120,
    },
});

export default Spinner;
