import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../components/ui/SearchBar';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Rating } from '../components/ui/Rating';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function ParentHomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [highRatedOnly, setHighRatedOnly] = useState(false);

  // Mock data - replace with API calls
  const activeSubscription = {
    driver: {
      name: 'John Silva',
      photo: null,
      verified: true,
    },
    vehicle: {
      make: 'Toyota',
      model: 'Coaster',
      plate: 'CAB-1234',
    },
    status: 'Active',
    expiryDate: '2026-02-15',
  };

  const availableServices = [
    {
      id: 1,
      driverName: 'Nimal Perera',
      verified: true,
      rating: 4.8,
      reviewCount: 45,
      monthlyFee: 12000,
      route: 'Colombo 07 → Dehiwala → Ratmalana',
      currentStudents: 18,
      capacity: 25,
      photo: null,
    },
    {
      id: 2,
      driverName: 'Kamal Fernando',
      verified: true,
      rating: 4.6,
      reviewCount: 32,
      monthlyFee: 10500,
      route: 'Nugegoda → Maharagama → Homagama',
      currentStudents: 15,
      capacity: 20,
      photo: null,
    },
    {
      id: 3,
      driverName: 'Sunil Jayasinghe',
      verified: false,
      rating: 4.3,
      reviewCount: 18,
      monthlyFee: 9500,
      route: 'Kaduwela → Malabe → Battaramulla',
      currentStudents: 12,
      capacity: 20,
      photo: null,
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => setRefreshing(false), 1500);
  };

  const filteredServices = availableServices.filter(service => {
    if (verifiedOnly && !service.verified) return false;
    if (highRatedOnly && service.rating < 4.0) return false;
    if (searchQuery && !service.route.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Hello, Parent! 👋</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color="#6b7280" />
              <Text style={styles.location}>Colombo, Sri Lanka</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#374151" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push('/parent/profile')}
            >
              <Avatar name="Parent" size={36} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Active Subscription Card */}
        {activeSubscription && (
          <Card style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <Badge variant="success" icon="checkmark-circle">Active</Badge>
              <Text style={styles.expiryText}>Until {activeSubscription.expiryDate}</Text>
            </View>
            
            <View style={styles.subscriptionBody}>
              <Avatar 
                name={activeSubscription.driver.name}
                source={activeSubscription.driver.photo}
                verified={activeSubscription.driver.verified}
                size={56}
              />
              <View style={styles.subscriptionInfo}>
                <Text style={styles.driverName}>{activeSubscription.driver.name}</Text>
                <Text style={styles.vehicleInfo}>
                  {activeSubscription.vehicle.make} {activeSubscription.vehicle.model} • {activeSubscription.vehicle.plate}
                </Text>
              </View>
            </View>

            <View style={styles.quickActions}>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/parent/messages')}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#2563eb" />
                <Text style={styles.quickActionText}>Message</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/parent/schedule')}
              >
                <Ionicons name="time-outline" size={20} color="#2563eb" />
                <Text style={styles.quickActionText}>Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.quickActionButton}
                onPress={() => router.push('/parent/payment')}
              >
                <Ionicons name="card-outline" size={20} color="#2563eb" />
                <Text style={styles.quickActionText}>Payment</Text>
              </TouchableOpacity>
            </View>
          </Card>
        )}

        {/* Search Section */}
        <View style={styles.searchSection}>
          <Text style={styles.sectionTitle}>Find School Bus Services</Text>
          <SearchBar
            placeholder="Search by school or area..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            style={styles.searchBar}
          />

          {/* Filters */}
          <View style={styles.filters}>
            <TouchableOpacity
              style={[styles.filterChip, verifiedOnly && styles.filterChipActive]}
              onPress={() => setVerifiedOnly(!verifiedOnly)}
            >
              <Ionicons 
                name={verifiedOnly ? "checkmark-circle" : "shield-outline"} 
                size={16} 
                color={verifiedOnly ? "#ffffff" : "#6b7280"} 
              />
              <Text style={[
                styles.filterChipText,
                verifiedOnly && styles.filterChipTextActive
              ]}>
                Verified Only
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.filterChip, highRatedOnly && styles.filterChipActive]}
              onPress={() => setHighRatedOnly(!highRatedOnly)}
            >
              <Ionicons 
                name={highRatedOnly ? "star" : "star-outline"} 
                size={16} 
                color={highRatedOnly ? "#ffffff" : "#6b7280"} 
              />
              <Text style={[
                styles.filterChipText,
                highRatedOnly && styles.filterChipTextActive
              ]}>
                4+ Stars
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Services */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Available Services</Text>
            <Text style={styles.resultCount}>{filteredServices.length} found</Text>
          </View>

          {filteredServices.map((service) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => router.push(`/parent/service-details?id=${service.id}`)}
            >
              <Card style={styles.serviceCard}>
                <View style={styles.serviceHeader}>
                  <Avatar 
                    name={service.driverName}
                    source={service.photo}
                    verified={service.verified}
                    size={48}
                  />
                  <View style={styles.serviceHeaderInfo}>
                    <Text style={styles.serviceName}>{service.driverName}</Text>
                    <Rating 
                      rating={service.rating} 
                      count={service.reviewCount}
                      size={14}
                    />
                  </View>
                  <View style={styles.priceContainer}>
                    <Text style={styles.price}>LKR {service.monthlyFee.toLocaleString()}</Text>
                    <Text style={styles.priceLabel}>/month</Text>
                  </View>
                </View>

                <View style={styles.routeContainer}>
                  <Ionicons name="navigate" size={16} color="#6b7280" />
                  <Text style={styles.routeText}>{service.route}</Text>
                </View>

                <View style={styles.serviceFooter}>
                  <View style={styles.capacityInfo}>
                    <Ionicons name="people" size={16} color="#6b7280" />
                    <Text style={styles.capacityText}>
                      {service.currentStudents}/{service.capacity} students
                    </Text>
                  </View>
                  <Button 
                    variant="outline" 
                    size="small"
                    onPress={() => router.push(`/parent/service-details?id=${service.id}`)}
                  >
                    View Details
                  </Button>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/home')}>
          <Ionicons name="home" size={24} color="#2563eb" />
          <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/bookings')}>
          <Ionicons name="calendar-outline" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Bookings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/messages')}>
          <Ionicons name="chatbubble-outline" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/parent/profile')}>
          <Ionicons name="person-outline" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 14,
    color: '#6b7280',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subscriptionCard: {
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  subscriptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  expiryText: {
    fontSize: 12,
    color: '#6b7280',
  },
  subscriptionBody: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  subscriptionInfo: {
    marginLeft: 12,
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  quickActionButton: {
    alignItems: 'center',
    gap: 4,
  },
  quickActionText: {
    fontSize: 12,
    color: '#2563eb',
    fontWeight: '500',
  },
  searchSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  searchBar: {
    marginBottom: 12,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  servicesSection: {
    marginBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  serviceCard: {
    marginBottom: 12,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceHeaderInfo: {
    flex: 1,
    marginLeft: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    marginBottom: 12,
  },
  routeText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  capacityText: {
    fontSize: 14,
    color: '#6b7280',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  navTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
