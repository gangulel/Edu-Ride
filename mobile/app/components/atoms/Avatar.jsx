import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { User, TickCircle } from 'iconsax-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { wp } from '../../utils/responsive';

const Avatar = ({
    source,
    name,
    initials: initialsProp,
    size = 'medium', // small, medium, large, xlarge
    showBadge = false,
    badgeColor,
    verified = false,
    backgroundColor,
    style,
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);

    const sizeValue = (() => {
        switch (size) {
            case 'small': return wp(32);
            case 'large': return wp(64);
            case 'xlarge': return wp(96);
            default: return wp(48);
        }
    })();

    const fontSize = sizeValue * 0.38;

    const computeInitials = () => {
        if (initialsProp) return initialsProp.slice(0, 2).toUpperCase();
        if (!name) return '?';
        const parts = name.trim().split(/\s+/);
        if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
        return name[0].toUpperCase();
    };

    return (
        <View style={[{ position: 'relative' }, style]}>
            {source ? (
                <Image
                    source={typeof source === 'string' ? { uri: source } : source}
                    style={[
                        styles.image,
                        {
                            width: sizeValue,
                            height: sizeValue,
                            borderRadius: sizeValue / 2,
                        },
                    ]}
                />
            ) : (
                <View
                    style={[
                        styles.placeholder,
                        {
                            width: sizeValue,
                            height: sizeValue,
                            borderRadius: sizeValue / 2,
                            backgroundColor: backgroundColor || theme.colors.primarySoft,
                        },
                    ]}
                >
                    {name || initialsProp ? (
                        <Text style={[styles.initials, { fontSize, color: theme.colors.primary }]}>
                            {computeInitials()}
                        </Text>
                    ) : (
                        <User size={sizeValue * 0.5} color={theme.colors.primary} variant="Bold" />
                    )}
                </View>
            )}

            {showBadge && (
                <View
                    style={[
                        styles.statusBadge,
                        {
                            width: sizeValue * 0.28,
                            height: sizeValue * 0.28,
                            borderRadius: sizeValue * 0.14,
                            backgroundColor: badgeColor || theme.colors.success,
                        },
                    ]}
                />
            )}

            {verified && (
                <View
                    style={[
                        styles.verifiedWrap,
                        { right: -2, bottom: -2 },
                    ]}
                >
                    <TickCircle
                        size={sizeValue * 0.36}
                        color={theme.colors.primary}
                        variant="Bold"
                    />
                </View>
            )}
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        image: {
            backgroundColor: theme.colors.surfaceMuted,
        },
        placeholder: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        initials: {
            fontFamily: theme.fontFamily.bold,
        },
        statusBadge: {
            position: 'absolute',
            right: 0,
            bottom: 0,
            borderWidth: 2,
            borderColor: theme.colors.surface,
        },
        verifiedWrap: {
            position: 'absolute',
            backgroundColor: theme.colors.surface,
            borderRadius: 999,
        },
    });

export default Avatar;
