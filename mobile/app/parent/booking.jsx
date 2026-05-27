import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, SafeAreaView,
    TouchableOpacity, Alert, ActivityIndicator, Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, hp } from '../utils/responsive';
import { Button, Input, Card } from '../components/atoms';
import { Header } from '../components/organisms';
import { getChildren, createBooking, getRouteById, searchRoutes } from '../../services/parentApi';

// ── Date helpers ─────────────────────────────────────────────────────────────
/** "YYYY-MM-DD" → "Mon, Feb 01 2026" for display */
const toDisplayDate = (iso) => {
    if (!iso) return '';
    const [y, mo, d] = iso.split('-').map(Number);
    return new Date(y, mo - 1, d).toLocaleDateString('en-US', {
        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    });
};

// ── Custom Calendar Picker (pure JS — works in Expo Go & bare) ───────────────
const MONTH_NAMES = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December',
];
const DAY_NAMES = ['Su','Mo','Tu','We','Th','Fr','Sa'];

function CalendarPicker({ visible, selectedIso, onConfirm, onClose }) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseIso = (iso) => {
        if (!iso) return today;
        const [y, m, d] = iso.split('-').map(Number);
        return new Date(y, m - 1, d);
    };

    const [viewYear,  setViewYear]  = useState(() => parseIso(selectedIso).getFullYear());
    const [viewMonth, setViewMonth] = useState(() => parseIso(selectedIso).getMonth());
    const [picked,    setPicked]    = useState(selectedIso || null);

    // Sync view when modal opens
    useEffect(() => {
        if (visible) {
            const base = parseIso(picked || null);
            setViewYear(base.getFullYear());
            setViewMonth(base.getMonth());
        }
    }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

    const prevMonth = () => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    };
    const nextMonth = () => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    };

    // Build a 7-column grid
    const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth  = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells = [
        ...Array(firstWeekday).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const isDisabled = (day) => {
        if (!day) return true;
        const d = new Date(viewYear, viewMonth, day);
        return d < today;
    };
    const isSelected = (day) => {
        if (!day || !picked) return false;
        const [py, pm, pd] = picked.split('-').map(Number);
        return viewYear === py && viewMonth === (pm - 1) && day === pd;
    };
    const isToday = (day) => {
        if (!day) return false;
        return (
            viewYear  === today.getFullYear() &&
            viewMonth === today.getMonth()    &&
            day       === today.getDate()
        );
    };

    const handleDay = (day) => {
        if (!day || isDisabled(day)) return;
        const mm = String(viewMonth + 1).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        setPicked(`${viewYear}-${mm}-${dd}`);
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            statusBarTranslucent
            onRequestClose={onClose}
        >
            {/* Dim backdrop — tap to dismiss */}
            <TouchableOpacity style={cal.backdrop} activeOpacity={1} onPress={onClose} />

            {/* Bottom sheet */}
            <View style={cal.sheet}>
                <View style={cal.handle} />

                {/* Title */}
                <View style={cal.titleRow}>
                    <Text style={cal.title}>Select Start Date</Text>
                </View>

                {/* Month navigation */}
                <View style={cal.monthNav}>
                    <TouchableOpacity style={cal.navBtn} onPress={prevMonth} activeOpacity={0.7}>
                        <Ionicons name="chevron-back" size={20} color="#1E293B" />
                    </TouchableOpacity>
                    <Text style={cal.monthLabel}>{MONTH_NAMES[viewMonth]}  {viewYear}</Text>
                    <TouchableOpacity style={cal.navBtn} onPress={nextMonth} activeOpacity={0.7}>
                        <Ionicons name="chevron-forward" size={20} color="#1E293B" />
                    </TouchableOpacity>
                </View>

                {/* Day-of-week headers */}
                <View style={cal.dayHeaderRow}>
                    {DAY_NAMES.map(d => (
                        <Text key={d} style={cal.dayHeader}>{d}</Text>
                    ))}
                </View>

                {/* Day grid */}
                <View style={cal.grid}>
                    {cells.map((day, idx) => {
                        const disabled = isDisabled(day);
                        const selected = isSelected(day);
                        const todayCl  = isToday(day);
                        return (
                            <TouchableOpacity
                                key={idx}
                                style={[
                                    cal.cell,
                                    selected  && cal.cellSelected,
                                    todayCl && !selected && cal.cellToday,
                                ]}
                                onPress={() => handleDay(day)}
                                activeOpacity={day && !disabled ? 0.7 : 1}
                                disabled={!day || disabled}
                            >
                                <Text style={[
                                    cal.cellText,
                                    selected  && cal.cellTextSelected,
                                    todayCl && !selected && cal.cellTextToday,
                                    disabled  && cal.cellTextDisabled,
                                    !day      && { opacity: 0 },
                                ]}>
                                    {day ?? 0}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {/* Actions */}
                <View style={cal.actions}>
                    <TouchableOpacity style={cal.cancelBtn} onPress={onClose} activeOpacity={0.7}>
                        <Text style={cal.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[cal.confirmBtn, !picked && cal.confirmBtnDisabled]}
                        onPress={() => picked && onConfirm(picked)}
                        disabled={!picked}
                        activeOpacity={0.8}
                    >
                        <Ionicons name="checkmark-circle" size={18} color="#fff" />
                        <Text style={cal.confirmText} numberOfLines={1}>
                            {picked ? toDisplayDate(picked) : 'Pick a date first'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const cal = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(15,23,42,0.5)',
    },
    sheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 16,
        paddingBottom: 32,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 20,
    },
    handle: {
        width: 40, height: 4,
        backgroundColor: '#CBD5E1',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 4,
    },
    titleRow: {
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E293B',
    },
    monthNav: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 14,
        paddingHorizontal: 4,
    },
    navBtn: {
        width: 38, height: 38,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    monthLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
    },
    dayHeaderRow: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    dayHeader: {
        width: `${100 / 7}%`,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
        paddingVertical: 4,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    cell: {
        width: `${100 / 7}%`,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
    },
    cellSelected: {
        backgroundColor: '#3B82F6',
    },
    cellToday: {
        borderWidth: 1.5,
        borderColor: '#3B82F6',
    },
    cellText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1E293B',
    },
    cellTextSelected: {
        color: '#fff',
        fontWeight: '700',
    },
    cellTextToday: {
        color: '#3B82F6',
        fontWeight: '700',
    },
    cellTextDisabled: {
        color: '#CBD5E1',
    },
    actions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 16,
        paddingTop: 14,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#64748B',
    },
    confirmBtn: {
        flex: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 12,
        backgroundColor: '#3B82F6',
    },
    confirmBtnDisabled: {
        backgroundColor: '#BFDBFE',
    },
    confirmText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
});

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

    // Date-picker state
    const [showDatePicker, setShowDatePicker] = useState(false);

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
        if (!selectedChildId)           newErrors.child       = 'Please select a child';
        if (!form.pickupAddress.trim()) newErrors.pickupAddress = 'Pickup address is required';
        if (!form.startDate.trim())     newErrors.startDate   = 'Start date is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validate()) return;

        // Guard: driverId must be present
        if (!driverId) {
            Alert.alert(
                'Missing Driver',
                'Driver information is missing. Please go back and select a service.',
            );
            return;
        }

        // Guard: monthlyFee must be a positive number (Zod min(1) on the backend)
        const fee = routeData?.driver?.monthlyFee;
        if (!fee || fee < 1) {
            Alert.alert(
                'Fee Unavailable',
                'Monthly fee information could not be loaded. Please go back and reselect the service.',
            );
            return;
        }

        // Fix timezone: build start date at local noon so the ISO string always
        // represents the SAME calendar date regardless of UTC offset.
        // "2026-02-01" → new Date(2026, 1, 1, 12, 0, 0) → 2026-02-01T06:30:00.000Z (UTC+5:30)
        // Backend check: new Date(startDate) > Date.now() → always passes for future local dates.
        const [sy, sm, sd] = form.startDate.split('-').map(Number);
        const startDateObj = new Date(sy, sm - 1, sd, 12, 0, 0);
        if (isNaN(startDateObj.getTime())) {
            Alert.alert('Invalid Date', 'Please select a valid start date.');
            return;
        }

        setSubmitting(true);
        try {
            // Race the API call against a 20-second timeout so the button
            // never stays frozen if the network is unreachable.
            await Promise.race([
                createBooking({
                    driver:               driverId,
                    child:                selectedChildId,
                    pickupAddress:        form.pickupAddress.trim(),
                    dropoffAddress:       form.dropoffAddress.trim() || undefined,
                    monthlyFee:           fee,
                    startDate:            startDateObj.toISOString(),
                    specialInstructions:  form.specialInstructions.trim() || undefined,
                }),
                new Promise((_, reject) =>
                    setTimeout(
                        () => reject(new Error('Request timed out. Please check your internet connection and try again.')),
                        20000,
                    )
                ),
            ]);

            Alert.alert(
                '🎉 Booking Submitted!',
                "Your booking request has been sent to the driver. You'll be notified once it's reviewed.",
                [{ text: 'OK', onPress: () => router.replace('/parent/my-bookings') }],
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

                        {/* ── Preferred Start Date — native calendar picker ── */}
                        <Text style={styles.dateLabel}>
                            Preferred Start Date <Text style={{ color: '#EF4444' }}>*</Text>
                        </Text>
                        <TouchableOpacity
                            style={[styles.dateTrigger, !!errors.startDate && styles.dateTriggerError]}
                            onPress={() => setShowDatePicker(true)}
                            activeOpacity={0.7}
                        >
                            <Ionicons
                                name="calendar-outline"
                                size={18}
                                color={form.startDate ? '#3B82F6' : '#94A3B8'}
                                style={{ marginRight: 8 }}
                            />
                            <Text style={[styles.dateTriggerText, !form.startDate && styles.datePlaceholder]}>
                                {form.startDate ? toDisplayDate(form.startDate) : 'Select a start date'}
                            </Text>
                            <Ionicons name="chevron-down-outline" size={16} color="#94A3B8" />
                        </TouchableOpacity>
                        {!!errors.startDate && (
                            <View style={styles.dateErrorRow}>
                                <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
                                <Text style={styles.dateErrorText}>{errors.startDate}</Text>
                            </View>
                        )}

                        {/* Custom calendar picker — works on all platforms */}
                        <CalendarPicker
                            visible={showDatePicker}
                            selectedIso={form.startDate || null}
                            onClose={() => setShowDatePicker(false)}
                            onConfirm={(iso) => {
                                setForm(prev => ({ ...prev, startDate: iso }));
                                setErrors(prev => ({ ...prev, startDate: '' }));
                                setShowDatePicker(false);
                            }}
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

    // ── Date picker ───────────────────────────────────────────────────────────
    dateLabel: {
        fontSize: responsive.fontSM,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 6,
        letterSpacing: 0.3,
    },
    dateTrigger: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1.2,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        minHeight: 50,
        paddingHorizontal: 14,
        marginBottom: 4,
    },
    dateTriggerError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    dateTriggerText: {
        flex: 1,
        fontSize: responsive.fontMD,
        color: '#1E293B',
    },
    datePlaceholder: {
        color: '#CBD5E1',
    },
    dateErrorRow: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        marginBottom: 8,
    },
    dateErrorText: {
        fontSize: responsive.fontXS ?? 11,
        color: '#EF4444',
    },

});
