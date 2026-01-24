import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { responsive, wp, hp } from "../utils/responsive";

export default function DriverHome() {
  const router = useRouter();
  const [isAvailable, setIsAvailable] = useState(false);
  const [activeRides, setActiveRides] = useState([
    { id: 1, student: "Alice Johnson", pickup: "Dormitory A", destination: "Main Campus", time: "08:00 AM", status: "Pending" },
  ]);
  const [completedToday, setCompletedToday] = useState(5);
  const [earnings, setEarnings] = useState(125.50);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good day,</Text>
            <Text style={styles.userName}>Driver</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Availability Toggle */}
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityContent}>
            <View style={styles.availabilityIcon}>
              <Ionicons
                name={isAvailable ? "checkmark-circle" : "close-circle"}
                size={32}
                color={isAvailable ? "#34C759" : "#8E8E93"}
              />
            </View>
            <View style={styles.availabilityText}>
              <Text style={styles.availabilityTitle}>
                {isAvailable ? "You're Online" : "You're Offline"}
              </Text>
              <Text style={styles.availabilityDescription}>
                {isAvailable ? "Ready to accept ride requests" : "Toggle to start accepting rides"}
              </Text>
            </View>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: "#E5E5EA", true: "#34C759" }}
            thumbColor="#fff"
          />
        </View>

        {/* Stats Overview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Summary</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="car" size={28} color="#007AFF" />
              <Text style={styles.statValue}>{completedToday}</Text>
              <Text style={styles.statLabel}>Completed Rides</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="cash" size={28} color="#34C759" />
              <Text style={styles.statValue}>${earnings.toFixed(2)}</Text>
              <Text style={styles.statLabel}>Earnings</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="star" size={28} color="#FF9500" />
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={28} color="#8E8E93" />
              <Text style={styles.statValue}>6h 30m</Text>
              <Text style={styles.statLabel}>Online Time</Text>
            </View>
          </View>
        </View>

        {/* Active Rides */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Active Rides</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeRides.length}</Text>
            </View>
          </View>

          {activeRides.length > 0 ? (
            activeRides.map((ride) => (
              <View key={ride.id} style={styles.rideCard}>
                <View style={styles.rideHeader}>
                  <View style={styles.studentInfo}>
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons name="person" size={20} color="#007AFF" />
                    </View>
                    <View>
                      <Text style={styles.studentName}>{ride.student}</Text>
                      <Text style={styles.rideTime}>{ride.time}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, ride.status === "Pending" && styles.statusPending]}>
                    <Text style={styles.statusText}>{ride.status}</Text>
                  </View>
                </View>

                <View style={styles.locationInfo}>
                  <View style={styles.locationRow}>
                    <View style={styles.locationDot} />
                    <Text style={styles.locationText}>{ride.pickup}</Text>
                  </View>
                  <View style={styles.locationLine} />
                  <View style={styles.locationRow}>
                    <View style={[styles.locationDot, styles.locationDotDestination]} />
                    <Text style={styles.locationText}>{ride.destination}</Text>
                  </View>
                </View>

                <View style={styles.rideActions}>
                  <TouchableOpacity style={styles.acceptButton}>
                    <Text style={styles.acceptButtonText}>Accept Ride</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.declineButton}>
                    <Text style={styles.declineButtonText}>Decline</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="car-outline" size={48} color="#C7C7CC" />
              <Text style={styles.emptyStateText}>
                {isAvailable ? "Waiting for ride requests..." : "Go online to receive ride requests"}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/driver/route-management")}
          >
            <Ionicons name="map" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>Manage Routes</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/driver/students")}
          >
            <Ionicons name="people" size={24} color="#34C759" />
            <Text style={styles.actionButtonText}>Student Management</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/driver/booking-requests")}
          >
            <Ionicons name="mail" size={24} color="#FF9500" />
            <Text style={styles.actionButtonText}>Booking Requests</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push("/driver/active-trip")}
          >
            <Ionicons name="navigate" size={24} color="#FF3B30" />
            <Text style={styles.actionButtonText}>Start Active Trip</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: responsive.paddingLG,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  greeting: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
    marginBottom: responsive.paddingXS,
  },
  userName: {
    fontSize: responsive.font3XL,
    fontWeight: "bold",
    color: "#000",
  },
  profileButton: {
    padding: responsive.paddingXS,
  },
  availabilityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: responsive.paddingLG,
    marginTop: responsive.paddingLG,
    padding: responsive.paddingLG,
    borderRadius: responsive.radiusLG,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  availabilityContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  availabilityIcon: {
    marginRight: responsive.paddingMD,
  },
  availabilityText: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: responsive.fontLG,
    fontWeight: "600",
    color: "#000",
    marginBottom: responsive.paddingXS,
  },
  availabilityDescription: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
  },
  section: {
    marginTop: responsive.paddingLG,
    paddingHorizontal: responsive.paddingLG,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsive.paddingMD,
  },
  sectionTitle: {
    fontSize: responsive.font2XL,
    fontWeight: "600",
    color: "#000",
    marginBottom: responsive.paddingMD,
  },
  badge: {
    backgroundColor: "#007AFF",
    borderRadius: responsive.radiusLG,
    paddingHorizontal: wp(10),
    paddingVertical: responsive.paddingXS,
    minWidth: wp(24),
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: responsive.fontSM,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: wp(-6),
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    padding: responsive.paddingLG,
    margin: "1%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: responsive.font3XL,
    fontWeight: "bold",
    color: "#000",
    marginTop: responsive.paddingSM,
    marginBottom: responsive.paddingXS,
  },
  statLabel: {
    fontSize: responsive.fontSM,
    color: "#8E8E93",
    textAlign: "center",
  },
  rideCard: {
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    padding: responsive.paddingLG,
    marginBottom: responsive.paddingMD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  rideHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsive.paddingLG,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsive.paddingMD,
  },
  studentName: {
    fontSize: responsive.fontLG,
    fontWeight: "600",
    color: "#000",
  },
  rideTime: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: responsive.paddingMD,
    paddingVertical: responsive.paddingSM,
    borderRadius: responsive.radiusLG,
    backgroundColor: "#34C759",
  },
  statusPending: {
    backgroundColor: "#FF9500",
  },
  statusText: {
    color: "#fff",
    fontSize: responsive.fontSM,
    fontWeight: "600",
  },
  locationInfo: {
    marginBottom: responsive.paddingLG,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationDot: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: "#007AFF",
    marginRight: responsive.paddingMD,
  },
  locationDotDestination: {
    backgroundColor: "#34C759",
  },
  locationLine: {
    width: 2,
    height: hp(20),
    backgroundColor: "#E5E5EA",
    marginLeft: wp(4),
    marginVertical: responsive.paddingXS,
  },
  locationText: {
    fontSize: responsive.fontMD,
    color: "#000",
    flex: 1,
  },
  rideActions: {
    flexDirection: "row",
    gap: responsive.paddingMD,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: responsive.paddingMD,
    borderRadius: responsive.radiusMD,
    alignItems: "center",
    minHeight: responsive.buttonHeight,
    justifyContent: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: responsive.fontLG,
    fontWeight: "600",
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingVertical: responsive.paddingMD,
    borderRadius: responsive.radiusMD,
    alignItems: "center",
    minHeight: responsive.buttonHeight,
    justifyContent: "center",
  },
  declineButtonText: {
    color: "#000",
    fontSize: responsive.fontLG,
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    padding: responsive.padding2XL,
    alignItems: "center",
    marginTop: responsive.paddingSM,
  },
  emptyStateText: {
    fontSize: responsive.fontLG,
    color: "#8E8E93",
    marginTop: responsive.paddingMD,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    padding: responsive.paddingLG,
    marginBottom: responsive.paddingMD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: responsive.fontLG,
    color: "#000",
    marginLeft: responsive.paddingMD,
  },
});
