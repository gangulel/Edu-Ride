import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Input from '../atoms/Input';
import Button from '../atoms/Button';
import Card from '../atoms/Card';
import LocationInput from '../molecules/LocationInput';
import { responsive } from '../../utils/responsive';

const BookingForm = ({
    driver,
    onSubmit,
    loading = false,
    style,
}) => {
    const [formData, setFormData] = useState({
        childName: '',
        childGrade: '',
        school: driver?.school || '',
        pickupAddress: '',
        dropoffAddress: '',
        startDate: '',
        specialInstructions: '',
    });

    const [errors, setErrors] = useState({});

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.childName) newErrors.childName = 'Child name is required';
        if (!formData.childGrade) newErrors.childGrade = 'Grade is required';
        if (!formData.school) newErrors.school = 'School is required';
        if (!formData.pickupAddress) newErrors.pickupAddress = 'Pickup address is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <View style={[styles.container, style]}>
            {/* Driver Info Summary */}
            <Card style={styles.driverSummary}>
                <View style={styles.driverInfo}>
                    <Ionicons name="person-circle" size={40} color="#007AFF" />
                    <View style={styles.driverDetails}>
                        <Text style={styles.driverName}>{driver?.name}</Text>
                        <Text style={styles.driverRoute}>LKR {driver?.monthlyFee?.toLocaleString()}/month</Text>
                    </View>
                </View>
            </Card>

            {/* Form Fields */}
            <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Child Information</Text>

                <Input
                    label="Child's Full Name"
                    placeholder="Enter child's name"
                    value={formData.childName}
                    onChangeText={(v) => updateField('childName', v)}
                    error={errors.childName}
                    leftIcon="person-outline"
                />

                <Input
                    label="Grade"
                    placeholder="e.g., Grade 5"
                    value={formData.childGrade}
                    onChangeText={(v) => updateField('childGrade', v)}
                    error={errors.childGrade}
                    leftIcon="school-outline"
                />

                <Input
                    label="School Name"
                    placeholder="Enter school name"
                    value={formData.school}
                    onChangeText={(v) => updateField('school', v)}
                    error={errors.school}
                    leftIcon="business-outline"
                />
            </View>

            <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Pickup / Drop-off Details</Text>

                <LocationInput
                    label="Pickup Address"
                    placeholder="Enter pickup location"
                    value={formData.pickupAddress}
                    onChangeText={(v) => updateField('pickupAddress', v)}
                    error={errors.pickupAddress}
                    icon="location"
                    iconColor="#34C759"
                />

                <LocationInput
                    label="Drop-off Address (Optional)"
                    placeholder="Same as school if not specified"
                    value={formData.dropoffAddress}
                    onChangeText={(v) => updateField('dropoffAddress', v)}
                    icon="flag"
                    iconColor="#FF9500"
                />
            </View>

            <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Additional Details</Text>

                <Input
                    label="Preferred Start Date"
                    placeholder="e.g., 1st February 2026"
                    value={formData.startDate}
                    onChangeText={(v) => updateField('startDate', v)}
                    leftIcon="calendar-outline"
                />

                <Input
                    label="Special Instructions (Optional)"
                    placeholder="Any special needs or instructions..."
                    value={formData.specialInstructions}
                    onChangeText={(v) => updateField('specialInstructions', v)}
                    multiline
                    numberOfLines={3}
                />
            </View>

            {/* Submit Button */}
            <View style={styles.submitSection}>
                <Button
                    title="Submit Booking Request"
                    onPress={handleSubmit}
                    loading={loading}
                    fullWidth
                    size="large"
                />
                <Text style={styles.disclaimer}>
                    The driver will review your request and respond within 48 hours.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {},
    driverSummary: {
        marginBottom: responsive.paddingLG,
    },
    driverInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    driverDetails: {
        marginLeft: responsive.paddingMD,
    },
    driverName: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
    },
    driverRoute: {
        fontSize: responsive.fontMD,
        color: '#007AFF',
        marginTop: 2,
    },
    formSection: {
        marginBottom: responsive.paddingLG,
    },
    sectionTitle: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
        marginBottom: responsive.paddingMD,
    },
    submitSection: {
        marginTop: responsive.paddingMD,
    },
    disclaimer: {
        fontSize: responsive.fontSM,
        color: '#8E8E93',
        textAlign: 'center',
        marginTop: responsive.paddingMD,
        lineHeight: responsive.fontSM * 1.5,
    },
});

export default BookingForm;
