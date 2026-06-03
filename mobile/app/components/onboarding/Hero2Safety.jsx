import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ShieldTick,
  TickCircle,
  Notification,
  Shield,
} from 'iconsax-react-native';
import { colors, palette } from '../../theme';
import GlassCard from './GlassCard';
import FloatingBox from './FloatingBox';

const Hero2Safety = () => {
  return (
    <View style={styles.frame}>
      {/* Soft radial halos */}
      <View style={[styles.halo, styles.haloBig]} />
      <View style={[styles.halo, styles.haloSmall]} />

      {/* Concentric rings */}
      <Svg width={320} height={320} viewBox="0 0 320 320" style={styles.rings}>
        <Circle
          cx="160"
          cy="160"
          r="118"
          stroke="rgba(37,99,235,0.16)"
          strokeWidth="1.5"
          fill="none"
          strokeDasharray="4,8"
        />
        <Circle
          cx="160"
          cy="160"
          r="78"
          stroke="rgba(37,99,235,0.18)"
          strokeWidth="1.5"
          fill="none"
        />
      </Svg>

      {/* Shield centerpiece */}
      <View style={styles.centerWrap}>
        <FloatingBox amplitude={6} duration={4500}>
          <LinearGradient
            colors={[palette.blue[500], palette.blue[600], palette.blue[800]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.shieldBlock}
          >
            <View style={styles.shieldInnerRing} />
            <ShieldTick size={56} color="#FFFFFF" variant="Bold" />
          </LinearGradient>

          {/* Check badge */}
          <LinearGradient
            colors={[palette.cyan[500], '#0EA5E9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.badge}
          >
            <TickCircle size={20} color="#FFFFFF" variant="Bold" />
          </LinearGradient>
        </FloatingBox>
      </View>

      {/* Notification: picked up (top-left) */}
      <FloatingBox
        duration={5300}
        delay={0}
        style={[styles.notifPos, { top: 18, left: 4 }]}
      >
        <GlassCard padding={12} style={styles.notifCard}>
          <View
            style={[
              styles.notifIcon,
              { backgroundColor: 'rgba(16,185,129,0.14)' },
            ]}
          >
            <TickCircle size={18} color={palette.emerald[500]} variant="Bold" />
          </View>
          <View style={styles.notifBody}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Picked up</Text>
              <Text style={styles.notifTime}>7:42</Text>
            </View>
            <Text style={styles.notifSub}>Alex boarded Bus #42</Text>
          </View>
        </GlassCard>
      </FloatingBox>

      {/* Notification: arriving soon (middle-right) */}
      <FloatingBox
        duration={5700}
        delay={250}
        style={[styles.notifPos, { top: 122, right: 0 }]}
      >
        <GlassCard padding={12} style={[styles.notifCard, { width: 224 }]}>
          <View
            style={[
              styles.notifIcon,
              { backgroundColor: 'rgba(37,99,235,0.12)' },
            ]}
          >
            <Notification size={18} color={colors.primaryDark} variant="Bold" />
          </View>
          <View style={styles.notifBody}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Arriving soon</Text>
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>5 min</Text>
              </View>
            </View>
            <Text style={styles.notifSub}>Bus approaching school</Text>
          </View>
        </GlassCard>
      </FloatingBox>

      {/* Notification: safe arrival (bottom-left) */}
      <FloatingBox
        duration={6100}
        delay={420}
        style={[styles.notifPos, { bottom: 22, left: 18 }]}
      >
        <GlassCard padding={12} style={[styles.notifCard, { width: 232 }]}>
          <LinearGradient
            colors={['rgba(6,182,212,0.18)', 'rgba(37,99,235,0.16)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.notifIcon}
          >
            <Shield size={18} color={palette.cyan[600]} variant="Bold" />
          </LinearGradient>
          <View style={styles.notifBody}>
            <View style={styles.notifHeader}>
              <Text style={styles.notifTitle}>Safe arrival</Text>
              <Text style={styles.notifTime}>3:18</Text>
            </View>
            <Text style={styles.notifSub}>Alex is home, safe &amp; sound</Text>
          </View>
        </GlassCard>
      </FloatingBox>
    </View>
  );
};

const styles = StyleSheet.create({
  frame: { flex: 1, position: 'relative' },
  halo: { position: 'absolute', borderRadius: 999 },
  haloBig: {
    width: 280,
    height: 280,
    backgroundColor: 'rgba(37,99,235,0.18)',
    top: '50%',
    left: '50%',
    marginLeft: -140,
    marginTop: -140,
    opacity: 0.6,
  },
  haloSmall: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(6,182,212,0.22)',
    top: '36%',
    right: '8%',
    opacity: 0.55,
  },
  rings: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -160,
    marginTop: -160,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldBlock: {
    width: 124,
    height: 124,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.blue[600],
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.55,
    shadowRadius: 30,
    elevation: 14,
  },
  shieldInnerRing: {
    ...StyleSheet.absoluteFillObject,
    margin: 6,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -10,
    width: 38,
    height: 38,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: palette.slate[50],
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius: 12,
    elevation: 8,
  },
  notifPos: { position: 'absolute' },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: 220,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBody: { flex: 1 },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  notifTime: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  notifSub: {
    fontSize: 11.5,
    color: colors.textSecondary,
    marginTop: 1,
    lineHeight: 15,
  },
  notifBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.1)',
  },
  notifBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});

export default Hero2Safety;
