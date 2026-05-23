import React, { useMemo, useRef, useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, ShieldTick, NotificationStatus, RouteSquare } from 'iconsax-react-native';
import { useTheme } from './contexts/ThemeContext';

const slidesContent = [
  {
    id: 1,
    image: require('../assets/images/school_bus.png'),
    title: 'Safe School Transport',
    subtitle: "Track your child's journey to school in real-time with our verified drivers.",
    Icon: ShieldTick,
    chip: 'Verified Drivers',
  },
  {
    id: 2,
    image: require('../assets/images/parent_child.png'),
    title: 'Peace of Mind',
    subtitle: 'Get instant notifications when your child boards and arrives safely.',
    Icon: NotificationStatus,
    chip: 'Live Updates',
  },
  {
    id: 3,
    image: require('../assets/images/school_bus.png'),
    title: 'Easy Booking',
    subtitle: 'Find and book reliable school transport services near you in a few taps.',
    Icon: RouteSquare,
    chip: 'Instant Booking',
  },
];

export default function Onboarding() {
  const theme = useTheme();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);
  const styles = useMemo(() => createStyles(theme, width, height), [theme, width, height]);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems[0]) setCurrentIndex(viewableItems[0].index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToNext = () => {
    if (currentIndex < slidesContent.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push('/login/login');
    }
  };

  const renderSlide = ({ item }) => {
    const SlideIcon = item.Icon;
    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.slideContent}>
          <View style={styles.imageCard}>
            <LinearGradient
              colors={[theme.colors.palette.blue[50], '#FFFFFF']}
              start={{ x: 0.05, y: 0 }}
              end={{ x: 0.95, y: 1 }}
              style={styles.imageCardGradient}
            >
              <View style={styles.accentChip}>
                <SlideIcon size={14} color={theme.colors.primary} variant="Bold" />
                <Text style={styles.accentChipText}>{item.chip}</Text>
              </View>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
            </LinearGradient>
          </View>
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.eyebrow}>Edu Ride</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
        </View>
      </View>
    );
  };

  const Paginator = () => (
    <View style={styles.paginatorContainer}>
      {slidesContent.map((_, index) => {
        const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
        const dotWidth = scrollX.interpolate({ inputRange, outputRange: [8, 28, 8], extrapolate: 'clamp' });
        const opacity = scrollX.interpolate({ inputRange, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' });
        return <Animated.View key={index} style={[styles.dot, { width: dotWidth, opacity }]} />;
      })}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <LinearGradient
        colors={[theme.colors.palette.blue[50], '#FFFFFF', theme.colors.palette.blue[50]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      <View style={styles.bgDecoration} pointerEvents="none">
        <View style={[styles.bgCircle, styles.bgCircle1]} />
        <View style={[styles.bgCircle, styles.bgCircle2]} />
      </View>

      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.push('/login/login')}
        activeOpacity={0.7}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <FlatList
        ref={slidesRef}
        data={slidesContent}
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

      <View style={styles.bottomContainer}>
        <Text style={styles.progressText}>{`0${currentIndex + 1} / 0${slidesContent.length}`}</Text>
        <Paginator />

        <TouchableOpacity style={styles.nextButton} onPress={scrollToNext} activeOpacity={0.9}>
          <LinearGradient
            colors={theme.colors.primaryGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === slidesContent.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <ArrowRight size={20} color="#fff" variant="Linear" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => router.push('/login/login')}
          activeOpacity={0.7}
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

const createStyles = (theme, width, height) => {
  const isSmallPhone = width < 360 || height < 700;
  const horizontalPadding = clamp(width * 0.07, 20, 34);
  const topOffset = clamp(height * 0.055, 36, 64);
  const imageCardWidth = clamp(Math.min(width * 0.84, 440), 260, 420);
  const imageCardHeight = clamp(imageCardWidth * 0.95, 240, 380);
  const imageSize = clamp(imageCardWidth * 0.84, 190, 320);
  const titleSize = clamp(width * 0.075, 24, 34);
  const subtitleSize = clamp(width * 0.045, 15, 18);
  const eyebrowSize = clamp(width * 0.034, 12, 14);
  const buttonVerticalPadding = isSmallPhone ? 14 : 17;
  const bottomPadding = clamp(height * 0.04, 20, 42);

  return StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    backgroundGradient: { ...StyleSheet.absoluteFillObject },
    bgDecoration: { position: 'absolute', width: '100%', height: '100%' },
    bgCircle: { position: 'absolute', borderRadius: 999 },
    bgCircle1: {
      width: imageCardWidth,
      height: imageCardWidth,
      backgroundColor: 'rgba(37, 99, 235, 0.10)',
      top: -imageCardWidth * 0.35,
      right: -imageCardWidth * 0.18,
    },
    bgCircle2: {
      width: imageCardWidth * 0.8,
      height: imageCardWidth * 0.8,
      backgroundColor: 'rgba(59, 130, 246, 0.10)',
      bottom: height * 0.2,
      left: -imageCardWidth * 0.22,
    },
    skipButton: {
      position: 'absolute',
      top: topOffset,
      right: horizontalPadding,
      zIndex: 10,
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.92)',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    skipText: {
      fontFamily: theme.fontFamily.medium,
      fontSize: clamp(width * 0.042, 13, 15),
      color: theme.colors.textSecondary,
    },
    slide: {
      flex: 1,
      paddingTop: topOffset + (isSmallPhone ? 6 : 16),
      justifyContent: 'space-between',
    },
    slideContent: {
      flex: 0.58,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: horizontalPadding,
    },
    imageCard: {
      width: imageCardWidth,
      height: imageCardHeight,
      borderRadius: clamp(width * 0.085, 22, 30),
      overflow: 'hidden',
      shadowColor: theme.colors.palette.blue[700],
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: 0.22,
      shadowRadius: 24,
      elevation: 10,
    },
    imageCardGradient: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: clamp(height * 0.02, 12, 22),
      paddingHorizontal: clamp(width * 0.045, 14, 24),
    },
    accentChip: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 999,
      backgroundColor: theme.colors.palette.blue[100],
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginBottom: clamp(height * 0.014, 8, 14),
      gap: 6,
    },
    accentChipText: {
      fontFamily: theme.fontFamily.bold,
      fontSize: clamp(width * 0.03, 11, 13),
      color: theme.colors.primaryDark,
      letterSpacing: 0.2,
    },
    image: { width: imageSize, height: imageSize },
    textContainer: {
      flex: 0.42,
      alignItems: 'center',
      paddingHorizontal: horizontalPadding,
      paddingTop: isSmallPhone ? 8 : 12,
    },
    eyebrow: {
      fontFamily: theme.fontFamily.bold,
      fontSize: eyebrowSize,
      textTransform: 'uppercase',
      letterSpacing: 1.4,
      color: theme.colors.primary,
      marginBottom: isSmallPhone ? 7 : 9,
    },
    title: {
      fontFamily: theme.fontFamily.bold,
      fontSize: titleSize,
      color: theme.colors.textPrimary,
      textAlign: 'center',
      marginBottom: isSmallPhone ? 8 : 12,
      lineHeight: titleSize * 1.18,
    },
    subtitle: {
      fontFamily: theme.fontFamily.regular,
      fontSize: subtitleSize,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: subtitleSize * 1.45,
      maxWidth: 500,
    },
    bottomContainer: {
      paddingHorizontal: horizontalPadding,
      paddingBottom: bottomPadding,
      paddingTop: clamp(height * 0.01, 8, 14),
      backgroundColor: 'rgba(255,255,255,0.85)',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.lg,
    },
    progressText: {
      alignSelf: 'center',
      fontFamily: theme.fontFamily.bold,
      fontSize: clamp(width * 0.032, 12, 13),
      color: theme.colors.textMuted,
      letterSpacing: 0.6,
      marginBottom: 8,
    },
    paginatorContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: isSmallPhone ? 16 : 22,
    },
    dot: {
      height: 8,
      borderRadius: 999,
      marginHorizontal: 4,
      backgroundColor: theme.colors.primary,
    },
    nextButton: {
      marginBottom: isSmallPhone ? 10 : 14,
      borderRadius: 999,
      overflow: 'hidden',
      ...theme.shadows.primaryMd,
    },
    nextButtonGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: buttonVerticalPadding,
      paddingHorizontal: clamp(width * 0.16, 40, 72),
      gap: 8,
    },
    nextButtonText: {
      fontFamily: theme.fontFamily.bold,
      color: '#FFFFFF',
      fontSize: clamp(width * 0.048, 16, 19),
      letterSpacing: 0.2,
    },
    loginLink: {
      alignItems: 'center',
      paddingVertical: isSmallPhone ? 4 : 8,
    },
    loginLinkText: {
      fontFamily: theme.fontFamily.regular,
      fontSize: clamp(width * 0.041, 14, 16),
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
    loginLinkBold: {
      fontFamily: theme.fontFamily.bold,
      color: theme.colors.primary,
    },
  });
};
