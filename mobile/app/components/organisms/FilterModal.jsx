import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../atoms/Button';
import FilterChip from '../molecules/FilterChip';
import { responsive, hp, wp } from '../../utils/responsive';

const FilterModal = ({
    visible,
    onClose,
    onApply,
    filters = {},
    onFilterChange,
}) => {
    const [localFilters, setLocalFilters] = useState(filters);

    const updateFilter = (key, value) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleReset = () => {
        setLocalFilters({});
    };

    const ratingOptions = [4.5, 4.0, 3.5, 3.0];
    const priceRanges = [
        { label: 'Under LKR 5,000', min: 0, max: 5000 },
        { label: 'LKR 5,000 - 8,000', min: 5000, max: 8000 },
        { label: 'LKR 8,000 - 12,000', min: 8000, max: 12000 },
        { label: 'Above LKR 12,000', min: 12000, max: 999999 },
    ];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>Filters</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
                        {/* Verified Only */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Verification</Text>
                            <FilterChip
                                label="Verified Drivers Only"
                                icon="shield-checkmark"
                                selected={localFilters.verifiedOnly}
                                onPress={() => updateFilter('verifiedOnly', !localFilters.verifiedOnly)}
                            />
                        </View>

                        {/* Minimum Rating */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Minimum Rating</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.chipRow}>
                                    {ratingOptions.map((rating) => (
                                        <FilterChip
                                            key={rating}
                                            label={`${rating}+ ★`}
                                            selected={localFilters.minRating === rating}
                                            onPress={() => updateFilter('minRating', localFilters.minRating === rating ? null : rating)}
                                        />
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Price Range */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Monthly Fee</Text>
                            <View style={styles.priceGrid}>
                                {priceRanges.map((range, index) => (
                                    <FilterChip
                                        key={index}
                                        label={range.label}
                                        selected={localFilters.priceRange?.min === range.min}
                                        onPress={() =>
                                            updateFilter('priceRange',
                                                localFilters.priceRange?.min === range.min ? null : range
                                            )
                                        }
                                        style={styles.priceChip}
                                    />
                                ))}
                            </View>
                        </View>

                        {/* Availability */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Availability</Text>
                            <FilterChip
                                label="Has Available Seats"
                                icon="people"
                                selected={localFilters.hasSeats}
                                onPress={() => updateFilter('hasSeats', !localFilters.hasSeats)}
                            />
                        </View>

                        {/* Sort By */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Sort By</Text>
                            <View style={styles.sortOptions}>
                                {[
                                    { value: 'relevant', label: 'Most Relevant' },
                                    { value: 'rating', label: 'Highest Rated' },
                                    { value: 'price_low', label: 'Lowest Price' },
                                    { value: 'price_high', label: 'Highest Price' },
                                    { value: 'newest', label: 'Newest' },
                                ].map((option) => (
                                    <TouchableOpacity
                                        key={option.value}
                                        style={[
                                            styles.sortOption,
                                            localFilters.sortBy === option.value && styles.sortOptionActive,
                                        ]}
                                        onPress={() => updateFilter('sortBy', option.value)}
                                    >
                                        <Text
                                            style={[
                                                styles.sortOptionText,
                                                localFilters.sortBy === option.value && styles.sortOptionTextActive,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                        {localFilters.sortBy === option.value && (
                                            <Ionicons name="checkmark" size={18} color="#007AFF" />
                                        )}
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    {/* Actions */}
                    <View style={styles.actions}>
                        <Button
                            title="Reset"
                            variant="outline"
                            onPress={handleReset}
                            style={styles.actionButton}
                        />
                        <Button
                            title="Apply Filters"
                            variant="primary"
                            onPress={handleApply}
                            style={[styles.actionButton, styles.applyButton]}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    content: {
        backgroundColor: '#fff',
        borderTopLeftRadius: responsive.radiusXL,
        borderTopRightRadius: responsive.radiusXL,
        maxHeight: hp(600),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: responsive.paddingLG,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    title: {
        fontSize: responsive.font2XL,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButton: {
        padding: responsive.paddingSM,
    },
    scrollContent: {
        paddingHorizontal: responsive.paddingLG,
    },
    section: {
        paddingVertical: responsive.paddingMD,
        borderBottomWidth: 1,
        borderBottomColor: '#F2F2F7',
    },
    sectionTitle: {
        fontSize: responsive.fontMD,
        fontWeight: '600',
        color: '#000',
        marginBottom: responsive.paddingMD,
    },
    chipRow: {
        flexDirection: 'row',
    },
    priceGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    priceChip: {
        marginBottom: responsive.paddingSM,
    },
    sortOptions: {
        backgroundColor: '#F9F9FB',
        borderRadius: responsive.radiusMD,
        overflow: 'hidden',
    },
    sortOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: responsive.paddingMD,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    sortOptionActive: {
        backgroundColor: '#E3F2FD',
    },
    sortOptionText: {
        fontSize: responsive.fontMD,
        color: '#000',
    },
    sortOptionTextActive: {
        color: '#007AFF',
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        padding: responsive.paddingLG,
        paddingBottom: hp(32),
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        gap: responsive.paddingMD,
    },
    actionButton: {
        flex: 1,
    },
    applyButton: {
        flex: 2,
    },
});

export default FilterModal;
