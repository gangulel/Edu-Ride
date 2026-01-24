import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive, hp } from '../../utils/responsive';
import { Button } from '../../components/atoms';
import { ChildCard, EmptyState } from '../../components/molecules';
import { Header } from '../../components/organisms';

export default function ChildrenScreen() {
    const router = useRouter();

    const children = [
        { id: 1, name: 'Kavindi Fernando', grade: '5', school: 'Royal College', age: 10, subscription: { driverName: 'Mr. Perera', status: 'active' } },
        { id: 2, name: 'Dineth Fernando', grade: '3', school: 'Royal College', age: 8, subscription: null },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Manage Children" showBack rightAction="Add" rightActionIcon="add-circle-outline" onRightAction={() => router.push('/parent/profile/add-child')} />

            {children.length > 0 ? (
                <FlatList
                    data={children}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <ChildCard
                            child={item}
                            onPress={() => { }}
                            onEdit={() => { }}
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
});
