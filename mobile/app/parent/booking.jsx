import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function BookingScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const [childName, setChildName] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  const [pickupAddress, setPickupAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Mock service data
  const service = {
    id: params.serviceId,
    driverName: 'Nimal Perera',
    photo: null,
    verified: true,
    monthlyFee: 12000,
    weeklyFee: 3200,
    vehicle: 'Toyota Coaster',
    plate: 'CAB-1234',
  };

  const handleSubmitBooking = () => {
    // Validate form
    if (!childName || !grade || !school || !pickupAddress) {
      alert('Please fill in all required fields');
      return;
    }

    // Navigate to payment
    router.push({
      pathname: '/parent/payment',
      params: {
        serviceId: service.id,
        plan: selectedPlan,
        amount: selectedPlan === 'monthly' ? service.monthlyFee : service.weeklyFee,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Service</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Service Info */}
        <Card style={styles.serviceCard}>
          <View style={styles.serviceHeader}>
            <Avatar 
              name={service.driverName}
              source={service.photo}
              verified={service.verified}
              size={48}
            />
            <View style={styles.serviceInfo}>
              <Text style={styles.driverName}>{service.driverName}</Text>
              <Text style={styles.vehicleInfo}>
                {service.vehicle} • {service.plate}
              </Text>
            </View>
          </View>
        </Card>

        {/* Subscription Plan */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Select Plan</Text>
          
          <TouchableOpacity
            style={[
              styles.planOption,
              selectedPlan === 'monthly' && styles.planOptionSelected
            ]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.planInfo}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>Monthly Plan</Text>
                {selectedPlan === 'monthly' && (
                  <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
                )}
              </View>
              <Text style={styles.planDescription}>Pay once a month</Text>
              <Text style={styles.planPrice}>LKR {service.monthlyFee.toLocaleString()}/month</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planOption,
              selectedPlan === 'weekly' && styles.planOptionSelected
            ]}
            onPress={() => setSelectedPlan('weekly')}
          >
            <View style={styles.planInfo}>
              <View style={styles.planHeader}>
                <Text style={styles.planTitle}>Weekly Plan</Text>
                {selectedPlan === 'weekly' && (
                  <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
                )}
              </View>
              <Text style={styles.planDescription}>Pay every week</Text>
              <Text style={styles.planPrice}>LKR {service.weeklyFee.toLocaleString()}/week</Text>
            </View>
          </TouchableOpacity>
        </Card>

        {/* Child Information */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Child Information</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Child's Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter child's full name"
              value={childName}
              onChangeText={setChildName}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Grade *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Grade 7"
              value={grade}
              onChangeText={setGrade}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>School *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter school name"
              value={school}
              onChangeText={setSchool}
            />
          </View>
        </Card>

        {/* Pickup Details */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Pickup Details</Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Pickup Address *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter full pickup address"
              value={pickupAddress}
              onChangeText={setPickupAddress}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Landmark (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Near City Bank"
              value={landmark}
              onChangeText={setLandmark}
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Special Instructions (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Any special instructions for the driver"
              value={specialInstructions}
              onChangeText={setSpecialInstructions}
              multiline
              numberOfLines={3}
            />
          </View>
        </Card>

        {/* Terms & Conditions */}
        <Card style={styles.section}>
          <View style={styles.termsHeader}>
            <Ionicons name="information-circle" size={20} color="#2563eb" />
            <Text style={styles.termsTitle}>Important Information</Text>
          </View>
          <Text style={styles.termsText}>
            • First payment will be processed after driver accepts your booking request{'\n'}
            • Cancellations with 7+ days notice: Full refund{'\n'}
            • Cancellations with 3-7 days notice: 50% refund{'\n'}
            • Cancellations with less than 3 days notice: No refund{'\n'}
            • You can communicate with the driver through the messaging feature
          </Text>
        </Card>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.footerPrice}>
          <Text style={styles.footerPriceLabel}>Total Amount</Text>
          <Text style={styles.footerPriceAmount}>
            LKR {(selectedPlan === 'monthly' ? service.monthlyFee : service.weeklyFee).toLocaleString()}
          </Text>
        </View>
        <Button 
          variant="primary" 
          size="large"
          style={styles.submitButton}
          onPress={handleSubmitBooking}
        >
          Send Booking Request
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  serviceCard: {
    marginBottom: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceInfo: {
    marginLeft: 12,
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  vehicleInfo: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  planOption: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  planOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  planInfo: {
    flex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  planDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    color: '#1f2937',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  termsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  termsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  termsText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  footerPrice: {
    marginBottom: 12,
  },
  footerPriceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  footerPriceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  submitButton: {
    width: '100%',
  },
});
