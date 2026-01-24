import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { responsive, hp } from '../utils/responsive';

// Components
import { Header } from '../components/organisms';
import { BookingForm } from '../components/organisms';

export default function BookingScreen() {
    const router = useRouter();
    const { driverId } = useLocalSearchParams();

    // Mock driver data
    const driver = {
        id: driverId,
        name: 'Kasun Perera',
        monthlyFee: 8500,
        school: 'Royal College',
    };

    const handleSubmit = (formData) => {
        console.log('Booking submitted:', formData);
        // Here you would make an API call to submit the booking
        router.push('/parent/my-bookings');
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Book Service" showBack />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <BookingForm
                    driver={driver}
                    onSubmit={handleSubmit}
                />

                <View style={{ height: hp(40) }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: responsive.paddingLG,
    },
});
