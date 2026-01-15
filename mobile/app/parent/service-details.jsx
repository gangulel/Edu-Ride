import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Rating } from '../components/ui/Rating';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

const { width } = Dimensions.get('window');

export default function ServiceDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Mock data - replace with API call using params.id
  const service = {
    id: params.id,
    driverName: 'Nimal Perera',
    verified: true,
    rating: 4.8,
    reviewCount: 45,
    yearsExperience: 8,
    totalStudentsServed: 120,
    monthlyFee: 12000,
    weeklyFee: 3200,
    photo: null,
    vehicle: {
      make: 'Toyota',
      model: 'Coaster',
      year: 2018,
      plate: 'CAB-1234',
      capacity: 25,
      currentStudents: 18,
      photos: [],
      features: ['Air Conditioning', 'First Aid Kit', 'Fire Extinguisher', 'GPS Tracking'],
      insurance: 'Valid until Dec 2026',
    },
    route: {
      name: 'Colombo → Royal College Route',
      stops: [
        { area: 'Colombo 07', time: '6:45 AM', type: 'pickup' },
        { area: 'Bambalapitiya', time: '6:55 AM', type: 'pickup' },
        { area: 'Wellawatta', time: '7:05 AM', type: 'pickup' },
        { area: 'Dehiwala', time: '7:15 AM', type: 'pickup' },
        { area: 'Royal College', time: '7:35 AM', type: 'dropoff' },
      ],
      returnTime: '2:00 PM',
      daysOfOperation: 'Monday - Friday',
    },
    reviews: [
      {
        id: 1,
        parentName: 'Parent of Grade 7 student',
        rating: 5,
        date: '2026-01-10',
        text: 'Excellent service! Very punctual and my child feels safe. The bus is clean and well-maintained.',
        driverResponse: 'Thank you for your kind words! Safety and punctuality are my top priorities.',
      },
      {
        id: 2,
        parentName: 'Parent of Grade 5 student',
        rating: 4,
        date: '2026-01-08',
        text: 'Good driver, friendly with kids. Sometimes 5-10 minutes late but overall reliable service.',
        driverResponse: null,
      },
    ],
    cancellationPolicy: {
      '7+days': 'Full refund',
      '3-7days': '50% refund',
      '<3days': 'No refund',
    },
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service Details</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Driver Profile Header */}
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <Avatar 
              name={service.driverName}
              source={service.photo}
              verified={service.verified}
              size={80}
            />
            <View style={styles.profileInfo}>
              <Text style={styles.driverName}>{service.driverName}</Text>
              <Rating rating={service.rating} count={service.reviewCount} size={16} />
              <View style={styles.stats}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{service.yearsExperience}</Text>
                  <Text style={styles.statLabel}>Years Exp.</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{service.totalStudentsServed}+</Text>
                  <Text style={styles.statLabel}>Students</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button 
              variant="outline" 
              style={styles.messageButton}
              onPress={() => router.push('/parent/messages')}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#2563eb" />
              <Text style={styles.messageButtonText}>Message</Text>
            </Button>
            <Button 
              variant="primary" 
              style={styles.bookButton}
              onPress={() => router.push(`/parent/booking?serviceId=${service.id}`)}
            >
              Book Service
            </Button>
          </View>
        </Card>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'overview' && styles.activeTab]}
            onPress={() => setSelectedTab('overview')}
          >
            <Text style={[styles.tabText, selectedTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'vehicle' && styles.activeTab]}
            onPress={() => setSelectedTab('vehicle')}
          >
            <Text style={[styles.tabText, selectedTab === 'vehicle' && styles.activeTabText]}>
              Vehicle
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'reviews' && styles.activeTab]}
            onPress={() => setSelectedTab('reviews')}
          >
            <Text style={[styles.tabText, selectedTab === 'reviews' && styles.activeTabText]}>
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {selectedTab === 'overview' && (
          <View>
            {/* Pricing */}
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Pricing</Text>
              <View style={styles.pricingRow}>
                <View style={styles.priceOption}>
                  <Text style={styles.priceAmount}>LKR {service.monthlyFee.toLocaleString()}</Text>
                  <Text style={styles.priceLabel}>Monthly</Text>
                </View>
                <View style={styles.priceOption}>
                  <Text style={styles.priceAmount}>LKR {service.weeklyFee.toLocaleString()}</Text>
                  <Text style={styles.priceLabel}>Weekly</Text>
                </View>
              </View>
              <Text style={styles.pricingNote}>
                <Ionicons name="information-circle" size={14} color="#6b7280" />
                {' '}Payment methods: Card, Bank Transfer, Mobile Wallet
              </Text>
            </Card>

            {/* Route & Schedule */}
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Route & Schedule</Text>
              <View style={styles.routeInfo}>
                <View style={styles.routeHeader}>
                  <Text style={styles.routeName}>{service.route.name}</Text>
                  <Badge variant="info">{service.route.daysOfOperation}</Badge>
                </View>

                <View style={styles.timeline}>
                  {service.route.stops.map((stop, index) => (
                    <View key={index} style={styles.timelineItem}>
                      <View style={styles.timelineDot}>
                        <View style={[
                          styles.dot,
                          index === 0 && styles.firstDot,
                          index === service.route.stops.length - 1 && styles.lastDot,
                        ]} />
                        {index < service.route.stops.length - 1 && (
                          <View style={styles.timelineLine} />
                        )}
                      </View>
                      <View style={styles.stopInfo}>
                        <Text style={styles.stopArea}>{stop.area}</Text>
                        <Text style={styles.stopTime}>{stop.time}</Text>
                      </View>
                    </View>
                  ))}
                </View>

                <View style={styles.returnInfo}>
                  <Ionicons name="arrow-back" size={16} color="#6b7280" />
                  <Text style={styles.returnText}>
                    Return journey starts at {service.route.returnTime}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Cancellation Policy */}
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Cancellation Policy</Text>
              {Object.entries(service.cancellationPolicy).map(([key, value]) => (
                <View key={key} style={styles.policyRow}>
                  <Text style={styles.policyPeriod}>
                    {key === '7+days' && '7+ days notice'}
                    {key === '3-7days' && '3-7 days notice'}
                    {key === '<3days' && 'Less than 3 days notice'}
                  </Text>
                  <Text style={styles.policyValue}>{value}</Text>
                </View>
              ))}
            </Card>
          </View>
        )}

        {selectedTab === 'vehicle' && (
          <View>
            <Card style={styles.section}>
              <Text style={styles.sectionTitle}>Vehicle Information</Text>
              
              {/* Vehicle Photos */}
              <View style={styles.vehiclePhotos}>
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="bus" size={48} color="#9ca3af" />
                  <Text style={styles.photoText}>Vehicle Photo</Text>
                </View>
              </View>

              <View style={styles.vehicleDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Make & Model</Text>
                  <Text style={styles.detailValue}>
                    {service.vehicle.make} {service.vehicle.model}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Year</Text>
                  <Text style={styles.detailValue}>{service.vehicle.year}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>License Plate</Text>
                  <Text style={styles.detailValue}>{service.vehicle.plate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Capacity</Text>
                  <Text style={styles.detailValue}>
                    {service.vehicle.currentStudents}/{service.vehicle.capacity} students
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Insurance</Text>
                  <Badge variant="success" icon="checkmark-circle">
                    {service.vehicle.insurance}
                  </Badge>
                </View>
              </View>

              <View style={styles.features}>
                <Text style={styles.featuresTitle}>Safety Features</Text>
                {service.vehicle.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons name="checkmark-circle" size={20} color="#16a34a" />
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        )}

        {selectedTab === 'reviews' && (
          <View>
            <Card style={styles.section}>
              <View style={styles.reviewsHeader}>
                <Text style={styles.sectionTitle}>Reviews & Ratings</Text>
                <Rating rating={service.rating} count={service.reviewCount} size={18} />
              </View>

              {service.reviews.map((review) => (
                <View key={review.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewerName}>{review.parentName}</Text>
                    <Text style={styles.reviewDate}>{review.date}</Text>
                  </View>
                  <Rating rating={review.rating} showCount={false} size={14} style={styles.reviewRating} />
                  <Text style={styles.reviewText}>{review.text}</Text>
                  
                  {review.driverResponse && (
                    <View style={styles.driverResponse}>
                      <View style={styles.responseHeader}>
                        <Ionicons name="arrow-redo" size={14} color="#6b7280" />
                        <Text style={styles.responseLabel}>Driver's Response</Text>
                      </View>
                      <Text style={styles.responseText}>{review.driverResponse}</Text>
                    </View>
                  )}
                </View>
              ))}
            </Card>
          </View>
        )}
      </ScrollView>

      {/* Sticky Footer */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Monthly Fee</Text>
          <Text style={styles.footerPriceAmount}>LKR {service.monthlyFee.toLocaleString()}</Text>
        </View>
        <Button 
          variant="primary" 
          size="large"
          style={styles.footerButton}
          onPress={() => router.push(`/parent/booking?serviceId=${service.id}`)}
        >
          Book This Service
        </Button>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  shareButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    marginBottom: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  driverName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  stats: {
    flexDirection: 'row',
    marginTop: 12,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  messageButtonText: {
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '600',
  },
  bookButton: {
    flex: 2,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#2563eb',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  activeTabText: {
    color: '#ffffff',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  pricingRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  priceOption: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
  },
  priceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  pricingNote: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 18,
  },
  routeInfo: {
    marginTop: 8,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  timeline: {
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineDot: {
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#9ca3af',
  },
  firstDot: {
    backgroundColor: '#16a34a',
  },
  lastDot: {
    backgroundColor: '#2563eb',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  stopInfo: {
    flex: 1,
    paddingTop: -4,
  },
  stopArea: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  stopTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  returnInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  returnText: {
    fontSize: 14,
    color: '#374151',
  },
  policyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  policyPeriod: {
    fontSize: 14,
    color: '#374151',
  },
  policyValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  vehiclePhotos: {
    marginBottom: 20,
  },
  photoPlaceholder: {
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    marginTop: 8,
    fontSize: 14,
    color: '#9ca3af',
  },
  vehicleDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  features: {
    marginTop: 8,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#374151',
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  reviewRating: {
    marginBottom: 8,
  },
  reviewText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  driverResponse: {
    marginTop: 12,
    paddingLeft: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  responseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  responseLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  responseText: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 16,
  },
  footerPrice: {
    justifyContent: 'center',
  },
  footerPriceLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  footerPriceAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  footerButton: {
    flex: 1,
  },
});
