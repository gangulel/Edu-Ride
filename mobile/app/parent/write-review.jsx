import React from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../utils/responsive';

// Components
import { Header } from '../components/organisms';
import { ReviewForm } from '../components/organisms';

export default function WriteReviewScreen() {
    const router = useRouter();

    // Mock driver data
    const driver = {
        id: 1,
        name: 'Kasun Perera',
    };

    const handleSubmit = (reviewData) => {
        console.log('Review submitted:', reviewData);
        // Here you would make an API call to submit the review
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Write Review" showBack />

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.content}
            >
                <ReviewForm
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
