import React, { useMemo, useRef, useState } from "react";
import {
  useWindowDimensions,
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Text,
  FlatList,
  Animated,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

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
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const styles = useMemo(() => createStyles(width, height), [width, height]);

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
      router.push("/login/login");
    }
  };

  const renderSlide = ({ item }) => {
    return (
      <View style={[styles.slide, { width }]}> 
        <View style={styles.imageContainer}>
          <View style={[styles.imageBg, { backgroundColor: `${item.color}18` }]}>
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
        onPress={() => router.push("/login/login")}
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
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2}
        extraData={width}
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
            colors={[slides[currentIndex].color, `${slides[currentIndex].color}CC`]}
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
          onPress={() => router.push("/login/login")}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const createStyles = (width, height) => {
  const isSmallPhone = width < 360 || height < 700;
  const horizontalPadding = clamp(width * 0.07, 20, 34);
  const topOffset = clamp(height * 0.055, 36, 64);
  const imageBgSize = clamp(Math.min(width * 0.78, height * 0.4), 210, 340);
  const imageSize = clamp(imageBgSize * 0.84, 170, 290);
  const titleSize = clamp(width * 0.075, 24, 34);
  const subtitleSize = clamp(width * 0.045, 15, 18);
  const buttonVerticalPadding = isSmallPhone ? 14 : 17;
  const bottomPadding = clamp(height * 0.04, 20, 42);

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#FFFFFF",
    },
    bgDecoration: {
      position: "absolute",
      width: "100%",
      height: "100%",
    },
    bgCircle: {
      position: "absolute",
      borderRadius: 999,
    },
    bgCircle1: {
      width: imageBgSize,
      height: imageBgSize,
      backgroundColor: "rgba(37, 99, 235, 0.09)",
      top: -imageBgSize * 0.3,
      right: -imageBgSize * 0.22,
    },
    bgCircle2: {
      width: imageBgSize * 0.75,
      height: imageBgSize * 0.75,
      backgroundColor: "rgba(59, 130, 246, 0.06)",
      bottom: height * 0.2,
      left: -imageBgSize * 0.28,
    },
    skipButton: {
      position: "absolute",
      top: topOffset,
      right: horizontalPadding,
      zIndex: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
    },
    skipText: {
      fontSize: clamp(width * 0.042, 14, 16),
      color: "#6B7280",
      fontWeight: "600",
    },
    slide: {
      flex: 1,
      paddingTop: topOffset + (isSmallPhone ? 6 : 16),
      justifyContent: "space-between",
    },
    imageContainer: {
      flex: 0.58,
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: horizontalPadding,
    },
    imageBg: {
      width: imageBgSize,
      height: imageBgSize,
      borderRadius: imageBgSize / 2,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: imageSize,
      height: imageSize,
    },
    textContainer: {
      flex: 0.42,
      alignItems: "center",
      paddingHorizontal: horizontalPadding,
      paddingTop: isSmallPhone ? 6 : 10,
    },
    title: {
      fontSize: titleSize,
      fontWeight: "800",
      color: "#0F172A",
      textAlign: "center",
      marginBottom: isSmallPhone ? 8 : 12,
      lineHeight: titleSize * 1.18,
    },
    subtitle: {
      fontSize: subtitleSize,
      color: "#475569",
      textAlign: "center",
      lineHeight: subtitleSize * 1.45,
      maxWidth: 500,
    },
    bottomContainer: {
      paddingHorizontal: horizontalPadding,
      paddingBottom: bottomPadding,
    },
    paginatorContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: isSmallPhone ? 16 : 22,
    },
    dot: {
      height: 8,
      borderRadius: 999,
      marginHorizontal: 4,
    },
    nextButton: {
      marginBottom: isSmallPhone ? 10 : 14,
      borderRadius: 999,
      overflow: "hidden",
      shadowColor: "#2563EB",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.26,
      shadowRadius: 14,
      elevation: 7,
    },
    nextButtonGradient: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: buttonVerticalPadding,
      paddingHorizontal: clamp(width * 0.16, 40, 72),
      gap: 8,
    },
    nextButtonText: {
      color: "#FFFFFF",
      fontSize: clamp(width * 0.048, 16, 19),
      fontWeight: "700",
    },
    loginLink: {
      alignItems: "center",
      paddingVertical: isSmallPhone ? 4 : 8,
    },
    loginLinkText: {
      fontSize: clamp(width * 0.041, 14, 16),
      color: "#64748B",
      textAlign: "center",
    },
    loginLinkBold: {
      color: "#2563EB",
      fontWeight: "700",
    },
  });
};
