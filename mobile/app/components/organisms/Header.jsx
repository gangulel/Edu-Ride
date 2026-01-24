import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Avatar from '../atoms/Avatar';
import Badge from '../atoms/Badge';
import { responsive, wp, hp } from '../../utils/responsive';

const Header = ({
    title,
    subtitle,
    showBack = false,
    showNotification = false,
    showProfile = false,
    notificationCount = 0,
    user,
    rightAction,
    rightActionIcon,
    onRightAction,
    transparent = false,
    style,
}) => {
    const router = useRouter();

    return (
        <View style={[styles.container, transparent && styles.transparent, style]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.leftSection}>
                {showBack && (
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                )}

                {showProfile && user && (
                    <TouchableOpacity style={styles.profileSection} onPress={() => router.push('/parent/profile')}>
                        <Avatar source={user.photo} name={user.name} size="medium" />
                        <View style={styles.greeting}>
                            <Text style={styles.greetingText}>Welcome back,</Text>
                            <Text style={styles.userName}>{user.name?.split(' ')[0] || 'Parent'}</Text>
                        </View>
                    </TouchableOpacity>
                )}

                {!showProfile && (title || subtitle) && (
                    <View style={styles.titleSection}>
                        {title && <Text style={styles.title}>{title}</Text>}
                        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                    </View>
                )}
            </View>

            <View style={styles.rightSection}>
                {showNotification && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push('/parent/notifications')}
                    >
                        <Ionicons name="notifications-outline" size={24} color="#000" />
                        {notificationCount > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationCount}>
                                    {notificationCount > 9 ? '9+' : notificationCount}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}

                {rightAction && (
                    <TouchableOpacity style={styles.iconButton} onPress={onRightAction}>
                        {rightActionIcon ? (
                            <Ionicons name={rightActionIcon} size={24} color="#007AFF" />
                        ) : (
                            <Text style={styles.rightActionText}>{rightAction}</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingMD,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    transparent: {
        backgroundColor: 'transparent',
        borderBottomWidth: 0,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    backButton: {
        padding: responsive.paddingSM,
        marginRight: responsive.paddingSM,
        marginLeft: -responsive.paddingSM,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    greeting: {
        marginLeft: responsive.paddingMD,
    },
    greetingText: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
    },
    userName: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
    },
    titleSection: {
        flex: 1,
    },
    title: {
        fontSize: responsive.fontXL,
        fontWeight: 'bold',
        color: '#000',
    },
    subtitle: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        marginTop: 2,
    },
    rightSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        padding: responsive.paddingSM,
        marginLeft: responsive.paddingSM,
    },
    notificationBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        backgroundColor: '#FF3B30',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 4,
    },
    notificationCount: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    rightActionText: {
        fontSize: responsive.fontMD,
        fontWeight: '600',
        color: '#007AFF',
    },
});

export default Header;
