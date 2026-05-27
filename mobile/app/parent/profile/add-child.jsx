import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    ActivityIndicator,
    StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { responsive, hp, wp } from '../../utils/responsive';
import { addChild } from '../../../services/parentApi';
import { useAuth } from '../../../contexts/AuthContext';

// ─── Constants ────────────────────────────────────────────────────────────────

const GRADE_OPTIONS = [
    'Pre-K', 'KG',
    '1', '2', '3', '4', '5', '6',
    '7', '8', '9', '10', '11', '12',
];

// ─── Colombo Schools Master List ──────────────────────────────────────────────

const COLOMBO_SCHOOLS = [
    // National schools – Colombo
    'Royal College',
    'Thurstan College',
    'DS Senanayake College',
    'Mahanama College',
    'Nalanda College',
    'Ananda College',
    'Isipathana College',
    'Lumbini College',
    'Zahira College',
    'President\'s College',
    'Gamini Vidyalaya',
    'Sri Jayawardenepura Maha Vidyalaya',
    // Girls national schools
    'Visakha Vidyalaya',
    'Devi Balika Vidyalaya',
    'Musaeus College',
    'Ladies College',
    'Holy Family Convent',
    'St. Bridget\'s Convent',
    'Good Shepherd Convent',
    'St. Clare\'s College',
    'Gothami Vidyalaya',
    // Catholic / faith-based
    'St. Joseph\'s College',
    'St. Peter\'s College',
    'St. Benedict\'s College',
    'De Mazenod College',
    'St. Thomas\' College',
    'Methodist College',
    'Bishop\'s College',
    'St. Mary\'s College',
    'St. Thomas\' Preparatory School',
    // International schools
    'Colombo International School',
    'Asian International School',
    'The British School in Colombo',
    'Overseas School of Colombo',
    'Elizabeth Moir School',
    'Gateway College Colombo',
    'Lyceum International School',
    'Lyceum International School Nugegoda',
    'Stafford International School',
    'GEMS World Academy Colombo',
    'Ilma International School',
    'Loreburn International School',
    // Suburban / Greater Colombo
    'Mahinda College',
    'Richmond College',
    'Prince of Wales College',
    'Dharmaraja College',
    'Dharmasoka College',
    'Rahula College',
    'Bandaranaike College',
    'Sirimavo Bandaranaike Vidyalaya',
    'Sirimavo Bandaranaike School',
    'Ferguson High School',
    'Carey College',
    'S. Thomas\' College Mount Lavinia',
    'Southlands College',
    'Sujatha Vidyalaya',
    'Vidyala Madhya Maha Vidyalaya',
    'Piliyandala Central College',
    'Kelaniya Madhya Maha Vidyalaya',
    'Kalubowila Central College',
    'Moratuwa Maha Vidyalaya',
    'Rathnavali Balika Vidyalaya',
    'Sangamitta Balika Vidyalaya',
    'Samudradevi Balika Vidyalaya',
    'Gothatuwa National School',
    'Taxila Central College',
    'Dharmapala Vidyalaya',
];

const GENDER_OPTIONS = [
    { label: 'Male',   icon: 'male-outline' },
    { label: 'Female', icon: 'female-outline' },
];

// ─── Reusable sub-components ──────────────────────────────────────────────────

/** Section card wrapper */
const SectionCard = ({ iconName, iconColor, iconBg, title, children }) => (
    <View style={cardStyles.card}>
        {/* Card header */}
        <View style={cardStyles.header}>
            <View style={[cardStyles.iconBadge, { backgroundColor: iconBg }]}>
                <Ionicons name={iconName} size={18} color={iconColor} />
            </View>
            <Text style={cardStyles.title}>{title}</Text>
        </View>
        <View style={cardStyles.divider} />
        {children}
    </View>
);

const cardStyles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: responsive.paddingLG,
        marginBottom: responsive.paddingLG,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.07,
        shadowRadius: 10,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsive.paddingMD,
    },
    iconBadge: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsive.paddingMD,
    },
    title: {
        fontSize: responsive.fontLG,
        fontWeight: '700',
        color: '#1E293B',
        letterSpacing: 0.2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: responsive.paddingLG,
    },
});

/** Labelled text input with focus ring and error state */
const FormField = ({
    label,
    required = false,
    placeholder,
    value,
    onChangeText,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    leftIcon,
    maxLength,
    error,
    nextRef,
    returnKeyType = 'next',
    onSubmitEditing,
}) => {
    const [focused, setFocused] = useState(false);

    return (
        <View style={fieldStyles.wrapper}>
            <Text style={fieldStyles.label}>
                {label}
                {required && <Text style={fieldStyles.required}> *</Text>}
            </Text>

            <View style={[
                fieldStyles.inputRow,
                focused && fieldStyles.inputFocused,
                error  && fieldStyles.inputError,
            ]}>
                {leftIcon && (
                    <Ionicons
                        name={leftIcon}
                        size={18}
                        color={focused ? '#3B82F6' : '#94A3B8'}
                        style={fieldStyles.leftIcon}
                    />
                )}
                <TextInput
                    ref={nextRef}
                    style={[fieldStyles.input, leftIcon && fieldStyles.inputIndented]}
                    placeholder={placeholder}
                    placeholderTextColor="#CBD5E1"
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                    returnKeyType={returnKeyType}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    blurOnSubmit={returnKeyType === 'done'}
                />
            </View>

            {!!error && (
                <View style={fieldStyles.errorRow}>
                    <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
                    <Text style={fieldStyles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

const fieldStyles = StyleSheet.create({
    wrapper: {
        marginBottom: responsive.paddingMD,
    },
    label: {
        fontSize: responsive.fontSM,
        fontWeight: '600',
        color: '#334155',
        marginBottom: hp(6),
        letterSpacing: 0.3,
    },
    required: {
        color: '#EF4444',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderWidth: 1.2,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        minHeight: hp(50),
        paddingHorizontal: responsive.paddingMD,
    },
    inputFocused: {
        borderColor: '#3B82F6',
        backgroundColor: '#FFFFFF',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 2,
    },
    inputError: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    leftIcon: {
        marginRight: hp(8),
    },
    input: {
        flex: 1,
        fontSize: responsive.fontMD,
        color: '#1E293B',
        paddingVertical: responsive.paddingMD,
    },
    inputIndented: {
        // already handled by marginRight on icon
    },
    errorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: hp(4),
        gap: 4,
    },
    errorText: {
        fontSize: responsive.fontXS,
        color: '#EF4444',
    },
});

/** Segmented gender selector */
const GenderSelector = ({ value, onChange, error }) => (
    <View style={gStyles.wrapper}>
        <Text style={fieldStyles.label}>
            Gender
        </Text>
        <View style={gStyles.row}>
            {GENDER_OPTIONS.map(({ label, icon }) => {
                const selected = value === label;
                return (
                    <TouchableOpacity
                        key={label}
                        style={[gStyles.chip, selected && gStyles.chipSelected]}
                        onPress={() => onChange(selected ? '' : label)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={icon}
                            size={15}
                            color={selected ? '#FFFFFF' : '#64748B'}
                        />
                        <Text style={[gStyles.chipLabel, selected && gStyles.chipLabelSelected]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
        {!!error && (
            <View style={fieldStyles.errorRow}>
                <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
                <Text style={fieldStyles.errorText}>{error}</Text>
            </View>
        )}
    </View>
);

const gStyles = StyleSheet.create({
    wrapper: { marginBottom: responsive.paddingMD },
    row: { flexDirection: 'row', gap: hp(8) },
    chip: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: hp(5),
        paddingVertical: hp(11),
        borderRadius: 10,
        borderWidth: 1.2,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
    },
    chipSelected: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    chipLabel: {
        fontSize: responsive.fontSM,
        fontWeight: '600',
        color: '#64748B',
    },
    chipLabelSelected: {
        color: '#FFFFFF',
    },
});

/** Date input field with format validation */
const DateInput = ({ value, onChange, error }) => {
    const [focused, setFocused] = useState(false);

    return (
        <View style={fieldStyles.wrapper}>
            <Text style={fieldStyles.label}>
                Preferred Start Date
                <Text style={fieldStyles.required}> *</Text>
            </Text>

            <View style={[
                fieldStyles.inputRow,
                focused && fieldStyles.inputFocused,
                error && fieldStyles.inputError,
            ]}>
                <Ionicons
                    name="calendar-outline"
                    size={18}
                    color={focused ? '#3B82F6' : '#94A3B8'}
                    style={fieldStyles.leftIcon}
                />
                <TextInput
                    style={[fieldStyles.input, { flex: 1 }]}
                    placeholder="YYYY-MM-DD (e.g., 2026-02-01)"
                    placeholderTextColor="#CBD5E1"
                    value={value}
                    onChangeText={onChange}
                    keyboardType="number-pad"
                    maxLength={10}
                    returnKeyType="done"
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                />
            </View>

            {!!error && (
                <View style={fieldStyles.errorRow}>
                    <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
                    <Text style={fieldStyles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

/** School name field with live Colombo school autocomplete */
const SchoolAutocomplete = ({ value, onChange, error }) => {
    const [focused,         setFocused]         = useState(false);
    const [suggestions,     setSuggestions]     = useState([]);
    const [showDropdown,    setShowDropdown]    = useState(false);

    const filterSchools = (text) => {
        onChange(text);
        if (text.trim().length === 0) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }
        const q = text.toLowerCase();
        const matches = COLOMBO_SCHOOLS
            .filter(s => s.toLowerCase().includes(q))
            .slice(0, 6);
        setSuggestions(matches);
        setShowDropdown(matches.length > 0);
    };

    const selectSchool = (school) => {
        onChange(school);
        setSuggestions([]);
        setShowDropdown(false);
    };

    const clearField = () => {
        onChange('');
        setSuggestions([]);
        setShowDropdown(false);
    };

    return (
        <View style={acStyles.wrapper}>
            <Text style={fieldStyles.label}>
                School Name <Text style={fieldStyles.required}>*</Text>
            </Text>

            {/* Input row */}
            <View style={[
                fieldStyles.inputRow,
                focused  && fieldStyles.inputFocused,
                error    && fieldStyles.inputError,
            ]}>
                <Ionicons
                    name="business-outline"
                    size={18}
                    color={focused ? '#3B82F6' : '#94A3B8'}
                    style={fieldStyles.leftIcon}
                />
                <TextInput
                    style={[fieldStyles.input, { flex: 1 }]}
                    placeholder="e.g. Colombo International School"
                    placeholderTextColor="#CBD5E1"
                    value={value}
                    onChangeText={filterSchools}
                    autoCapitalize="words"
                    maxLength={120}
                    returnKeyType="done"
                    onFocus={() => {
                        setFocused(true);
                        if (suggestions.length > 0) setShowDropdown(true);
                    }}
                    onBlur={() => {
                        setFocused(false);
                        // small delay so tap on a suggestion registers first
                        setTimeout(() => setShowDropdown(false), 180);
                    }}
                />
                {value.length > 0 && (
                    <TouchableOpacity onPress={clearField} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Ionicons name="close-circle" size={18} color="#94A3B8" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Suggestions dropdown */}
            {showDropdown && (
                <View style={acStyles.dropdown}>
                    <FlatList
                        data={suggestions}
                        keyExtractor={(item) => item}
                        keyboardShouldPersistTaps="handled"
                        scrollEnabled={suggestions.length > 4}
                        nestedScrollEnabled
                        style={{ maxHeight: hp(210) }}
                        renderItem={({ item, index }) => (
                            <TouchableOpacity
                                style={[
                                    acStyles.item,
                                    index < suggestions.length - 1 && acStyles.itemBorder,
                                ]}
                                onPress={() => selectSchool(item)}
                                activeOpacity={0.7}
                            >
                                <View style={acStyles.itemIconWrap}>
                                    <Ionicons name="school-outline" size={15} color="#3B82F6" />
                                </View>
                                <Text style={acStyles.itemText} numberOfLines={1}>{item}</Text>
                                <Ionicons name="arrow-forward" size={13} color="#CBD5E1" />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            )}

            {!!error && (
                <View style={fieldStyles.errorRow}>
                    <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
                    <Text style={fieldStyles.errorText}>{error}</Text>
                </View>
            )}
        </View>
    );
};

const acStyles = StyleSheet.create({
    wrapper: {
        marginBottom: responsive.paddingMD,
        zIndex: 10,
    },
    dropdown: {
        marginTop: hp(4),
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#BFDBFE',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.10,
        shadowRadius: 10,
        elevation: 5,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: hp(12),
        paddingHorizontal: responsive.paddingMD,
        gap: hp(10),
        backgroundColor: '#FFFFFF',
    },
    itemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    itemIconWrap: {
        width: 28,
        height: 28,
        borderRadius: 8,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemText: {
        flex: 1,
        fontSize: responsive.fontMD,
        color: '#1E293B',
        fontWeight: '500',
    },
});

/** Grade picker — tappable display + modal list */
const GradePicker = ({ value, onChange, error }) => {
    const [open, setOpen] = useState(false);

    return (
        <View style={fieldStyles.wrapper}>
            <Text style={fieldStyles.label}>
                Grade <Text style={fieldStyles.required}>*</Text>
            </Text>

            <TouchableOpacity
                style={[
                    fieldStyles.inputRow,
                    error && fieldStyles.inputError,
                    { justifyContent: 'space-between' },
                ]}
                onPress={() => setOpen(true)}
                activeOpacity={0.7}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons
                        name="school-outline"
                        size={18}
                        color={value ? '#3B82F6' : '#94A3B8'}
                        style={fieldStyles.leftIcon}
                    />
                    <Text style={[
                        fieldStyles.input,
                        { paddingVertical: 0 },
                        !value && { color: '#CBD5E1' },
                    ]}>
                        {value || 'Select grade'}
                    </Text>
                </View>
                <Ionicons
                    name="chevron-down-outline"
                    size={18}
                    color="#94A3B8"
                />
            </TouchableOpacity>

            {!!error && (
                <View style={fieldStyles.errorRow}>
                    <Ionicons name="alert-circle-outline" size={13} color="#EF4444" />
                    <Text style={fieldStyles.errorText}>{error}</Text>
                </View>
            )}

            {/* Grade picker modal */}
            <Modal
                visible={open}
                transparent
                animationType="slide"
                statusBarTranslucent
                onRequestClose={() => setOpen(false)}
            >
                <TouchableOpacity
                    style={pickerStyles.backdrop}
                    activeOpacity={1}
                    onPress={() => setOpen(false)}
                />
                <View style={pickerStyles.sheet}>
                    {/* Handle bar */}
                    <View style={pickerStyles.handle} />
                    <Text style={pickerStyles.sheetTitle}>Select Grade</Text>

                    <FlatList
                        data={GRADE_OPTIONS}
                        keyExtractor={(item) => item}
                        numColumns={3}
                        contentContainerStyle={pickerStyles.grid}
                        renderItem={({ item }) => {
                            const selected = value === item;
                            return (
                                <TouchableOpacity
                                    style={[pickerStyles.gradeCell, selected && pickerStyles.gradeCellSelected]}
                                    onPress={() => { onChange(item); setOpen(false); }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={[pickerStyles.gradeCellText, selected && pickerStyles.gradeCellTextSelected]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            );
                        }}
                    />

                    <TouchableOpacity style={pickerStyles.cancelBtn} onPress={() => setOpen(false)}>
                        <Text style={pickerStyles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const pickerStyles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(15,23,42,0.45)',
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: responsive.paddingLG,
        paddingBottom: hp(32),
        maxHeight: '65%',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: '#CBD5E1',
        borderRadius: 2,
        alignSelf: 'center',
        marginTop: hp(12),
        marginBottom: hp(16),
    },
    sheetTitle: {
        fontSize: responsive.fontLG,
        fontWeight: '700',
        color: '#1E293B',
        textAlign: 'center',
        marginBottom: hp(16),
    },
    grid: {
        paddingBottom: hp(8),
    },
    gradeCell: {
        flex: 1,
        margin: hp(5),
        paddingVertical: hp(14),
        borderRadius: 10,
        borderWidth: 1.2,
        borderColor: '#E2E8F0',
        backgroundColor: '#F8FAFC',
        alignItems: 'center',
    },
    gradeCellSelected: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    gradeCellText: {
        fontSize: responsive.fontMD,
        fontWeight: '600',
        color: '#475569',
    },
    gradeCellTextSelected: {
        color: '#FFFFFF',
    },
    cancelBtn: {
        marginTop: hp(8),
        paddingVertical: hp(14),
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
    },
    cancelText: {
        fontSize: responsive.fontMD,
        fontWeight: '600',
        color: '#64748B',
    },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────

const INITIAL_FORM = {
    fullName: '',
    age: '',
    gender: '',
    school: '',
    grade: '',
    startDate: '',
    specialInstructions: '',
    emergencyContact1: '',
    emergencyContact2: '',
};

const INITIAL_ERRORS = {
    fullName: '',
    age: '',
    gender: '',
    school: '',
    grade: '',
    startDate: '',
    emergencyContact1: '',
    emergencyContact2: '',
};

const PHONE_RE = /^\+?\d{7,15}$/;

export default function AddChildScreen() {
    const router = useRouter();
    const { token } = useAuth();
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState(INITIAL_ERRORS);
    const [loading, setLoading] = useState(false);

    // Refs for focus chaining
    const ageRef          = useRef(null);
    const schoolRef       = useRef(null);
    const ec1Ref          = useRef(null);
    const ec2Ref          = useRef(null);

    // ── Helpers ─────────────────────────────────────────────────────────────

    const setField = (key, val) => {
        setForm(prev => ({ ...prev, [key]: val }));
        if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const validate = () => {
        const e = { ...INITIAL_ERRORS };
        let valid = true;

        if (!form.fullName.trim()) {
            e.fullName = 'Child\'s full name is required';
            valid = false;
        } else if (form.fullName.trim().length < 2) {
            e.fullName = 'Name must be at least 2 characters';
            valid = false;
        }

        if (form.age) {
            const n = Number(form.age);
            if (isNaN(n) || !Number.isInteger(n) || n < 3 || n > 25) {
                e.age = 'Age must be between 3 and 25';
                valid = false;
            }
        }

        if (!form.school.trim()) {
            e.school = 'School name is required';
            valid = false;
        }

        if (!form.grade) {
            e.grade = 'Please select a grade';
            valid = false;
        }

        if (!form.startDate.trim()) {
            e.startDate = 'Start date is required';
            valid = false;
        } else if (!isValidDate(form.startDate)) {
            e.startDate = 'Please enter a valid date (YYYY-MM-DD)';
            valid = false;
        }

        if (form.emergencyContact1 && !PHONE_RE.test(form.emergencyContact1.trim())) {
            e.emergencyContact1 = 'Enter a valid phone number (e.g. +94771234567)';
            valid = false;
        }

        if (form.emergencyContact2 && !PHONE_RE.test(form.emergencyContact2.trim())) {
            e.emergencyContact2 = 'Enter a valid phone number (e.g. +94771234567)';
            valid = false;
        }

        setErrors(e);
        return valid;
    };

    const isValidDate = (dateStr) => {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dateStr)) return false;
        const date = new Date(dateStr + 'T00:00:00');
        return date instanceof Date && !isNaN(date);
    };

    const handleSave = async () => {
        if (!token) {
            // No session token — redirect to login
            router.replace('/login/login');
            return;
        }

        if (!validate()) return;

        setLoading(true);
        try {
            await addChild({
                fullName:         form.fullName.trim(),
                grade:            form.grade,
                school:           form.school.trim(),
                startDate:        form.startDate.trim(),
                age:              form.age ? Number(form.age) : undefined,
                gender:           form.gender || undefined,
                specialInstructions: form.specialInstructions.trim() || undefined,
                emergencyContact1: form.emergencyContact1.trim() || undefined,
                emergencyContact2: form.emergencyContact2.trim() || undefined,
            });
            router.back();
        } catch (err) {
            setErrors(prev => ({
                ...prev,
                fullName: err.message || 'Failed to add child. Please try again.',
            }));
        } finally {
            setLoading(false);
        }
    };

    // ── Render ──────────────────────────────────────────────────────────────

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* ── Top bar ── */}
            <View style={styles.topBar}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
                    <Ionicons name="arrow-back" size={22} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.topBarTitle}>Add Child</Text>
                <View style={styles.topBarRight} />
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >
                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* ── Hero banner ── */}
                    <LinearGradient
                        colors={['#3B82F6', '#2563EB']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.heroBanner}
                    >
                        <View style={styles.heroIconWrap}>
                            <Text style={styles.heroEmoji}>👦</Text>
                        </View>
                        <View style={styles.heroText}>
                            <Text style={styles.heroTitle}>Add Child Information</Text>
                            <Text style={styles.heroSubtitle}>
                                Enter your child's details to{'\n'}continue booking school transport
                            </Text>
                        </View>
                    </LinearGradient>

                    {/* ══ Section 1 — Child Info ══ */}
                    <SectionCard
                        iconName="person-outline"
                        iconColor="#3B82F6"
                        iconBg="#EFF6FF"
                        title="Child Information"
                    >
                        <FormField
                            label="Child's Full Name"
                            required
                            placeholder="e.g. Aiden De Silva"
                            value={form.fullName}
                            onChangeText={v => setField('fullName', v)}
                            autoCapitalize="words"
                            leftIcon="person-outline"
                            maxLength={80}
                            error={errors.fullName}
                            returnKeyType="next"
                            onSubmitEditing={() => ageRef.current?.focus()}
                        />

                        {/* Age + Gender side by side */}
                        <View style={styles.row}>
                            <View style={{ flex: 0.38 }}>
                                <FormField
                                    label="Age"
                                    placeholder="e.g. 8"
                                    value={form.age}
                                    onChangeText={v => setField('age', v)}
                                    keyboardType="number-pad"
                                    leftIcon="calendar-outline"
                                    maxLength={2}
                                    error={errors.age}
                                    nextRef={ageRef}
                                    returnKeyType="next"
                                    onSubmitEditing={() => schoolRef.current?.focus()}
                                />
                            </View>
                            <View style={{ flex: 0.58 }}>
                                <GenderSelector
                                    value={form.gender}
                                    onChange={v => setField('gender', v)}
                                    error={errors.gender}
                                />
                            </View>
                        </View>
                    </SectionCard>

                    {/* ══ Section 2 — Academic Info ══ */}
                    <SectionCard
                        iconName="school-outline"
                        iconColor="#10B981"
                        iconBg="#ECFDF5"
                        title="Academic Information"
                    >
                        <SchoolAutocomplete
                            value={form.school}
                            onChange={v => setField('school', v)}
                            error={errors.school}
                        />

                        <GradePicker
                            value={form.grade}
                            onChange={v => setField('grade', v)}
                            error={errors.grade}
                        />
                    </SectionCard>

                    {/* ══ Section 3 — Additional Details ══ */}
                    <SectionCard
                        iconName="calendar-outline"
                        iconColor="#8B5CF6"
                        iconBg="#F3E8FF"
                        title="Additional Details"
                    >
                        <DateInput
                            value={form.startDate}
                            onChange={v => setField('startDate', v)}
                            error={errors.startDate}
                        />

                        <FormField
                            label="Special Instructions (Optional)"
                            placeholder="Any special needs or instructions..."
                            value={form.specialInstructions}
                            onChangeText={v => setField('specialInstructions', v)}
                            autoCapitalize="sentences"
                            maxLength={300}
                            returnKeyType="done"
                        />
                    </SectionCard>

                    {/* ══ Section 4 — Emergency Contacts ══ */}
                    <SectionCard
                        iconName="call-outline"
                        iconColor="#F59E0B"
                        iconBg="#FFFBEB"
                        title="Emergency Contacts"
                    >
                        {/* Helper note */}
                        <View style={styles.infoNote}>
                            <Ionicons name="information-circle-outline" size={15} color="#94A3B8" />
                            <Text style={styles.infoNoteText}>
                                These contacts will be notified in case of an emergency during transit.
                            </Text>
                        </View>

                        <FormField
                            label="Emergency Contact 1"
                            placeholder="+94 77 123 4567"
                            value={form.emergencyContact1}
                            onChangeText={v => setField('emergencyContact1', v)}
                            keyboardType="phone-pad"
                            leftIcon="call-outline"
                            maxLength={16}
                            error={errors.emergencyContact1}
                            nextRef={ec1Ref}
                            returnKeyType="next"
                            onSubmitEditing={() => ec2Ref.current?.focus()}
                        />

                        <FormField
                            label="Emergency Contact 2"
                            placeholder="+94 77 987 6543  (optional)"
                            value={form.emergencyContact2}
                            onChangeText={v => setField('emergencyContact2', v)}
                            keyboardType="phone-pad"
                            leftIcon="call-outline"
                            maxLength={16}
                            error={errors.emergencyContact2}
                            nextRef={ec2Ref}
                            returnKeyType="done"
                        />
                    </SectionCard>

                    {/* ══ Submit button ══ */}
                    <TouchableOpacity
                        style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                        onPress={handleSave}
                        activeOpacity={0.8}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                                <Text style={styles.submitText}>Save Child</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <View style={{ height: hp(40) }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

// ─── Screen styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: '#F1F5F9',
    },

    // Top navigation bar
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingMD,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 10,
        backgroundColor: '#F1F5F9',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topBarTitle: {
        fontSize: responsive.fontLG,
        fontWeight: '700',
        color: '#1E293B',
    },
    topBarRight: {
        width: 38,
    },

    // Scroll
    scroll: { flex: 1 },
    scrollContent: {
        padding: responsive.paddingLG,
        paddingTop: responsive.paddingMD,
    },

    // Hero banner
    heroBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 16,
        padding: responsive.paddingLG,
        marginBottom: responsive.paddingLG,
        gap: responsive.paddingMD,
    },
    heroIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 14,
        backgroundColor: 'rgba(255,255,255,0.22)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroEmoji: {
        fontSize: 28,
    },
    heroText: {
        flex: 1,
    },
    heroTitle: {
        fontSize: responsive.fontLG,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: responsive.fontSM,
        color: 'rgba(255,255,255,0.82)',
        lineHeight: 18,
    },

    // Two-column row
    row: {
        flexDirection: 'row',
        gap: hp(10),
    },

    // Emergency info note
    infoNote: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: hp(6),
        backgroundColor: '#F8FAFC',
        borderRadius: 8,
        padding: hp(10),
        marginBottom: responsive.paddingMD,
    },
    infoNoteText: {
        flex: 1,
        fontSize: responsive.fontXS,
        color: '#64748B',
        lineHeight: 17,
    },

    // Submit button
    submitBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: hp(8),
        backgroundColor: '#3B82F6',
        borderRadius: 14,
        paddingVertical: hp(16),
        marginTop: hp(4),
        shadowColor: '#3B82F6',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.28,
        shadowRadius: 14,
        elevation: 6,
    },
    submitBtnDisabled: {
        opacity: 0.7,
    },
    submitText: {
        fontSize: responsive.fontLG,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.3,
    },
});
