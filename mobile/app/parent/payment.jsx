import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function PaymentScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [saveCard, setSaveCard] = useState(false);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: 'card',
      description: 'Visa, Mastercard, Amex',
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: 'business',
      description: 'Direct bank transfer',
    },
    {
      id: 'wallet',
      name: 'Mobile Wallet',
      icon: 'phone-portrait',
      description: 'eZ Cash, mCash',
    },
  ];

  const handlePayment = () => {
    // Process payment
    alert('Payment processing...');
    // On success, navigate to confirmation
    router.replace('/parent/booking-confirmation');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Payment Summary */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subscription Plan</Text>
            <Text style={styles.summaryValue}>
              {params.plan === 'monthly' ? 'Monthly' : 'Weekly'}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subscription Fee</Text>
            <Text style={styles.summaryValue}>
              LKR {parseInt(params.amount || 0).toLocaleString()}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee (5%)</Text>
            <Text style={styles.summaryValue}>
              LKR {(parseInt(params.amount || 0) * 0.05).toLocaleString()}
            </Text>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              LKR {(parseInt(params.amount || 0) * 1.05).toLocaleString()}
            </Text>
          </View>
        </Card>

        {/* Payment Method */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>
          
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.paymentMethod,
                selectedMethod === method.id && styles.paymentMethodSelected
              ]}
              onPress={() => setSelectedMethod(method.id)}
            >
              <View style={styles.methodIcon}>
                <Ionicons 
                  name={method.icon} 
                  size={24} 
                  color={selectedMethod === method.id ? '#2563eb' : '#6b7280'} 
                />
              </View>
              <View style={styles.methodInfo}>
                <Text style={[
                  styles.methodName,
                  selectedMethod === method.id && styles.methodNameSelected
                ]}>
                  {method.name}
                </Text>
                <Text style={styles.methodDescription}>{method.description}</Text>
              </View>
              {selectedMethod === method.id && (
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              )}
            </TouchableOpacity>
          ))}
        </Card>

        {/* Auto-renewal */}
        <Card style={styles.section}>
          <View style={styles.autoRenewalHeader}>
            <View>
              <Text style={styles.autoRenewalTitle}>Auto-renewal</Text>
              <Text style={styles.autoRenewalDescription}>
                Automatically renew subscription at the end of each period
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.toggle, saveCard && styles.toggleActive]}
              onPress={() => setSaveCard(!saveCard)}
            >
              <View style={[styles.toggleThumb, saveCard && styles.toggleThumbActive]} />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Security Info */}
        <Card style={styles.section}>
          <View style={styles.securityHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#16a34a" />
            <Text style={styles.securityTitle}>Secure Payment</Text>
          </View>
          <Text style={styles.securityText}>
            Your payment information is encrypted and secure. We never store your card details on our servers.
          </Text>
        </Card>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Button 
          variant="primary" 
          size="large"
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Ionicons name="lock-closed" size={20} color="#ffffff" />
          <Text style={styles.payButtonText}>
            Pay LKR {(parseInt(params.amount || 0) * 1.05).toLocaleString()}
          </Text>
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
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalRow: {
    borderBottomWidth: 0,
    paddingTop: 16,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    marginBottom: 12,
  },
  paymentMethodSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  methodNameSelected: {
    color: '#2563eb',
  },
  methodDescription: {
    fontSize: 13,
    color: '#9ca3af',
  },
  autoRenewalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoRenewalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  autoRenewalDescription: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
    maxWidth: '80%',
  },
  toggle: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#d1d5db',
    padding: 2,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: '#2563eb',
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  securityText: {
    fontSize: 13,
    color: '#6b7280',
    lineHeight: 18,
  },
  footer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  payButton: {
    width: '100%',
    flexDirection: 'row',
    gap: 8,
  },
  payButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
