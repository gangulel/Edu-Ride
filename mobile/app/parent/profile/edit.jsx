import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../../utils/responsive';
import { Button, Avatar, Input } from '../../components/atoms';
import { Header } from '../../components/organisms';
import { useAuth } from '../../../contexts/AuthContext';
import { updateProfile } from '../../../services/parentApi';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        fullName: user?.fullName || '',
        phone: user?.phone || '',
    });

    const handleSave = async () => {
        if (!form.fullName.trim()) {
            Alert.alert('Validation', 'Full name is required.');
            return;
        }
        setLoading(true);
        try {
            const res = await updateProfile(user.id, {
                fullName: form.fullName.trim(),
                phone: form.phone.trim(),
            });
            updateUser(res?.user || { fullName: form.fullName, phone: form.phone });
            router.back();
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Edit Profile" showBack />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <Avatar name={form.fullName || 'User'} size="xlarge" />
                </View>

                <Input
                    label="Full Name"
                    value={form.fullName}
                    onChangeText={(v) => setForm({ ...form, fullName: v })}
                    autoCapitalize="words"
                />
                <Input
                    label="Email"
                    value={user?.email || ''}
                    editable={false}
                    style={styles.disabledInput}
                />
                <Input
                    label="Phone"
                    value={form.phone}
                    onChangeText={(v) => setForm({ ...form, phone: v })}
                    keyboardType="phone-pad"
                />

                <Button title="Save Changes" onPress={handleSave} loading={loading} fullWidth size="large" />
                <View style={{ height: hp(40) }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    scrollView: { flex: 1 },
    content: { padding: responsive.paddingLG },
    avatarSection: { alignItems: 'center', marginBottom: responsive.paddingXL },
    disabledInput: { opacity: 0.5 },
});
