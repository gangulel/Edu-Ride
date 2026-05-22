import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Car } from 'iconsax-react-native';
import { responsive, hp, wp } from '../../utils/responsive';
import { Avatar, Card, Badge } from '../../components/atoms';
import { Header, ParentBottomNav } from '../../components/organisms';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user: authUser, switchRole, logout } = useAuth();

    const user = {
        name: authUser?.name || 'Samantha Fernando',
        email: authUser?.email || 'samantha.fernando@email.com',
        phone: authUser?.mobile || '+94 77 123 4567',
        memberSince: 'January 2025',
    };

    const canSwitchToDriver =
        Array.isArray(authUser?.availableRoles) && authUser.availableRoles.includes('driver');

    const handleSwitchToDriver = () => {
        Alert.alert(
            'Switch to driver mode',
            'You will be taken to your driver dashboard. You can switch back anytime from your driver profile.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Switch',
                    onPress: async () => {
                        try {
                            await switchRole('driver');
                            router.replace('/driver');
                        } catch (err) {
                            Alert.alert('Unable to switch', err.message || 'Please try again.');
                        }
                    },
                },
            ],
        );
    };

    const handleLogout = async () => {
        await logout();
        router.replace('/login/login');
    };

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', route: '/parent/profile/edit' },
        { icon: 'people-outline', label: 'Manage Children', route: '/parent/profile/children', badge: '2' },
        { icon: 'calendar-outline', label: 'My Subscriptions', route: '/parent/my-bookings' },
        { icon: 'card-outline', label: 'Payment Methods', route: '/parent/payments' },
        { icon: 'notifications-outline', label: 'Notifications', route: '/parent/notifications' },
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

                    {canSwitchToDriver && (
                        <TouchableOpacity
                            style={styles.switchRoleButton}
                            onPress={handleSwitchToDriver}
                            activeOpacity={0.85}
                            accessibilityLabel="Switch to driver mode"
                        >
                            <Car size={18} color="#fff" variant="Bold" />
                            <Text style={styles.switchRoleText}>Switch to Driver</Text>
                        </TouchableOpacity>
                    )}
                </Card>

                <View style={styles.menuSection}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.menuItem}
                            onPress={() => item.route && router.push(item.route)}
                        >
                            <View style={styles.menuLeft}>
                                <View style={styles.iconBox}>
                                    <Ionicons name={item.icon} size={22} color="#3B82F6" />
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

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
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
    switchRoleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: responsive.paddingLG,
        paddingHorizontal: responsive.paddingXL,
        paddingVertical: responsive.paddingMD,
        backgroundColor: '#3B82F6',
        borderRadius: 9999,
        gap: 8,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    switchRoleText: {
        color: '#fff',
        fontSize: responsive.fontMD,
        fontWeight: '600',
        letterSpacing: 0.2,
    },
    menuSection: { margin: responsive.paddingLG, backgroundColor: '#fff', borderRadius: responsive.radiusLG },
    menuItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: responsive.paddingMD, borderBottomWidth: 1, borderBottomColor: '#E5E5EA' },
    menuLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBox: { width: wp(36), height: wp(36), borderRadius: 8, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: responsive.paddingMD },
    menuLabel: { fontSize: responsive.fontMD, color: '#000' },
    menuRight: { flexDirection: 'row', alignItems: 'center', gap: responsive.paddingSM },
    logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: responsive.paddingLG, backgroundColor: '#fff', padding: responsive.paddingMD, borderRadius: responsive.radiusLG, gap: 8 },
    logoutText: { fontSize: responsive.fontLG, color: '#FF3B30', fontWeight: '500' },
    version: { textAlign: 'center', fontSize: responsive.fontSM, color: '#8E8E93', marginTop: responsive.paddingMD },
});
