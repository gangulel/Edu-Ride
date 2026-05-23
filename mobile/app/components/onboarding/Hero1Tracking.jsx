import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Path, Rect, G, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Bus, Location, Clock } from 'iconsax-react-native';
import { colors, palette } from '../../theme';
import GlassCard from './GlassCard';
import FloatingBox from './FloatingBox';

const AnimatedPath = Animated.createAnimatedComponent(Path);

const Hero1Tracking = () => {
  // Dashed-route flow: animate strokeDashoffset.
  const dash = useRef(new Animated.Value(0)).current;
  // Bus marker ripple.
  const ripple = useRef(new Animated.Value(0)).current;
  // Route progress bar shimmer.
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const dashLoop = Animated.loop(
      Animated.timing(dash, {
        toValue: 1,
        duration: 3500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    );
    const rippleLoop = Animated.loop(
      Animated.timing(ripple, {
        toValue: 1,
        duration: 2400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    );
    const progressLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(progress, {
          toValue: 1,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
        Animated.timing(progress, {
          toValue: 0,
          duration: 2600,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: false,
        }),
      ]),
    );
    dashLoop.start();
    rippleLoop.start();
    progressLoop.start();
    return () => {
      dashLoop.stop();
      rippleLoop.stop();
      progressLoop.stop();
    };
  }, [dash, ripple, progress]);

  const dashOffset = dash.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  const rippleScale = ripple.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 2.4],
  });
  const rippleOpacity = ripple.interpolate({
    inputRange: [0, 1],
    outputRange: [0.55, 0],
  });
  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['54%', '78%'],
  });

  return (
    <View style={styles.frame}>
      {/* Map background */}
      <LinearGradient
        colors={[palette.blue[100], palette.blue[50], palette.slate[50]]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Grid */}
      <Svg
        viewBox="0 0 358 360"
        preserveAspectRatio="xMidYMid slice"
        style={StyleSheet.absoluteFill}
      >
        <G stroke="rgba(37,99,235,0.06)" strokeWidth="1">
          {Array.from({ length: 12 }).map((_, i) => (
            <Line
              key={`h-${i}`}
              x1="0"
              y1={i * 32}
              x2="358"
              y2={i * 32}
            />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <Line
              key={`v-${i}`}
              x1={i * 32}
              y1="0"
              x2={i * 32}
              y2="360"
            />
          ))}
        </G>

        {/* Roads */}
        <G stroke="#FFFFFF" strokeWidth="14" fill="none" strokeLinecap="round">
          <Path d="M-10 80 Q 80 90 160 60 T 370 90" />
          <Path d="M-10 280 Q 90 270 180 300 T 370 280" />
          <Path d="M40 -10 Q 60 100 50 200 T 80 370" />
          <Path d="M260 -10 Q 250 80 270 180 T 250 370" />
        </G>
        <G
          stroke="#E0E7FF"
          strokeWidth="14"
          fill="none"
          strokeLinecap="round"
          opacity={0.55}
        >
          <Path d="M-10 180 Q 90 170 180 200 T 370 180" />
          <Path d="M150 -10 Q 140 100 160 200 T 150 370" />
        </G>

        {/* Buildings */}
        <G fill="#DBEAFE" opacity={0.55}>
          <Rect x="78" y="108" width="44" height="48" rx="6" />
          <Rect x="78" y="208" width="44" height="42" rx="6" />
          <Rect x="180" y="108" width="58" height="42" rx="6" />
          <Rect x="190" y="218" width="48" height="42" rx="6" />
          <Rect x="290" y="120" width="40" height="50" rx="6" />
          <Rect x="290" y="220" width="40" height="50" rx="6" />
        </G>

        {/* Route — soft underlay */}
        <Path
          d="M 60 290 Q 60 220 110 200 T 200 180 Q 270 170 285 100"
          stroke="rgba(37, 99, 235, 0.14)"
          strokeWidth="14"
          strokeLinecap="round"
          fill="none"
        />
        {/* Route — animated dashed flow */}
        <AnimatedPath
          d="M 60 290 Q 60 220 110 200 T 200 180 Q 270 170 285 100"
          stroke={colors.primaryDark}
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
          strokeDasharray="2,8"
          strokeDashoffset={dashOffset}
        />
      </Svg>

      {/* HOME pin */}
      <View style={[styles.pin, { left: 28, bottom: 48 }]}>
        <View style={styles.pinBubble}>
          <Location
            size={18}
            color={palette.slate[500]}
            variant="Bold"
          />
        </View>
        <View style={styles.pinLabel}>
          <Text style={styles.pinLabelText}>HOME</Text>
        </View>
      </View>

      {/* SCHOOL pin */}
      <View style={[styles.pin, { right: 22, top: 36 }]}>
        <LinearGradient
          colors={[palette.cyan[500], palette.blue[500]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.pinBubble, styles.pinBubbleAccent]}
        >
          <Location size={18} color="#FFFFFF" variant="Bold" />
        </LinearGradient>
        <View style={styles.pinLabel}>
          <Text style={[styles.pinLabelText, { color: palette.cyan[600] }]}>
            SCHOOL
          </Text>
        </View>
      </View>

      {/* Bus marker (center) */}
      <FloatingBox
        amplitude={5}
        duration={4200}
        style={styles.busWrap}
        pointerEvents="none"
      >
        <Animated.View
          style={[
            styles.ripple,
            {
              transform: [{ scale: rippleScale }],
              opacity: rippleOpacity,
            },
          ]}
        />
        <LinearGradient
          colors={[palette.blue[500], palette.blue[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.busMarker}
        >
          <Bus size={26} color="#FFFFFF" variant="Bold" />
        </LinearGradient>
      </FloatingBox>

      {/* Floating ETA card (top-left) */}
      <FloatingBox
        delay={100}
        duration={5200}
        style={[styles.floatPos, { top: 16, left: 14 }]}
      >
        <GlassCard padding={10} style={styles.etaCard}>
          <View style={styles.etaIcon}>
            <Clock size={18} color={colors.primaryDark} variant="Bold" />
          </View>
          <View>
            <Text style={styles.etaLabel}>ARRIVING IN</Text>
            <Text style={styles.etaValue}>
              8 <Text style={styles.etaUnit}>min</Text>
            </Text>
          </View>
        </GlassCard>
      </FloatingBox>

      {/* Floating route card (bottom-right) */}
      <FloatingBox
        delay={250}
        duration={5800}
        style={[styles.floatPos, { bottom: 14, right: 12 }]}
      >
        <GlassCard padding={12} style={styles.routeCard}>
          <View style={styles.routeHeader}>
            <View style={styles.routeDotWrap}>
              <View style={styles.routeDot} />
            </View>
            <Text style={styles.routeStatus}>ON ROUTE</Text>
          </View>
          <Text style={styles.routeTitle}>Bus #42 · Route A</Text>
          <Text style={styles.routeDriver}>Driver: Mr. Daniel</Text>
          <View style={styles.routeProgressTrack}>
            <Animated.View
              style={[styles.routeProgressFillBase, { width: progressWidth }]}
            >
              <LinearGradient
                colors={[palette.cyan[500], palette.blue[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </GlassCard>
      </FloatingBox>

      {/* Soft white inner ring for the map */}
      <View pointerEvents="none" style={styles.mapInnerRing} />
    </View>
  );
};

const styles = StyleSheet.create({
  frame: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: palette.blue[50],
  },
  mapInnerRing: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.08)',
  },
  pin: {
    position: 'absolute',
    alignItems: 'center',
    gap: 4,
  },
  pinBubble: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 4,
  },
  pinBubbleAccent: {
    borderWidth: 0,
    shadowColor: palette.cyan[500],
    shadowOpacity: 0.45,
  },
  pinLabel: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pinLabelText: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.slate[600],
    letterSpacing: 0.4,
  },
  busWrap: {
    position: 'absolute',
    left: '46%',
    top: '44%',
    width: 56,
    height: 56,
    marginLeft: -28,
    marginTop: -28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ripple: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.3)',
  },
  busMarker: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: palette.blue[600],
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.55,
    shadowRadius: 18,
    elevation: 10,
  },
  floatPos: { position: 'absolute' },
  etaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  etaIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(37,99,235,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  etaLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.6,
  },
  etaValue: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 20,
    letterSpacing: -0.2,
  },
  etaUnit: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  routeCard: { minWidth: 172 },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  routeDotWrap: {
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: 'rgba(16,185,129,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    backgroundColor: palette.emerald[500],
  },
  routeStatus: {
    fontSize: 11,
    fontWeight: '800',
    color: palette.emerald[500],
    letterSpacing: 0.6,
  },
  routeTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  routeDriver: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  routeProgressTrack: {
    marginTop: 8,
    height: 5,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.12)',
    overflow: 'hidden',
  },
  routeProgressFillBase: {
    height: '100%',
    borderRadius: 999,
    overflow: 'hidden',
  },
});

export default Hero1Tracking;
