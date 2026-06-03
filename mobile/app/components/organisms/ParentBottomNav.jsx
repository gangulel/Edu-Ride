import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { responsive } from '../../utils/responsive';

const ParentBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const insets = useSafeAreaInsets();

    const tabs = [
        { name: 'Home', icon: 'home-outline', iconActive: 'home', route: '/parent' },
        { name: 'Search', icon: 'search-outline', iconActive: 'search', route: '/parent/search' },
        { name: 'Bookings', icon: 'calendar-outline', iconActive: 'calendar', route: '/parent/my-bookings' },
        { name: 'Messages', icon: 'chatbubble-outline', iconActive: 'chatbubble-outline', route: '/parent/messages' },
        { name: 'Profile', icon: 'person-outline', iconActive: 'person', route: '/parent/profile' },
    ];

    const isActive = (route) => {
        if (route === '/parent') {
            return pathname === '/parent' || pathname === '/parent/index';
        }
        return pathname.startsWith(route);
    };

    return (
        <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
            {tabs.map((tab) => {
                const active = isActive(tab.route);
                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.tab}
                        onPress={() => router.push(tab.route)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={active ? tab.iconActive : tab.icon}
                            size={24}
                            color={active ? '#007AFF' : '#8E8E93'}
                        />
                        <Text style={[styles.label, active && styles.labelActive]}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        paddingTop: responsive.paddingSM,
        paddingHorizontal: responsive.paddingSM,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
            },
            android: { elevation: 8 },
        }),
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 3,
    },
    label: {
        fontSize: responsive.fontXS,
        color: '#8E8E93',
        marginTop: 2,
    },
    labelActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
});

export default ParentBottomNav;
