import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";

const DriverBottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    {
      name: "Home",
      icon: "home",
      route: "/driver",
    },
    {
      name: "Rides",
      icon: "car",
      route: "/driver/rides",
    },
    {
      name: "Messages",
      icon: "chatbubbles",
      route: "/driver/messages",
    },
    {
      name: "Earnings",
      icon: "wallet",
      route: "/driver/earnings",
    },
    {
      name: "Profile",
      icon: "person",
      route: "/driver/Profile/profile",
    },
  ];

  const isActive = (route) => {
    if (route === "/driver") {
      return pathname === route;
    }
    return pathname?.startsWith(route);
  };

  return (
    <View style={styles.container}>
      {navItems.map((item) => {
        const active = isActive(item.route);
        return (
          <TouchableOpacity
            key={item.name}
            style={styles.navItem}
            onPress={() => router.push(item.route)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={active ? "#007AFF" : "#8E8E93"}
            />
            <Text style={[styles.label, active && styles.activeLabel]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingBottom: 8,
    paddingTop: 8,
    height: 60,
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 4,
    color: "#8E8E93",
  },
  activeLabel: {
    color: "#007AFF",
  },
});

export default DriverBottomNav;
