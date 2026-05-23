import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { TickCircle, Lock1 } from 'iconsax-react-native';
import { colors, palette } from '../../theme';
import GlassCard from './GlassCard';
import FloatingBox from './FloatingBox';

const Hero3Payments = () => {
  return (
    <View style={styles.frame}>
      {/* Soft glow */}
      <View style={styles.glow} />

      {/* Wallet / payment card centerpiece */}
      <View style={styles.centerWrap}>
        <FloatingBox amplitude={5} duration={4600} style={styles.cardTilt}>
          <LinearGradient
            colors={[palette.blue[800], palette.blue[600], palette.cyan[500]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.card}
          >
            {/* Decorative orb */}
            <View style={styles.cardOrb} />

            <View style={styles.cardTopRow}>
              <View>
                <Text style={styles.cardEyebrow}>EDU-RIDE · WALLET</Text>
                <Text style={styles.cardOwner}>Olivia Carter</Text>
              </View>
              <View style={styles.cardChips}>
                <View
                  style={[
                    styles.cardChip,
                    { backgroundColor: 'rgba(255,255,255,0.85)' },
                  ]}
                />
                <View
                  style={[
                    styles.cardChip,
                    {
                      backgroundColor: 'rgba(255,255,255,0.45)',
                      marginLeft: -8,
                    },
                  ]}
                />
              </View>
            </View>

            <View style={styles.cardBalanceRow}>
              <Text style={styles.cardBalanceLabel}>BALANCE</Text>
              <Text style={styles.cardBalance}>
                $148<Text style={styles.cardBalanceCents}>.50</Text>
              </Text>
            </View>

            <View style={styles.cardBottomRow}>
              <Text style={styles.cardNumber}>•••• 4291</Text>
              <Text style={styles.cardBrand}>VISA</Text>
            </View>
          </LinearGradient>
        </FloatingBox>
      </View>

      {/* Driver chat bubble (top-right) */}
      <FloatingBox
        duration={5300}
        delay={150}
        style={[styles.floatPos, { top: 10, right: 4 }]}
      >
        <GlassCard padding={10} style={styles.chatCard}>
          <View style={styles.chatHeader}>
            <LinearGradient
              colors={[palette.amber[500], '#EF4444']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>MD</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.chatName}>Mr. Daniel · Driver</Text>
              <View style={styles.chatStatusRow}>
                <View style={styles.chatStatusDot} />
                <Text style={styles.chatStatusText}>Online</Text>
              </View>
            </View>
          </View>
          <View style={styles.chatBubbleLeft}>
            <Text style={styles.chatBubbleText}>
              Approaching pickup in 2 minutes — please be ready
            </Text>
          </View>
        </GlassCard>
      </FloatingBox>

      {/* Reply bubble (mid-right) */}
      <FloatingBox
        duration={5800}
        delay={300}
        style={[styles.floatPos, { top: 132, right: 24 }]}
      >
        <LinearGradient
          colors={[palette.blue[500], palette.blue[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.replyBubble}
        >
          <Text style={styles.replyText}>Thanks! Alex is at the gate</Text>
        </LinearGradient>
      </FloatingBox>

      {/* Paid chip (bottom-left) */}
      <FloatingBox
        duration={5400}
        delay={450}
        style={[styles.floatPos, { bottom: 28, left: 12 }]}
      >
        <GlassCard padding={10} style={styles.paidCard}>
          <View style={styles.paidIcon}>
            <TickCircle size={18} color={palette.emerald[500]} variant="Bold" />
          </View>
          <View>
            <Text style={styles.paidLabel}>PAID</Text>
            <Text style={styles.paidTitle}>Nov fees · $42</Text>
          </View>
        </GlassCard>
      </FloatingBox>

      {/* End-to-end secure chip (bottom-right) */}
      <FloatingBox
        duration={4900}
        delay={560}
        style={[styles.floatPos, { bottom: 54, right: 12 }]}
      >
        <GlassCard padding={8} style={styles.lockCard}>
          <Lock1 size={14} color={colors.primaryDark} variant="Bold" />
          <Text style={styles.lockText}>End-to-end secure</Text>
        </GlassCard>
      </FloatingBox>
    </View>
  );
};

const styles = StyleSheet.create({
  frame: { flex: 1, position: 'relative' },
  glow: {
    position: 'absolute',
    width: 320,
    height: 320,
    borderRadius: 999,
    backgroundColor: 'rgba(37,99,235,0.22)',
    top: '50%',
    left: '50%',
    marginLeft: -160,
    marginTop: -160,
    opacity: 0.7,
  },
  centerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  cardTilt: { transform: [{ rotate: '-6deg' }] },
  card: {
    width: 248,
    height: 152,
    borderRadius: 22,
    padding: 18,
    overflow: 'hidden',
    shadowColor: palette.blue[600],
    shadowOffset: { width: 0, height: 22 },
    shadowOpacity: 0.55,
    shadowRadius: 28,
    elevation: 14,
  },
  cardOrb: {
    position: 'absolute',
    top: -36,
    right: -36,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardEyebrow: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.75)',
    letterSpacing: 0.8,
  },
  cardOwner: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.88)',
    marginTop: 4,
  },
  cardChips: { flexDirection: 'row', alignItems: 'center' },
  cardChip: { width: 18, height: 18, borderRadius: 999 },
  cardBalanceRow: { marginTop: 22 },
  cardBalanceLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.72)',
    letterSpacing: 0.6,
  },
  cardBalance: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.4,
    lineHeight: 32,
  },
  cardBalanceCents: { fontSize: 18, color: 'rgba(255,255,255,0.72)' },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 6,
  },
  cardNumber: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    letterSpacing: 2,
  },
  cardBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.9)',
    letterSpacing: 1,
  },
  floatPos: { position: 'absolute' },
  chatCard: { width: 218 },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 11, fontWeight: '800', color: '#FFFFFF' },
  chatName: {
    fontSize: 11.5,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  chatStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chatStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: palette.emerald[500],
  },
  chatStatusText: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.emerald[500],
  },
  chatBubbleLeft: {
    backgroundColor: 'rgba(37,99,235,0.08)',
    borderRadius: 12,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  chatBubbleText: {
    fontSize: 12,
    color: colors.textPrimary,
    lineHeight: 16,
  },
  replyBubble: {
    borderRadius: 12,
    borderBottomRightRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 168,
    shadowColor: palette.blue[600],
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  replyText: { fontSize: 12, color: '#FFFFFF', lineHeight: 16 },
  paidCard: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  paidIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: 'rgba(16,185,129,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paidLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: palette.emerald[500],
    letterSpacing: 0.6,
  },
  paidTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    lineHeight: 16,
  },
  lockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  lockText: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textPrimary,
  },
});

export default Hero3Payments;
