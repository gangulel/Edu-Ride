import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Background gradient to approximate provided design */}
      <LinearGradient
        colors={["#0E2A63", "#17346B", "#3B2D92"]}
        start={[0, 0]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content} pointerEvents="box-none">
        <View style={styles.headlineWrap}>
          <Text style={styles.headline}>
            Simple way to
            {'\n'}help control your
            {'\n'}Savings
          </Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => router.push("/login")}> 
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/login")}
            style={styles.circleButton}
            activeOpacity={0.8}
          >
            <Text style={styles.chev}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E2A63",
  },
  content: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 28,
    paddingBottom: 40,
  },
  headlineWrap: {
    // keep headline anchored near bottom-left with breathing room
    marginBottom: 140,
  },
  headline: {
    color: "#fff",
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "700",
    maxWidth: "70%",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  skip: {
    color: "#fff",
    opacity: 0.9,
    fontSize: 16,
  },
  circleButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
    // subtle shadow (iOS & Android)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  chev: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
  },
});
