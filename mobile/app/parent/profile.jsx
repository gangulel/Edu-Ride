import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, hp, wp } from '../utils/responsive';
import { Avatar, Card, Badge } from '../components/atoms';
import { Header, ParentBottomNav } from '../components/organisms';

export default function ProfileScreen() {
    const router = useRouter();

    const user = {
        name: 'Samantha Fernando',
        email: 'samantha.fernando@email.com',
        phone: '+94 77 123 4567',
        memberSince: 'January 2025',
    };

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', route: '/parent/profile/edit' },
        { icon: 'people-outline', label: 'Manage Children', route: '/parent/profile/children', badge: '2' },
        { icon: 'calendar-outline', label: 'My Subscriptions', route: '/parent/my-bookings' },
        { icon: 'card-outline', label: 'Payment Methods', route: '/parent/payments' },
        { icon: 'notifications-outline', label: 'Notifications', route: '/parent/profile/notifications' },
        { icon: 'help-circle-outline', label: 'Help & FAQ', route: '/parent/help' },
        { icon: 'shield-outline', label: 'Privacy & Security', route: '/parent/privacy' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Profile" showBack />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Card style={styles.profileCard}>
                    <Avatar name={user.name} size="xlarge" />
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                    <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
                </Card>

                <View style={styles.menuSection}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.menuItem}
                            onPress={() => item.route && router.push(item.route)}
                        >
                            <View style={styles.menuLeft}>
                                <View style={styles.iconBox}>
                                    <Ionicons name={item.icon} size={22} color="#007AFF" />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <View style={styles.menuRight}>
                                {item.badge && <Badge label={item.badge} variant="primary" size="small" />}
                                <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Version 1.0.0</Text>
                <View style={{ height: hp(100) }} />
            </ScrollView>
            <ParentBottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    scrollView: { flex: 1 },
    profileCard: { alignItems: 'center', margin: responsive.paddingLG, paddingVertical: responsive.paddingXL },
    userName: { fontSize: responsive.font2XL, fontWeight: 'bold', marginTop: responsive.paddingMD },
    userEmail: { fontSize: responsive.fontMD, color: '#8E8E93', marginTop: 4 },
    memberSince: { fontSize: responsive.fontSM, color: '#8E8E93', marginTop: 4 },
    menuSection: { margin: responsive.paddingLG, backgroundColor: '#fff', borderRadius: responsive.radiusLG },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: responsive.paddingMD, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
    menuLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: wp(36), height: wp(36), borderRadius: 8, backgroundColor: '#E3F2FD', alignItems: 'center', justifyContent: 'center', marginRight: responsive.paddingMD },
    menuLabel: { fontSize: responsive.fontMD, color: '#000' },
    menuRight: { flexDirection: 'row', alignItems: 'center', gap: responsive.paddingSM },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: responsive.paddingLG, backgroundColor: '#fff', padding: responsive.paddingMD, borderRadius: responsive.radiusLG, gap: 8 },
    logoutText: { fontSize: responsive.fontLG, color: '#FF3B30', fontWeight: '500' },
    version: { textAlign: 'center', fontSize: responsive.fontSM, color: '#8E8E93', marginTop: responsive.paddingMD },
});
