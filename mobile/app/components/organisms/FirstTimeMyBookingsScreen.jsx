/**
 * FirstTimeMyBookingsScreen
 *
 * Shown instead of the regular My Bookings list when a first-time parent
 * has no bookings at all.  Goal: warm onboarding experience that guides
 * parents toward making their first booking – never an empty / broken look.
 *
 * Sections
 *  1. Gradient header  (My Bookings title + subtitle)
 *  2. Hero illustration card  (bus + parent + child + GPS badge)
 *  3. Empty-state booking card
 *  4. Primary + secondary CTA buttons
 *  5. Horizontal "How to Book" step guide
 *  6. Feature highlights  (2 × 2 grid)
 *  7. Suggested popular routes preview
 *  8. Safety & trust banner
 *  9. Fixed bottom nav
 */

import React, { useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    StatusBar,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
    Notification,
    Location,
    Wallet3,
    Shield,
    Bus,
    Profile2User,
    TickCircle,
    ArrowRight2,
    Clock,
    Map1,
    AddCircle,
    SearchNormal1,
    Calendar,
    GPS,
    Verify,
    Sms,
    ArrowRight,
} from 'iconsax-react-native';
import { wp, hp, fs } from '../../utils/responsive';
import ParentBottomNav from './ParentBottomNav';

// ─── dummy route data ─────────────────────────────────────────────────────────

const POPULAR_ROUTES = [
    {
        id: '1',
        school: 'Greenfield Primary',
        area: 'Colombo 07',
        time: '~18 min',
        seats: 4,
        color: ['#EFF6FF', '#DBEAFE'],
        accent: '#3B82F6',
    },
    {
        id: '2',
        school: 'Royal College',
        area: 'Colombo 05',
        time: '~25 min',
        seats: 2,
        color: ['#F0FDF4', '#DCFCE7'],
        accent: '#10B981',
    },
    {
        id: '3',
        school: 'Stafford Int. School',
        area: 'Rajagiriya',
        time: '~30 min',
        seats: 6,
        color: ['#FAF5FF', '#EDE9FE'],
        accent: '#8B5CF6',
    },
    {
        id: '4',
        school: 'Gateway College',
        area: 'Dehiwala',
        time: '~35 min',
        seats: 3,
        color: ['#FFF7ED', '#FED7AA'],
        accent: '#F59E0B',
    },
];

// ─── Hero Illustration ────────────────────────────────────────────────────────

function HeroIllustration() {
    return (
        <View style={hi.wrapper}>
            {/* Decorative gradient blobs */}
            <View style={[hi.blob, { top: -20, left: -16, backgroundColor: '#DBEAFE', width: 100, height: 100, borderRadius: 50 }]} />
            <View style={[hi.blob, { bottom: 10, right: -14, backgroundColor: '#EDE9FE', width: 80, height: 80, borderRadius: 40 }]} />
            <View style={[hi.blob, { top: 30, right: wp(60), backgroundColor: '#D1FAE5', width: 50, height: 50, borderRadius: 25 }]} />

            {/* Route dotted path */}
            <View style={hi.routePath}>
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                    <View
                        key={i}
                        style={[hi.routeDot, { backgroundColor: i % 2 === 0 ? '#BFDBFE' : 'transparent' }]}
                    />
                ))}
            </View>

            {/* Parent figure (left) */}
            <View style={hi.figureWrap}>
                <Text style={hi.figureEmoji}>👩</Text>
                <View style={hi.figureName}>
                    <Text style={hi.figureNameText}>Parent</Text>
                </View>
            </View>

            {/* School Bus (centre) */}
            <View style={hi.busContainer}>
                <LinearGradient
                    colors={['#FDE68A', '#F59E0B', '#D97706']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={hi.busBody}
                >
                    {/* Roof strip */}
                    <View style={hi.busRoof} />

                    {/* Bus label */}
                    <View style={hi.busLabelRow}>
                        <View style={hi.busLabelPill}>
                            <Text style={hi.busLabelText}>SCHOOL BUS</Text>
                        </View>
                    </View>

                    {/* Windows */}
                    <View style={hi.windowsRow}>
                        {[0, 1, 2, 3].map((i) => (
                            <View key={i} style={hi.window} />
                        ))}
                    </View>

                    {/* Bumper / front detail */}
                    <View style={hi.busFront}>
                        <View style={hi.headlight} />
                        <View style={hi.headlightSpacer} />
                        <View style={hi.headlight} />
                    </View>
                </LinearGradient>

                {/* Wheels */}
                <View style={hi.wheelsRow}>
                    <View style={hi.wheel}>
                        <View style={hi.wheelHub} />
                    </View>
                    <View style={hi.wheel}>
                        <View style={hi.wheelHub} />
                    </View>
                    <View style={hi.wheel}>
                        <View style={hi.wheelHub} />
                    </View>
                </View>

                {/* Road */}
                <View style={hi.road}>
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                        <View key={i} style={hi.roadDash} />
                    ))}
                </View>
            </View>

            {/* Child figure (right) */}
            <View style={hi.figureWrap}>
                <Text style={[hi.figureEmoji, { fontSize: fs(30) }]}>👦</Text>
                <View style={[hi.figureName, { backgroundColor: '#D1FAE5' }]}>
                    <Text style={[hi.figureNameText, { color: '#059669' }]}>Student</Text>
                </View>
            </View>

            {/* Floating GPS Live badge */}
            <View style={hi.gpsBadge}>
                <View style={hi.gpsDot} />
                <Text style={hi.gpsBadgeText}>GPS Live</Text>
            </View>

            {/* Location pin */}
            <View style={hi.locationPin}>
                <Location size={14} color="#EF4444" variant="Bold" />
            </View>
        </View>
    );
}

const hi = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: hp(22),
        paddingHorizontal: wp(12),
        overflow: 'hidden',
        position: 'relative',
        minHeight: hp(130),
    },
    blob: {
        position: 'absolute',
        opacity: 0.55,
    },
    routePath: {
        position: 'absolute',
        bottom: hp(28),
        left: wp(20),
        right: wp(20),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 0,
    },
    routeDot: { width: wp(16), height: 3, borderRadius: 2 },
    figureWrap: {
        alignItems: 'center',
        marginBottom: hp(10),
        zIndex: 1,
    },
    figureEmoji: { fontSize: fs(38), lineHeight: fs(46) },
    figureName: {
        marginTop: hp(4),
        backgroundColor: '#DBEAFE',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    figureNameText: { fontSize: fs(9), fontFamily: 'Roboto-Bold', color: '#2563EB' },
    busContainer: { alignItems: 'center', marginHorizontal: wp(10), zIndex: 1 },
    busBody: {
        width: wp(148),
        height: hp(72),
        borderRadius: 14,
        overflow: 'hidden',
        padding: hp(6),
        justifyContent: 'space-between',
    },
    busRoof: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 6,
        backgroundColor: '#F97316',
        opacity: 0.5,
    },
    busLabelRow: { alignItems: 'center' },
    busLabelPill: {
        backgroundColor: 'rgba(0,0,0,0.15)',
        borderRadius: 6,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    busLabelText: {
        fontSize: fs(7),
        fontFamily: 'Roboto-Bold',
        color: '#78350F',
        letterSpacing: 0.8,
    },
    windowsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingHorizontal: 4,
    },
    window: {
        width: wp(22),
        height: hp(17),
        backgroundColor: 'rgba(219,234,254,0.9)',
        borderRadius: 5,
        borderWidth: 1.5,
        borderColor: 'rgba(255,255,255,0.6)',
    },
    busFront: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingRight: 8,
        paddingBottom: 2,
    },
    headlight: { width: 9, height: 6, backgroundColor: '#FEF9C3', borderRadius: 3 },
    headlightSpacer: { width: 4 },
    wheelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: wp(128),
        marginTop: -5,
        paddingHorizontal: wp(8),
    },
    wheel: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#1E293B',
        borderWidth: 3,
        borderColor: '#475569',
        alignItems: 'center',
        justifyContent: 'center',
    },
    wheelHub: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#94A3B8' },
    road: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: hp(4),
    },
    roadDash: { width: wp(13), height: 3, backgroundColor: '#CBD5E1', borderRadius: 2 },
    gpsBadge: {
        position: 'absolute',
        top: hp(14),
        right: wp(16),
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
        elevation: 4,
        zIndex: 10,
    },
    gpsDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
    gpsBadgeText: { fontSize: fs(11), fontFamily: 'Roboto-Bold', color: '#1E293B' },
    locationPin: {
        position: 'absolute',
        top: hp(14),
        left: wp(16),
        backgroundColor: '#FEF2F2',
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#EF4444',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        zIndex: 10,
    },
});

// ─── Horizontal Booking Step ──────────────────────────────────────────────────

function BookingStep({ icon: Icon, iconColor, iconBg, stepNo, title, desc, isLast }) {
    return (
        <View style={bs.stepWrap}>
            <View style={bs.card}>
                {/* Step number badge */}
                <View style={bs.stepNumWrap}>
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        style={bs.stepNum}
                    >
                        <Text style={bs.stepNumText}>{stepNo}</Text>
                    </LinearGradient>
                </View>

                {/* Icon */}
                <View style={[bs.iconCircle, { backgroundColor: iconBg }]}>
                    <Icon size={22} color={iconColor} variant="Bold" />
                </View>

                <Text style={bs.title}>{title}</Text>
                <Text style={bs.desc}>{desc}</Text>
            </View>

            {/* Connecting arrow */}
            {!isLast && (
                <View style={bs.arrow}>
                    <ArrowRight size={18} color="#BFDBFE" />
                </View>
            )}
        </View>
    );
}

const bs = StyleSheet.create({
    stepWrap: { flexDirection: 'row', alignItems: 'center' },
    card: {
        width: wp(110),
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: wp(12),
        alignItems: 'center',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 3,
        marginVertical: hp(4),
    },
    stepNumWrap: { position: 'absolute', top: -12, left: -8, zIndex: 5 },
    stepNum: {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    stepNumText: { fontSize: fs(10), fontFamily: 'Roboto-Bold', color: '#fff' },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(10),
        marginTop: hp(4),
    },
    title: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        textAlign: 'center',
        lineHeight: fs(16),
        marginBottom: hp(4),
    },
    desc: {
        fontSize: fs(10),
        fontFamily: 'Roboto-Regular',
        color: '#94A3B8',
        textAlign: 'center',
        lineHeight: fs(14),
    },
    arrow: { marginHorizontal: wp(4), paddingBottom: hp(4) },
});

// ─── Feature Card ─────────────────────────────────────────────────────────────

function FeatureCard({ icon: Icon, iconColor, iconBg, gradColors, title, description }) {
    return (
        <View style={fc.card}>
            <LinearGradient
                colors={gradColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={fc.gradient}
            >
                <View style={[fc.iconWrap, { backgroundColor: iconBg }]}>
                    <Icon size={22} color={iconColor} variant="Bold" />
                </View>
                <Text style={fc.title}>{title}</Text>
                <Text style={fc.desc}>{description}</Text>
            </LinearGradient>
        </View>
    );
}

const fc = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    gradient: { padding: wp(14), minHeight: hp(130) },
    iconWrap: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(10),
    },
    title: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        lineHeight: fs(18),
        marginBottom: 4,
    },
    desc: {
        fontSize: fs(11),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
        lineHeight: fs(16),
    },
});

// ─── Route Preview Card ───────────────────────────────────────────────────────

function RouteCard({ route }) {
    return (
        <LinearGradient
            colors={route.color}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={rc.card}
        >
            {/* School icon */}
            <View style={[rc.iconWrap, { backgroundColor: route.accent + '22' }]}>
                <Bus size={20} color={route.accent} variant="Bold" />
            </View>

            {/* School name */}
            <Text style={rc.school} numberOfLines={2}>{route.school}</Text>

            {/* Area */}
            <View style={rc.rowMeta}>
                <Location size={13} color={route.accent} variant="Bold" />
                <Text style={[rc.metaText, { color: route.accent }]}>{route.area}</Text>
            </View>

            {/* Divider */}
            <View style={rc.divider} />

            {/* Time + Seats */}
            <View style={rc.footer}>
                <View style={rc.rowMeta}>
                    <Clock size={12} color="#64748B" variant="Outline" />
                    <Text style={rc.footerText}>{route.time}</Text>
                </View>
                <View style={[rc.seatsBadge, { backgroundColor: route.accent + '18' }]}>
                    <Text style={[rc.seatsText, { color: route.accent }]}>
                        {route.seats} seats
                    </Text>
                </View>
            </View>
        </LinearGradient>
    );
}

const rc = StyleSheet.create({
    card: {
        width: wp(148),
        borderRadius: 20,
        padding: wp(14),
        marginRight: wp(12),
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(10),
    },
    school: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        lineHeight: fs(18),
        marginBottom: hp(6),
    },
    rowMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { fontSize: fs(11), fontFamily: 'Roboto-Medium' },
    divider: { height: 1, backgroundColor: 'rgba(0,0,0,0.06)', marginVertical: hp(10) },
    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    footerText: { fontSize: fs(11), fontFamily: 'Roboto-Regular', color: '#64748B' },
    seatsBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
    seatsText: { fontSize: fs(11), fontFamily: 'Roboto-Bold' },
});

// ─── Trust Badge Pill ─────────────────────────────────────────────────────────

function TrustPill({ icon: Icon, iconColor, label }) {
    return (
        <View style={tp.pill}>
            <View style={[tp.iconWrap, { backgroundColor: iconColor + '18' }]}>
                <Icon size={14} color={iconColor} variant="Bold" />
            </View>
            <Text style={tp.label}>{label}</Text>
        </View>
    );
}

const tp = StyleSheet.create({
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#fff',
        paddingHorizontal: wp(12),
        paddingVertical: hp(8),
        borderRadius: 24,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    iconWrap: {
        width: 24,
        height: 24,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: { fontSize: fs(12), fontFamily: 'Roboto-Medium', color: '#334155' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FirstTimeMyBookingsScreen() {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 550,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 550,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    // ── data constants ────────────────────────────────────────────────────────

    const BOOKING_STEPS = [
        {
            icon: Profile2User,
            iconColor: '#3B82F6',
            iconBg: '#EFF6FF',
            title: 'Add Child\nDetails',
            desc: 'Name, grade & school info',
        },
        {
            icon: Map1,
            iconColor: '#10B981',
            iconBg: '#ECFDF5',
            title: 'Choose\nSchool Route',
            desc: 'Browse nearby routes',
        },
        {
            icon: Bus,
            iconColor: '#8B5CF6',
            iconBg: '#F5F3FF',
            title: 'Select\nBus',
            desc: 'Pick a verified driver',
        },
        {
            icon: TickCircle,
            iconColor: '#F59E0B',
            iconBg: '#FFFBEB',
            title: 'Confirm\nBooking',
            desc: 'Done in seconds!',
        },
    ];

    const FEATURES = [
        {
            icon: GPS,
            iconColor: '#3B82F6',
            iconBg: '#EFF6FF',
            gradColors: ['#F0F9FF', '#EFF6FF'],
            title: 'Live GPS\nBus Tracking',
            description: 'Know exactly where the bus is at all times.',
        },
        {
            icon: Shield,
            iconColor: '#10B981',
            iconBg: '#ECFDF5',
            gradColors: ['#F0FDF4', '#DCFCE7'],
            title: 'Safe &\nVerified Drivers',
            description: 'Every driver is background-checked & licensed.',
        },
        {
            icon: Wallet3,
            iconColor: '#8B5CF6',
            iconBg: '#F5F3FF',
            gradColors: ['#FAF5FF', '#EDE9FE'],
            title: 'Monthly\nPayments',
            description: 'Simple billing, zero hidden charges.',
        },
        {
            icon: Sms,
            iconColor: '#F59E0B',
            iconBg: '#FFFBEB',
            gradColors: ['#FFFBEB', '#FEF3C7'],
            title: 'Real-Time\nNotifications',
            description: 'Instant pickup & drop-off alerts.',
        },
    ];

    const TRUST_ITEMS = [
        { icon: GPS, iconColor: '#3B82F6', label: 'GPS Tracking' },
        { icon: Shield, iconColor: '#10B981', label: 'Verified Drivers' },
        { icon: Verify, iconColor: '#8B5CF6', label: 'Safety Certified' },
    ];

    // ── render ────────────────────────────────────────────────────────────────

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

            {/* ── 1. GRADIENT HEADER ──────────────────────────────── */}
            <LinearGradient
                colors={['#1D4ED8', '#2563EB', '#3B82F6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.headerGrad}
            >
                <SafeAreaView edges={['top']}>
                    <View style={s.headerRow}>
                        {/* Left text block */}
                        <View style={s.headerTextBlock}>
                            {/* Page chip */}
                            <View style={s.pageChip}>
                                <Calendar size={12} color="#93C5FD" variant="Bold" />
                                <Text style={s.pageChipText}>My Bookings</Text>
                            </View>

                            <Text style={s.headerTitle}>My Bookings</Text>
                            <Text style={s.headerSub}>
                                Manage your child's school{'\n'}transport bookings easily.
                            </Text>
                        </View>

                        {/* Right actions */}
                        <View style={s.headerActions}>
                            <TouchableOpacity
                                style={s.iconBtn}
                                onPress={() => router.push('/parent/notifications')}
                                activeOpacity={0.8}
                            >
                                <Notification size={22} color="#fff" variant="Outline" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Status strip */}
                    <View style={s.statusStrip}>
                        <View style={s.statusPill}>
                            <View style={s.statusDot} />
                            <Text style={s.statusPillText}>No Active Bookings</Text>
                        </View>
                        <Text style={s.statusHint}>Complete setup to activate</Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* ── SCROLLABLE BODY ──────────────────────────────────── */}
            <ScrollView
                style={s.scroll}
                contentContainerStyle={s.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View
                    style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
                >
                    {/* ── 2. HERO ILLUSTRATION CARD ──────────────── */}
                    <View style={s.heroCard}>
                        <HeroIllustration />
                        <View style={s.heroCopyWrap}>
                            <Text style={s.heroTitle}>
                                Your child's safe ride{'\n'}starts right here 🚌
                            </Text>
                            <Text style={s.heroSub}>
                                Set up your first booking in minutes and track
                                every journey with complete peace of mind.
                            </Text>
                        </View>
                    </View>

                    {/* ── 3. EMPTY STATE BOOKING CARD ────────────── */}
                    <View style={s.section}>
                        <View style={s.emptyCard}>
                            {/* Decorative arc background */}
                            <View style={s.emptyArc} />

                            {/* Bus icon */}
                            <LinearGradient
                                colors={['#EFF6FF', '#DBEAFE']}
                                style={s.emptyBusIconGrad}
                            >
                                <Bus size={42} color="#3B82F6" variant="Bold" />
                            </LinearGradient>

                            <Text style={s.emptyTitle}>No Bookings Yet</Text>
                            <Text style={s.emptyDesc}>
                                You haven't booked a school transport service yet.{'\n'}
                                Start by adding your child and selecting a bus route.
                            </Text>

                            {/* Mini flow pill */}
                            <View style={s.emptyFlowRow}>
                                {['Add Child', '→', 'Find Route', '→', 'Book Ride'].map((item, i) => (
                                    <Text
                                        key={i}
                                        style={item === '→' ? s.emptyFlowArrow : s.emptyFlowStep}
                                    >
                                        {item}
                                    </Text>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* ── 4. CTA BUTTONS ─────────────────────────── */}
                    <View style={s.section}>
                        {/* Primary */}
                        <TouchableOpacity
                            style={s.primaryBtn}
                            onPress={() => router.push('/parent/profile/add-child')}
                            activeOpacity={0.88}
                        >
                            <LinearGradient
                                colors={['#3B82F6', '#2563EB', '#1D4ED8']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={s.primaryBtnGrad}
                            >
                                <View style={s.primaryBtnIcon}>
                                    <AddCircle size={22} color="#3B82F6" variant="Bold" />
                                </View>
                                <Text style={s.primaryBtnText}>Book Your First Ride</Text>
                                <ArrowRight2 size={20} color="rgba(255,255,255,0.75)" />
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Secondary */}
                        <TouchableOpacity
                            style={s.secondaryBtn}
                            onPress={() => router.push('/parent/search')}
                            activeOpacity={0.8}
                        >
                            <SearchNormal1 size={20} color="#2563EB" variant="Outline" />
                            <Text style={s.secondaryBtnText}>Explore Available Routes</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── 5. HOW TO BOOK STEPPER ──────────────────── */}
                    <View style={s.section}>
                        <View style={s.sectionHeaderRow}>
                            <View style={s.sectionLabelChip}>
                                <Text style={s.sectionLabelChipText}>GUIDE</Text>
                            </View>
                            <Text style={s.sectionTitle}>How to Make a Booking</Text>
                        </View>
                        <Text style={s.sectionSubtitle}>
                            Follow these simple steps to book your child's school transport.
                        </Text>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={s.stepsScroll}
                        >
                            {BOOKING_STEPS.map((step, i) => (
                                <BookingStep
                                    key={i}
                                    {...step}
                                    stepNo={i + 1}
                                    isLast={i === BOOKING_STEPS.length - 1}
                                />
                            ))}
                        </ScrollView>
                    </View>

                    {/* ── 6. FEATURE HIGHLIGHTS (2×2 grid) ───────── */}
                    <View style={s.section}>
                        <View style={s.sectionHeaderRow}>
                            <View style={[s.sectionLabelChip, { backgroundColor: '#ECFDF5' }]}>
                                <Text style={[s.sectionLabelChipText, { color: '#059669' }]}>FEATURES</Text>
                            </View>
                            <Text style={s.sectionTitle}>Everything You Need</Text>
                        </View>

                        <View style={s.featGrid}>
                            <View style={s.featRow}>
                                <FeatureCard {...FEATURES[0]} />
                                <View style={{ width: wp(10) }} />
                                <FeatureCard {...FEATURES[1]} />
                            </View>
                            <View style={[s.featRow, { marginTop: hp(10) }]}>
                                <FeatureCard {...FEATURES[2]} />
                                <View style={{ width: wp(10) }} />
                                <FeatureCard {...FEATURES[3]} />
                            </View>
                        </View>
                    </View>

                    {/* ── 7. SUGGESTED ROUTES PREVIEW ────────────── */}
                    <View style={[s.section, { paddingHorizontal: 0 }]}>
                        <View style={s.sectionPadded}>
                            <View style={s.sectionHeaderRow}>
                                <View style={[s.sectionLabelChip, { backgroundColor: '#F5F3FF' }]}>
                                    <Text style={[s.sectionLabelChipText, { color: '#7C3AED' }]}>ROUTES</Text>
                                </View>
                                <Text style={s.sectionTitle}>Popular Routes Near You</Text>
                            </View>
                            <Text style={s.sectionSubtitle}>
                                Browse popular school routes in your area.
                            </Text>
                        </View>

                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={s.routesScroll}
                        >
                            {POPULAR_ROUTES.map((route) => (
                                <RouteCard key={route.id} route={route} />
                            ))}
                        </ScrollView>

                        {/* View All Routes link */}
                        <View style={s.sectionPadded}>
                            <TouchableOpacity
                                style={s.viewAllRow}
                                onPress={() => router.push('/parent/search')}
                                activeOpacity={0.7}
                            >
                                <Text style={s.viewAllText}>View All Available Routes</Text>
                                <ArrowRight2 size={16} color="#3B82F6" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ── 8. SAFETY & TRUST BANNER ────────────────── */}
                    <View style={s.section}>
                        <LinearGradient
                            colors={['#1E3A5F', '#1D4ED8', '#2563EB']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={s.trustBanner}
                        >
                            {/* Background decorations */}
                            <View style={s.trustBlobTL} />
                            <View style={s.trustBlobBR} />

                            {/* Shield icon */}
                            <View style={s.trustShieldWrap}>
                                <LinearGradient
                                    colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.1)']}
                                    style={s.trustShieldCircle}
                                >
                                    <Shield size={32} color="#fff" variant="Bold" />
                                </LinearGradient>
                            </View>

                            <Text style={s.trustTitle}>
                                Your child's safety is{'\n'}our priority.
                            </Text>
                            <Text style={s.trustSub}>
                                Every ride is monitored, every driver verified,
                                and every route tracked in real-time.
                            </Text>

                            {/* Trust pills */}
                            <View style={s.trustPillsRow}>
                                {TRUST_ITEMS.map((item, i) => (
                                    <TrustPill key={i} {...item} />
                                ))}
                            </View>

                            {/* Metrics row */}
                            <View style={s.metricsRow}>
                                {[
                                    { value: '10K+', label: 'Happy Parents' },
                                    { value: '98%', label: 'On-Time Rate' },
                                    { value: '500+', label: 'Drivers' },
                                ].map((m, i) => (
                                    <View key={i} style={s.metricItem}>
                                        <Text style={s.metricValue}>{m.value}</Text>
                                        <Text style={s.metricLabel}>{m.label}</Text>
                                        {i < 2 && <View style={s.metricDivider} />}
                                    </View>
                                ))}
                            </View>
                        </LinearGradient>
                    </View>

                    {/* ── FINAL CTA NUDGE ─────────────────────────── */}
                    <View style={s.section}>
                        <View style={s.nudgeCard}>
                            <Text style={s.nudgeTitle}>Ready to get started?</Text>
                            <Text style={s.nudgeSub}>
                                Join thousands of parents who trust Edu-Ride for their
                                child's daily school journey.
                            </Text>

                            <TouchableOpacity
                                style={s.nudgeBtn}
                                onPress={() => router.push('/parent/profile/add-child')}
                                activeOpacity={0.88}
                            >
                                <LinearGradient
                                    colors={['#3B82F6', '#2563EB']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={s.nudgeBtnGrad}
                                >
                                    <AddCircle size={20} color="#fff" variant="Bold" />
                                    <Text style={s.nudgeBtnText}>Add Your Child Now</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Bottom spacer so content clears the nav bar */}
                    <View style={{ height: hp(28) }} />
                </Animated.View>
            </ScrollView>

            {/* ── 9. BOTTOM NAV (fixed) ────────────────────────────── */}
            <ParentBottomNav />
        </View>
    );
}

// ─── styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    // ── Header ──────────────────────────────────────────────────────────────
    headerGrad: {
        paddingBottom: hp(18),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: wp(20),
        paddingTop: hp(8),
    },
    headerTextBlock: { flex: 1, paddingRight: wp(12) },
    pageChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        marginBottom: hp(8),
    },
    pageChipText: {
        fontSize: fs(11),
        fontFamily: 'Roboto-Medium',
        color: 'rgba(255,255,255,0.9)',
    },
    headerTitle: {
        fontSize: fs(26),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        lineHeight: fs(32),
    },
    headerSub: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.78)',
        marginTop: hp(6),
        lineHeight: fs(20),
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: hp(4),
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statusStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        paddingHorizontal: wp(20),
        marginTop: hp(14),
        paddingBottom: hp(2),
    },
    statusPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.18)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#FCD34D',
    },
    statusPillText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
        color: '#fff',
    },
    statusHint: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.7)',
    },

    // ── Scroll ───────────────────────────────────────────────────────────────
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: hp(20) },

    // ── Hero Card ────────────────────────────────────────────────────────────
    heroCard: {
        marginHorizontal: wp(16),
        marginTop: hp(18),
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.13,
        shadowRadius: 20,
        elevation: 8,
    },
    heroCopyWrap: {
        paddingHorizontal: wp(20),
        paddingBottom: hp(20),
    },
    heroTitle: {
        fontSize: fs(20),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        lineHeight: fs(28),
        marginBottom: hp(8),
    },
    heroSub: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
        lineHeight: fs(20),
    },

    // ── Sections ─────────────────────────────────────────────────────────────
    section: {
        paddingHorizontal: wp(16),
        marginTop: hp(24),
    },
    sectionPadded: {
        paddingHorizontal: wp(16),
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(8),
        marginBottom: hp(4),
    },
    sectionLabelChip: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
    },
    sectionLabelChipText: {
        fontSize: fs(10),
        fontFamily: 'Roboto-Bold',
        color: '#2563EB',
        letterSpacing: 0.8,
    },
    sectionTitle: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
    },
    sectionSubtitle: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
        lineHeight: fs(19),
        marginBottom: hp(16),
    },

    // ── Empty State Card ─────────────────────────────────────────────────────
    emptyCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: wp(24),
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 14,
        elevation: 5,
    },
    emptyArc: {
        position: 'absolute',
        top: -50,
        width: 240,
        height: 240,
        borderRadius: 120,
        backgroundColor: '#EFF6FF',
        opacity: 0.5,
    },
    emptyBusIconGrad: {
        width: 84,
        height: 84,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: hp(16),
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 3,
    },
    emptyTitle: {
        fontSize: fs(20),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        marginBottom: hp(8),
    },
    emptyDesc: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: fs(20),
        marginBottom: hp(20),
    },
    emptyFlowRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    emptyFlowStep: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
        color: '#2563EB',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
    },
    emptyFlowArrow: {
        fontSize: fs(14),
        color: '#BFDBFE',
        fontFamily: 'Roboto-Regular',
    },

    // ── CTA Buttons ──────────────────────────────────────────────────────────
    primaryBtn: {
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.28,
        shadowRadius: 14,
        elevation: 7,
        marginBottom: hp(12),
    },
    primaryBtnGrad: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(17),
        paddingHorizontal: wp(24),
        gap: 10,
    },
    primaryBtnIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'rgba(255,255,255,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    primaryBtnText: {
        flex: 1,
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        textAlign: 'center',
        marginLeft: -4,
    },
    secondaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: hp(16),
        paddingHorizontal: wp(24),
        borderRadius: 18,
        borderWidth: 2,
        borderColor: '#BFDBFE',
        backgroundColor: '#EFF6FF',
    },
    secondaryBtnText: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#2563EB',
    },

    // ── Booking Steps Horizontal Scroll ──────────────────────────────────────
    stepsScroll: {
        paddingHorizontal: wp(4),
        paddingBottom: hp(8),
        paddingTop: hp(14),
    },

    // ── Feature Grid ─────────────────────────────────────────────────────────
    featGrid: {},
    featRow: { flexDirection: 'row' },

    // ── Routes Scroll ────────────────────────────────────────────────────────
    routesScroll: {
        paddingLeft: wp(16),
        paddingRight: wp(6),
        paddingVertical: hp(8),
    },
    viewAllRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: hp(4),
    },
    viewAllText: {
        fontSize: fs(14),
        fontFamily: 'Roboto-Medium',
        color: '#3B82F6',
    },

    // ── Trust Banner ─────────────────────────────────────────────────────────
    trustBanner: {
        borderRadius: 24,
        padding: wp(22),
        overflow: 'hidden',
        shadowColor: '#1D4ED8',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 18,
        elevation: 8,
    },
    trustBlobTL: {
        position: 'absolute',
        top: -30,
        left: -30,
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    trustBlobBR: {
        position: 'absolute',
        bottom: -20,
        right: -20,
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.06)',
    },
    trustShieldWrap: { marginBottom: hp(14) },
    trustShieldCircle: {
        width: 60,
        height: 60,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    trustTitle: {
        fontSize: fs(22),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        lineHeight: fs(30),
        marginBottom: hp(8),
    },
    trustSub: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.75)',
        lineHeight: fs(20),
        marginBottom: hp(20),
    },
    trustPillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: wp(8),
        marginBottom: hp(20),
    },
    metricsRow: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: wp(16),
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.12)',
    },
    metricItem: {
        flex: 1,
        alignItems: 'center',
        position: 'relative',
    },
    metricValue: {
        fontSize: fs(20),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
    metricLabel: {
        fontSize: fs(11),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.7)',
        marginTop: 2,
    },
    metricDivider: {
        position: 'absolute',
        right: 0,
        top: '15%',
        bottom: '15%',
        width: 1,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },

    // ── Final Nudge Card ─────────────────────────────────────────────────────
    nudgeCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: wp(22),
        alignItems: 'center',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 4,
        borderWidth: 1.5,
        borderColor: '#EFF6FF',
    },
    nudgeTitle: {
        fontSize: fs(20),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: hp(6),
    },
    nudgeSub: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: fs(20),
        marginBottom: hp(20),
    },
    nudgeBtn: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 5,
    },
    nudgeBtnGrad: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(15),
        gap: 10,
    },
    nudgeBtnText: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },
});
