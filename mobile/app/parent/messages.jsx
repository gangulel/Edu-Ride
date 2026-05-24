import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../utils/responsive';
import { EmptyState } from '../components/molecules';
import { Header, ParentBottomNav } from '../components/organisms';
import { getBookings } from '../../services/parentApi';

export default function MessagesScreen() {
    const router = useRouter();
    const [drivers, setDrivers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDrivers = useCallback(async () => {
        try {
            const res = await getBookings();
            const bookings = res?.bookings || [];
            // Derive unique driver contacts from accepted/pending bookings
            const seen = new Set();
            const contacts = [];
            bookings
                .filter(b => b.status === 'accepted' || b.status === 'pending')
                .forEach(b => {
                    const driverId = b.driver?._id || b.driver;
                    if (driverId && !seen.has(driverId)) {
                        seen.add(driverId);
                        contacts.push({
                            id: driverId,
                            participant: {
                                name: b.driver?.fullName || 'Driver',
                                photo: b.driver?.profilePhoto || null,
                            },
                            bookingStatus: b.status,
                        });
                    }
                });
            setDrivers(contacts);
        } catch {
            // silently ignore — show empty state
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDrivers(); }, [fetchDrivers]);

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Messages" showBack />

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                </View>
            ) : (
                <EmptyState
                    icon="chatbubbles-outline"
                    title="Messaging coming soon"
                    message={
                        drivers.length > 0
                            ? `You have ${drivers.length} driver(s) you can contact. In-app messaging will be available in the next update.`
                            : "Book a bus service to start communicating with your driver."
                    }
                    actionLabel={drivers.length === 0 ? "Find Service" : null}
                    onAction={drivers.length === 0 ? () => router.push('/parent/search') : null}
                />
            )}

            <ParentBottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
