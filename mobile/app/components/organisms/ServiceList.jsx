import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import ServiceCard from '../molecules/ServiceCard';
import EmptyState from '../molecules/EmptyState';
import Spinner from '../atoms/Spinner';
import { responsive } from '../../utils/responsive';

const ServiceList = ({
    services = [],
    loading = false,
    onServicePress,
    onEndReached,
    refreshing = false,
    onRefresh,
    variant = 'default',
    ListHeaderComponent,
    emptyTitle = 'No services found',
    emptyMessage = 'Try adjusting your search or filters',
    emptyAction,
    onEmptyAction,
    style,
}) => {
    if (loading && services.length === 0) {
        return (
            <View style={styles.loadingContainer}>
                <Spinner text="Finding bus services..." />
            </View>
        );
    }

    if (services.length === 0) {
        return (
            <EmptyState
                icon="bus-outline"
                title={emptyTitle}
                message={emptyMessage}
                actionLabel={emptyAction}
                onAction={onEmptyAction}
            />
        );
    }

    return (
        <FlatList
            data={services}
            keyExtractor={(item) => item.id?.toString()}
            renderItem={({ item }) => (
                <ServiceCard
                    driver={item}
                    onPress={() => onServicePress?.(item)}
                    variant={variant}
                />
            )}
            contentContainerStyle={[styles.listContent, style]}
            showsVerticalScrollIndicator={false}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.5}
            refreshing={refreshing}
            onRefresh={onRefresh}
            ListHeaderComponent={ListHeaderComponent}
            ListFooterComponent={loading ? <Spinner size="small" /> : null}
        />
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: responsive.padding2XL,
    },
    listContent: {
        paddingHorizontal: responsive.paddingLG,
        paddingBottom: responsive.padding2XL,
    },
});

export default ServiceList;
