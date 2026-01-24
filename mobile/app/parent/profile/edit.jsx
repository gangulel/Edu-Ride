import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../../utils/responsive';
import { Button, Avatar, Input } from '../../components/atoms';
import { Header } from '../../components/organisms';

export default function EditProfileScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        firstName: 'Samantha',
        lastName: 'Fernando',
        email: 'samantha.fernando@email.com',
        phone: '+94 77 123 4567',
        address: 'Colombo 07, Sri Lanka',
    });

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            router.back();
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Edit Profile" showBack />
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <View style={styles.avatarSection}>
                    <Avatar name={`${form.firstName} ${form.lastName}`} size="xlarge" />
                    <Button title="Change Photo" variant="ghost" size="small" style={styles.changePhoto} />
                </View>

                <Input label="First Name" value={form.firstName} onChangeText={(v) => setForm({ ...form, firstName: v })} />
                <Input label="Last Name" value={form.lastName} onChangeText={(v) => setForm({ ...form, lastName: v })} />
                <Input label="Email" value={form.email} onChangeText={(v) => setForm({ ...form, email: v })} keyboardType="email-address" autoCapitalize="none" />
                <Input label="Phone" value={form.phone} onChangeText={(v) => setForm({ ...form, phone: v })} keyboardType="phone-pad" />
                <Input label="Address" value={form.address} onChangeText={(v) => setForm({ ...form, address: v })} multiline />

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
    changePhoto: { marginTop: responsive.paddingMD },
});
