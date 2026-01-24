import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp } from '../../utils/responsive';

const Avatar = ({
    source,
    name,
    size = 'medium', // small, medium, large, xlarge
    showBadge = false,
    badgeColor = '#34C759',
    verified = false,
    style,
}) => {
    const getSizeValue = () => {
        switch (size) {
            case 'small':
                return wp(32);
            case 'large':
                return wp(64);
            case 'xlarge':
                return wp(96);
            default:
                return wp(48);
        }
    };

    const getInitials = (name) => {
        if (!name) return '?';
        const names = name.trim().split(' ');
        if (names.length >= 2) {
            return `${names[0][0]}${names[1][0]}`.toUpperCase();
        }
        return name[0].toUpperCase();
    };

    const sizeValue = getSizeValue();
    const fontSize = sizeValue * 0.4;

    return (
        <View style={[{ position: 'relative' }, style]}>
            {source ? (
                <Image
                    source={typeof source === 'string' ? { uri: source } : source}
                    style={[
                        styles.avatar,
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
                        },
                    ]}
                >
                    {name ? (
                        <Text style={[styles.initials, { fontSize }]}>{getInitials(name)}</Text>
                    ) : (
                        <Ionicons name="person" size={sizeValue * 0.5} color="#007AFF" />
                    )}
                </View>
            )}

            {showBadge && (
                <View
                    style={[
                        styles.badge,
                        {
                            width: sizeValue * 0.3,
                            height: sizeValue * 0.3,
                            borderRadius: sizeValue * 0.15,
                            backgroundColor: badgeColor,
                            right: 0,
                            bottom: 0,
                        },
                    ]}
                />
            )}

            {verified && (
                <View
                    style={[
                        styles.verifiedBadge,
                        {
                            width: sizeValue * 0.35,
                            height: sizeValue * 0.35,
                            borderRadius: sizeValue * 0.175,
                            right: -2,
                            bottom: -2,
                        },
                    ]}
                >
                    <Ionicons name="checkmark-circle" size={sizeValue * 0.35} color="#007AFF" />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    avatar: {
        backgroundColor: '#E5E5EA',
    },
    placeholder: {
        backgroundColor: '#E3F2FD',
        alignItems: 'center',
        justifyContent: 'center',
    },
    initials: {
        color: '#007AFF',
        fontWeight: '600',
    },
    badge: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#fff',
    },
    verifiedBadge: {
        position: 'absolute',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Avatar;
