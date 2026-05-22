import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { wp } from '../../utils/responsive';

// Light wrapper around Ionicons for screens that want consistent sizing and
// an optional pill background. Screens are also free to import iconsax-react-native
// directly for richer iconography — both libraries coexist in the project.
const Icon = ({
    name,
    size = 'medium', // small, medium, large, xlarge or a numeric pixel size
    color,
    background,
    rounded = true,
    style,
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    const sizeValue = (() => {
        if (typeof size === 'number') return size;
        switch (size) {
            case 'small': return wp(16);
            case 'large': return wp(28);
            case 'xlarge': return wp(36);
            default: return wp(22);
        }
    })();

    const iconColor = color || theme.colors.primary;
    const containerSize = sizeValue * 1.9;

    if (background) {
        return (
            <View
                style={[
                    styles.container,
                    {
                        width: containerSize,
                        height: containerSize,
                        borderRadius: rounded ? containerSize / 2 : theme.radius.md,
                        backgroundColor: background,
                    },
                    style,
                ]}
            >
                <Ionicons name={name} size={sizeValue} color={iconColor} />
            </View>
        );
    }

    return <Ionicons name={name} size={sizeValue} color={iconColor} style={style} />;
};

const useStyles = () =>
    StyleSheet.create({
        container: {
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

export default Icon;
