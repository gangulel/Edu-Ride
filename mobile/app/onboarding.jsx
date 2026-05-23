import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bus, ArrowRight2, ArrowLeft2 } from 'iconsax-react-native';

import { colors, palette } from './theme';
import Hero1Tracking from './components/onboarding/Hero1Tracking';
import Hero2Safety from './components/onboarding/Hero2Safety';
import Hero3Payments from './components/onboarding/Hero3Payments';

const SCREENS = [
  {
    eyebrow: 'Live tracking',
    headline: 'Track every ride in',
    headlineAccent: 'real-time',
    desc:
      'Monitor your child’s school bus live with GPS tracking, ETA updates, and instant arrival alerts.',
    Hero: Hero1Tracking,
    cta: 'Next',
  },
  {
    eyebrow: 'Safety & alerts',
    headline: 'Stay updated &',
    headlineAccent: 'feel secure',
    desc:
      'Receive instant notifications for pickups, drop-offs, delays, and emergency alerts — all in one place.',
    Hero: Hero2Safety,
    cta: 'Next',
  },
  {
    eyebrow: 'All in one place',
    headline: 'Simple payments,',
    headlineAccent: 'easy chats',
    desc:
      'Pay transport fees securely, chat with drivers, and manage school trips effortlessly.',
    Hero: Hero3Payments,
    cta: 'Get started',
  },
];

export default function Onboarding() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const styles = useMemo(() => createStyles(width, height), [width, height]);
  const screen = SCREENS[index];
  const isLast = index === SCREENS.length - 1;
  const Hero = screen.Hero;

  const goNext = () => {
    if (isLast) {
      router.push('/login/login');
    } else {
      setIndex((i) => Math.min(SCREENS.length - 1, i + 1));
    }
  };
  const goBack = () => setIndex((i) => Math.max(0, i - 1));
  const skip = () => setIndex(SCREENS.length - 1);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      {/* Layered gradient background */}
      <LinearGradient
        colors={['#EFF5FF', palette.slate[50], '#FFFFFF']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.bgBlobTopLeft} />
      <View style={styles.bgBlobTopRight} />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        {/* Top bar */}
        <View style={styles.topbar}>
          <View style={styles.brand}>
            <LinearGradient
              colors={[colors.primary, palette.cyan[500]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.brandMark}
            >
              <Bus size={16} color="#FFFFFF" variant="Bold" />
            </LinearGradient>
            <Text style={styles.brandText}>Edu-Ride</Text>
          </View>
          {!isLast ? (
            <TouchableOpacity onPress={skip} style={styles.skip} activeOpacity={0.8}>
              <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 64 }} />
          )}
        </View>

        {/* Hero area — keyed so each screen remounts cleanly */}
        <View style={styles.heroFrame}>
          <View style={styles.heroInner} key={`hero-${index}`}>
            <Hero />
          </View>
        </View>

        {/* Text block */}
        <View style={styles.textBlock}>
          <View style={styles.eyebrow}>
            <View style={styles.eyebrowDot} />
            <Text style={styles.eyebrowText}>{screen.eyebrow}</Text>
          </View>
          <Text style={styles.headline}>
            {screen.headline}{' '}
            <Text style={styles.headlineAccent}>{screen.headlineAccent}</Text>
          </Text>
          <Text style={styles.desc}>{screen.desc}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.dots}>
            {SCREENS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === index && styles.dotActive,
                ]}
              />
            ))}
          </View>

          <View style={styles.actions}>
            {index > 0 ? (
              <TouchableOpacity
                onPress={goBack}
                style={styles.back}
                activeOpacity={0.8}
                accessibilityLabel="Back"
              >
                <ArrowLeft2 size={22} color={colors.primaryDark} variant="Linear" />
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity
              onPress={goNext}
              activeOpacity={0.9}
              style={styles.ctaShadow}
            >
              <LinearGradient
                colors={[palette.blue[500], palette.blue[600]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.cta}
              >
                <View style={styles.ctaSheen} />
                <Text style={styles.ctaText}>{screen.cta}</Text>
                <View style={styles.ctaArrow}>
                  <ArrowRight2 size={18} color="#FFFFFF" variant="Linear" />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {isLast ? (
            <View style={styles.signin}>
              <Text style={styles.signinText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => router.push('/login/login')}>
                <Text style={styles.signinLink}> Sign in</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </SafeAreaView>
    </View>
  );
}

const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

const createStyles = (width, height) => {
  const isSmall = width < 360 || height < 700;
  const hPad = clamp(width * 0.06, 18, 26);

  return StyleSheet.create({
    root: { flex: 1, backgroundColor: '#FFFFFF' },
    safe: { flex: 1 },
    bgBlobTopRight: {
      position: 'absolute',
      top: -60,
      right: -80,
      width: 280,
      height: 280,
      borderRadius: 999,
      backgroundColor: 'rgba(59,130,246,0.28)',
      opacity: 0.55,
    },
    bgBlobTopLeft: {
      position: 'absolute',
      top: -40,
      left: -60,
      width: 220,
      height: 220,
      borderRadius: 999,
      backgroundColor: 'rgba(6,182,212,0.22)',
      opacity: 0.5,
    },

    topbar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: hPad,
      paddingTop: Platform.OS === 'android' ? 8 : 4,
      paddingBottom: 4,
    },
    brand: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    brandMark: {
      width: 26,
      height: 26,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 4,
    },
    brandText: {
      fontSize: 16,
      fontWeight: '800',
      color: colors.textPrimary,
      letterSpacing: -0.2,
    },
    skip: {
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: 'rgba(255,255,255,0.7)',
      borderWidth: 1,
      borderColor: 'rgba(15,23,42,0.06)',
    },
    skipText: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.textSecondary,
      letterSpacing: -0.2,
    },

    heroFrame: {
      flex: 1,
      marginHorizontal: hPad,
      marginTop: 12,
      minHeight: isSmall ? 280 : 340,
    },
    heroInner: { flex: 1, position: 'relative' },

    textBlock: {
      paddingHorizontal: hPad + 6,
      paddingTop: 22,
      paddingBottom: 6,
      alignItems: 'center',
    },
    eyebrow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: 'rgba(37,99,235,0.08)',
      marginBottom: 12,
    },
    eyebrowDot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: colors.primaryDark,
    },
    eyebrowText: {
      fontSize: 11,
      fontWeight: '800',
      color: colors.primaryDark,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    headline: {
      fontSize: isSmall ? 26 : 30,
      fontWeight: '800',
      color: colors.textPrimary,
      textAlign: 'center',
      letterSpacing: -0.6,
      lineHeight: isSmall ? 32 : 36,
    },
    headlineAccent: { color: palette.cyan[500] },
    desc: {
      fontSize: isSmall ? 14.5 : 15.5,
      lineHeight: isSmall ? 22 : 23,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 10,
      maxWidth: 320,
    },

    footer: {
      paddingHorizontal: hPad,
      paddingTop: 16,
      paddingBottom: isSmall ? 18 : 26,
      gap: 16,
    },
    dots: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 6,
    },
    dot: {
      width: 6,
      height: 6,
      borderRadius: 999,
      backgroundColor: 'rgba(37,99,235,0.2)',
    },
    dotActive: {
      width: 24,
      backgroundColor: colors.primaryDark,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    back: {
      width: 56,
      height: 56,
      borderRadius: 999,
      borderWidth: 1.5,
      borderColor: 'rgba(37,99,235,0.18)',
      backgroundColor: 'rgba(255,255,255,0.7)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    ctaShadow: {
      flex: 1,
      borderRadius: 18,
      shadowColor: palette.blue[600],
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.45,
      shadowRadius: 20,
      elevation: 10,
    },
    cta: {
      height: 56,
      borderRadius: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      overflow: 'hidden',
    },
    ctaSheen: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '50%',
      backgroundColor: 'rgba(255,255,255,0.18)',
      borderTopLeftRadius: 18,
      borderTopRightRadius: 18,
    },
    ctaText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
      letterSpacing: -0.2,
    },
    ctaArrow: { alignItems: 'center', justifyContent: 'center' },
    signin: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    signinText: { fontSize: 13.5, color: colors.textSecondary },
    signinLink: {
      fontSize: 13.5,
      fontWeight: '700',
      color: colors.primaryDark,
    },
  });
};
