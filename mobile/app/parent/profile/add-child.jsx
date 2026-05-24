import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../../utils/responsive';
import { Button, Input } from '../../components/atoms';
import { Header } from '../../components/organisms';
import { addChild } from '../../../services/parentApi';

const GRADE_OPTIONS = ['Pre-K', 'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

export default function AddChildScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: '',
        grade: '',
        school: '',
        age: '',
        specialNotes: '',
    });

    const handleSave = async () => {
        if (!form.fullName.trim()) {
            Alert.alert('Validation', 'Child\'s full name is required.');
            return;
        }
        if (!form.grade.trim()) {
            Alert.alert('Validation', 'Grade is required.');
            return;
        }
        if (!form.school.trim()) {
            Alert.alert('Validation', 'School name is required.');
            return;
        }

        setLoading(true);
        try {
            await addChild({
                fullName: form.fullName.trim(),
                grade: form.grade.trim(),
                school: form.school.trim(),
                age: form.age ? Number(form.age) : undefined,
                specialNotes: form.specialNotes.trim() || undefined,
            });
            router.back();
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to add child. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Add Child" showBack />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <Input
                    label="Child's Full Name *"
                    placeholder="Enter full name"
                    value={form.fullName}
                    onChangeText={(v) => setForm({ ...form, fullName: v })}
                    leftIcon="person-outline"
                    autoCapitalize="words"
                />
                <Input
                    label="Grade *"
                    placeholder="e.g., 5 or Pre-K"
                    value={form.grade}
                    onChangeText={(v) => setForm({ ...form, grade: v })}
                    leftIcon="school-outline"
                />
                <Input
                    label="School Name *"
                    placeholder="Enter school name"
                    value={form.school}
                    onChangeText={(v) => setForm({ ...form, school: v })}
                    leftIcon="business-outline"
                />
                <Input
                    label="Age"
                    placeholder="Enter age"
                    value={form.age}
                    onChangeText={(v) => setForm({ ...form, age: v })}
                    keyboardType="numeric"
                    leftIcon="calendar-outline"
                />
                <Input
                    label="Special Notes (Optional)"
                    placeholder="Any allergies, medical conditions, etc."
                    value={form.specialNotes}
                    onChangeText={(v) => setForm({ ...form, specialNotes: v })}
                    multiline
                    numberOfLines={3}
                />

                <Button
                    title="Add Child"
                    onPress={handleSave}
                    loading={loading}
                    fullWidth
                    size="large"
                    style={styles.submitButton}
                />
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
