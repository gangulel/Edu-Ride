import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { responsive, wp, hp } from "../utils/responsive";

export default function StudentHome() {
  const router = useRouter();
  const [upcomingTrips, setUpcomingTrips] = useState([
    { id: 1, destination: "Main Campus", time: "08:00 AM", driver: "John Doe", status: "Scheduled" },
    { id: 2, destination: "Library", time: "02:00 PM", driver: "Jane Smith", status: "Scheduled" },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>Student</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={40} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => router.push("/trips")}
            >
              <View style={styles.actionIconContainer}>
                <Ionicons name="add-circle" size={32} color="#007AFF" />
              </View>
              <Text style={styles.actionTitle}>Book a Ride</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="time-outline" size={32} color="#34C759" />
              </View>
              <Text style={styles.actionTitle}>Trip History</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="location-outline" size={32} color="#FF9500" />
              </View>
              <Text style={styles.actionTitle}>Saved Places</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIconContainer}>
                <Ionicons name="settings-outline" size={32} color="#8E8E93" />
              </View>
              <Text style={styles.actionTitle}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Upcoming Trips */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Trips</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {upcomingTrips.length > 0 ? (
            upcomingTrips.map((trip) => (
              <View key={trip.id} style={styles.tripCard}>
                <View style={styles.tripIconContainer}>
                  <Ionicons name="car" size={24} color="#007AFF" />
                </View>
                <View style={styles.tripDetails}>
                  <Text style={styles.tripDestination}>{trip.destination}</Text>
                  <Text style={styles.tripDriver}>Driver: {trip.driver}</Text>
                  <Text style={styles.tripTime}>{trip.time}</Text>
                </View>
                <View style={styles.tripStatusContainer}>
                  <Text style={styles.tripStatus}>{trip.status}</Text>
                  <TouchableOpacity>
                    <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-outline" size={48} color="#C7C7CC" />
              <Text style={styles.emptyStateText}>No upcoming trips</Text>
              <TouchableOpacity
                style={styles.bookButton}
                onPress={() => router.push("/trips")}
              >
                <Text style={styles.bookButtonText}>Book Your First Ride</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Safety Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety & Support</Text>
          <View style={styles.infoCard}>
            <Ionicons name="shield-checkmark" size={24} color="#34C759" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Emergency Contact</Text>
              <Text style={styles.infoDescription}>
                Access emergency support anytime during your ride
              </Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={24} color="#007AFF" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoTitle}>Safety Tips</Text>
              <Text style={styles.infoDescription}>
                Review safety guidelines for a secure journey
              </Text>
            </View>
          </View>
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
  seeAllText: {
    fontSize: responsive.fontMD,
    color: "#007AFF",
    fontWeight: "500",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: wp(-6),
  },
  actionCard: {
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
  actionIconContainer: {
    marginBottom: responsive.paddingSM,
  },
  actionTitle: {
    fontSize: responsive.fontMD,
    fontWeight: "500",
    color: "#000",
    textAlign: "center",
  },
  tripCard: {
    flexDirection: "row",
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
  tripIconContainer: {
    width: wp(48),
    height: wp(48),
    borderRadius: wp(24),
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsive.paddingMD,
  },
  tripDetails: {
    flex: 1,
  },
  tripDestination: {
    fontSize: responsive.fontLG,
    fontWeight: "600",
    color: "#000",
    marginBottom: responsive.paddingXS,
  },
  tripDriver: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
    marginBottom: 2,
  },
  tripTime: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
  },
  tripStatusContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  tripStatus: {
    fontSize: responsive.fontSM,
    color: "#34C759",
    fontWeight: "500",
    marginBottom: responsive.paddingSM,
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
    marginBottom: responsive.paddingLG,
  },
  bookButton: {
    backgroundColor: "#007AFF",
    paddingVertical: responsive.paddingMD,
    paddingHorizontal: responsive.paddingXL,
    borderRadius: responsive.radiusMD,
    minHeight: responsive.buttonHeight,
    justifyContent: "center",
  },
  bookButtonText: {
    color: "#fff",
    fontSize: responsive.fontLG,
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
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
  infoTextContainer: {
    flex: 1,
    marginLeft: responsive.paddingMD,
  },
  infoTitle: {
    fontSize: responsive.fontLG,
    fontWeight: "600",
    color: "#000",
    marginBottom: responsive.paddingXS,
  },
  infoDescription: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
    lineHeight: responsive.fontXL,
  },
});
