import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, Switch } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="list" size={24} color="#007AFF" />
            <Text style={styles.actionButtonText}>View All Trips</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="wallet" size={24} color="#34C759" />
            <Text style={styles.actionButtonText}>Earnings Report</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="car-sport" size={24} color="#FF9500" />
            <Text style={styles.actionButtonText}>Vehicle Information</Text>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="help-circle" size={24} color="#8E8E93" />
            <Text style={styles.actionButtonText}>Help & Support</Text>
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
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  greeting: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  profileButton: {
    padding: 4,
  },
  availabilityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
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
    marginRight: 12,
  },
  availabilityText: {
    flex: 1,
  },
  availabilityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  availabilityDescription: {
    fontSize: 14,
    color: "#8E8E93",
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  badge: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: 24,
    alignItems: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  statCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    margin: "1%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
    textAlign: "center",
  },
  rideCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 16,
  },
  studentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  rideTime: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "#34C759",
  },
  statusPending: {
    backgroundColor: "#FF9500",
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  locationInfo: {
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    marginRight: 12,
  },
  locationDotDestination: {
    backgroundColor: "#34C759",
  },
  locationLine: {
    width: 2,
    height: 20,
    backgroundColor: "#E5E5EA",
    marginLeft: 4,
    marginVertical: 4,
  },
  locationText: {
    fontSize: 14,
    color: "#000",
    flex: 1,
  },
  rideActions: {
    flexDirection: "row",
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  acceptButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  declineButton: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  declineButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyState: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 32,
    alignItems: "center",
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 12,
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    marginLeft: 12,
  },
});
