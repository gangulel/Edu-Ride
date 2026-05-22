import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import { responsive, wp } from '../../utils/responsive';

const NotificationItem = ({
    notification,
    onPress,
    style,
}) => {
    const {
        type = 'info', // info, success, warning, danger, payment, message
        title,
        message,
        time,
        read = false,
        avatar,
        actionLabel,
    } = notification;

    const getIconConfig = () => {
        switch (type) {
            case 'success':
                return { name: 'checkmark-circle', color: '#34C759', bg: '#E8F8ED' };
            case 'warning':
                return { name: 'warning', color: '#FF9500', bg: '#FFF4E5' };
            case 'danger':
                return { name: 'alert-circle', color: '#FF3B30', bg: '#FFE9E8' };
            case 'payment':
                return { name: 'card', color: '#007AFF', bg: '#E3F2FD' };
            case 'message':
                return { name: 'chatbubble', color: '#5856D6', bg: '#F0EFFF' };
            default:
                return { name: 'information-circle', color: '#007AFF', bg: '#E3F2FD' };
        }
    };

    const iconConfig = getIconConfig();

    const formatTime = (timestamp) => {
        const now = new Date();
        const notificationTime = new Date(timestamp);
        const diffMs = now - notificationTime;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return notificationTime.toLocaleDateString();
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                !read && styles.unread,
                style,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {!read && <View style={styles.unreadDot} />}

            {avatar ? (
                <Avatar source={avatar} size="medium" />
            ) : (
                <View style={[styles.iconContainer, { backgroundColor: iconConfig.bg }]}>
                    <Ionicons name={iconConfig.name} size={24} color={iconConfig.color} />
                </View>
            )}

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.title, !read && styles.titleUnread]} numberOfLines={1}>
                        {title}
                    </Text>
                    <Text style={styles.time}>{formatTime(time)}</Text>
                </View>
                <Text style={styles.message} numberOfLines={2}>
                    {message}
                </Text>
                {actionLabel && (
                    <Text style={styles.actionLabel}>{actionLabel}</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: responsive.paddingLG,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    unread: {
        backgroundColor: '#F9FAFC',
    },
    unreadDot: {
        position: 'absolute',
        left: responsive.paddingSM,
        top: responsive.paddingLG + wp(16),
        width: wp(8),
        height: wp(8),
        borderRadius: wp(4),
        backgroundColor: '#007AFF',
    },
    iconContainer: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        marginLeft: responsive.paddingMD,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: responsive.paddingXS,
    },
    title: {
        fontSize: responsive.fontMD,
        fontWeight: '500',
        color: '#000',
        flex: 1,
        marginRight: responsive.paddingSM,
    },
    titleUnread: {
        fontWeight: '600',
    },
    time: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
    },
    message: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        lineHeight: responsive.fontMD * 1.4,
    },
    actionLabel: {
        fontSize: responsive.fontMD,
        color: '#007AFF',
        fontWeight: '500',
        marginTop: responsive.paddingSM,
    },
});

export default NotificationItem;
