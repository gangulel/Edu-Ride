import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp } from '../../utils/responsive';

const Icon = ({
    name,
    size = 'medium', // small, medium, large, xlarge
    color = '#007AFF',
    background,
    rounded = false,
    style,
}) => {
    const getSizeValue = () => {
        switch (size) {
            case 'small':
                return wp(16);
            case 'large':
                return wp(28);
            case 'xlarge':
                return wp(36);
            default:
                return wp(24);
        }
    };

    const getContainerSize = () => {
        const iconSize = getSizeValue();
        return iconSize * 1.8;
    };

    const sizeValue = getSizeValue();
    const containerSize = getContainerSize();

    if (background) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        width: containerSize,
                        height: containerSize,
                        borderRadius: rounded ? containerSize / 2 : responsive.radiusMD,
                        backgroundColor: background,
                    },
                    style,
                ]}
            >
                <Ionicons name={name} size={sizeValue} color={color} />
            </View>
        );
    }

    return <Ionicons name={name} size={sizeValue} color={color} style={style} />;
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Icon;
