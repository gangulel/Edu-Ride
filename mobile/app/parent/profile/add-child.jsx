import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../../utils/responsive';
import { Button, Input } from '../../components/atoms';
import { Header } from '../../components/organisms';

export default function AddChildScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ name: '', grade: '', school: '', age: '', notes: '' });

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.back();
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Add Child" showBack />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Input label="Child's Full Name" placeholder="Enter full name" value={form.name} onChangeText={(v) => setForm({ ...form, name: v })} leftIcon="person-outline" />
                <Input label="Grade" placeholder="e.g., Grade 5" value={form.grade} onChangeText={(v) => setForm({ ...form, grade: v })} leftIcon="school-outline" />
                <Input label="School Name" placeholder="Enter school name" value={form.school} onChangeText={(v) => setForm({ ...form, school: v })} leftIcon="business-outline" />
                <Input label="Age" placeholder="Enter age" value={form.age} onChangeText={(v) => setForm({ ...form, age: v })} keyboardType="numeric" leftIcon="calendar-outline" />
                <Input label="Special Notes (Optional)" placeholder="Any allergies, medical conditions, etc." value={form.notes} onChangeText={(v) => setForm({ ...form, notes: v })} multiline numberOfLines={3} />

                <Button title="Add Child" onPress={handleSave} loading={loading} fullWidth size="large" style={styles.submitButton} />
                <View style={{ height: hp(40) }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    scrollView: { flex: 1 },
    content: { padding: responsive.paddingLG },
    submitButton: { marginTop: responsive.paddingLG },
});
