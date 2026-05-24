import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, ActivityIndicator, Text, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../../utils/responsive';
import { Button } from '../../components/atoms';
import { ChildCard, EmptyState } from '../../components/molecules';
import { Header } from '../../components/organisms';
import { getChildren, deleteChild } from '../../../services/parentApi';

export default function ChildrenScreen() {
    const router = useRouter();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchChildren = useCallback(async () => {
        try {
            setError(null);
            const res = await getChildren();
            setChildren(res?.children || []);
        } catch (err) {
            setError(err.message || 'Failed to load children');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchChildren(); }, [fetchChildren]);

    const handleDelete = (child) => {
        Alert.alert(
            'Remove Child',
            `Remove ${child.fullName} from your account?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Remove',
                    style: 'destructive',
                    onPress: async () => {
                        setDeletingId(child._id);
                        try {
                            await deleteChild(child._id);
                            setChildren(prev => prev.filter(c => c._id !== child._id));
                        } catch (err) {
                            Alert.alert('Error', err.message || 'Failed to remove child');
                        } finally {
                            setDeletingId(null);
                        }
                    },
                },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                title="Manage Children"
                showBack
                rightAction="Add"
                rightActionIcon="add-circle-outline"
                onRightAction={() => router.push('/parent/profile/add-child')}
            />

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.loadingText}>Loading children...</Text>
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchChildren}>
                        <Text style={styles.retryText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : children.length > 0 ? (
                <FlatList
                    data={children}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <ChildCard
                            child={{
                                id: item._id,
                                name: item.fullName,
                                grade: item.grade,
                                school: item.school,
                                age: item.age,
                                subscription: null,
                            }}
                            onPress={() => {}}
                            onEdit={() => {}}
                            onDelete={() => handleDelete(item)}
                            deleting={deletingId === item._id}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <EmptyState
                    icon="people-outline"
                    title="No children added"
                    message="Add your children to book bus services for them."
                    actionLabel="Add Child"
                    onAction={() => router.push('/parent/profile/add-child')}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    listContent: { padding: responsive.paddingLG, paddingBottom: hp(40) },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    loadingText: { marginTop: 12, fontSize: responsive.fontMD, color: '#64748B' },
    errorText: { fontSize: responsive.fontMD, color: '#EF4444', textAlign: 'center', marginBottom: 12 },
    retryBtn: { backgroundColor: '#3B82F6', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 20 },
    retryText: { color: '#fff', fontWeight: '600' },
});
