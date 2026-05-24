import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, hp, wp } from '../../utils/responsive';
import { Avatar, Card, Badge } from '../../components/atoms';
import { Header, ParentBottomNav } from '../../components/organisms';
import { useAuth } from '../../../contexts/AuthContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    const formatMemberSince = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const menuItems = [
        { icon: 'person-outline', label: 'Edit Profile', route: '/parent/profile/edit' },
        { icon: 'people-outline', label: 'Manage Children', route: '/parent/profile/children' },
        { icon: 'calendar-outline', label: 'My Subscriptions', route: '/parent/my-bookings' },
        { icon: 'card-outline', label: 'Payment Methods', route: '/parent/payments' },
        { icon: 'notifications-outline', label: 'Notifications', route: '/parent/notifications' },
        { icon: 'help-circle-outline', label: 'Help & FAQ', route: '/parent/help' },
        { icon: 'shield-outline', label: 'Privacy & Security', route: '/parent/privacy' },
    ];

    const handleLogout = async () => {
        await logout();
        router.replace('/login/login');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Profile" showBack />
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <Card style={styles.profileCard}>
                    <Avatar name={user?.fullName || 'User'} size="xlarge" />
                    <Text style={styles.userName}>{user?.fullName || '—'}</Text>
                    <Text style={styles.userEmail}>{user?.email || '—'}</Text>
                    {user?.phone ? (
                        <Text style={styles.userPhone}>{user.phone}</Text>
                    ) : null}
                    {user?.createdAt ? (
                        <Text style={styles.memberSince}>Member since {formatMemberSince(user.createdAt)}</Text>
                    ) : null}
                    <View style={[
                        styles.statusBadge,
                        { backgroundColor: user?.status === 'active' ? '#ECFDF5' : '#FEF3C7' }
                    ]}>
                        <Text style={[
                            styles.statusText,
                            { color: user?.status === 'active' ? '#10B981' : '#F59E0B' }
                        ]}>
                            {user?.status === 'active' ? 'Active Account' : user?.status || 'Pending'}
                        </Text>
                    </View>
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
    userPhone: { fontSize: responsive.fontSM, color: '#8E8E93', marginTop: 2 },
    memberSince: { fontSize: responsive.fontSM, color: '#8E8E93', marginTop: 4 },
    statusBadge: {
        marginTop: 10, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20,
    },
    statusText: { fontSize: responsive.fontSM, fontWeight: '600' },
    menuSection: { margin: responsive.paddingLG, backgroundColor: '#fff', borderRadius: responsive.radiusLG },
    menuItem: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        padding: responsive.paddingMD, borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
    },
    menuLeft: { flexDirection: 'row', alignItems: 'center' },
    iconBox: {
        width: wp(36), height: wp(36), borderRadius: 8,
        backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center', marginRight: responsive.paddingMD,
    },
    menuLabel: { fontSize: responsive.fontMD, color: '#000' },
    menuRight: { flexDirection: 'row', alignItems: 'center', gap: responsive.paddingSM },
    logoutButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        margin: responsive.paddingLG, backgroundColor: '#fff',
        padding: responsive.paddingMD, borderRadius: responsive.radiusLG, gap: 8,
    },
    logoutText: { fontSize: responsive.fontLG, color: '#FF3B30', fontWeight: '500' },
    version: { textAlign: 'center', fontSize: responsive.fontSM, color: '#8E8E93', marginTop: responsive.paddingMD },
});
