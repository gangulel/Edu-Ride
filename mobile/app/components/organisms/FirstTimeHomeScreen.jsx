/**
 * FirstTimeHomeScreen
 *
 * Shown instead of the regular dashboard when a parent has just signed up:
 * no children added, no bookings made.  Goal: avoid empty-state dread and
 * replace it with a warm onboarding journey.
 *
 * Sections
 *  1. Welcome header (gradient)
 *  2. Hero illustration card
 *  3. Quick-setup progress card (4 steps)
 *  4. Primary + secondary CTA buttons
 *  5. Feature highlight cards (3)
 *  6. Empty-bookings state
 *  7. Safety & trust strip
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
    Message,
    Shield,
    Bus,
    Profile2User,
    TickCircle,
    ArrowRight2,
    Clock,
    Map1,
    AddCircle,
    Star1,
    SearchNormal1,
} from 'iconsax-react-native';
import { wp, hp, fs } from '../../utils/responsive';
import ParentBottomNav from './ParentBottomNav';

// ─── helpers ─────────────────────────────────────────────────────────────────

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
}

function getInitials(name = '') {
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

// ─── sub-components ──────────────────────────────────────────────────────────

/** Hero illustration – pure View / Text to avoid binary asset dependency */
function HeroIllustration() {
    return (
        <View style={hero.wrapper}>
            {/* Decorative blobs */}
            <View style={[hero.blob, { top: -18, right: -18, backgroundColor: '#DBEAFE' }]} />
            <View style={[hero.blob, { bottom: 0, left: -12, width: 70, height: 70, backgroundColor: '#EDE9FE', borderRadius: 35 }]} />

            {/* Parent figure */}
            <View style={hero.figure}>
                <View style={[hero.figureHead, { backgroundColor: '#FCD34D' }]} />
                <View style={[hero.figureBody, { backgroundColor: '#3B82F6' }]} />
                <Text style={hero.figureEmoji}>👩</Text>
            </View>

            {/* School bus */}
            <View style={hero.busContainer}>
                {/* Bus body */}
                <LinearGradient
                    colors={['#FDE68A', '#F59E0B']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={hero.busBody}
                >
                    {/* Bus label */}
                    <View style={hero.busLabelRow}>
                        <View style={hero.busLabelPill}>
                            <Text style={hero.busLabelText}>SCHOOL BUS</Text>
                        </View>
                    </View>
                    {/* Windows row */}
                    <View style={hero.windowsRow}>
                        {[0, 1, 2, 3].map((i) => (
                            <View key={i} style={hero.window} />
                        ))}
                    </View>
                    {/* Front detail */}
                    <View style={hero.busFront}>
                        <View style={hero.headlight} />
                        <View style={[hero.headlight, { marginLeft: 4 }]} />
                    </View>
                </LinearGradient>
                {/* Wheels */}
                <View style={hero.wheelsRow}>
                    <View style={hero.wheel} />
                    <View style={hero.wheel} />
                    <View style={hero.wheel} />
                </View>
                {/* Road */}
                <View style={hero.road}>
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                        <View key={i} style={hero.roadDash} />
                    ))}
                </View>
            </View>

            {/* Child figure */}
            <View style={[hero.figure, { marginLeft: 8 }]}>
                <Text style={[hero.figureEmoji, { fontSize: fs(28) }]}>👦</Text>
            </View>

            {/* Floating badge */}
            <View style={hero.floatingBadge}>
                <View style={hero.floatingBadgeDot} />
                <Text style={hero.floatingBadgeText}>GPS Live</Text>
            </View>
        </View>
    );
}

const hero = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        paddingVertical: hp(20),
        paddingHorizontal: wp(12),
        overflow: 'hidden',
        position: 'relative',
    },
    blob: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
        opacity: 0.6,
    },
    figure: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: hp(6),
    },
    figureHead: { width: 20, height: 20, borderRadius: 10, position: 'absolute', top: 0 },
    figureBody: { width: 14, height: 28, borderRadius: 4, position: 'absolute', top: 20 },
    figureEmoji: { fontSize: fs(38), lineHeight: fs(42) },
    busContainer: { alignItems: 'center', marginHorizontal: wp(8) },
    busBody: {
        width: wp(160),
        height: hp(68),
        borderRadius: 12,
        padding: 8,
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    busLabelRow: { alignItems: 'center' },
    busLabelPill: {
        backgroundColor: 'rgba(0,0,0,0.12)',
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
        width: wp(24),
        height: hp(18),
        backgroundColor: 'rgba(219,234,254,0.85)',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    busFront: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 6,
        paddingBottom: 4,
    },
    headlight: {
        width: 8,
        height: 6,
        backgroundColor: '#FEF3C7',
        borderRadius: 3,
    },
    wheelsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: wp(140),
        marginTop: -6,
        paddingHorizontal: wp(10),
    },
    wheel: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#1E293B',
        borderWidth: 3,
        borderColor: '#475569',
    },
    road: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 4,
    },
    roadDash: {
        width: wp(16),
        height: 3,
        backgroundColor: '#CBD5E1',
        borderRadius: 2,
    },
    floatingBadge: {
        position: 'absolute',
        top: hp(12),
        right: wp(8),
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    floatingBadgeDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    floatingBadgeText: {
        fontSize: fs(11),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
    },
});

/** Single onboarding step row */
function SetupStep({ icon: Icon, label, description, stepNo, total, done = false, isLast = false }) {
    return (
        <View style={step.row}>
            {/* Left: icon in circle + connecting line */}
            <View style={step.leftCol}>
                <View style={[step.iconCircle, done && step.iconCircleDone]}>
                    {done ? (
                        <TickCircle size={18} color="#10B981" variant="Bold" />
                    ) : (
                        <Icon size={18} color={done ? '#10B981' : '#3B82F6'} variant="Outline" />
                    )}
                </View>
                {!isLast && <View style={step.connector} />}
            </View>

            {/* Right: text */}
            <View style={step.textCol}>
                <View style={step.textRow}>
                    <Text style={[step.label, done && step.labelDone]}>{label}</Text>
                    {done && (
                        <View style={step.doneBadge}>
                            <Text style={step.doneBadgeText}>Done</Text>
                        </View>
                    )}
                </View>
                <Text style={step.desc}>{description}</Text>
            </View>
        </View>
    );
}

const step = StyleSheet.create({
    row: { flexDirection: 'row', marginBottom: hp(4) },
    leftCol: { alignItems: 'center', width: 36, marginRight: wp(12) },
    iconCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
    },
    iconCircleDone: {
        backgroundColor: '#ECFDF5',
        borderColor: '#6EE7B7',
    },
    connector: {
        flex: 1,
        width: 2,
        backgroundColor: '#E2E8F0',
        marginVertical: 4,
        minHeight: hp(24),
    },
    textCol: { flex: 1, paddingTop: 6, paddingBottom: hp(20) },
    textRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    label: {
        fontSize: fs(15),
        fontFamily: 'Roboto-Medium',
        color: '#1E293B',
    },
    labelDone: { color: '#64748B', textDecorationLine: 'line-through' },
    desc: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Regular',
        color: '#94A3B8',
        marginTop: 3,
        lineHeight: fs(18),
    },
    doneBadge: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
    },
    doneBadgeText: {
        fontSize: fs(11),
        fontFamily: 'Roboto-Medium',
        color: '#10B981',
    },
});

/** Feature highlight card (3 cards) */
function FeatureCard({ icon: Icon, iconColor, iconBg, gradient, title, description }) {
    return (
        <View style={feat.card}>
            <LinearGradient
                colors={gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={feat.gradient}
            >
                <View style={[feat.iconWrap, { backgroundColor: iconBg }]}>
                    <Icon size={22} color={iconColor} variant="Bold" />
                </View>
                <Text style={feat.title}>{title}</Text>
                <Text style={feat.desc}>{description}</Text>
            </LinearGradient>
        </View>
    );
}

const feat = StyleSheet.create({
    card: {
        flex: 1,
        borderRadius: 18,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    gradient: { padding: wp(14), minHeight: hp(130) },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
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

/** Small trust badge pill */
function TrustBadge({ icon: Icon, iconColor, label }) {
    return (
        <View style={trust.pill}>
            <Icon size={16} color={iconColor} variant="Bold" />
            <Text style={trust.label}>{label}</Text>
        </View>
    );
}

const trust = StyleSheet.create({
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: wp(12),
        paddingVertical: hp(8),
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
        elevation: 2,
    },
    label: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
        color: '#334155',
    },
});

// ─── main screen ─────────────────────────────────────────────────────────────

export default function FirstTimeHomeScreen({ user }) {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    const firstName =
        user?.fullName?.split(' ')[0] || user?.email?.split('@')[0] || 'Parent';
    const fullName = user?.fullName || 'Parent';

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start();
    }, [fadeAnim, slideAnim]);

    const SETUP_STEPS = [
        {
            icon: Profile2User,
            label: 'Add Child Information',
            description: 'Enter your child\'s name, grade and school details.',
        },
        {
            icon: Map1,
            label: 'Select School Route',
            description: 'Browse available routes from your area to the school.',
        },
        {
            icon: Bus,
            label: 'Choose a Bus Service',
            description: 'Pick a verified driver and vehicle that fits your schedule.',
        },
        {
            icon: Star1,
            label: 'Complete First Booking',
            description: 'Confirm your monthly subscription and you\'re all set!',
        },
    ];

    const FEATURES = [
        {
            icon: Location,
            iconColor: '#3B82F6',
            iconBg: '#EFF6FF',
            gradient: ['#F0F9FF', '#EFF6FF'],
            title: 'Live Bus\nTracking',
            description: 'Know exactly where your child\'s bus is, always.',
        },
        {
            icon: Wallet3,
            iconColor: '#10B981',
            iconBg: '#ECFDF5',
            gradient: ['#F0FDF4', '#ECFDF5'],
            title: 'Secure\nPayments',
            description: 'Simple monthly billing, no hidden charges.',
        },
        {
            icon: Notification,
            iconColor: '#8B5CF6',
            iconBg: '#F5F3FF',
            gradient: ['#FAF5FF', '#F5F3FF'],
            title: 'Real-Time\nAlerts',
            description: 'Instant pickup & drop-off notifications.',
        },
    ];

    const TRUST_ITEMS = [
        { icon: Shield, iconColor: '#3B82F6', label: 'Verified Drivers' },
        { icon: Location, iconColor: '#10B981', label: 'GPS Tracking' },
        { icon: Bus, iconColor: '#8B5CF6', label: 'Safe Transport' },
    ];

    return (
        <View style={s.root}>
            <StatusBar barStyle="light-content" />

            {/* ── 1. HEADER ──────────────────────────────────────── */}
            <LinearGradient
                colors={['#2563EB', '#3B82F6', '#60A5FA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.headerGradient}
            >
                <SafeAreaView edges={['top']}>
                    <View style={s.headerRow}>
                        <View style={s.headerLeft}>
                            <Text style={s.greeting}>
                                {getGreeting()} 👋
                            </Text>
                            <Text style={s.welcomeTitle}>Welcome to Edu-Ride</Text>
                            <Text style={s.welcomeSub}>
                                Safe and smart school{'\n'}transportation for your child.
                            </Text>
                        </View>

                        <View style={s.headerActions}>
                            <TouchableOpacity
                                style={s.iconBtn}
                                onPress={() => router.push('/parent/notifications')}
                                activeOpacity={0.8}
                            >
                                <Notification size={22} color="#fff" variant="Outline" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={s.avatarBtn}
                                onPress={() => router.push('/parent/profile')}
                                activeOpacity={0.8}
                            >
                                <LinearGradient
                                    colors={['#fff', '#EFF6FF']}
                                    style={s.avatarGrad}
                                >
                                    <Text style={s.avatarInitials}>{getInitials(fullName)}</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Header accent strip */}
                    <View style={s.headerAccentRow}>
                        <View style={s.accentChip}>
                            <View style={s.accentDot} />
                            <Text style={s.accentText}>New Account</Text>
                        </View>
                        <Text style={s.accentCopy}>
                            Complete setup in{' '}
                            <Text style={{ fontFamily: 'Roboto-Bold' }}>4 easy steps</Text>
                        </Text>
                    </View>
                </SafeAreaView>
            </LinearGradient>

            {/* ── SCROLLABLE BODY ────────────────────────────────── */}
            <ScrollView
                style={s.scroll}
                contentContainerStyle={s.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

                    {/* ── 2. HERO ILLUSTRATION ───────────────────── */}
                    <View style={s.heroCard}>
                        <HeroIllustration />
                        <View style={s.heroCopy}>
                            <Text style={s.heroTitle}>Your child's safe ride{'\n'}starts here 🚌</Text>
                            <Text style={s.heroSub}>
                                Set up your account in minutes and track your child's journey
                                to school with complete peace of mind.
                            </Text>
                        </View>
                    </View>

                    {/* ── 3. SETUP PROGRESS CARD ─────────────────── */}
                    <View style={s.section}>
                        <View style={s.sectionHeader}>
                            <Text style={s.sectionTitle}>Your Setup Checklist</Text>
                            <View style={s.progressPill}>
                                <Text style={s.progressPillText}>0 / 4</Text>
                            </View>
                        </View>

                        <View style={s.card}>
                            {/* Progress bar */}
                            <View style={s.progressBarBg}>
                                <View style={[s.progressBarFill, { width: '0%' }]} />
                            </View>
                            <Text style={s.progressNote}>
                                Complete all steps to activate your first booking
                            </Text>

                            <View style={{ marginTop: hp(16) }}>
                                {SETUP_STEPS.map((step, i) => (
                                    <SetupStep
                                        key={i}
                                        {...step}
                                        stepNo={i + 1}
                                        total={SETUP_STEPS.length}
                                        done={false}
                                        isLast={i === SETUP_STEPS.length - 1}
                                    />
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* ── 4. MAIN CTA BUTTONS ────────────────────── */}
                    <View style={s.section}>
                        <TouchableOpacity
                            style={s.primaryBtn}
                            onPress={() => router.push('/parent/profile/add-child')}
                            activeOpacity={0.88}
                        >
                            <LinearGradient
                                colors={['#3B82F6', '#2563EB']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={s.primaryBtnGrad}
                            >
                                <AddCircle size={22} color="#fff" variant="Bold" />
                                <Text style={s.primaryBtnText}>Add Your Child</Text>
                                <ArrowRight2 size={20} color="rgba(255,255,255,0.8)" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={s.secondaryBtn}
                            onPress={() => router.push('/parent/search')}
                            activeOpacity={0.8}
                        >
                            <SearchNormal1 size={20} color="#3B82F6" variant="Outline" />
                            <Text style={s.secondaryBtnText}>Explore Bus Routes</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ── 5. FEATURE HIGHLIGHT CARDS ─────────────── */}
                    <View style={s.section}>
                        <Text style={s.sectionTitle}>Everything You Need</Text>
                        <View style={s.featRow}>
                            {FEATURES.map((f, i) => (
                                <FeatureCard key={i} {...f} />
                            ))}
                        </View>
                    </View>

                    {/* ── 6. EMPTY BOOKINGS STATE ────────────────── */}
                    <View style={s.section}>
                        <Text style={s.sectionTitle}>Your Bookings</Text>
                        <View style={s.emptyBookingCard}>
                            {/* Decorative background arc */}
                            <View style={s.emptyBgArc} />

                            <View style={s.emptyBusIcon}>
                                <LinearGradient
                                    colors={['#EFF6FF', '#DBEAFE']}
                                    style={s.emptyBusIconGrad}
                                >
                                    <Bus size={40} color="#3B82F6" variant="Bold" />
                                </LinearGradient>
                            </View>

                            <Text style={s.emptyTitle}>No bookings yet</Text>
                            <Text style={s.emptyDesc}>
                                Start by adding your child and selecting a{'\n'}school route to make your first booking.
                            </Text>

                            <View style={s.emptyStepsRow}>
                                {['Add Child', '→', 'Find Route', '→', 'Book Ride'].map((item, i) => (
                                    <Text
                                        key={i}
                                        style={item === '→' ? s.emptyArrow : s.emptyStepLabel}
                                    >
                                        {item}
                                    </Text>
                                ))}
                            </View>

                            <TouchableOpacity
                                style={s.emptyBtn}
                                onPress={() => router.push('/parent/profile/add-child')}
                                activeOpacity={0.8}
                            >
                                <Text style={s.emptyBtnText}>Get Started Now</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* ── 7. SAFETY & TRUST STRIP ────────────────── */}
                    <View style={s.section}>
                        <Text style={s.sectionTitle}>Why Parents Trust Us</Text>
                        <View style={s.trustRow}>
                            {TRUST_ITEMS.map((t, i) => (
                                <TrustBadge key={i} {...t} />
                            ))}
                        </View>

                        {/* Trust metrics */}
                        <View style={s.metricsRow}>
                            {[
                                { value: '10K+', label: 'Parents' },
                                { value: '98%', label: 'On-time' },
                                { value: '500+', label: 'Drivers' },
                            ].map((m, i) => (
                                <View key={i} style={s.metricCard}>
                                    <Text style={s.metricValue}>{m.value}</Text>
                                    <Text style={s.metricLabel}>{m.label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* ── QUICK LINKS ────────────────────────────── */}
                    <View style={s.section}>
                        <View style={s.quickLinksCard}>
                            <Text style={s.quickLinksTitle}>Quick Actions</Text>
                            {[
                                {
                                    icon: Profile2User,
                                    color: '#3B82F6',
                                    bg: '#EFF6FF',
                                    label: 'Manage Children',
                                    sub: 'Add or edit child profiles',
                                    route: '/parent/profile/children',
                                },
                                {
                                    icon: Wallet3,
                                    color: '#10B981',
                                    bg: '#ECFDF5',
                                    label: 'Payment Methods',
                                    sub: 'Add a card or bank account',
                                    route: '/parent/payments',
                                },
                                {
                                    icon: Message,
                                    color: '#8B5CF6',
                                    bg: '#F5F3FF',
                                    label: 'Messages',
                                    sub: 'Contact drivers or support',
                                    route: '/parent/messages',
                                },
                            ].map((item, i) => (
                                <TouchableOpacity
                                    key={i}
                                    style={[
                                        s.quickLink,
                                        i < 2 && { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
                                    ]}
                                    onPress={() => router.push(item.route)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[s.quickLinkIcon, { backgroundColor: item.bg }]}>
                                        <item.icon size={20} color={item.color} variant="Bold" />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={s.quickLinkLabel}>{item.label}</Text>
                                        <Text style={s.quickLinkSub}>{item.sub}</Text>
                                    </View>
                                    <ArrowRight2 size={18} color="#CBD5E1" />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* bottom spacer so last card isn't under the nav */}
                    <View style={{ height: hp(24) }} />
                </Animated.View>
            </ScrollView>

            {/* ── BOTTOM NAV ─────────────────────────────────────── */}
            <ParentBottomNav />
        </View>
    );
}

// ─── styles ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    // Header
    headerGradient: {
        paddingBottom: hp(20),
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: wp(20),
        paddingTop: hp(8),
    },
    headerLeft: { flex: 1, paddingRight: wp(12) },
    greeting: {
        fontSize: fs(13),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.85)',
        marginBottom: 2,
    },
    welcomeTitle: {
        fontSize: fs(26),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        lineHeight: fs(32),
    },
    welcomeSub: {
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
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: 'rgba(255,255,255,0.18)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarBtn: {},
    avatarGrad: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    avatarInitials: {
        fontSize: fs(15),
        fontFamily: 'Roboto-Bold',
        color: '#2563EB',
    },
    headerAccentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp(10),
        paddingHorizontal: wp(20),
        marginTop: hp(14),
        paddingBottom: hp(4),
    },
    accentChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
    },
    accentDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#34D399',
    },
    accentText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
        color: '#fff',
    },
    accentCopy: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Regular',
        color: 'rgba(255,255,255,0.78)',
    },

    // Scroll
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: hp(24) },

    // Hero card
    heroCard: {
        marginHorizontal: wp(16),
        marginTop: hp(16),
        backgroundColor: '#fff',
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
    },
    heroCopy: {
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

    // Sections
    section: {
        paddingHorizontal: wp(16),
        marginTop: hp(24),
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: hp(12),
    },
    sectionTitle: {
        fontSize: fs(18),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        marginBottom: hp(12),
    },
    progressPill: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    progressPillText: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Bold',
        color: '#3B82F6',
    },

    // Card base
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: wp(20),
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 4,
    },

    // Progress bar
    progressBarBg: {
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
        backgroundColor: '#3B82F6',
    },
    progressNote: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Regular',
        color: '#94A3B8',
        marginTop: hp(6),
    },

    // CTA buttons
    primaryBtn: {
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 12,
        elevation: 6,
        marginBottom: hp(12),
    },
    primaryBtnGrad: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: hp(16),
        paddingHorizontal: wp(24),
        gap: 10,
    },
    primaryBtnText: {
        flex: 1,
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
        textAlign: 'center',
        marginLeft: -10,
    },
    secondaryBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: hp(15),
        paddingHorizontal: wp(24),
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#BFDBFE',
        backgroundColor: '#EFF6FF',
    },
    secondaryBtnText: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#2563EB',
    },

    // Feature cards row
    featRow: {
        flexDirection: 'row',
        gap: wp(10),
    },

    // Empty bookings
    emptyBookingCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: wp(24),
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 4,
    },
    emptyBgArc: {
        position: 'absolute',
        top: -40,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: '#EFF6FF',
        opacity: 0.6,
    },
    emptyBusIcon: {
        marginBottom: hp(16),
        borderRadius: 20,
        overflow: 'hidden',
    },
    emptyBusIconGrad: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
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
    emptyStepsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: hp(20),
    },
    emptyStepLabel: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Medium',
        color: '#3B82F6',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    emptyArrow: {
        fontSize: fs(13),
        color: '#CBD5E1',
        fontFamily: 'Roboto-Regular',
    },
    emptyBtn: {
        backgroundColor: '#3B82F6',
        borderRadius: 14,
        paddingVertical: hp(13),
        paddingHorizontal: wp(32),
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.28,
        shadowRadius: 10,
        elevation: 4,
    },
    emptyBtnText: {
        fontSize: fs(15),
        fontFamily: 'Roboto-Bold',
        color: '#fff',
    },

    // Trust strip
    trustRow: {
        flexDirection: 'row',
        gap: wp(8),
        flexWrap: 'wrap',
        marginBottom: hp(14),
    },

    // Metrics
    metricsRow: {
        flexDirection: 'row',
        gap: wp(10),
    },
    metricCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: hp(16),
        alignItems: 'center',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 2,
    },
    metricValue: {
        fontSize: fs(22),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
    },
    metricLabel: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Regular',
        color: '#94A3B8',
        marginTop: 2,
    },

    // Quick links card
    quickLinksCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.07,
        shadowRadius: 12,
        elevation: 4,
        paddingTop: wp(16),
    },
    quickLinksTitle: {
        fontSize: fs(16),
        fontFamily: 'Roboto-Bold',
        color: '#1E293B',
        paddingHorizontal: wp(16),
        marginBottom: hp(8),
    },
    quickLink: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(14),
        paddingHorizontal: wp(16),
        gap: wp(12),
    },
    quickLinkIcon: {
        width: 42,
        height: 42,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickLinkLabel: {
        fontSize: fs(15),
        fontFamily: 'Roboto-Medium',
        color: '#1E293B',
    },
    quickLinkSub: {
        fontSize: fs(12),
        fontFamily: 'Roboto-Regular',
        color: '#94A3B8',
        marginTop: 2,
    },
});
