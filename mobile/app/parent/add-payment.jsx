import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../utils/responsive';
import { Button, Card } from '../components/atoms';
import { Input } from '../components/atoms';
import { Header } from '../components/organisms';

export default function AddPaymentScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
    });

    const handleSubmit = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.back();
        }, 1500);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Add Payment Method" showBack />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Card style={styles.formCard}>
                    <Input
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        value={form.cardNumber}
                        onChangeText={(v) => setForm({ ...form, cardNumber: v })}
                        keyboardType="numeric"
                        leftIcon="card-outline"
                    />
                    <View style={styles.row}>
                        <View style={styles.halfInput}>
                            <Input
                                label="Expiry Date"
                                placeholder="MM/YY"
                                value={form.expiryDate}
                                onChangeText={(v) => setForm({ ...form, expiryDate: v })}
                            />
                        </View>
                        <View style={styles.halfInput}>
                            <Input
                                label="CVV"
                                placeholder="123"
                                value={form.cvv}
                                onChangeText={(v) => setForm({ ...form, cvv: v })}
                                keyboardType="numeric"
                                secureTextEntry
                            />
                        </View>
                    </View>
                    <Input
                        label="Cardholder Name"
                        placeholder="Name on card"
                        value={form.cardholderName}
                        onChangeText={(v) => setForm({ ...form, cardholderName: v })}
                        autoCapitalize="words"
                    />
                </Card>

                <Button
                    title="Add Card"
                    onPress={handleSubmit}
                    loading={loading}
                    fullWidth
                    size="large"
                />

                <Text style={styles.securityNote}>
                    Your payment information is encrypted and securely stored.
                </Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    scrollView: { flex: 1 },
    content: { padding: responsive.paddingLG },
    formCard: { marginBottom: responsive.paddingLG },
    row: { flexDirection: 'row', gap: responsive.paddingMD },
    halfInput: { flex: 1 },
    securityNote: { fontSize: responsive.fontSM, color: '#8E8E93', textAlign: 'center', marginTop: responsive.paddingMD, lineHeight: 20 },
});
