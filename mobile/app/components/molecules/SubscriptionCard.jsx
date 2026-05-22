import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import Card from '../atoms/Card';
import { responsive, wp } from '../../utils/responsive';

const SubscriptionCard = ({
    subscription,
    onPress,
    onMessagePress,
    onViewSchedule,
    onMakePayment,
    style,
}) => {
    const {
        driver,
        vehicle,
        status = 'active', // active, pending, expired, paused
        expiryDate,
        nextPaymentDate,
        monthlyFee,
        child,
    } = subscription;

    const getStatusConfig = () => {
        switch (status) {
            case 'active':
                return { label: 'Active', variant: 'success' };
            case 'pending':
                return { label: 'Pending', variant: 'warning' };
            case 'expired':
                return { label: 'Expired', variant: 'danger' };
            case 'paused':
                return { label: 'Paused', variant: 'neutral' };
            default:
                return { label: status, variant: 'neutral' };
        }
    };

    const statusConfig = getStatusConfig();

    return (
        <Card onPress={onPress} style={[styles.card, style]}>
            {/* Header */}
            <View style={styles.header}>
                <Avatar source={driver?.photo} name={driver?.name} size="large" verified={driver?.verified} />
                <View style={styles.headerInfo}>
                    <View style={styles.nameRow}>
                        <Text style={styles.driverName} numberOfLines={1}>{driver?.name}</Text>
                        <Badge label={statusConfig.label} variant={statusConfig.variant} size="small" />
                    </View>
                    <Text style={styles.vehicleInfo}>
                        {vehicle?.make} {vehicle?.model} • {vehicle?.licensePlate}
                    </Text>
                    {child && (
                        <Text style={styles.childInfo}>For: {child.name}</Text>
                    )}
                </View>
            </View>

            {/* Status Info */}
            <View style={styles.statusSection}>
                <View style={styles.statusItem}>
                    <Ionicons name="calendar" size={18} color="#8E8E93" />
                    <View style={styles.statusTextContainer}>
                        <Text style={styles.statusLabel}>Subscription Period</Text>
                        <Text style={styles.statusValue}>{expiryDate}</Text>
                    </View>
                </View>
                {nextPaymentDate && (
                    <View style={styles.statusItem}>
                        <Ionicons name="card" size={18} color="#8E8E93" />
                        <View style={styles.statusTextContainer}>
                            <Text style={styles.statusLabel}>Next Payment</Text>
                            <Text style={styles.statusValue}>{nextPaymentDate}</Text>
                        </View>
                    </View>
                )}
            </View>

            {/* Quick Actions */}
            <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={onMessagePress}>
                    <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Message</Text>
                </TouchableOpacity>
                <View style={styles.actionDivider} />
                <TouchableOpacity style={styles.actionButton} onPress={onViewSchedule}>
                    <Ionicons name="time-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Schedule</Text>
                </TouchableOpacity>
                <View style={styles.actionDivider} />
                <TouchableOpacity style={styles.actionButton} onPress={onMakePayment}>
                    <Ionicons name="wallet-outline" size={20} color="#007AFF" />
                    <Text style={styles.actionText}>Pay</Text>
                </TouchableOpacity>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginBottom: responsive.paddingMD,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.paddingMD,
    },
    headerInfo: {
        flex: 1,
        marginLeft: responsive.paddingMD,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    driverName: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
        flex: 1,
        marginRight: responsive.paddingSM,
    },
    vehicleInfo: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: responsive.paddingXS,
    },
    childInfo: {
        fontSize: responsive.fontSM,
        color: '#007AFF',
        marginTop: responsive.paddingXS,
    },
    statusSection: {
        backgroundColor: '#F9F9FB',
        borderRadius: responsive.radiusMD,
        padding: responsive.paddingMD,
        marginBottom: responsive.paddingMD,
    },
    statusItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.paddingSM,
    },
    statusTextContainer: {
        marginLeft: responsive.paddingSM,
    },
    statusLabel: {
        fontSize: responsive.fontXS,
        color: '#8E8E93',
    },
    statusValue: {
        fontSize: responsive.fontMD,
        fontWeight: '500',
        color: '#000',
    },
    actions: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        paddingTop: responsive.paddingMD,
        marginTop: responsive.paddingXS,
    },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: responsive.paddingSM,
    },
    actionText: {
        fontSize: responsive.fontMD,
        color: '#007AFF',
        fontWeight: '500',
    },
    actionDivider: {
        width: 1,
        height: '100%',
        backgroundColor: '#E5E5EA',
    },
});

export default SubscriptionCard;
