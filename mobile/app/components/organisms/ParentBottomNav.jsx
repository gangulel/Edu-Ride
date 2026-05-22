import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import {
    Bus,
    SearchNormal1,
    Calendar,
    Message,
    Profile,
} from 'iconsax-react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { hp, fs } from '../../utils/responsive';
import { getConversations, getNotifications } from '../../../services/mock';

const TABS = [
    { key: 'home', label: 'Home', icon: Bus, route: '/parent', matches: ['/parent', '/parent/index'] },
    { key: 'search', label: 'Search', icon: SearchNormal1, route: '/parent/search' },
    { key: 'bookings', label: 'Bookings', icon: Calendar, route: '/parent/my-bookings' },
    { key: 'messages', label: 'Messages', icon: Message, route: '/parent/messages' },
    { key: 'profile', label: 'Profile', icon: Profile, route: '/parent/profile' },
];

// Single source of truth for the parent bottom nav. Drop into any tab-style
// parent screen and it picks up the active route automatically.
const ParentBottomNav = ({ badges, activeOverride }) => {
    const theme = useTheme();
    const styles = useStyles(theme);
    const router = useRouter();
    const pathname = usePathname();
    const { user } = useAuth();

    // Auto-load unread counts so screens don't each need to plumb them through.
    const [autoBadges, setAutoBadges] = useState({ messages: 0 });

    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            try {
                const [convos, notifs] = await Promise.all([
                    getConversations(user?.id || 'u-parent-1'),
                    getNotifications(),
                ]);
                if (cancelled) return;
                setAutoBadges({
                    messages: convos.reduce((acc, c) => acc + (c.unreadCount || 0), 0),
                    notifications: notifs.filter((n) => !n.read).length,
                });
            } catch {
                // Mock layer is offline-safe, but guard just in case.
            }
        };
        load();
        return () => { cancelled = true; };
    }, [user?.id]);

    const mergedBadges = { ...autoBadges, ...(badges || {}) };

    const isActive = (tab) => {
        if (activeOverride) return activeOverride === tab.key;
        if (tab.matches) return tab.matches.includes(pathname);
        return pathname === tab.route || pathname.startsWith(`${tab.route}/`);
    };

    return (
        <View style={styles.container}>
            {TABS.map((tab) => {
                const active = isActive(tab);
                const TabIcon = tab.icon;
                const count = mergedBadges[tab.key] || 0;
                return (
                    <TouchableOpacity
                        key={tab.key}
                        style={styles.tab}
                        onPress={() => {
                            if (active) return;
                            router.push(tab.route);
                        }}
                        activeOpacity={0.7}
                        accessibilityRole="tab"
                        accessibilityState={{ selected: active }}
                        accessibilityLabel={tab.label}
                    >
                        <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                            <TabIcon
                                size={22}
                                color={active ? theme.colors.primary : theme.colors.textMuted}
                                variant={active ? 'Bold' : 'Outline'}
                            />
                            {count > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
                                </View>
                            )}
                        </View>
                        <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const useStyles = (theme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: theme.colors.surface,
            paddingTop: 10,
            paddingBottom: hp(24),
            borderTopWidth: 1,
            borderTopColor: theme.colors.divider,
            ...Platform.select({
                ios: theme.shadows.lg,
                android: { elevation: 12 },
            }),
        },
        tab: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
        },
        iconWrap: {
            width: 52,
            height: 32,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: theme.radius.pill,
        },
        iconWrapActive: {
            backgroundColor: theme.colors.primarySoft,
        },
        badge: {
            position: 'absolute',
            top: -2,
            right: 8,
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
        badgeText: {
            fontFamily: theme.fontFamily.bold,
            fontSize: 9,
            color: '#fff',
            lineHeight: 11,
        },
        label: {
            fontFamily: theme.fontFamily.medium,
            fontSize: fs(10),
            color: theme.colors.textMuted,
            marginTop: 2,
        },
        labelActive: {
            color: theme.colors.primary,
            fontFamily: theme.fontFamily.bold,
        },
    });

export default ParentBottomNav;
