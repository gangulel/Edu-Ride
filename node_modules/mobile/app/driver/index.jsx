import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { responsive, wp, hp, fs } from "../utils/responsive";

export default function DriverHome() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const stats = [
    { icon: "people", value: "24", label: "Students", color: "#007AFF", bgColor: "#E3F2FD" },
    { icon: "star", value: "4.9", label: "Rating", color: "#FF9500", bgColor: "#FFF4E5" },
    { icon: "calendar-outline", value: "156", label: "Trips", color: "#34C759", bgColor: "#E8F8ED" },
  ];

  const quickActions = [
    {
      icon: "map-outline",
      label: "Routes",
      subtitle: "Manage stops",
      route: "/driver/route-management",
      color: "#007AFF",
      bgColor: "#E3F2FD"
    },
    {
      icon: "people-outline",
      label: "Students",
      subtitle: "24 enrolled",
      route: "/driver/students",
      color: "#34C759",
      bgColor: "#E8F8ED"
    },
    {
      icon: "mail-outline",
      label: "Requests",
      subtitle: "3 pending",
      route: "/driver/booking-requests",
      color: "#FF9500",
      bgColor: "#FFF4E5",
      badge: 3
    },
    {
      icon: "chatbubble-outline",
      label: "Messages",
      subtitle: "2 unread",
      route: "/driver/messages",
      color: "#5856D6",
      bgColor: "#F0EFFF",
      badge: 2
    },
  ];

  const menuItems = [
    { icon: "navigate-outline", label: "Start Active Trip", route: "/driver/active-trip", color: "#FF3B30" },
    { icon: "time-outline", label: "Ride History", route: "/driver/rides", color: "#007AFF" },
    { icon: "wallet-outline", label: "Earnings", route: "/driver/earnings", color: "#34C759" },
    { icon: "settings-outline", label: "Settings", route: "/driver/Profile", color: "#8E8E93" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{getGreeting()} 👋</Text>
              <Text style={styles.userName}>Kasun Perera</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notificationBtn}>
                <Ionicons name="notifications-outline" size={24} color="#1a1a2e" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.avatarBtn}
                onPress={() => router.push("/driver/Profile")}
              >
                <LinearGradient
                  colors={["#007AFF", "#5856D6"]}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>KP</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            {stats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
                  <Ionicons name={stat.icon} size={20} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          {/* Next Trip Card */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Next Scheduled Trip</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.tripCard}
              onPress={() => router.push("/driver/active-trip")}
              activeOpacity={0.95}
            >
              <LinearGradient
                colors={["#007AFF", "#5856D6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.tripCardGradient}
              >
                <View style={styles.tripBadge}>
                  <Ionicons name="sunny" size={12} color="#fff" />
                  <Text style={styles.tripBadgeText}>Morning Route</Text>
                </View>

                <View style={styles.tripTimeRow}>
                  <Text style={styles.tripTime}>6:45 AM</Text>
                  <View style={styles.tripArrow}>
                    <Ionicons name="arrow-forward" size={16} color="rgba(255,255,255,0.7)" />
                  </View>
                  <Text style={styles.tripTimeEnd}>8:00 AM</Text>
                </View>

                <View style={styles.tripDetails}>
                  <View style={styles.tripDetail}>
                    <Ionicons name="school-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.tripDetailText}>Royal College, Colombo</Text>
                  </View>
                  <View style={styles.tripDetail}>
                    <Ionicons name="people-outline" size={16} color="rgba(255,255,255,0.8)" />
                    <Text style={styles.tripDetailText}>24 students</Text>
                  </View>
                </View>

                <View style={styles.tripAction}>
                  <View style={styles.startTripBtn}>
                    <Ionicons name="play" size={18} color="#007AFF" />
                    <Text style={styles.startTripText}>Start Trip</Text>
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {quickActions.map((action, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.actionCard}
                  onPress={() => router.push(action.route)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: action.bgColor }]}>
                    <Ionicons name={action.icon} size={24} color={action.color} />
                    {action.badge && (
                      <View style={styles.actionBadge}>
                        <Text style={styles.actionBadgeText}>{action.badge}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                  <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Menu List */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>More Options</Text>
            <View style={styles.menuCard}>
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.menuItem,
                    index < menuItems.length - 1 && styles.menuItemBorder
                  ]}
                  onPress={() => router.push(item.route)}
                >
                  <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Today's Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today's Summary</Text>
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>2</Text>
                  <Text style={styles.summaryLabel}>Trips Completed</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryValue}>48</Text>
                  <Text style={styles.summaryLabel}>Students Served</Text>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: "#34C759" }]}>LKR 2.5K</Text>
                  <Text style={styles.summaryLabel}>Earned Today</Text>
                </View>
              </View>
            </View>
          </View>

        </Animated.View>

        <View style={{ height: hp(30) }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: responsive.paddingXL,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsive.paddingLG,
    paddingTop: responsive.paddingMD,
    paddingBottom: responsive.paddingLG,
    backgroundColor: "#fff",
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
    marginBottom: 4,
  },
  userName: {
    fontSize: fs(24),
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsive.paddingSM,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FF3B30",
    borderWidth: 2,
    borderColor: "#F2F2F7",
  },
  avatarBtn: {},
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: responsive.fontMD,
    fontWeight: "bold",
    color: "#fff",
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: responsive.paddingLG,
    marginTop: responsive.paddingMD,
    gap: responsive.paddingSM,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    padding: responsive.paddingMD,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsive.paddingSM,
  },
  statValue: {
    fontSize: fs(20),
    fontWeight: "bold",
    color: "#1a1a2e",
  },
  statLabel: {
    fontSize: responsive.fontXS,
    color: "#8E8E93",
    marginTop: 2,
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
    color: "#1a1a2e",
    marginBottom: responsive.paddingMD,
  },
  seeAllText: {
    fontSize: responsive.fontSM,
    color: "#007AFF",
    fontWeight: "500",
    marginBottom: responsive.paddingMD,
  },
  tripCard: {
    borderRadius: responsive.radiusXL,
    overflow: "hidden",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  tripCardGradient: {
    padding: responsive.paddingLG,
  },
  tripBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: responsive.radiusFull,
    alignSelf: "flex-start",
    marginBottom: responsive.paddingMD,
    gap: 4,
  },
  tripBadgeText: {
    fontSize: responsive.fontXS,
    color: "#fff",
    fontWeight: "600",
  },
  tripTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsive.paddingMD,
    gap: responsive.paddingSM,
  },
  tripTime: {
    fontSize: fs(28),
    fontWeight: "bold",
    color: "#fff",
  },
  tripArrow: {
    paddingHorizontal: responsive.paddingSM,
  },
  tripTimeEnd: {
    fontSize: fs(28),
    fontWeight: "bold",
    color: "rgba(255,255,255,0.7)",
  },
  tripDetails: {
    flexDirection: "row",
    gap: responsive.paddingLG,
    marginBottom: responsive.paddingLG,
  },
  tripDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  tripDetailText: {
    fontSize: responsive.fontSM,
    color: "rgba(255,255,255,0.8)",
  },
  tripAction: {
    alignItems: "flex-start",
  },
  startTripBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: responsive.paddingLG,
    paddingVertical: responsive.paddingSM,
    borderRadius: responsive.radiusFull,
    gap: 6,
  },
  startTripText: {
    fontSize: responsive.fontMD,
    fontWeight: "600",
    color: "#007AFF",
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -responsive.paddingSM / 2,
  },
  actionCard: {
    width: "50%",
    paddingHorizontal: responsive.paddingSM / 2,
    marginBottom: responsive.paddingSM,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: responsive.radiusMD,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: responsive.paddingSM,
  },
  actionBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 6,
  },
  actionBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#fff",
  },
  actionLabel: {
    fontSize: responsive.fontMD,
    fontWeight: "600",
    color: "#1a1a2e",
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: responsive.fontSM,
    color: "#8E8E93",
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: responsive.paddingMD,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: responsive.paddingMD,
  },
  menuLabel: {
    flex: 1,
    fontSize: responsive.fontMD,
    fontWeight: "500",
    color: "#1a1a2e",
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: responsive.radiusLG,
    padding: responsive.paddingLG,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: fs(20),
    fontWeight: "bold",
    color: "#1a1a2e",
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: responsive.fontXS,
    color: "#8E8E93",
    textAlign: "center",
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E5EA",
  },
});
