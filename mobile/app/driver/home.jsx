import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Switch,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function DriverHomeScreen() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - replace with API calls
  const todaySchedule = {
    date: 'January 15, 2026',
    day: 'Wednesday',
    morning: {
      startTime: '6:30 AM',
      endTime: '7:45 AM',
      studentCount: 18,
      route: [
        { area: 'Colombo 07', time: '6:45 AM', students: 3 },
        { area: 'Bambalapitiya', time: '6:55 AM', students: 5 },
        { area: 'Wellawatta', time: '7:05 AM', students: 4 },
        { area: 'Dehiwala', time: '7:15 AM', students: 6 },
      ],
    },
    afternoon: {
      startTime: '2:00 PM',
      endTime: '3:15 PM',
      studentCount: 18,
    },
  };

  const bookingRequests = [
    {
      id: 1,
      parentName: 'Kumari Silva',
      childName: 'Sahan Silva',
      grade: '7',
      school: 'Royal College',
      pickupArea: 'Colombo 05',
      dropoffArea: 'Royal College',
      requestDate: '2026-01-14',
      photo: null,
    },
    {
      id: 2,
      parentName: 'Nadeeka Fernando',
      childName: 'Amaya Fernando',
      grade: '5',
      school: 'Royal College',
      pickupArea: 'Bambalapitiya',
      dropoffArea: 'Royal College',
      requestDate: '2026-01-13',
      photo: null,
    },
  ];

  const revenue = {
    thisMonth: 216000,
    pending: 48000,
    lastMonth: 204000,
    students: 18,
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Driver Dashboard</Text>
            <Text style={styles.date}>{todaySchedule.date}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications-outline" size={24} color="#374151" />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>2</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => router.push('/driver/profile')}
            >
              <Avatar name="Driver" size={36} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Online/Offline Toggle */}
        <View style={styles.onlineToggle}>
          <View style={styles.toggleInfo}>
            <View style={[styles.statusDot, isOnline && styles.statusDotOnline]} />
            <Text style={styles.statusText}>
              {isOnline ? 'Accepting New Bookings' : 'Not Accepting Bookings'}
            </Text>
          </View>
          <Switch
            value={isOnline}
            onValueChange={setIsOnline}
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={isOnline ? '#2563eb' : '#f3f4f6'}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Revenue Overview */}
        <Card style={styles.revenueCard}>
          <View style={styles.revenueHeader}>
            <Text style={styles.sectionTitle}>Revenue Overview</Text>
            <TouchableOpacity onPress={() => router.push('/driver/earnings')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.revenueGrid}>
            <View style={styles.revenueItem}>
              <Text style={styles.revenueAmount}>LKR {revenue.thisMonth.toLocaleString()}</Text>
              <Text style={styles.revenueLabel}>This Month</Text>
              <View style={styles.revenueChange}>
                <Ionicons name="trending-up" size={14} color="#16a34a" />
                <Text style={styles.revenueChangeText}>+5.9%</Text>
              </View>
            </View>
            <View style={[styles.revenueItem, styles.revenueItemBorder]}>
              <Text style={[styles.revenueAmount, styles.revenuePending]}>
                LKR {revenue.pending.toLocaleString()}
              </Text>
              <Text style={styles.revenueLabel}>Pending</Text>
              <Text style={styles.revenueCount}>{revenue.students} students</Text>
            </View>
          </View>
        </Card>

        {/* Today's Schedule */}
        <Card style={styles.scheduleCard}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <Badge variant="info">{todaySchedule.day}</Badge>
          </View>

          {/* Morning Route */}
          <View style={styles.routeSection}>
            <View style={styles.routeHeader}>
              <Ionicons name="sunny" size={20} color="#f59e0b" />
              <Text style={styles.routeTitle}>Morning Route</Text>
              <Badge variant="default">{todaySchedule.morning.studentCount} students</Badge>
            </View>
            <Text style={styles.routeTime}>
              {todaySchedule.morning.startTime} - {todaySchedule.morning.endTime}
            </Text>

            <View style={styles.routeStops}>
              {todaySchedule.morning.route.map((stop, index) => (
                <View key={index} style={styles.stopItem}>
                  <View style={styles.stopIndicator}>
                    <View style={styles.stopDot} />
                    {index < todaySchedule.morning.route.length - 1 && (
                      <View style={styles.stopLine} />
                    )}
                  </View>
                  <View style={styles.stopDetails}>
                    <View style={styles.stopHeader}>
                      <Text style={styles.stopArea}>{stop.area}</Text>
                      <Text style={styles.stopTime}>{stop.time}</Text>
                    </View>
                    <Text style={styles.stopStudents}>{stop.students} students</Text>
                  </View>
                </View>
              ))}
            </View>

            <Button 
              variant="primary" 
              style={styles.startRouteButton}
              onPress={() => router.push('/driver/active-route')}
            >
              <Ionicons name="navigate" size={20} color="#ffffff" />
              <Text style={styles.startRouteText}>Start Morning Route</Text>
            </Button>
          </View>

          {/* Afternoon Route */}
          <View style={[styles.routeSection, styles.afternoonRoute]}>
            <View style={styles.routeHeader}>
              <Ionicons name="partly-sunny" size={20} color="#f59e0b" />
              <Text style={styles.routeTitle}>Afternoon Return</Text>
              <Badge variant="default">{todaySchedule.afternoon.studentCount} students</Badge>
            </View>
            <Text style={styles.routeTime}>
              {todaySchedule.afternoon.startTime} - {todaySchedule.afternoon.endTime}
            </Text>
          </View>
        </Card>

        {/* Booking Requests */}
        <Card style={styles.bookingRequestsCard}>
          <View style={styles.bookingRequestsHeader}>
            <Text style={styles.sectionTitle}>Booking Requests</Text>
            <Badge variant="warning">{bookingRequests.length} pending</Badge>
          </View>

          {bookingRequests.map((request) => (
            <View key={request.id} style={styles.requestItem}>
              <View style={styles.requestHeader}>
                <Avatar name={request.parentName} source={request.photo} size={48} />
                <View style={styles.requestInfo}>
                  <Text style={styles.parentName}>{request.parentName}</Text>
                  <Text style={styles.childInfo}>
                    {request.childName} • Grade {request.grade}
                  </Text>
                  <View style={styles.requestRoute}>
                    <Ionicons name="location" size={14} color="#6b7280" />
                    <Text style={styles.requestRouteText}>{request.pickupArea}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.requestActions}>
                <Button 
                  variant="danger" 
                  size="small"
                  style={styles.requestButton}
                  onPress={() => {/* Handle decline */}}
                >
                  Decline
                </Button>
                <Button 
                  variant="success" 
                  size="small"
                  style={styles.requestButton}
                  onPress={() => router.push(`/driver/booking-details?id=${request.id}`)}
                >
                  Accept
                </Button>
              </View>
            </View>
          ))}
        </Card>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/driver/students')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="people" size={28} color="#2563eb" />
            </View>
            <Text style={styles.quickActionTitle}>Students</Text>
            <Text style={styles.quickActionValue}>{revenue.students}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/driver/routes')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="map" size={28} color="#16a34a" />
            </View>
            <Text style={styles.quickActionTitle}>Routes</Text>
            <Text style={styles.quickActionValue}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/driver/messages')}
          >
            <View style={styles.quickActionIcon}>
              <Ionicons name="chatbubbles" size={28} color="#f59e0b" />
            </View>
            <Text style={styles.quickActionTitle}>Messages</Text>
            <Badge variant="warning" style={styles.quickActionBadge}>5</Badge>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="home" size={24} color="#2563eb" />
          <Text style={[styles.navText, styles.navTextActive]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/driver/students')}
        >
          <Ionicons name="people-outline" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Students</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/driver/earnings')}
        >
          <Ionicons name="wallet-outline" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/driver/messages')}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#9ca3af" />
          <Text style={styles.navText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => router.push('/driver/profile')}
        >
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
    marginBottom: 16,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  date: {
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
  onlineToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9ca3af',
  },
  statusDotOnline: {
    backgroundColor: '#16a34a',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  revenueCard: {
    marginBottom: 16,
  },
  revenueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 14,
    color: '#2563eb',
    fontWeight: '600',
  },
  revenueGrid: {
    flexDirection: 'row',
  },
  revenueItem: {
    flex: 1,
    paddingRight: 16,
  },
  revenueItemBorder: {
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    paddingLeft: 16,
    paddingRight: 0,
  },
  revenueAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  revenuePending: {
    color: '#f59e0b',
  },
  revenueLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  revenueChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  revenueChangeText: {
    fontSize: 12,
    color: '#16a34a',
    fontWeight: '600',
  },
  revenueCount: {
    fontSize: 12,
    color: '#6b7280',
  },
  scheduleCard: {
    marginBottom: 16,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  routeSection: {
    marginBottom: 20,
  },
  afternoonRoute: {
    marginBottom: 0,
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  routeTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  routeTime: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  routeStops: {
    marginBottom: 16,
  },
  stopItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  stopIndicator: {
    alignItems: 'center',
    marginRight: 12,
  },
  stopDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  stopLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 4,
  },
  stopDetails: {
    flex: 1,
  },
  stopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  stopArea: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  stopTime: {
    fontSize: 14,
    color: '#6b7280',
  },
  stopStudents: {
    fontSize: 13,
    color: '#6b7280',
  },
  startRouteButton: {
    flexDirection: 'row',
    gap: 8,
  },
  startRouteText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  bookingRequestsCard: {
    marginBottom: 16,
  },
  bookingRequestsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  requestItem: {
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  requestHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  requestInfo: {
    marginLeft: 12,
    flex: 1,
  },
  parentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  childInfo: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  requestRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requestRouteText: {
    fontSize: 13,
    color: '#6b7280',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  requestButton: {
    flex: 1,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 100,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  quickActionTitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 4,
  },
  quickActionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  quickActionBadge: {
    marginTop: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  navTextActive: {
    color: '#2563eb',
    fontWeight: '600',
  },
});
