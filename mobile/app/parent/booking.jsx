import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, SafeAreaView,
    TouchableOpacity, Alert, ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, hp } from '../utils/responsive';
import { Button, Input, Card } from '../components/atoms';
import { Header } from '../components/organisms';
import { getChildren, createBooking, getRouteById, searchRoutes } from '../../services/parentApi';

export default function BookingScreen() {
    const router = useRouter();
    const { driverId, routeId } = useLocalSearchParams();

    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        pickupAddress: '',
        dropoffAddress: '',
        startDate: '',
        specialInstructions: '',
    });
    const [errors, setErrors] = useState({});

    // Vehicle suggestion state
    const [suggestedRoutes, setSuggestedRoutes]         = useState([]);
    const [loadingSuggestions, setLoadingSuggestions]   = useState(false);
    const [isPickupAutofilled, setIsPickupAutofilled]   = useState(false);
    const [isDropoffAutofilled, setIsDropoffAutofilled] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const [childrenRes, routeRes] = await Promise.allSettled([
                getChildren(),
                routeId ? getRouteById(routeId) : Promise.resolve(null),
            ]);
            const fetchedChildren = childrenRes.status === 'fulfilled' ? childrenRes.value?.children || [] : [];
            setChildren(fetchedChildren);
            if (fetchedChildren.length > 0) setSelectedChildId(fetchedChildren[0]._id);

            if (routeRes.status === 'fulfilled' && routeRes.value) {
                const route = routeRes.value?.route || routeRes.value;
                setRouteData(route);
                if (route?.driver?.monthlyFee) {
                    // pre-fill school from route
                }
            }
        } catch {
            // non-critical, proceed with empty state
        } finally {
            setLoading(false);
        }
    }, [routeId]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // ── Auto-fill pickup / drop-off from selected child's saved data ──────────
    useEffect(() => {
        if (!selectedChildId || children.length === 0) return;
        const child = children.find(c => c._id === selectedChildId);
        if (!child) return;

        setForm(prev => {
            const updates = {};
            if (child.homeAddress) {
                updates.pickupAddress = child.homeAddress;
                setIsPickupAutofilled(true);
            }
            if (child.school) {
                updates.dropoffAddress = child.school;
                setIsDropoffAutofilled(true);
            }
            return { ...prev, ...updates };
        });
    }, [selectedChildId, children]);

    // ── Load vehicle suggestions whenever pickup / drop-off change ────────────
    const loadSuggestedRoutes = useCallback(async (pickup, dropoff) => {
        const query = dropoff || pickup;
        if (!query) { setSuggestedRoutes([]); return; }
        setLoadingSuggestions(true);
        try {
            const res = await searchRoutes({ status: 'active', search: query });
            setSuggestedRoutes((res?.routes || []).slice(0, 3));
        } catch {
            setSuggestedRoutes([]);
        } finally {
            setLoadingSuggestions(false);
        }
    }, []);

    useEffect(() => {
        loadSuggestedRoutes(form.pickupAddress, form.dropoffAddress);
    }, [form.pickupAddress, form.dropoffAddress, loadSuggestedRoutes]);

    const validate = () => {
        const newErrors = {};
        if (!selectedChildId) newErrors.child = 'Please select a child';
        if (!form.pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required';
        if (!form.startDate.trim()) newErrors.startDate = 'Start date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        setSubmitting(true);
        try {
            const startDate = new Date(form.startDate);
            if (isNaN(startDate.getTime())) throw new Error('Please enter a valid start date (e.g., 2026-02-01)');

            await createBooking({
                driver: driverId,
                child: selectedChildId,
                pickupAddress: form.pickupAddress.trim(),
                dropoffAddress: form.dropoffAddress.trim() || undefined,
                monthlyFee: routeData?.driver?.monthlyFee || 0,
                startDate: startDate.toISOString(),
                specialInstructions: form.specialInstructions.trim() || undefined,
            });
            Alert.alert(
                'Booking Submitted',
                'Your booking request has been sent to the driver. You\'ll be notified once it\'s reviewed.',
                [{ text: 'OK', onPress: () => router.push('/parent/my-bookings') }]
            );
        } catch (err) {
            Alert.alert('Booking Failed', err.message || 'Failed to submit booking. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const driver = routeData?.driver;

    return (
        <SafeAreaView style={styles.container}>
            <Header title="Book Service" showBack />

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text style={styles.loadingText}>Loading details...</Text>
                </View>
            ) : (
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                    {/* Driver Summary */}
                    <Card style={styles.driverCard}>
                        <View style={styles.driverRow}>
                            <Ionicons name="person-circle" size={44} color="#3B82F6" />
                            <View style={styles.driverInfo}>
                                <Text style={styles.driverName}>{driver?.fullName || `Driver (ID: ${driverId})`}</Text>
                                {driver?.monthlyFee ? (
                                    <Text style={styles.driverFee}>LKR {driver.monthlyFee.toLocaleString()}/month</Text>
                                ) : null}
                                {routeData?.school ? (
                                    <Text style={styles.driverSchool}>{routeData.school}</Text>
                                ) : null}
                            </View>
                        </View>
                    </Card>

                    {/* Child Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Select Child</Text>
                        {errors.child ? <Text style={styles.fieldError}>{errors.child}</Text> : null}

                        {children.length === 0 ? (
                            <Card style={styles.noChildCard}>
                                <Text style={styles.noChildText}>No children added to your account.</Text>
                                <TouchableOpacity onPress={() => router.push('/parent/profile/add-child')}>
                                    <Text style={styles.noChildLink}>+ Add a child first</Text>
                                </TouchableOpacity>
                            </Card>
                        ) : (
                            children.map(child => (
                                <TouchableOpacity
                                    key={child._id}
                                    style={[styles.childOption, selectedChildId === child._id && styles.childOptionSelected]}
                                    onPress={() => setSelectedChildId(child._id)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.childOptionLeft}>
                                        <View style={[
                                            styles.childAvatar,
                                            { backgroundColor: selectedChildId === child._id ? '#3B82F6' : '#EFF6FF' }
                                        ]}>
                                            <Text style={[
                                                styles.childInitial,
                                                { color: selectedChildId === child._id ? '#fff' : '#3B82F6' }
                                            ]}>
                                                {child.fullName[0]}
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.childName}>{child.fullName}</Text>
                                            <Text style={styles.childMeta}>Grade {child.grade} • {child.school}</Text>
                                        </View>
                                    </View>
                                    {selectedChildId === child._id && (
                                        <Ionicons name="checkmark-circle" size={22} color="#3B82F6" />
                                    )}
                                </TouchableOpacity>
                            ))
                        )}
                    </View>

                    {/* ── Suggested Vehicles (appears at the top of the service section) ── */}
                    {(suggestedRoutes.length > 0 || loadingSuggestions) && (
                        <View style={styles.section}>
                            <View style={styles.suggestionsHeader}>
                                <Ionicons name="sparkles" size={16} color="#F59E0B" />
                                <Text style={styles.sectionTitle}>Suggested Vehicles</Text>
                                {loadingSuggestions && (
                                    <ActivityIndicator size="small" color="#3B82F6" style={{ marginLeft: 8 }} />
                                )}
                            </View>
                            <Text style={styles.suggestionsSubtitle}>
                                Matched to pickup location &amp; school
                            </Text>
                            {suggestedRoutes.map(route => {
                                const driverName = route.driver?.fullName || 'Available Driver';
                                const initial    = driverName[0].toUpperCase();
                                const fee        = route.driver?.monthlyFee || 0;
                                return (
                                    <TouchableOpacity
                                        key={route._id}
                                        style={styles.suggestionCard}
                                        onPress={() =>
                                            router.push(
                                                `/parent/service-detail?id=${route.driver?._id}&routeId=${route._id}`
                                            )
                                        }
                                        activeOpacity={0.7}
                                    >
                                        <View style={styles.suggestionLeft}>
                                            <View style={styles.suggestionAvatar}>
                                                <Text style={styles.suggestionInitial}>{initial}</Text>
                                            </View>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.suggestionName}>{driverName}</Text>
                                                <Text style={styles.suggestionMeta} numberOfLines={1}>
                                                    {route.school || 'School Transport'} •{' '}
                                                    LKR {fee.toLocaleString()}/mo
                                                </Text>
                                            </View>
                                        </View>
                                        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}

                    {/* Pickup Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Pickup / Drop-off</Text>

                        {/* Pickup address with auto-fill badge */}
                        {isPickupAutofilled && (
                            <View style={styles.autofillBadge}>
                                <Ionicons name="sparkles-outline" size={11} color="#3B82F6" />
                                <Text style={styles.autofillText}>
                                    Auto-filled from child's home address
                                </Text>
                            </View>
                        )}
                        <Input
                            label="Pickup Address *"
                            placeholder="Enter your pickup location"
                            value={form.pickupAddress}
                            onChangeText={(v) => {
                                setForm({ ...form, pickupAddress: v });
                                setIsPickupAutofilled(false);
                            }}
                            error={errors.pickupAddress}
                            leftIcon="location-outline"
                        />

                        {/* Drop-off address with auto-fill badge */}
                        {isDropoffAutofilled && (
                            <View style={styles.autofillBadge}>
                                <Ionicons name="sparkles-outline" size={11} color="#10B981" />
                                <Text style={[styles.autofillText, { color: '#10B981' }]}>
                                    Auto-filled from child's school
                                </Text>
                            </View>
                        )}
                        <Input
                            label="Drop-off Address (Optional)"
                            placeholder="Same as school if not specified"
                            value={form.dropoffAddress}
                            onChangeText={(v) => {
                                setForm({ ...form, dropoffAddress: v });
                                setIsDropoffAutofilled(false);
                            }}
                            leftIcon="flag-outline"
                        />
                    </View>

                    {/* Additional Details */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Additional Details</Text>
                        <Input
                            label="Preferred Start Date *"
                            placeholder="YYYY-MM-DD (e.g., 2026-02-01)"
                            value={form.startDate}
                            onChangeText={(v) => setForm({ ...form, startDate: v })}
                            error={errors.startDate}
                            leftIcon="calendar-outline"
                        />
                        <Input
                            label="Special Instructions (Optional)"
                            placeholder="Any special needs or instructions..."
                            value={form.specialInstructions}
                            onChangeText={(v) => setForm({ ...form, specialInstructions: v })}
                            multiline
                            numberOfLines={3}
                        />
                    </View>

                    <Button
                        title="Submit Booking Request"
                        onPress={handleSubmit}
                        loading={submitting}
                        disabled={children.length === 0}
                        fullWidth
                        size="large"
                    />
                    <Text style={styles.disclaimer}>
                        The driver will review your request and respond within 48 hours.
                    </Text>

                    <View style={{ height: hp(40) }} />
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F7' },
    scrollView: { flex: 1 },
    content: { padding: responsive.paddingLG },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
    loadingText: { marginTop: 12, fontSize: responsive.fontMD, color: '#64748B' },
    driverCard: { marginBottom: responsive.paddingLG },
    driverRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    driverInfo: { flex: 1 },
    driverName: { fontSize: responsive.fontLG, fontWeight: '600', color: '#000' },
    driverFee: { fontSize: responsive.fontMD, color: '#3B82F6', marginTop: 2 },
    driverSchool: { fontSize: responsive.fontSM, color: '#64748B', marginTop: 2 },
    section: { marginBottom: responsive.paddingLG },
    sectionTitle: { fontSize: responsive.fontLG, fontWeight: '600', color: '#000', marginBottom: responsive.paddingMD },
    fieldError: { fontSize: responsive.fontSM, color: '#EF4444', marginBottom: 8 },
    noChildCard: { alignItems: 'center', paddingVertical: responsive.paddingLG },
    noChildText: { fontSize: responsive.fontMD, color: '#64748B', marginBottom: 8 },
    noChildLink: { fontSize: responsive.fontMD, color: '#3B82F6', fontWeight: '600' },
    childOption: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8,
        borderWidth: 2, borderColor: 'transparent',
    },
    childOptionSelected: { borderColor: '#3B82F6', backgroundColor: '#EFF6FF' },
    childOptionLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    childAvatar: {
        width: 40, height: 40, borderRadius: 20,
        alignItems: 'center', justifyContent: 'center',
    },
    childInitial: { fontSize: 18, fontWeight: 'bold' },
    childName: { fontSize: responsive.fontMD, fontWeight: '600', color: '#000' },
    childMeta: { fontSize: responsive.fontSM, color: '#64748B', marginTop: 2 },
    disclaimer: {
        fontSize: responsive.fontSM, color: '#8E8E93', textAlign: 'center',
        marginTop: responsive.paddingMD, lineHeight: responsive.fontSM * 1.5,
    },

    // ── Suggested vehicles ────────────────────────────────────────────────────
    suggestionsHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 6,
        marginBottom: 4,
    },
    suggestionsSubtitle: {
        fontSize: responsive.fontXS ?? 11, color: '#94A3B8',
        marginBottom: responsive.paddingMD, marginTop: 2,
    },
    suggestionCard: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8,
        borderWidth: 1.5, borderColor: '#FEF3C7',
    },
    suggestionLeft: {
        flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1,
    },
    suggestionAvatar: {
        width: 38, height: 38, borderRadius: 19,
        backgroundColor: '#FFFBEB',
        alignItems: 'center', justifyContent: 'center',
    },
    suggestionInitial: {
        fontSize: responsive.fontLG, fontWeight: 'bold', color: '#F59E0B',
    },
    suggestionName: {
        fontSize: responsive.fontMD, fontWeight: '600', color: '#1E293B',
    },
    suggestionMeta: {
        fontSize: responsive.fontSM ?? 12, color: '#64748B', marginTop: 1,
    },

    // ── Autofill badge ────────────────────────────────────────────────────────
    autofillBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8, paddingVertical: 4,
        borderRadius: 6, alignSelf: 'flex-start',
        marginBottom: 4,
    },
    autofillText: {
        fontSize: responsive.fontXS ?? 11, color: '#3B82F6', fontWeight: '500',
    },
});
