import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { wp, hp, fs } from '../../utils/responsive';
import { Header, ParentBottomNav } from '../../components/organisms';
import { useAuth } from '../../../contexts/AuthContext';
import { getMe } from '../../../services/parentApi';

// ─── small helpers ────────────────────────────────────────────────────────────

function getInitials(name = '') {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return '?';
}

function formatMemberSince(dateStr) {
    if (!dateStr) return null;
    try {
        return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
        return null;
    }
}

// ─── InfoRow ──────────────────────────────────────────────────────────────────

function InfoRow({ icon, label }) {
    if (!label) return null;
    return (
        <View style={styles.infoRow}>
            <Ionicons name={icon} size={16} color="#64748B" />
            <Text style={styles.infoText} numberOfLines={1}>{label}</Text>
        </View>
    );
}

// ─── ProfileScreen ────────────────────────────────────────────────────────────

export default function ProfileScreen() {
    const router   = useRouter();
    const { user, token, loading: authLoading, logout, updateUser } = useAuth();

    const [refreshing,  setRefreshing]  = useState(false);
    const [fetchLoading, setFetchLoading] = useState(false);

    // Fetch fresh profile data from the API and merge into context
    const fetchProfile = useCallback(async () => {
        if (!token) return;              // no session → nothing to fetch
        try {
            const res = await getMe();
            if (res?.user) updateUser(res.user);
        } catch (_) {
            // keep whatever is already in context
        } finally {
            setFetchLoading(false);
            setRefreshing(false);
        }
    }, [token, updateUser]);

    // Kick off a background refresh whenever the screen mounts and auth is ready
    useEffect(() => {
        if (authLoading) return;
        if (!token) return;             // not logged in – handled in render below
        setFetchLoading(true);
        fetchProfile();
    }, [authLoading, token]);           // re-runs if token changes (e.g. login in same session)

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchProfile();
    }, [fetchProfile]);

    const handleLogout = async () => {
        await logout();
        router.replace('/login/login');
    };

    // ── 1. Auth still loading ─────────────────────────────────────────────────
    if (authLoading) {
        return (
            <SafeAreaView edges={['top']} style={styles.container}>
                <Header title="Profile" showBack />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.centerText}>Loading…</Text>
                </View>
                <ParentBottomNav />
            </SafeAreaView>
        );
    }

    // ── 2. No session ─────────────────────────────────────────────────────────
    if (!token && !user) {
        return (
            <SafeAreaView edges={['top']} style={styles.container}>
                <Header title="Profile" showBack />
                <View style={styles.center}>
                    <Ionicons name="person-circle-outline" size={72} color="#CBD5E1" />
                    <Text style={styles.notSignedInTitle}>You're not signed in</Text>
                    <Text style={styles.notSignedInSub}>Please log in to view your profile.</Text>
                    <TouchableOpacity
                        style={styles.loginBtn}
                        onPress={() => router.replace('/login/login')}
                        activeOpacity={0.85}
                    >
                        <Text style={styles.loginBtnText}>Go to Login</Text>
                    </TouchableOpacity>
                </View>
                <ParentBottomNav />
            </SafeAreaView>
        );
    }

    // ── 3. Waiting for first-ever data (no cached user yet) ───────────────────
    if (!user && fetchLoading) {
        return (
            <SafeAreaView edges={['top']} style={styles.container}>
                <Header title="Profile" showBack />
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.centerText}>Loading profile…</Text>
                </View>
                <ParentBottomNav />
            </SafeAreaView>
        );
    }

    // ── 4. Main profile UI ────────────────────────────────────────────────────
    const memberSince  = formatMemberSince(user?.createdAt);
    const isActive     = user?.status === 'active';
    const displayName  = user?.fullName  || 'No Name';
    const displayEmail = user?.email     || '';
    const displayPhone = user?.phone     || '';

    const menuItems = [
        { icon: 'create-outline',        label: 'Edit Profile',      route: '/parent/profile/edit'     },
        { icon: 'people-outline',         label: 'Manage Children',   route: '/parent/profile/children' },
        { icon: 'calendar-outline',       label: 'My Subscriptions',  route: '/parent/my-bookings'      },
        { icon: 'card-outline',           label: 'Payment Methods',   route: '/parent/payments'         },
        { icon: 'notifications-outline',  label: 'Notifications',     route: '/parent/notifications'    },
        { icon: 'help-circle-outline',    label: 'Help & FAQ',        route: null                       },
        { icon: 'shield-outline',         label: 'Privacy & Security',route: null                       },
    ];

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            <Header title="Profile" showBack />

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor="#3B82F6"
                        colors={['#3B82F6']}
                    />
                }
            >

                {/* ── Profile card ─────────────────────────────────────── */}
                <View style={styles.profileCard}>

                    {/* Avatar */}
                    <View style={styles.avatarWrap}>
                        {user?.profilePhoto ? (
                            <Image
                                source={{ uri: user.profilePhoto }}
                                style={styles.avatarImg}
                            />
                        ) : (
                            <View style={styles.avatarFallback}>
                                <Text style={styles.avatarInitials}>
                                    {getInitials(displayName)}
                                </Text>
                            </View>
                        )}
                        {isActive && <View style={styles.onlineDot} />}
                    </View>

                    {/* Subtle spinner while refreshing in background */}
                    {fetchLoading && !refreshing && (
                        <ActivityIndicator
                            size="small"
                            color="#3B82F6"
                            style={{ marginBottom: 6 }}
                        />
                    )}

                    {/* Name */}
                    <Text style={styles.userName}>{displayName}</Text>

                    {/* Role badge */}
                    <View style={styles.roleBadge}>
                        <Ionicons name="people" size={13} color="#3B82F6" />
                        <Text style={styles.roleText}>Parent</Text>
                    </View>

                    {/* Contact / membership info */}
                    <View style={styles.infoSection}>
                        <InfoRow icon="mail-outline"     label={displayEmail} />
                        <InfoRow icon="call-outline"     label={displayPhone} />
                        {memberSince && (
                            <InfoRow icon="calendar-outline" label={`Member since ${memberSince}`} />
                        )}
                    </View>

                    {/* Account status */}
                    <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusPending]}>
                        <View style={[styles.statusDot, { backgroundColor: isActive ? '#10B981' : '#F59E0B' }]} />
                        <Text style={[styles.statusText, { color: isActive ? '#10B981' : '#F59E0B' }]}>
                            {isActive ? 'Active Account' : (user?.status || 'Pending')}
                        </Text>
                    </View>
                </View>

                {/* ── Edit button ──────────────────────────────────────── */}
                <TouchableOpacity
                    style={styles.editBtn}
                    activeOpacity={0.85}
                    onPress={() => router.push('/parent/profile/edit')}
                >
                    <Ionicons name="create-outline" size={18} color="#3B82F6" />
                    <Text style={styles.editBtnText}>Edit Profile</Text>
                </TouchableOpacity>

                {/* ── Menu list ────────────────────────────────────────── */}
                <View style={styles.menuCard}>
                    {menuItems.map((item, idx) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[
                                styles.menuItem,
                                idx < menuItems.length - 1 && styles.menuItemBorder,
                            ]}
                            activeOpacity={0.7}
                            onPress={() => item.route && router.push(item.route)}
                        >
                            <View style={styles.menuLeft}>
                                <View style={styles.iconBox}>
                                    <Ionicons name={item.icon} size={20} color="#3B82F6" />
                                </View>
                                <Text style={styles.menuLabel}>{item.label}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
                        </TouchableOpacity>
                    ))}
                </View>

                {/* ── Logout ──────────────────────────────────────────── */}
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={handleLogout}
                    activeOpacity={0.85}
                >
                    <Ionicons name="log-out-outline" size={20} color="#EF4444" />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.version}>Edu-Ride v1.0.0</Text>
                <View style={{ height: hp(100) }} />
            </ScrollView>

            <ParentBottomNav />
        </SafeAreaView>
    );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const CARD_RADIUS = 20;
const SHADOW = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
};

const styles = StyleSheet.create({

    // ── Layout ────────────────────────────────────────────────────────────────
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    scroll: {
        flex: 1,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp(24),
        gap: 12,
    },
    centerText: {
        fontSize: fs(14),
        color: '#94A3B8',
        marginTop: 8,
    },

    // ── Not signed in ─────────────────────────────────────────────────────────
    notSignedInTitle: {
        fontSize: fs(20),
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
    },
    notSignedInSub: {
        fontSize: fs(14),
        color: '#64748B',
        textAlign: 'center',
    },
    loginBtn: {
        marginTop: 8,
        backgroundColor: '#3B82F6',
        paddingHorizontal: wp(32),
        paddingVertical: hp(14),
        borderRadius: 24,
    },
    loginBtnText: {
        fontSize: fs(15),
        color: '#fff',
        fontWeight: '700',
    },

    // ── Profile card ──────────────────────────────────────────────────────────
    profileCard: {
        margin: wp(16),
        backgroundColor: '#fff',
        borderRadius: CARD_RADIUS,
        paddingVertical: hp(28),
        paddingHorizontal: wp(20),
        alignItems: 'center',
        ...SHADOW,
    },

    // ── Avatar ────────────────────────────────────────────────────────────────
    avatarWrap: {
        position: 'relative',
        marginBottom: hp(14),
    },
    avatarImg: {
        width: wp(96),
        height: wp(96),
        borderRadius: wp(48),
        backgroundColor: '#E3F2FD',
    },
    avatarFallback: {
        width: wp(96),
        height: wp(96),
        borderRadius: wp(48),
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#BFDBFE',
    },
    avatarInitials: {
        fontSize: fs(34),
        fontWeight: '700',
        color: '#3B82F6',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#fff',
    },

    // ── Name / role ───────────────────────────────────────────────────────────
    userName: {
        fontSize: fs(22),
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: 6,
    },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: hp(14),
    },
    roleText: {
        fontSize: fs(13),
        color: '#3B82F6',
        fontWeight: '600',
    },

    // ── Info rows ─────────────────────────────────────────────────────────────
    infoSection: {
        width: '100%',
        gap: 8,
        marginBottom: hp(14),
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: fs(14),
        color: '#475569',
        flex: 1,
    },

    // ── Status ────────────────────────────────────────────────────────────────
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusActive:  { backgroundColor: '#ECFDF5' },
    statusPending: { backgroundColor: '#FEF3C7' },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
    },
    statusText: {
        fontSize: fs(13),
        fontWeight: '600',
    },

    // ── Edit button ───────────────────────────────────────────────────────────
    editBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: wp(16),
        marginBottom: wp(16),
        paddingVertical: hp(13),
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
        backgroundColor: '#EFF6FF',
    },
    editBtnText: {
        fontSize: fs(15),
        color: '#3B82F6',
        fontWeight: '600',
    },

    // ── Menu card ─────────────────────────────────────────────────────────────
    menuCard: {
        marginHorizontal: wp(16),
        backgroundColor: '#fff',
        borderRadius: CARD_RADIUS,
        overflow: 'hidden',
        ...SHADOW,
        marginBottom: wp(16),
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: hp(14),
        paddingHorizontal: wp(16),
    },
    menuItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    menuLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconBox: {
        width: wp(38),
        height: wp(38),
        borderRadius: 10,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(12),
    },
    menuLabel: {
        fontSize: fs(15),
        color: '#1E293B',
        fontWeight: '500',
    },

    // ── Logout ────────────────────────────────────────────────────────────────
    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginHorizontal: wp(16),
        paddingVertical: hp(14),
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#FECACA',
        backgroundColor: '#FFF5F5',
        marginBottom: hp(8),
    },
    logoutText: {
        fontSize: fs(15),
        color: '#EF4444',
        fontWeight: '600',
    },

    // ── Version ───────────────────────────────────────────────────────────────
    version: {
        textAlign: 'center',
        fontSize: fs(12),
        color: '#94A3B8',
        marginTop: hp(4),
    },
});
