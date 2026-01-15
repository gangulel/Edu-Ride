import React from "react";
import { View, Image, StyleSheet, SafeAreaView, TouchableOpacity, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { wp, hp, fs, responsive } from "./utils/responsive";

export default function Onboarding() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#0E2A63", "#1E5BA8", "#2D8FDB"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Edu-Ride</Text>
        </View>

        <TouchableOpacity
          style={styles.getStartedButton}
          activeOpacity={0.8}
          onPress={() => router.push('/login/login')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: fs(48),
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  logo: {
    width: wp(180),
    height: hp(180),
  },
  getStartedButton: {
    position: "absolute",
    bottom: hp(50),
    backgroundColor: "#FFFFFF",
    paddingVertical: responsive.paddingLG,
    paddingHorizontal: wp(60),
    borderRadius: responsive.radiusFull,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  getStartedText: {
    color: "#0E2A63",
    fontSize: responsive.fontXL,
    fontWeight: "600",
    textAlign: "center",
  },
});
