import React, { useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { responsive } from '../utils/responsive';

// Components
import { SearchBar, FilterChip } from '../components/molecules';
import { Header, ParentBottomNav, ServiceList, FilterModal } from '../components/organisms';

export default function SearchScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({});
    const [activeFilter, setActiveFilter] = useState('all');

    // Mock services data
    const services = [
        {
            id: 1,
            name: 'Kasun Perera',
            photo: null,
            verified: true,
            rating: 4.9,
            reviewCount: 234,
            monthlyFee: 8500,
            areasServed: ['Colombo 07', 'Dehiwala', 'Mount Lavinia', 'Bambalapitiya'],
            school: 'Royal College',
            availableSeats: 4,
            totalSeats: 28,
        },
        {
            id: 2,
            name: 'Anura Bandara',
            photo: null,
            verified: true,
            rating: 4.8,
            reviewCount: 156,
            monthlyFee: 7500,
            areasServed: ['Colombo 07', 'Bambalapitiya', 'Wellawatte'],
            school: 'Royal College',
            availableSeats: 5,
            totalSeats: 28,
        },
        {
            id: 3,
            name: 'Siripala Fernando',
            photo: null,
            verified: true,
            rating: 4.6,
            reviewCount: 98,
            monthlyFee: 8000,
            areasServed: ['Dehiwala', 'Mount Lavinia', 'Ratmalana'],
            school: 'Royal College',
            availableSeats: 3,
            totalSeats: 24,
        },
        {
            id: 4,
            name: 'Ruwan de Silva',
            photo: null,
            verified: false,
            rating: 4.2,
            reviewCount: 45,
            monthlyFee: 6500,
            areasServed: ['Nugegoda', 'Maharagama', 'Kottawa'],
            school: 'Royal College',
            availableSeats: 8,
            totalSeats: 24,
        },
        {
            id: 5,
            name: 'Nimal Jayawardena',
            photo: null,
            verified: true,
            rating: 4.7,
            reviewCount: 189,
            monthlyFee: 9000,
            areasServed: ['Colombo 03', 'Colombo 04', 'Colombo 05'],
            school: 'Royal College',
            availableSeats: 2,
            totalSeats: 20,
        },
    ];

    const quickFilters = [
        { key: 'all', label: 'All' },
        { key: 'verified', label: 'Verified', icon: 'shield-checkmark' },
        { key: 'top_rated', label: 'Top Rated', icon: 'star' },
        { key: 'available', label: 'Available', icon: 'people' },
    ];

    const handleSearch = useCallback(() => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => setLoading(false), 1000);
    }, [searchQuery]);

    const handleServicePress = (service) => {
        router.push(`/parent/service-detail?id=${service.id}`);
    };

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setLoading(true);
        setTimeout(() => setLoading(false), 500);
    };

    const filteredServices = services.filter(service => {
        if (activeFilter === 'verified' && !service.verified) return false;
        if (activeFilter === 'top_rated' && service.rating < 4.5) return false;
        if (activeFilter === 'available' && service.availableSeats === 0) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return (
                service.name.toLowerCase().includes(query) ||
                service.areasServed.some(area => area.toLowerCase().includes(query)) ||
                service.school.toLowerCase().includes(query)
            );
        }
        return true;
    });

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Find Bus Service" showBack />

            <View style={styles.searchSection}>
                <SearchBar
                    placeholder="Search by location, school, or driver..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    onSearch={handleSearch}
                    showFilter
                    onFilterPress={() => setShowFilters(true)}
                />

                {/* Quick Filters */}
                <View style={styles.quickFilters}>
                    {quickFilters.map(filter => (
                        <FilterChip
                            key={filter.key}
                            label={filter.label}
                            icon={filter.icon}
                            selected={activeFilter === filter.key}
                            onPress={() => setActiveFilter(filter.key)}
                        />
                    ))}
                </View>
            </View>

            <ServiceList
                services={filteredServices}
                loading={loading}
                onServicePress={handleServicePress}
                emptyTitle="No services found"
                emptyMessage="Try adjusting your search or filters to find available bus services."
                emptyAction="Clear Filters"
                onEmptyAction={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                    setFilters({});
                }}
            />

            <FilterModal
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                filters={filters}
                onApply={handleApplyFilters}
            />

            <ParentBottomNav />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    searchSection: {
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingMD,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    quickFilters: {
        flexDirection: 'row',
        marginTop: responsive.paddingMD,
        flexWrap: 'wrap',
    },
});
