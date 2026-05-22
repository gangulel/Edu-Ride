import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { responsive, fs } from "../utils/responsive";

export default function DriverEarnings() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  const todayStats = {
    total: 12550.00,
    trips: 5,
    hours: 6.5,
    avgPerTrip: 2510.00,
  };

  const weekStats = {
    total: 68730.00,
    trips: 28,
    hours: 35,
    avgPerTrip: 2455.00,
  };

  const monthStats = {
    total: 284580.00,
    trips: 112,
    hours: 145,
    avgPerTrip: 2541.00,
  };

  const currentStats = selectedPeriod === "today" ? todayStats : selectedPeriod === "week" ? weekStats : monthStats;

  const recentTransactions = [
    { id: 1, student: "Amaya Perera", amount: 1850.00, time: "2:30 PM", destination: "Main Campus" },
    { id: 2, student: "Sahan Silva", amount: 2200.00, time: "1:15 PM", destination: "Sports Complex" },
    { id: 3, student: "Dilini Fernando", amount: 1500.00, time: "12:00 PM", destination: "Library" },
    { id: 4, student: "Roshan Jayawardena", amount: 2800.00, time: "10:30 AM", destination: "Downtown" },
    { id: 5, student: "Malini Dissanayake", amount: 1900.00, time: "9:00 AM", destination: "Main Campus" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "today" && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod("today")}
          >
            <Text style={[styles.periodText, selectedPeriod === "today" && styles.periodTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "week" && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod("week")}
          >
            <Text style={[styles.periodText, selectedPeriod === "week" && styles.periodTextActive]}>
              This Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, selectedPeriod === "month" && styles.periodButtonActive]}
            onPress={() => setSelectedPeriod("month")}
          >
            <Text style={[styles.periodText, selectedPeriod === "month" && styles.periodTextActive]}>
              This Month
            </Text>
          </TouchableOpacity>
        </View>

        {/* Total Earnings Card */}
        <View style={styles.totalCard}>
          <View style={styles.totalIconContainer}>
            <Ionicons name="wallet" size={32} color="#34C759" />
          </View>
          <Text style={styles.totalLabel}>Total Earnings</Text>
          <Text style={styles.totalAmount}>Rs. {currentStats.total.toLocaleString()}</Text>
          <TouchableOpacity style={styles.withdrawButton}>
            <Ionicons name="arrow-down-circle" size={20} color="#fff" />
            <Text style={styles.withdrawButtonText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="car" size={24} color="#007AFF" />
            </View>
            <Text style={styles.statValue}>{currentStats.trips}</Text>
            <Text style={styles.statLabel}>Total Trips</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="time" size={24} color="#FF9500" />
            </View>
            <Text style={styles.statValue}>{currentStats.hours}h</Text>
            <Text style={styles.statLabel}>Hours Online</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trending-up" size={24} color="#34C759" />
            </View>
            <Text style={styles.statValue}>Rs. {currentStats.avgPerTrip.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Avg per Trip</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {recentTransactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionCard}>
              <View style={styles.transactionIcon}>
                <Ionicons name="arrow-up" size={20} color="#34C759" />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionStudent}>{transaction.student}</Text>
                <Text style={styles.transactionDestination}>{transaction.destination}</Text>
                <Text style={styles.transactionTime}>{transaction.time}</Text>
              </View>
              <Text style={styles.transactionAmount}>+Rs. {transaction.amount.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          <TouchableOpacity style={styles.paymentCard}>
            <View style={styles.paymentIconContainer}>
              <Ionicons name="card" size={24} color="#007AFF" />
            </View>
            <View style={styles.paymentDetails}>
              <Text style={styles.paymentTitle}>Bank Account</Text>
              <Text style={styles.paymentDescription}>•••• •••• •••• 4242</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.addPaymentButton}>
            <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
            <Text style={styles.addPaymentText}>Add Payment Method</Text>
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
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: responsive.paddingLG,
    paddingVertical: responsive.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: fs(28),
    fontWeight: "bold",
    color: "#000",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsive.tabBarHeight + responsive.paddingLG,
  },
  periodSelector: {
    flexDirection: "row",
    padding: responsive.paddingLG,
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: responsive.paddingSM,
    paddingHorizontal: responsive.paddingMD,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  periodButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  periodText: {
    fontSize: responsive.fontSM,
    color: "#000",
    fontWeight: "500",
  },
  periodTextActive: {
    color: "#fff",
    fontWeight: "600",
  },
  totalCard: {
    backgroundColor: "#fff",
    marginHorizontal: responsive.paddingLG,
    marginBottom: responsive.paddingLG,
    padding: responsive.paddingXL,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  totalIconContainer: {
    width: fs(60),
    height: fs(60),
    borderRadius: fs(30),
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
    marginBottom: responsive.paddingSM,
  },
  totalAmount: {
    fontSize: fs(34),
    fontWeight: "bold",
    color: "#000",
    marginBottom: responsive.paddingLG,
    textAlign: "center",
  },
  withdrawButton: {
    flexDirection: "row",
    backgroundColor: "#34C759",
    paddingVertical: responsive.paddingSM,
    paddingHorizontal: responsive.paddingXL,
    borderRadius: 8,
    alignItems: "center",
    gap: 8,
  },
  withdrawButtonText: {
    color: "#fff",
    fontSize: responsive.fontMD,
    fontWeight: "600",
  },
  statsGrid: {
    flexDirection: "row",
    paddingHorizontal: responsive.paddingLG,
    flexWrap: "wrap",
    gap: 12,
    marginBottom: responsive.paddingLG,
  },
  statCard: {
    flexGrow: 1,
    flexBasis: fs(110),
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: responsive.fontXL,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: responsive.fontXS,
    color: "#8E8E93",
    textAlign: "center",
  },
  section: {
    paddingHorizontal: responsive.paddingLG,
    marginBottom: responsive.paddingXL,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: responsive.fontXL,
    fontWeight: "600",
    color: "#000",
    marginBottom: responsive.paddingMD,
  },
  seeAllText: {
    fontSize: responsive.fontSM,
    color: "#007AFF",
    fontWeight: "500",
  },
  transactionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: responsive.paddingMD,
    marginBottom: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  transactionIcon: {
    width: fs(40),
    height: fs(40),
    borderRadius: fs(20),
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionStudent: {
    fontSize: responsive.fontMD,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  transactionDestination: {
    fontSize: responsive.fontSM,
    color: "#8E8E93",
    marginBottom: 2,
  },
  transactionTime: {
    fontSize: responsive.fontXS,
    color: "#8E8E93",
  },
  transactionAmount: {
    fontSize: responsive.fontLG,
    fontWeight: "bold",
    color: "#34C759",
    maxWidth: "42%",
    textAlign: "right",
  },
  paymentCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: responsive.paddingMD,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  paymentIconContainer: {
    width: fs(46),
    height: fs(46),
    borderRadius: fs(23),
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentDetails: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: responsive.fontMD,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  paymentDescription: {
    fontSize: responsive.fontSM,
    color: "#8E8E93",
  },
  addPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: responsive.paddingMD,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
    gap: 8,
  },
  addPaymentText: {
    fontSize: responsive.fontMD,
    color: "#007AFF",
    fontWeight: "500",
  },
});
