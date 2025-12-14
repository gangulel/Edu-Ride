import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DriverRides() {
  const [selectedTab, setSelectedTab] = useState("upcoming");
  
  const upcomingRides = [
    { id: 1, student: "Alice Johnson", pickup: "Dormitory A", destination: "Main Campus", time: "08:00 AM", status: "Scheduled" },
    { id: 2, student: "Bob Smith", pickup: "Library", destination: "Sports Complex", time: "10:30 AM", status: "Scheduled" },
  ];

  const completedRides = [
    { id: 3, student: "Carol Davis", pickup: "Main Campus", destination: "Dormitory B", time: "07:00 AM", status: "Completed", earnings: "$15.00" },
    { id: 4, student: "David Wilson", pickup: "Sports Complex", destination: "Library", time: "06:30 AM", status: "Completed", earnings: "$12.00" },
    { id: 5, student: "Emma Brown", pickup: "Dormitory C", destination: "Main Campus", time: "05:45 AM", status: "Completed", earnings: "$18.00" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Rides</Text>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "upcoming" && styles.tabActive]}
          onPress={() => setSelectedTab("upcoming")}
        >
          <Text style={[styles.tabText, selectedTab === "upcoming" && styles.tabTextActive]}>
            Upcoming
          </Text>
          {selectedTab === "upcoming" && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === "completed" && styles.tabActive]}
          onPress={() => setSelectedTab("completed")}
        >
          <Text style={[styles.tabText, selectedTab === "completed" && styles.tabTextActive]}>
            Completed
          </Text>
          {selectedTab === "completed" && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {selectedTab === "upcoming" ? (
          <View style={styles.content}>
            {upcomingRides.map((ride) => (
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
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>{ride.status}</Text>
                  </View>
                </View>

                <View style={styles.locationInfo}>
                  <View style={styles.locationRow}>
                    <View style={styles.locationDot} />
                    <View style={styles.locationTextContainer}>
                      <Text style={styles.locationLabel}>Pickup</Text>
                      <Text style={styles.locationText}>{ride.pickup}</Text>
                    </View>
                  </View>
                  <View style={styles.locationLine} />
                  <View style={styles.locationRow}>
                    <View style={[styles.locationDot, styles.locationDotDestination]} />
                    <View style={styles.locationTextContainer}>
                      <Text style={styles.locationLabel}>Drop-off</Text>
                      <Text style={styles.locationText}>{ride.destination}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.rideActions}>
                  <TouchableOpacity style={styles.startButton}>
                    <Ionicons name="navigate" size={18} color="#fff" />
                    <Text style={styles.startButtonText}>Start Trip</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="call" size={18} color="#007AFF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactButton}>
                    <Ionicons name="chatbubble" size={18} color="#007AFF" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.content}>
            {completedRides.map((ride) => (
              <View key={ride.id} style={styles.rideCard}>
                <View style={styles.rideHeader}>
                  <View style={styles.studentInfo}>
                    <View style={styles.avatarPlaceholder}>
                      <Ionicons name="person" size={20} color="#34C759" />
                    </View>
                    <View>
                      <Text style={styles.studentName}>{ride.student}</Text>
                      <Text style={styles.rideTime}>{ride.time}</Text>
                    </View>
                  </View>
                  <View style={styles.earningsContainer}>
                    <Text style={styles.earningsLabel}>Earned</Text>
                    <Text style={styles.earningsAmount}>{ride.earnings}</Text>
                  </View>
                </View>

                <View style={styles.locationInfo}>
                  <View style={styles.locationRow}>
                    <View style={[styles.locationDot, styles.locationDotCompleted]} />
                    <View style={styles.locationTextContainer}>
                      <Text style={styles.locationLabel}>Pickup</Text>
                      <Text style={styles.locationText}>{ride.pickup}</Text>
                    </View>
                  </View>
                  <View style={styles.locationLine} />
                  <View style={styles.locationRow}>
                    <View style={[styles.locationDot, styles.locationDotCompleted]} />
                    <View style={styles.locationTextContainer}>
                      <Text style={styles.locationLabel}>Drop-off</Text>
                      <Text style={styles.locationText}>{ride.destination}</Text>
                    </View>
                  </View>
                </View>

                <TouchableOpacity style={styles.viewDetailsButton}>
                  <Text style={styles.viewDetailsText}>View Details</Text>
                  <Ionicons name="chevron-forward" size={16} color="#007AFF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#000",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    position: "relative",
  },
  tabActive: {
    // Active state handled by indicator
  },
  tabText: {
    fontSize: 16,
    color: "#8E8E93",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#007AFF",
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#007AFF",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
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
    backgroundColor: "#007AFF",
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
    alignItems: "flex-start",
  },
  locationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    marginRight: 12,
    marginTop: 6,
  },
  locationDotDestination: {
    backgroundColor: "#34C759",
  },
  locationDotCompleted: {
    backgroundColor: "#8E8E93",
  },
  locationLine: {
    width: 2,
    height: 20,
    backgroundColor: "#E5E5EA",
    marginLeft: 4,
    marginVertical: 4,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 2,
  },
  locationText: {
    fontSize: 14,
    color: "#000",
  },
  rideActions: {
    flexDirection: "row",
    gap: 12,
  },
  startButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  startButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  contactButton: {
    width: 44,
    height: 44,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  earningsContainer: {
    alignItems: "flex-end",
  },
  earningsLabel: {
    fontSize: 12,
    color: "#8E8E93",
    marginBottom: 2,
  },
  earningsAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#34C759",
  },
  viewDetailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  viewDetailsText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
    marginRight: 4,
  },
});
