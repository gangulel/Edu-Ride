import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import { responsive, wp } from '../../utils/responsive';

const MessagePreview = ({
    conversation,
    onPress,
    style,
}) => {
    const {
        participant,
        lastMessage,
        timestamp,
        unreadCount = 0,
        isOnline = false,
    } = conversation;

    const formatTime = (timestamp) => {
        const now = new Date();
        const msgTime = new Date(timestamp);
        const diffMs = now - msgTime;
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffDays === 0) {
            return msgTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        }
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) {
            return msgTime.toLocaleDateString('en-US', { weekday: 'short' });
        }
        return msgTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Avatar
                source={participant?.photo}
                name={participant?.name}
                size="large"
                showBadge={isOnline}
                badgeColor="#34C759"
            />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={[styles.name, unreadCount > 0 && styles.nameUnread]} numberOfLines={1}>
                        {participant?.name}
                    </Text>
                    <Text style={styles.time}>{formatTime(timestamp)}</Text>
                </View>

                <View style={styles.previewRow}>
                    <Text
                        style={[styles.preview, unreadCount > 0 && styles.previewUnread]}
                        numberOfLines={2}
                    >
                        {lastMessage}
                    </Text>
                    {unreadCount > 0 && (
                        <Badge label={unreadCount > 99 ? '99+' : String(unreadCount)} variant="primary" size="small" />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: responsive.paddingLG,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    content: {
        flex: 1,
        marginLeft: responsive.paddingMD,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsive.paddingXS,
    },
    name: {
        fontSize: responsive.fontLG,
        fontWeight: '500',
        color: '#000',
        flex: 1,
        marginRight: responsive.paddingSM,
    },
    nameUnread: {
        fontWeight: '600',
    },
    time: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
    },
    previewRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    preview: {
        fontSize: responsive.fontMD,
        color: '#8E8E93',
        flex: 1,
        marginRight: responsive.paddingSM,
        lineHeight: responsive.fontMD * 1.4,
    },
    previewUnread: {
        color: '#000',
        fontWeight: '500',
    },
});

export default MessagePreview;
