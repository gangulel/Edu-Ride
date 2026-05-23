import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    TouchableOpacity,
    TextInput,
    FlatList,
    ActivityIndicator,
    StatusBar,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    SearchNormal1,
    Location,
    Star1,
    Shield,
    People,
    Bus,
    ArrowLeft,
    ArrowRight2,
    Verify,
    Clock,
    CloseCircle,
    Car,
    Truck,
} from 'iconsax-react-native';
import { responsive, wp, hp, fs } from '../utils/responsive';
import { searchDrivers } from '../../services/mock';
import { ParentBottomNav } from '../components/organisms';

// Maps mock driver shape to the legacy UI shape used by this screen.
const driverToService = (d, idx) => ({
    id: d.id || idx + 1,
    name: d.name,
    verified: !!d.verified,
    rating: d.rating ?? 0,
    reviewCount: d.totalReviews ?? d.reviewCount ?? 0,
    monthlyFee: d.monthlyFee ?? 0,
    areasServed: d.areas || d.areasServed || [],
    school: d.school || 'Royal College',
    availableSeats: Math.max(0, Math.floor((d.seats || 0) / 3)),
    totalSeats: d.seats ?? 0,
    experience: d.yearsOfExperience ? `${d.yearsOfExperience} years` : '—',
    vehicleType: d.vehicleModel || d.vehicleType || 'Van',
    category: (d.vehicleType || 'van').toLowerCase(),
    isAC: !!d.hasAC,
});

const FALLBACK_SERVICES = [];

export default function SearchScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [services, setServices] = useState(FALLBACK_SERVICES);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const drivers = await searchDrivers({});
            if (!cancelled) {
                setServices(drivers.map(driverToService));
                setLoading(false);
            }
        })();
        return () => { cancelled = true; };
    }, []);

    const quickFilters = [
        { key: 'all', label: 'All', icon: Bus },
        { key: 'verified', label: 'Verified', icon: Shield },
        { key: 'top_rated', label: 'Top Rated', icon: Star1 },
        { key: 'available', label: 'Available', icon: People },
    ];

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedVehicleType, setSelectedVehicleType] = useState('all');
    const [selectedACType, setSelectedACType] = useState('all');

    // Sri Lankan Locations
    const sriLankanLocations = [
        // Colombo District
        'Colombo 01', 'Colombo 02', 'Colombo 03', 'Colombo 04', 'Colombo 05',
        'Colombo 06', 'Colombo 07', 'Colombo 08', 'Colombo 09', 'Colombo 10',
        'Colombo 11', 'Colombo 12', 'Colombo 13', 'Colombo 14', 'Colombo 15',
        'Bambalapitiya', 'Wellawatte', 'Dehiwala', 'Mount Lavinia', 'Ratmalana',
        'Moratuwa', 'Panadura', 'Nugegoda', 'Maharagama', 'Kottawa', 'Piliyandala',
        'Boralesgamuwa', 'Homagama', 'Kaduwela', 'Malabe', 'Battaramulla',
        'Rajagiriya', 'Nawala', 'Narahenpita', 'Kirulapone', 'Kolpetty',
        'Kollupitiya', 'Slave Island', 'Pettah', 'Fort', 'Maradana',
        'Dematagoda', 'Kotahena', 'Mattakkuliya', 'Modara', 'Grandpass',
        'Kelaniya', 'Peliyagoda', 'Wattala', 'Hendala', 'Ja-Ela',
        'Ekala', 'Seeduwa', 'Katunayake', 'Negombo', 'Divulapitiya',
        'Minuwangoda', 'Gampaha', 'Kadawatha', 'Kiribathgoda',

        // Other Major Cities
        'Kandy', 'Peradeniya', 'Katugastota', 'Kundasale', 'Digana',
        'Galle', 'Hikkaduwa', 'Unawatuna', 'Ambalangoda', 'Bentota',
        'Matara', 'Weligama', 'Mirissa', 'Tangalle', 'Hambantota',
        'Jaffna', 'Nallur', 'Chavakachcheri', 'Point Pedro', 'Karainagar',
        'Trincomalee', 'Kinniya', 'Uppuveli', 'Nilaveli',
        'Batticaloa', 'Kattankudy', 'Eravur', 'Kaluwanchikudy',
        'Anuradhapura', 'Mihintale', 'Medawachchiya', 'Kekirawa',
        'Polonnaruwa', 'Higurakgoda', 'Medirigiriya',
        'Kurunegala', 'Kuliyapitiya', 'Narammala', 'Pannala', 'Mawathagama',
        'Badulla', 'Bandarawela', 'Haputale', 'Welimada', 'Ella',
        'Ratnapura', 'Balangoda', 'Pelmadulla', 'Embilipitiya',
        'Nuwara Eliya', 'Hatton', 'Talawakelle', 'Nawalapitiya',
        'Matale', 'Dambulla', 'Sigiriya', 'Habarana',
        'Kegalle', 'Mawanella', 'Rambukkana', 'Warakapola',
        'Kalutara', 'Beruwala', 'Aluthgama', 'Wadduwa',
        'Chilaw', 'Puttalam', 'Kalpitiya', 'Marawila',
        'Mannar', 'Talaimannar', 'Kilinochchi', 'Mullaitivu',
        'Vavuniya', 'Ampara', 'Akkaraipattu', 'Kalmunai',
        'Monaragala', 'Wellawaya', 'Bibile',

        // Popular Suburbs
        'Thalawathugoda', 'Kotte', 'Sri Jayawardenepura', 'Ethul Kotte',
        'Pita Kotte', 'Mirihana', 'Gangodawila', 'Kohuwala', 'Pepiliyana',
        'Udahamulla', 'Talangama', 'Koswatta', 'Hokandara', 'Athurugiriya',
        'Thalahena', 'Welikada', 'Biyagama', 'Sapugaskanda',
    ];

    // Sri Lankan Schools
    const sriLankanSchools = [
        // Colombo National Schools
        'Royal College Colombo', 'Visakha Vidyalaya', 'Ananda College',
        'Nalanda College', 'Devi Balika Vidyalaya', 'Musaeus College',
        'Mahanama College', 'Isipathana College', 'Thurstan College',
        'D.S. Senanayake College', 'Prince of Wales College', 'Lumbini College',
        'Ananda Balika Vidyalaya', 'Gothami Balika Vidyalaya', 'Sirimavo Bandaranaike Vidyalaya',
        'President\'s College', 'Asoka Vidyalaya', 'Dharmapala Vidyalaya',

        // Colombo Catholic Schools
        "St. Joseph's College Colombo", "St. Peter's College Colombo 04",
        "St. Thomas' College Mount Lavinia", "St. Benedict's College Kotahena",
        "St. Bridget's Convent Colombo", "St. Paul's Milagiriya",
        "St. Lawrence's Convent Colombo 06", "St. Paul's Girls' School Milagiriya",
        "Holy Family Convent Bambalapitiya", "Good Shepherd Convent Kotahena",
        "De Mazenod College Kandana", "St. Sebastian's College Moratuwa",
        "Maris Stella College Negombo", "St. Mary's College Negombo",
        "St. Anne's College Kurunegala", "Holy Cross College Gampaha",
        "Sacred Heart Convent Galle", "Loyola College Negombo",
        "De La Salle College Mutwal", "St. John's College Nugegoda",

        // Colombo Private & International Schools
        'Ladies College Colombo', 'Bishop\'s College Colombo', 'Wesley College Colombo',
        'Carey College Colombo', 'Methodist College Colombo',
        'Gateway College Colombo', 'Gateway College Rajagiriya',
        'Asian International School', 'Lyceum International School Nugegoda',
        'Lyceum International School Wattala', 'Lyceum International School Panadura',
        'Colombo International School', 'Elizabeth Moir School',
        'British School Colombo', 'Overseas School of Colombo',
        'Royal Institute Colombo', 'Stafford International School',
        'Alethea International School', 'Leeds International School',
        'Ilma International Girls School', 'The American School of Colombo',
        'CIS Kandy', 'CMS Ladies College',

        // Colombo Hindu Schools
        'Colombo Hindu College', 'Hindu Ladies College Colombo',
        'Vivekananda College Colombo', 'Ramakrishna Vidyalaya',

        // Colombo Muslim Schools
        'Zahira College Colombo', 'Al Hikma College Colombo',
        'Muslim Ladies College', 'Hameediyah Ladies College',
        'Mahanama Muslim Vidyalaya', 'Ananda College Maradana',

        // Colombo Suburban Schools - Nugegoda
        'Anula Vidyalaya Nugegoda', 'Viharamahadevi Balika Vidyalaya',
        'Sujatha Vidyalaya Nugegoda', 'Science College Nugegoda',
        'Nugegoda Technical College', 'Dharmashoka Vidyalaya Nugegoda',

        // Colombo Suburban Schools - Maharagama
        'Maharagama Central College', 'Parakrama Maha Vidyalaya Maharagama',
        'Sri Palee College Horana', 'Maharagama Dharmaraja College',

        // Colombo Suburban Schools - Dehiwala/Mount Lavinia
        'St. Thomas\' College Mount Lavinia', 'Southlands College',
        'St. Mary\'s College Mount Lavinia', 'St. Anthony\'s College Dehiwala',
        'Kalutara Balika Vidyalaya', 'Taxila Central College',

        // Colombo Suburban Schools - Kottawa/Piliyandala
        'Piliyandala Central College', 'Kottawa Dharmapala Maha Vidyalaya',
        'Boralesgamuwa Maha Vidyalaya', 'Homagama Maha Vidyalaya',

        // Colombo Suburban Schools - Moratuwa/Panadura
        'St. Sebastian\'s College Moratuwa', 'Moratu Maha Vidyalaya',
        'Panadura Balika Maha Vidyalaya', 'Susila Vidyalaya Panadura',

        // Colombo Suburban Schools - Rajagiriya/Battaramulla
        'Vidyartha College Rajagiriya', 'Sri Lanka Broadcasting Corporation School',
        'Battaramulla Central College', 'Thalawathugoda Maha Vidyalaya',

        // Colombo Suburban Schools - Kotte
        'Sri Jayawardenepura Maha Vidyalaya', 'Kotte North Maha Vidyalaya',
        'Pita Kotte Central College', 'Mirihana Maha Vidyalaya',

        // Colombo Suburban Schools - Kelaniya/Wattala
        'Kelaniya Central College', 'Vidyaloka Maha Vidyalaya Kelaniya',
        'Wattala Central College', 'Hendala Maha Vidyalaya',
        'Ja-Ela Central College', 'Ekala Maha Vidyalaya',

        // Colombo Suburban Schools - Malabe/Kaduwela
        'Malabe Central College', 'Koswatta Maha Vidyalaya',
        'Kaduwela Central College', 'Athurugiriya Maha Vidyalaya',

        // Other Colombo Schools
        'Seethadevi Balika Vidyalaya', 'Rathnavali Balika Vidyalaya',
        'Yasodara Devi Balika Vidyalaya', 'C.W.W. Kannangara Vidyalaya',
        'Colombo South International College', 'Wycherley International School',
        'Horizon College Colombo', 'Colombo Leadership Academy',

        // Kandy Schools
        'Trinity College Kandy', 'Dharmaraja College Kandy', "St. Anthony's College Kandy",
        'Girls\' High School Kandy', 'St. Sylvester\'s College Kandy',
        'Mahamaya Girls\' College', 'Pushpadana Girls\' College', 'Kingswood College',
        'Hillwood College', "Good Shepherd Convent Kandy",

        // Galle Schools
        'Richmond College Galle', 'Southlands College Galle', 'Mahinda College Galle',
        'Sanghamitta Balika Vidyalaya', 'Sacred Heart Convent Galle', "St. Aloysius' College Galle",

        // Jaffna Schools
        'Jaffna Hindu College', 'St. John\'s College Jaffna', 'Jaffna Central College',
        'Chundikuli Girls\' College', 'Jaffna College', 'Holy Family Convent Jaffna',
        'Hartley College Point Pedro', 'St. Patrick\'s College Jaffna',

        // Other Major Schools
        'St. Thomas\' College Matara', 'Rahula College Matara', 'Richmond College Matara',
        'Maliyadeva Balika Vidyalaya Kurunegala', 'Pinnawala Central College',
        'Bandaranayake College Gampaha', 'Taxila Central College Horana',
        'Rathnavali Balika Vidyalaya', 'Yasodara Devi Balika Vidyalaya',
        'C.W.W. Kannangara Vidyalaya', 'Anula Vidyalaya Nugegoda',
        'Viharamahadevi Balika Vidyalaya', 'Seethadevi Balika Vidyalaya',
        'Devi Balika Vidyalaya Ratnapura', 'Sivali Central College',
        'St. Anne\'s College Kurunegala', 'Holy Cross College Gampaha',
        'De Mazenod College Kandana', 'St. Sebastian\'s College Moratuwa',
        'Piliyandala Central College', 'Mahinda Rajapaksa College',
        'Science College', 'Royal Institute Colombo',
    ];

    // Combine all suggestions
    const allSuggestions = [
        ...sriLankanLocations.map(loc => ({ type: 'location', name: loc })),
        ...sriLankanSchools.map(school => ({ type: 'school', name: school })),
    ];

    // Filter suggestions based on search query
    const filteredSuggestions = searchQuery.length >= 2
        ? allSuggestions.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8) // Limit to 8 suggestions
        : [];

    const handleSuggestionPress = (suggestion) => {
        setSearchQuery(suggestion.name);
        setShowSuggestions(false);
        handleSearch();
    };

    const handleSearch = useCallback(() => {
        setLoading(true);
        setShowSuggestions(false);
        setTimeout(() => setLoading(false), 1000);
    }, [searchQuery]);

    const handleServicePress = (service) => {
        router.push(`/parent/service-detail?id=${service.id}`);
    };

    const sortBy = 'rating';

    const filteredServices = services
        .filter(service => {
            if (activeFilter === 'verified' && !service.verified) return false;
            if (activeFilter === 'top_rated' && service.rating < 4.5) return false;
            if (activeFilter === 'available' && service.availableSeats === 0) return false;

            // Vehicle Type Filter
            if (selectedVehicleType !== 'all' && service.category !== selectedVehicleType) return false;

            // AC Filter
            if (selectedACType === 'ac' && !service.isAC) return false;
            if (selectedACType === 'non-ac' && service.isAC) return false;

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    service.name.toLowerCase().includes(query) ||
                    service.areasServed.some(area => area.toLowerCase().includes(query)) ||
                    service.school.toLowerCase().includes(query)
                );
            }
            return true;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'rating':
                    return b.rating - a.rating;
                case 'price_low':
                    return a.monthlyFee - b.monthlyFee;
                case 'price_high':
                    return b.monthlyFee - a.monthlyFee;
                case 'seats':
                    return b.availableSeats - a.availableSeats;
                default:
                    return 0;
            }
        });

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const renderServiceCard = ({ item: service }) => (
        <TouchableOpacity
            style={styles.serviceCard}
            onPress={() => handleServicePress(service)}
            activeOpacity={0.7}
        >
            <View style={styles.cardHeader}>
                <View style={styles.driverInfo}>
                    <View style={styles.driverAvatar}>
                        <Text style={styles.driverInitials}>{getInitials(service.name)}</Text>
                    </View>
                    <View style={styles.driverDetails}>
                        <View style={styles.nameRow}>
                            <Text style={styles.driverName}>{service.name}</Text>
                            {service.verified && (
                                <Verify size={18} color="#3B82F6" variant="Bold" />
                            )}
                        </View>
                        <View style={styles.ratingRow}>
                            <Star1 size={14} color="#F59E0B" variant="Bold" />
                            <Text style={styles.ratingText}>{service.rating}</Text>
                            <Text style={styles.reviewCount}>({service.reviewCount} reviews)</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceLabel}>Monthly</Text>
                    <Text style={styles.priceValue}>Rs. {service.monthlyFee.toLocaleString()}</Text>
                </View>
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBody}>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        {service.category === 'bus' && <Bus size={16} color="#64748B" variant="Outline" />}
                        {service.category === 'van' && <Truck size={16} color="#64748B" variant="Outline" />}
                        {service.category === 'car' && <Car size={16} color="#64748B" variant="Outline" />}
                        {service.category === 'weel' && <Bus size={16} color="#64748B" variant="Outline" />}
                        <Text style={styles.infoText}>{service.vehicleType}</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <View style={[
                            styles.acBadge,
                            { backgroundColor: service.isAC ? '#DBEAFE' : '#F1F5F9' }
                        ]}>
                            <Text style={[
                                styles.acBadgeText,
                                { color: service.isAC ? '#3B82F6' : '#64748B' }
                            ]}>
                                {service.isAC ? 'A/C' : 'Non-A/C'}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.infoItem}>
                        <Clock size={16} color="#64748B" variant="Outline" />
                        <Text style={styles.infoText}>{service.experience}</Text>
                    </View>
                </View>

                <View style={styles.locationRow}>
                    <Location size={16} color="#3B82F6" variant="Bold" />
                    <Text style={styles.locationText} numberOfLines={1}>
                        {service.areasServed.slice(0, 3).join(' • ')}
                    </Text>
                </View>
            </View>

            <View style={styles.cardFooter}>
                <View style={[
                    styles.seatsContainer,
                    { backgroundColor: service.availableSeats > 3 ? '#ECFDF5' : '#FEF3C7' }
                ]}>
                    <People size={16} color={service.availableSeats > 3 ? '#10B981' : '#F59E0B'} variant="Bold" />
                    <Text style={[
                        styles.seatsText,
                        { color: service.availableSeats > 3 ? '#10B981' : '#F59E0B' }
                    ]}>
                        {service.availableSeats} seats available
                    </Text>
                </View>
                <View style={styles.viewDetailsBtn}>
                    <Text style={styles.viewDetailsText}>View Details</Text>
                    <ArrowRight2 size={16} color="#3B82F6" />
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            {/* Header */}
            <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <SafeAreaView>
                    <View style={styles.headerContent}>
                        <TouchableOpacity
                            style={styles.backBtn}
                            onPress={() => router.back()}
                        >
                            <ArrowLeft size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Find Bus Service</Text>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <View style={styles.searchInputContainer}>
                            <SearchNormal1 size={20} color="#64748B" variant="Outline" />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search by location, school, driver..."
                                placeholderTextColor="#94A3B8"
                                value={searchQuery}
                                onChangeText={(text) => {
                                    setSearchQuery(text);
                                    setShowSuggestions(text.length >= 2);
                                }}
                                onSubmitEditing={handleSearch}
                                onFocus={() => setShowSuggestions(searchQuery.length >= 2)}
                                returnKeyType="search"
                            />
                            {searchQuery.length > 0 && (
                                <TouchableOpacity onPress={() => {
                                    setSearchQuery('');
                                    setShowSuggestions(false);
                                }}>
                                    <CloseCircle size={20} color="#94A3B8" variant="Bold" />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Suggestions Dropdown */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <View style={styles.suggestionsContainer}>
                                {filteredSuggestions.map((suggestion, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.suggestionItem}
                                        onPress={() => handleSuggestionPress(suggestion)}
                                        activeOpacity={0.7}
                                    >
                                        {suggestion.type === 'location' ? (
                                            <Location size={18} color="#3B82F6" variant="Bold" />
                                        ) : (
                                            <Bus size={18} color="#10B981" variant="Bold" />
                                        )}
                                        <View style={styles.suggestionTextContainer}>
                                            <Text style={styles.suggestionText}>{suggestion.name}</Text>
                                            <Text style={styles.suggestionType}>
                                                {suggestion.type === 'location' ? 'Location' : 'School'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Quick Filters */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.filtersContainer}
                    >
                        {quickFilters.map((filter) => (
                            <TouchableOpacity
                                key={filter.key}
                                style={[
                                    styles.filterChip,
                                    activeFilter === filter.key && styles.filterChipActive,
                                ]}
                                onPress={() => setActiveFilter(filter.key)}
                                activeOpacity={0.7}
                            >
                                <filter.icon
                                    size={16}
                                    color={activeFilter === filter.key ? '#3B82F6' : '#fff'}
                                    variant={activeFilter === filter.key ? 'Bold' : 'Outline'}
                                />
                                <Text
                                    style={[
                                        styles.filterText,
                                        activeFilter === filter.key && styles.filterTextActive,
                                    ]}
                                >
                                    {filter.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* Secondary Filter Row - Vehicle Type */}
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={[styles.filtersContainer, { paddingTop: hp(8) }]}
                    >
                        {['all', 'bus', 'van', 'car', 'weel'].map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.secondaryFilterChip,
                                    selectedVehicleType === type && styles.secondaryFilterChipActive,
                                ]}
                                onPress={() => setSelectedVehicleType(type)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.secondaryFilterText,
                                        selectedVehicleType === type && styles.secondaryFilterTextActive,
                                    ]}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1) === 'Weel' ? '3-Wheel' : type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    {/* AC Filter Row */}
                    <View style={styles.acFilterContainer}>
                        {['all', 'ac', 'non-ac'].map((acType) => (
                            <TouchableOpacity
                                key={acType}
                                style={[
                                    styles.acFilterChip,
                                    selectedACType === acType && styles.acFilterChipActive,
                                ]}
                                onPress={() => setSelectedACType(acType)}
                                activeOpacity={0.7}
                            >
                                <Text
                                    style={[
                                        styles.acFilterText,
                                        selectedACType === acType && styles.acFilterTextActive,
                                    ]}
                                >
                                    {acType === 'all' ? 'Any AC' : acType.toUpperCase()}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* Results Section */}
            <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                    {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
                </Text>
            </View>

            {/* Service List */}
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.loadingText}>Finding services...</Text>
                </View>
            ) : filteredServices.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <View style={styles.emptyIconContainer}>
                        <SearchNormal1 size={48} color="#94A3B8" variant="Outline" />
                    </View>
                    <Text style={styles.emptyTitle}>No services found</Text>
                    <Text style={styles.emptyMessage}>
                        Try adjusting your search or filters to find available bus services.
                    </Text>
                    <TouchableOpacity
                        style={styles.clearBtn}
                        onPress={() => {
                            setSearchQuery('');
                            setActiveFilter('all');
                            setSelectedVehicleType('all');
                            setSelectedACType('all');
                        }}
                    >
                        <Text style={styles.clearBtnText}>Clear Filters</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredServices}
                    renderItem={renderServiceCard}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
                />
            )}

            <ParentBottomNav />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingBottom: hp(16),
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: wp(16),
        paddingTop: hp(10),
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
    searchContainer: {
        paddingHorizontal: wp(16),
        paddingTop: hp(16),
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        paddingHorizontal: 16,
        height: 52,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: fs(15),
        fontFamily: 'Roboto-Regular',
        color: '#1E293B',
    },
    suggestionsContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginTop: 8,
        paddingVertical: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    suggestionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    suggestionTextContainer: {
        flex: 1,
    },
    suggestionText: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Medium',
        color: '#1E293B',
    },
    suggestionType: {
        fontSize: fs(11),
        fontFamily: 'Roboto-Regular',
        color: '#94A3B8',
        marginTop: 2,
    },
    filtersContainer: {
        paddingHorizontal: wp(16),
        paddingTop: hp(16),
        gap: 10,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.15)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        marginRight: 10,
        gap: 6,
    },
    filterChipActive: {
        backgroundColor: '#fff',
    },
    filterText: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Medium',
        color: '#fff',
    },
    filterTextActive: {
        color: '#3B82F6',
    },
    secondaryFilterChip: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginRight: 8,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    secondaryFilterChipActive: {
        backgroundColor: 'rgba(255,255,255,0.25)',
        borderColor: '#fff',
    },
    secondaryFilterText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
        color: 'rgba(255,255,255,0.7)',
    },
    secondaryFilterTextActive: {
        color: '#fff',
    },
    acFilterContainer: {
        flexDirection: 'row',
        paddingHorizontal: wp(16),
        paddingTop: hp(12),
        gap: 8,
    },
    acFilterChip: {
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.08)',
        paddingVertical: 8,
        borderRadius: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    acFilterChipActive: {
        backgroundColor: '#fff',
        borderColor: '#fff',
    },
    acFilterText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Bold',
        color: 'rgba(255,255,255,0.7)',
    },
    acFilterTextActive: {
        color: '#3B82F6',
    },
    resultsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: wp(20),
        paddingVertical: hp(16),
    },
    resultsCount: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Medium',
        color: '#64748B',
    },


    listContainer: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(100),
    },
    serviceCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    driverInfo: {
        flexDirection: 'row',
        flex: 1,
    },
    driverAvatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    driverInitials: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#3B82F6',
    },
    driverDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    driverName: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        gap: 4,
    },
    ratingText: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Bold',
        color: '#F59E0B',
    },
    reviewCount: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Regular',
        color: '#94A3B8',
    },
    priceContainer: {
        alignItems: 'flex-end',
    },
    priceLabel: {
        fontSize: fs(11),
        fontFamily: 'Roboto-Regular',
        color: '#94A3B8',
    },
    priceValue: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#10B981',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 14,
    },
    cardBody: {
        gap: 10,
    },
    infoRow: {
        flexDirection: 'row',
        gap: 20,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    infoText: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
    },
    acBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    acBadgeText: {
        fontSize: fs(10),
        fontFamily: 'Roboto-Bold',
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    locationText: {
        flex: 1,
        fontSize: fs(13),
        fontFamily: 'Roboto-Medium',
        color: '#3B82F6',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
    },
    seatsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    seatsText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
    },
    viewDetailsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    viewDetailsText: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Medium',
        color: '#3B82F6',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    loadingText: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: wp(40),
    },
    emptyIconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        marginBottom: 8,
    },
    emptyMessage: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    clearBtn: {
        marginTop: 20,
        paddingHorizontal: 24,
        paddingVertical: 12,
        backgroundColor: '#3B82F6',
        borderRadius: 25,
    },
    clearBtnText: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Medium',
        color: '#fff',
    },
});
