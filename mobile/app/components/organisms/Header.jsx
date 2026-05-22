import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import {
    ArrowLeft,
    Notification,
    Add,
    Edit2,
    Setting2,
    More,
    SearchNormal1,
    TickSquare,
    Filter,
    Trash,
} from 'iconsax-react-native';
import Avatar from '../atoms/Avatar';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { hp, fs } from '../../utils/responsive';
import { getNotifications } from '../../../services/mock';

// Map shorthand icon names to iconsax components so callers can keep their
// existing Ionicon-style strings while we move the implementation off Ionicons.
const ICON_BY_NAME = {
    'add': Add,
    'add-circle-outline': Add,
    'add-outline': Add,
    'plus': Add,
    'edit': Edit2,
    'edit-2': Edit2,
    'pencil': Edit2,
    'settings': Setting2,
    'settings-outline': Setting2,
    'more': More,
    'more-horizontal': More,
    'search': SearchNormal1,
    'search-outline': SearchNormal1,
    'check': TickSquare,
    'checkmark': TickSquare,
    'checkmark-done-outline': TickSquare,
    'checkmark-done': TickSquare,
    'filter': Filter,
    'filter-outline': Filter,
    'trash': Trash,
    'trash-outline': Trash,
};

// Shared top header for parent screens.
//   • `title` + `showBack`           → simple title bar with back arrow
//   • `showProfile`                  → avatar + greeting (pulls user from AuthContext)
//   • `showNotification`             → bell with auto unread-count badge
//   • `rightAction` / `rightActionIcon` → optional right-side action button
const Header = ({
    title,
    subtitle,
    showBack = false,
    showNotification = false,
    showProfile = false,
    notificationCount, // optional override
    user: userProp,
    rightAction,
    rightActionIcon,
    onRightAction,
    transparent = false,
    style,
}) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const router = useRouter();
    const { user: authUser } = useAuth();
    const user = userProp || authUser;

    const [autoCount, setAutoCount] = useState(0);

    useEffect(() => {
        if (!showNotification || notificationCount != null) return;
        let cancelled = false;
        (async () => {
            try {
                const notifs = await getNotifications();
                if (!cancelled) setAutoCount(notifs.filter((n) => !n.read).length);
            } catch {
                // mock layer is offline-safe
            }
        })();
        return () => { cancelled = true; };
    }, [showNotification, notificationCount]);

    const badge = notificationCount != null ? notificationCount : autoCount;
    // Unknown icon name → null, so the text label renders instead of a random icon.
    const RightIcon = rightActionIcon ? ICON_BY_NAME[rightActionIcon] || null : null;

    return (
        <View style={[styles.container, transparent && styles.transparent, style]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.leftSection}>
                {showBack && (
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => router.back()}
                        activeOpacity={0.7}
                        accessibilityLabel="Go back"
                    >
                        <ArrowLeft size={20} color={theme.colors.textPrimary} variant="Linear" />
                    </TouchableOpacity>
                )}

                {showProfile && user && (
                    <TouchableOpacity
                        style={styles.profileSection}
                        onPress={() => router.push('/parent/profile')}
                        activeOpacity={0.7}
                    >
                        <Avatar
                            source={user.avatar}
                            name={user.name}
                            size="medium"
                            backgroundColor={theme.colors.primarySoft}
                        />
                        <View style={styles.greeting}>
                            <Text style={styles.greetingText}>Welcome back,</Text>
                            <Text style={styles.userName} numberOfLines={1}>
                                {user.name?.split(' ')[0] || 'Parent'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                )}

                {!showProfile && (title || subtitle) && (
                    <View style={styles.titleSection}>
                        {title && (
                            <Text style={styles.title} numberOfLines={1}>{title}</Text>
                        )}
                        {subtitle && (
                            <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
                        )}
                    </View>
                )}
            </View>

            <View style={styles.rightSection}>
                {showNotification && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={() => router.push('/parent/notifications')}
                        activeOpacity={0.7}
                        accessibilityLabel="Notifications"
                    >
                        <Notification size={22} color={theme.colors.textPrimary} variant="Outline" />
                        {badge > 0 && (
                            <View style={styles.notificationBadge}>
                                <Text style={styles.notificationCount}>
                                    {badge > 9 ? '9+' : badge}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                )}

                {rightAction && (
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={onRightAction}
                        activeOpacity={0.7}
                    >
                        {RightIcon ? (
                            <RightIcon size={22} color={theme.colors.primary} variant="Bold" />
                        ) : (
                            <Text style={styles.rightActionText}>{rightAction}</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.lg,
            paddingTop: hp(48),
            paddingBottom: theme.spacing.md,
            backgroundColor: theme.colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.divider,
        },
        transparent: {
            backgroundColor: 'transparent',
            borderBottomWidth: 0,
        },
        leftSection: {
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            gap: theme.spacing.sm,
        },
        backButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
        },
        profileSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.md,
            flex: 1,
        },
        greeting: {
            flex: 1,
        },
        greetingText: {
            fontFamily: theme.fontFamily.regular,
            fontSize: fs(12),
            color: theme.colors.textMuted,
        },
        userName: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(16),
            color: theme.colors.textPrimary,
            marginTop: 2,
        },
        titleSection: {
            flex: 1,
        },
        title: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(18),
            color: theme.colors.textPrimary,
        },
        subtitle: {
            fontFamily: theme.fontFamily.regular,
            fontSize: fs(12),
            color: theme.colors.textMuted,
            marginTop: 2,
        },
        rightSection: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.xs,
        },
        iconButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: theme.colors.surfaceMuted,
            alignItems: 'center',
            justifyContent: 'center',
        },
        notificationBadge: {
            position: 'absolute',
            top: 6,
            right: 6,
            minWidth: 16,
            height: 16,
            paddingHorizontal: 4,
            borderRadius: 8,
            backgroundColor: theme.colors.danger,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1.5,
            borderColor: theme.colors.surface,
        },
        notificationCount: {
            fontFamily: theme.fontFamily.bold,
            fontSize: 9,
            color: '#fff',
            lineHeight: 11,
        },
        rightActionText: {
            fontFamily: theme.fontFamily.bold,
            fontSize: fs(14),
            color: theme.colors.primary,
            paddingHorizontal: theme.spacing.sm,
        },
    });

export default Header;
