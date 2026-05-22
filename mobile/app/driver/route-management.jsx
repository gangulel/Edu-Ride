import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { responsive, wp, hp } from "../utils/responsive";

export default function RouteManagement() {
  const router = useRouter();
  const [showAddStop, setShowAddStop] = useState(false);
  const [newStopName, setNewStopName] = useState("");
  const [newStopTime, setNewStopTime] = useState("");
  
  const [routeStops, setRouteStops] = useState([
    { id: 1, location: "Colombo 07", pickupTime: "6:45 AM", dropoffTime: "3:30 PM" },
    { id: 2, location: "Dehiwala", pickupTime: "7:10 AM", dropoffTime: "3:05 PM" },
    { id: 3, location: "Bambalapitiya", pickupTime: "7:25 AM", dropoffTime: "2:50 PM" },
    { id: 4, location: "Mount Lavinia", pickupTime: "7:40 AM", dropoffTime: "2:35 PM" },
  ]);

  const [routeDetails, setRouteDetails] = useState({
    school: "Royal College",
    schoolArrival: "8:00 AM",
    schoolDeparture: "2:15 PM",
    daysOfOperation: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  });

  const addStop = () => {
    if (newStopName && newStopTime) {
      const newStop = {
        id: routeStops.length + 1,
        location: newStopName,
        pickupTime: newStopTime,
        dropoffTime: "TBD",
      };
      setRouteStops([...routeStops, newStop]);
      setNewStopName("");
      setNewStopTime("");
      setShowAddStop(false);
    }
  };

  const removeStop = (id) => {
    setRouteStops(routeStops.filter(stop => stop.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Route Management</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Route Summary Card */}
        <View style={styles.section}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Ionicons name="school" size={24} color="#007AFF" />
              <View style={styles.summaryTextContainer}>
                <Text style={styles.summarySchool}>{routeDetails.school}</Text>
                <Text style={styles.summarySubtext}>{routeStops.length} pickup points</Text>
              </View>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryDetails}>
              <View style={styles.summaryDetailItem}>
                <Text style={styles.summaryDetailLabel}>Morning Arrival</Text>
                <Text style={styles.summaryDetailValue}>{routeDetails.schoolArrival}</Text>
              </View>
              <View style={styles.summaryDetailItem}>
                <Text style={styles.summaryDetailLabel}>Afternoon Departure</Text>
                <Text style={styles.summaryDetailValue}>{routeDetails.schoolDeparture}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Days of Operation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Days of Operation</Text>
          <View style={styles.daysContainer}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayButton,
                  routeDetails.daysOfOperation.includes(day) && styles.dayButtonActive
                ]}
              >
                <Text style={[
                  styles.dayButtonText,
                  routeDetails.daysOfOperation.includes(day) && styles.dayButtonTextActive
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Route Stops */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Route Stops</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddStop(true)}
            >
              <Ionicons name="add-circle" size={24} color="#007AFF" />
              <Text style={styles.addButtonText}>Add Stop</Text>
            </TouchableOpacity>
          </View>

          {/* Route Timeline */}
          <View style={styles.routeTimeline}>
            {/* Start Point */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View style={[styles.timelineIcon, styles.timelineIconStart]}>
                  <Ionicons name="flag" size={16} color="#fff" />
                </View>
                <View style={styles.timelineLine} />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Route Start</Text>
                <Text style={styles.timelineTime}>{routeStops[0]?.pickupTime || "N/A"}</Text>
              </View>
            </View>

            {/* Stops */}
            {routeStops.map((stop, index) => (
              <View key={stop.id} style={styles.timelineItem}>
                <View style={styles.timelineIconContainer}>
                  <View style={styles.timelineIcon}>
                    <Ionicons name="location" size={16} color="#007AFF" />
                  </View>
                  {index < routeStops.length - 1 && <View style={styles.timelineLine} />}
                </View>
                <View style={styles.timelineContent}>
                  <View style={styles.stopHeader}>
                    <View style={styles.stopInfo}>
                      <Text style={styles.stopLocation}>{stop.location}</Text>
                      <Text style={styles.stopTime}>Pickup: {stop.pickupTime}</Text>
                      <Text style={styles.stopTime}>Drop-off: {stop.dropoffTime}</Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.deleteButton}
                      onPress={() => removeStop(stop.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}

            {/* School Arrival */}
            <View style={styles.timelineItem}>
              <View style={styles.timelineIconContainer}>
                <View style={[styles.timelineIcon, styles.timelineIconEnd]}>
                  <Ionicons name="school" size={16} color="#fff" />
                </View>
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>{routeDetails.school}</Text>
                <Text style={styles.timelineTime}>Arrival: {routeDetails.schoolArrival}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Route Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Route Statistics</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="people" size={24} color="#007AFF" />
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="time" size={24} color="#34C759" />
              <Text style={styles.statValue}>1h 15m</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="navigation" size={24} color="#FF9500" />
              <Text style={styles.statValue}>18 km</Text>
              <Text style={styles.statLabel}>Distance</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Add Stop Modal */}
      <Modal
        visible={showAddStop}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddStop(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Route Stop</Text>
              <TouchableOpacity onPress={() => setShowAddStop(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Location Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Colombo 07"
                value={newStopName}
                onChangeText={setNewStopName}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Pickup Time</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 7:00 AM"
                value={newStopTime}
                onChangeText={setNewStopTime}
              />
            </View>

            <TouchableOpacity style={styles.modalButton} onPress={addStop}>
              <Text style={styles.modalButtonText}>Add Stop</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
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
  backButton: {
    padding: responsive.paddingSM,
  },
  headerTitle: {
    fontSize: responsive.fontXL,
    fontWeight: "bold",
    color: "#000",
  },
  saveButton: {
    paddingHorizontal: responsive.paddingLG,
    paddingVertical: responsive.paddingSM,
  },
  saveButtonText: {
    fontSize: responsive.fontLG,
    color: "#007AFF",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsive.tabBarHeight + responsive.paddingLG,
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
    fontSize: responsive.fontXL,
    fontWeight: "600",
    color: "#000",
    marginBottom: responsive.paddingMD,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    padding: responsive.paddingLG,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryTextContainer: {
    marginLeft: responsive.paddingMD,
    flex: 1,
  },
  summarySchool: {
    fontSize: responsive.fontXL,
    fontWeight: "600",
    color: "#000",
  },
  summarySubtext: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
    marginTop: responsive.paddingXS,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: responsive.paddingLG,
  },
  summaryDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  summaryDetailItem: {
    alignItems: "center",
  },
  summaryDetailLabel: {
    fontSize: responsive.fontSM,
    color: "#8E8E93",
    marginBottom: responsive.paddingXS,
  },
  summaryDetailValue: {
    fontSize: responsive.fontLG,
    fontWeight: "600",
    color: "#007AFF",
  },
  daysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: responsive.paddingSM,
  },
  dayButton: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  dayButtonActive: {
    backgroundColor: "#007AFF",
  },
  dayButtonText: {
    fontSize: responsive.fontSM,
    color: "#8E8E93",
    fontWeight: "600",
  },
  dayButtonTextActive: {
    color: "#fff",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsive.paddingSM,
  },
  addButtonText: {
    fontSize: responsive.fontMD,
    color: "#007AFF",
    fontWeight: "600",
  },
  routeTimeline: {
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    padding: responsive.paddingLG,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: responsive.paddingMD,
  },
  timelineIconContainer: {
    alignItems: "center",
    marginRight: responsive.paddingMD,
  },
  timelineIcon: {
    width: wp(32),
    height: wp(32),
    borderRadius: wp(16),
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  timelineIconStart: {
    backgroundColor: "#34C759",
  },
  timelineIconEnd: {
    backgroundColor: "#FF9500",
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E5E5EA",
    marginVertical: responsive.paddingSM,
  },
  timelineContent: {
    flex: 1,
    paddingTop: responsive.paddingXS,
  },
  timelineLabel: {
    fontSize: responsive.fontLG,
    fontWeight: "600",
    color: "#000",
  },
  timelineTime: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
    marginTop: 2,
  },
  stopHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stopInfo: {
    flex: 1,
  },
  stopLocation: {
    fontSize: responsive.fontLG,
    fontWeight: "600",
    color: "#000",
  },
  stopTime: {
    fontSize: responsive.fontSM,
    color: "#8E8E93",
    marginTop: 2,
  },
  deleteButton: {
    padding: responsive.paddingSM,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: responsive.paddingMD,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: wp(96),
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    padding: responsive.paddingLG,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: responsive.fontXL,
    fontWeight: "bold",
    color: "#000",
    marginTop: responsive.paddingSM,
  },
  statLabel: {
    fontSize: responsive.fontSM,
    color: "#8E8E93",
    marginTop: responsive.paddingXS,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: responsive.radiusXL,
    borderTopRightRadius: responsive.radiusXL,
    padding: responsive.paddingXL,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsive.paddingXL,
  },
  modalTitle: {
    fontSize: responsive.font2XL,
    fontWeight: "bold",
    color: "#000",
  },
  inputContainer: {
    marginBottom: responsive.paddingLG,
  },
  inputLabel: {
    fontSize: responsive.fontMD,
    fontWeight: "600",
    color: "#000",
    marginBottom: responsive.paddingSM,
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: responsive.radiusMD,
    padding: responsive.paddingLG,
    fontSize: responsive.fontLG,
    color: "#000",
  },
  modalButton: {
    backgroundColor: "#007AFF",
    borderRadius: responsive.radiusMD,
    padding: responsive.paddingLG,
    alignItems: "center",
    marginTop: responsive.paddingMD,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: responsive.fontLG,
    fontWeight: "600",
  },
});
