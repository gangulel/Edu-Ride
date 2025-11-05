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
        colors={["#0E2A63", "#17376bff", "#2d5c92ff"]}
        start={[0, 0]}
        end={[1, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content} pointerEvents="box-none">
        <View style={styles.headlineWrap}>
          <Text style={styles.headline}>
            Sample text
            {'\n'}Sample text
            {'\n'}Sample text
          </Text>
        </View>

        {/* Get Started button placed above footer */}
        <TouchableOpacity
          style={styles.getStarted}
          activeOpacity={0.9}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
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
  getStarted: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  getStartedText: {
    color: '#0E2A63',
    fontSize: 16,
    fontWeight: '700',
  },
});
