import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp, hp, fs } from '../utils/responsive';
import { Header, ParentBottomNav } from '../components/organisms';
import { getBookings } from '../../services/parentApi';

// ── Default support chats (always visible) ────────────────────────────────────
const DEFAULT_CHATS = [
    {
        id: 'support-complaint',
        title: 'Complaint Support',
        preview: 'Report school transport issues or concerns here.',
        timestamp: 'Support',
        unread: 1,
        iconName: 'warning-outline',
        iconColor: '#F59E0B',
        iconBg: '#FFFBEB',
        isSupport: true,
    },
    {
        id: 'support-customer',
        title: 'Customer Support',
        preview: "We're here to help you with bookings and app support.",
        timestamp: 'Support',
        unread: 0,
        iconName: 'headset-outline',
        iconColor: '#3B82F6',
        iconBg: '#EFF6FF',
        isSupport: true,
    },
];

// ── Helper: driver initials ────────────────────────────────────────────────────
function getInitials(name = '') {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// ── Support / driver avatar ────────────────────────────────────────────────────
function ChatAvatar({ item }) {
    if (item.isSupport) {
        return (
            <View style={[styles.avatarWrap, { backgroundColor: item.iconBg }]}>
                <Ionicons name={item.iconName} size={24} color={item.iconColor} />
            </View>
        );
    }
    return (
        <View style={[styles.avatarWrap, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.avatarInitials}>
                {getInitials(item.title)}
            </Text>
        </View>
    );
}

// ── Single chat row ────────────────────────────────────────────────────────────
function ChatItem({ item, onPress }) {
    return (
        <TouchableOpacity
            style={styles.chatCard}
            onPress={() => onPress(item)}
            activeOpacity={0.7}
        >
            <ChatAvatar item={item} />

            <View style={styles.chatBody}>
                <View style={styles.chatTopRow}>
                    <Text style={styles.chatTitle} numberOfLines={1}>
                        {item.title}
                    </Text>
                    <Text style={[styles.chatTimestamp, item.isSupport && styles.supportTimestamp]}>
                        {item.timestamp}
                    </Text>
                </View>

                <View style={styles.chatBottomRow}>
                    <Text style={styles.chatPreview} numberOfLines={1}>
                        {item.preview}
                    </Text>
                    {item.unread > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{item.unread}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

// ── Section header ─────────────────────────────────────────────────────────────
function SectionLabel({ label }) {
    return (
        <View style={styles.sectionLabel}>
            <Text style={styles.sectionLabelText}>{label}</Text>
        </View>
    );
}

// ── Main screen ───────────────────────────────────────────────────────────────
export default function MessagesScreen() {
    const router = useRouter();
    const [driverChats, setDriverChats] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDrivers = useCallback(async () => {
        try {
            const res = await getBookings();
            const bookings = res?.bookings || [];
            const seen = new Set();
            const contacts = [];
            bookings
                .filter((b) => b.status === 'accepted' || b.status === 'pending')
                .forEach((b) => {
                    const driverId = b.driver?._id || b.driver;
                    if (driverId && !seen.has(driverId)) {
                        seen.add(driverId);
                        contacts.push({
                            id: driverId,
                            title: b.driver?.fullName || 'Driver',
                            preview: `Booking for ${b.child?.fullName || 'your child'} · ${b.status}`,
                            timestamp: 'Now',
                            unread: 0,
                            isSupport: false,
                            bookingStatus: b.status,
                        });
                    }
                });
            setDriverChats(contacts);
        } catch {
            // silently ignore — support chats remain visible
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

    const handleChatPress = (item) => {
        if (item.isSupport) {
            // TODO: route to dedicated support thread
            return;
        }
        // TODO: route to driver chat when backend ready
    };

    // ── Build list sections ────────────────────────────────────────────────────
    const listData = [];

    // Support chats always appear at the top
    listData.push({ type: 'sectionLabel', id: 'label-support', label: 'Support' });
    DEFAULT_CHATS.forEach((c) => listData.push({ type: 'chat', ...c }));

    // Driver chats only when available
    if (!loading && driverChats.length > 0) {
        listData.push({ type: 'sectionLabel', id: 'label-drivers', label: 'Your Drivers' });
        driverChats.forEach((c) => listData.push({ type: 'chat', ...c }));
    }

    const renderItem = ({ item }) => {
        if (item.type === 'sectionLabel') {
            return <SectionLabel label={item.label} />;
        }
        return <ChatItem item={item} onPress={handleChatPress} />;
    };

    return (
        <SafeAreaView edges={['top']} style={styles.container}>
            {/* ── Header ────────────────────────────────────────────────────── */}
            <Header title="Messages" />

            {/* ── Content ───────────────────────────────────────────────────── */}
            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <FlatList
                    data={listData}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                        <View style={styles.inboxHeader}>
                            <Text style={styles.inboxTitle}>Inbox</Text>
                            <View style={styles.inboxBadge}>
                                <Text style={styles.inboxBadgeText}>
                                    {DEFAULT_CHATS.filter((c) => c.unread > 0).length +
                                        driverChats.filter((c) => c.unread > 0).length}
                                </Text>
                            </View>
                        </View>
                    }
                />
            )}

            {/* ── Bottom nav — always pinned ─────────────────────────────────── */}
            <ParentBottomNav />
        </SafeAreaView>
    );
}

// ── Styles ─────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    // ── Layout
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // ── Inbox header
    inboxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: wp(20),
        paddingTop: hp(16),
        paddingBottom: hp(8),
        gap: 8,
    },
    inboxTitle: {
        fontSize: fs(22),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
    },
    inboxBadge: {
        backgroundColor: '#3B82F6',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6,
    },
    inboxBadgeText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },

    // ── Section label
    sectionLabel: {
        paddingHorizontal: wp(20),
        paddingTop: hp(12),
        paddingBottom: hp(4),
    },
    sectionLabelText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
        color: '#94A3B8',
        textTransform: 'uppercase',
        letterSpacing: 0.8,
    },

    // ── Chat list
    listContent: {
        paddingBottom: hp(16),
    },

    // ── Chat card
    chatCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: wp(16),
        marginVertical: hp(4),
        borderRadius: 16,
        paddingHorizontal: wp(16),
        paddingVertical: hp(14),
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },

    // ── Avatar
    avatarWrap: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: wp(12),
    },
    avatarInitials: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#3B82F6',
    },

    // ── Chat body
    chatBody: {
        flex: 1,
    },
    chatTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatTitle: {
        fontSize: fs(15),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        flex: 1,
        marginRight: 8,
    },
    chatTimestamp: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Regular',
        color: '#94A3B8',
    },
    supportTimestamp: {
        backgroundColor: '#F1F5F9',
        color: '#64748B',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        fontSize: fs(11),
        fontFamily: 'Roboto-Medium',
        overflow: 'hidden',
    },
    chatBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    chatPreview: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
        flex: 1,
        marginRight: 8,
    },

    // ── Unread badge
    unreadBadge: {
        backgroundColor: '#3B82F6',
        borderRadius: 10,
        minWidth: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 5,
    },
    unreadText: {
        fontSize: fs(11),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
});
