import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { responsive, hp, wp } from '../../utils/responsive';

const ParentBottomNav = () => {
    const router = useRouter();
    const pathname = usePathname();

    const tabs = [
        { name: 'Home', icon: 'home', iconActive: 'home', route: '/parent' },
        { name: 'Search', icon: 'search-outline', iconActive: 'search', route: '/parent/search' },
        { name: 'Bookings', icon: 'calendar-outline', iconActive: 'calendar', route: '/parent/my-bookings' },
        { name: 'Messages', icon: 'chatbubble-outline', iconActive: 'chatbubble', route: '/parent/messages' },
        { name: 'Profile', icon: 'person-outline', iconActive: 'person', route: '/parent/profile' },
    ];

    const isActive = (route) => {
        if (route === '/parent') {
            return pathname === '/parent' || pathname === '/parent/index';
        }
        return pathname.startsWith(route);
    };

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const active = isActive(tab.route);
                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.tab}
                        onPress={() => router.push(tab.route)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, active && styles.iconContainerActive]}>
                            <Ionicons
                                name={active ? tab.iconActive : tab.icon}
                                size={24}
                                color={active ? '#007AFF' : '#8E8E93'}
                            />
                        </View>
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
        paddingBottom: hp(20),
        paddingTop: responsive.paddingSM,
        paddingHorizontal: responsive.paddingSM,
    },
    tab: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: wp(48),
        height: wp(32),
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: responsive.radiusLG,
    },
    iconContainerActive: {
        backgroundColor: '#E3F2FD',
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
