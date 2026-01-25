import React, { useState, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  Dimensions,
  FlatList,
  Animated,
  StatusBar
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { wp, hp, fs, responsive } from "./utils/responsive";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    image: require("../assets/images/school_bus.png"),
    title: "Safe School Transport",
    subtitle: "Track your child's journey to school in real-time with our verified drivers",
    color: "#667eea",
  },
  {
    id: 2,
    image: require("../assets/images/parent_child.png"),
    title: "Peace of Mind",
    subtitle: "Get instant notifications when your child boards and arrives safely",
    color: "#f5576c",
  },
  {
    id: 3,
    image: require("../assets/images/school_bus.png"),
    title: "Easy Booking",
    subtitle: "Find and book reliable school transport services near you instantly",
    color: "#38ef7d",
  },
];

export default function Onboarding() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < slides.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/login/login');
    }
  };

  const renderSlide = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageContainer}>
          <View style={[styles.imageBg, { backgroundColor: `${item.color}15` }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  const Paginator = () => {
    return (
      <View style={styles.paginatorContainer}>
        {slides.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                { width: dotWidth, opacity, backgroundColor: slides[currentIndex].color },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background decoration */}
      <View style={styles.bgDecoration}>
        <View style={[styles.bgCircle, styles.bgCircle1]} />
        <View style={[styles.bgCircle, styles.bgCircle2]} />
      </View>

      {/* Skip button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push('/login/login')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={slidesRef}
        data={slides}
        renderItem={renderSlide}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
      />

      {/* Bottom section */}
      <View style={styles.bottomContainer}>
        <Paginator />

        <TouchableOpacity
          style={styles.nextButton}
          onPress={scrollToNext}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[slides[currentIndex].color, slides[currentIndex].color + "CC"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            {currentIndex === slides.length - 1 ? (
              <Text style={styles.nextButtonText}>Get Started</Text>
            ) : (
              <>
                <Text style={styles.nextButtonText}>Next</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/login/login')}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  bgDecoration: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  bgCircle: {
    position: "absolute",
    borderRadius: 1000,
  },
  bgCircle1: {
    width: wp(300),
    height: wp(300),
    backgroundColor: "rgba(102, 126, 234, 0.08)",
    top: -wp(100),
    right: -wp(100),
  },
  bgCircle2: {
    width: wp(250),
    height: wp(250),
    backgroundColor: "rgba(245, 87, 108, 0.06)",
    bottom: hp(100),
    left: -wp(100),
  },
  skipButton: {
    position: "absolute",
    top: hp(50),
    right: responsive.paddingLG,
    zIndex: 10,
    paddingHorizontal: responsive.paddingMD,
    paddingVertical: responsive.paddingSM,
  },
  skipText: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
    fontWeight: "500",
  },
  slide: {
    width,
    flex: 1,
    paddingTop: hp(80),
  },
  imageContainer: {
    flex: 0.6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsive.paddingLG,
  },
  imageBg: {
    width: wp(320),
    height: wp(320),
    borderRadius: wp(160),
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: wp(280),
    height: wp(280),
  },
  textContainer: {
    flex: 0.4,
    paddingHorizontal: responsive.paddingXL,
    alignItems: "center",
  },
  title: {
    fontSize: fs(28),
    fontWeight: "bold",
    color: "#1a1a2e",
    textAlign: "center",
    marginBottom: responsive.paddingMD,
  },
  subtitle: {
    fontSize: responsive.fontLG,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: responsive.paddingMD,
  },
  bottomContainer: {
    paddingHorizontal: responsive.paddingXL,
    paddingBottom: hp(40),
  },
  paginatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: responsive.paddingXL,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    marginBottom: responsive.paddingLG,
    borderRadius: responsive.radiusFull,
    overflow: "hidden",
    shadowColor: "#667eea",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  nextButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: responsive.paddingLG,
    paddingHorizontal: wp(60),
    gap: 8,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: responsive.fontLG,
    fontWeight: "600",
  },
  loginLink: {
    alignItems: "center",
    paddingVertical: responsive.paddingSM,
  },
  loginLinkText: {
    fontSize: responsive.fontMD,
    color: "#8E8E93",
  },
  loginLinkBold: {
    color: "#667eea",
    fontWeight: "600",
  },
});
