import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Card from '../atoms/Card';
import { responsive, wp } from '../../utils/responsive';

const StatCard = ({
    icon,
    iconColor = '#007AFF',
    iconBackground,
    value,
    label,
    trend,
    trendValue,
    onPress,
    style,
}) => {
    const getTrendColor = () => {
        if (!trend) return '#8E8E93';
        return trend === 'up' ? '#34C759' : trend === 'down' ? '#FF3B30' : '#8E8E93';
    };

    const getTrendIcon = () => {
        if (!trend) return null;
        return trend === 'up' ? 'arrow-up' : trend === 'down' ? 'arrow-down' : null;
    };

    return (
        <Card onPress={onPress} style={[styles.card, style]}>
            <View style={[styles.iconContainer, { backgroundColor: iconBackground || `${iconColor}15` }]}>
                <Ionicons name={icon} size={24} color={iconColor} />
            </View>

            <Text style={styles.value}>{value}</Text>
            <Text style={styles.label}>{label}</Text>

            {trend && trendValue && (
                <View style={styles.trendContainer}>
                    <Ionicons name={getTrendIcon()} size={12} color={getTrendColor()} />
                    <Text style={[styles.trendText, { color: getTrendColor() }]}>
                        {trendValue}
                    </Text>
                </View>
            )}
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        alignItems: 'center',
        padding: responsive.paddingLG,
        minWidth: wp(100),
    },
    iconContainer: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsive.paddingSM,
    },
    value: {
        fontSize: responsive.font2XL,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: responsive.paddingXS,
    },
    label: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        textAlign: 'center',
    },
    trendContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: responsive.paddingSM,
    },
    trendText: {
        fontSize: responsive.fontXS,
        fontWeight: '500',
        marginLeft: 2,
    },
});

export default StatCard;
