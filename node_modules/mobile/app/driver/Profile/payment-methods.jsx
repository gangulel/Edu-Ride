import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, Alert, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentMethods() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState("");

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: "bank",
      name: "Commercial Bank",
      details: "Account ****6789",
      isDefault: true,
      icon: "business-outline",
      color: "#007AFF",
    },
    {
      id: 2,
      type: "card",
      name: "Visa Debit Card",
      details: "**** **** **** 4532",
      isDefault: false,
      icon: "card-outline",
      color: "#5856D6",
    },
    {
      id: 3,
      type: "paypal",
      name: "PayPal",
      details: "kasun.perera@eduride.lk",
      isDefault: false,
      icon: "logo-paypal",
      color: "#003087",
    },
  ]);

  const [earnings] = useState({
    thisWeek: 124750.00,
    pendingPayout: 45000.00,
    nextPayoutDate: "Dec 18, 2025",
  });

  const handleSetDefault = (id) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
    Alert.alert("Success", "Default payment method updated");
  };

  const handleRemove = (id, name) => {
    Alert.alert(
      "Remove Payment Method",
      `Are you sure you want to remove ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            setPaymentMethods(methods => methods.filter(m => m.id !== id));
          },
        },
      ]
    );
  };

  const handleAddPaymentMethod = (type) => {
    setSelectedType(type);
    setModalVisible(true);
  };

  const handleSavePaymentMethod = () => {
    // In a real app, this would validate and save the payment method
    setModalVisible(false);
    Alert.alert("Success", "Payment method added successfully");
  };

  const handleRequestPayout = () => {
    Alert.alert(
      "Request Early Payout",
      `Request early payout of Rs. ${earnings.pendingPayout.toLocaleString()}? A small fee may apply.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Request", onPress: () => Alert.alert("Success", "Payout requested") },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <View style={styles.earningsHeader}>
            <Ionicons name="wallet-outline" size={24} color="#34C759" />
            <Text style={styles.earningsTitle}>Your Earnings</Text>
          </View>

          <View style={styles.earningsGrid}>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>This Week</Text>
              <Text style={styles.earningValue}>Rs. {earnings.thisWeek.toLocaleString()}</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>Pending Payout</Text>
              <Text style={styles.earningValue}>Rs. {earnings.pendingPayout.toLocaleString()}</Text>
            </View>
          </View>

          <View style={styles.payoutInfo}>
            <Ionicons name="time-outline" size={16} color="#8E8E93" />
            <Text style={styles.payoutText}>
              Next automatic payout on {earnings.nextPayoutDate}
            </Text>
          </View>

          <TouchableOpacity style={styles.payoutButton} onPress={handleRequestPayout}>
            <Ionicons name="flash-outline" size={18} color="#fff" />
            <Text style={styles.payoutButtonText}>Request Early Payout</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Methods Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Payment Methods</Text>
            <Text style={styles.sectionSubtitle}>
              {paymentMethods.length} method{paymentMethods.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {paymentMethods.map((method) => (
            <View key={method.id} style={styles.paymentCard}>
              <View style={styles.paymentHeader}>
                <View style={styles.paymentLeft}>
                  <View style={[styles.paymentIcon, { backgroundColor: `${method.color}15` }]}>
                    <Ionicons name={method.icon} size={24} color={method.color} />
                  </View>
                  <View style={styles.paymentInfo}>
                    <View style={styles.paymentNameRow}>
                      <Text style={styles.paymentName}>{method.name}</Text>
                      {method.isDefault && (
                        <View style={styles.defaultBadge}>
                          <Text style={styles.defaultBadgeText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.paymentDetails}>{method.details}</Text>
                  </View>
                </View>
              </View>

              <View style={styles.paymentActions}>
                {!method.isDefault && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(method.id)}
                  >
                    <Ionicons name="checkmark-circle-outline" size={18} color="#007AFF" />
                    <Text style={styles.actionButtonText}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={[styles.actionButton, styles.removeButton]}
                  onPress={() => handleRemove(method.id, method.name)}
                >
                  <Ionicons name="trash-outline" size={18} color="#FF3B30" />
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Add Payment Method Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add New Payment Method</Text>

          <TouchableOpacity
            style={styles.addMethodCard}
            onPress={() => handleAddPaymentMethod("bank")}
          >
            <View style={styles.addMethodIcon}>
              <Ionicons name="business-outline" size={24} color="#007AFF" />
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodName}>Bank Account</Text>
              <Text style={styles.addMethodDesc}>Direct deposit to your bank</Text>
            </View>
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addMethodCard}
            onPress={() => handleAddPaymentMethod("card")}
          >
            <View style={styles.addMethodIcon}>
              <Ionicons name="card-outline" size={24} color="#5856D6" />
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodName}>Debit Card</Text>
              <Text style={styles.addMethodDesc}>Instant transfer to your card</Text>
            </View>
            <Ionicons name="add-circle-outline" size={24} color="#5856D6" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addMethodCard}
            onPress={() => handleAddPaymentMethod("paypal")}
          >
            <View style={styles.addMethodIcon}>
              <Ionicons name="logo-paypal" size={24} color="#003087" />
            </View>
            <View style={styles.addMethodInfo}>
              <Text style={styles.addMethodName}>PayPal</Text>
              <Text style={styles.addMethodDesc}>Transfer to PayPal account</Text>
            </View>
            <Ionicons name="add-circle-outline" size={24} color="#003087" />
          </TouchableOpacity>
        </View>

        {/* Payment Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Payment Information</Text>
          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark-outline" size={20} color="#34C759" />
            <Text style={styles.infoText}>
              Your payment information is encrypted and secure
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Automatic payouts occur weekly on Wednesdays
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="flash-outline" size={20} color="#FF9500" />
            <Text style={styles.infoText}>
              Instant payouts available with debit cards (fee applies)
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={20} color="#34C759" />
            <Text style={styles.infoText}>
              Minimum payout amount is Rs. 5,000.00
            </Text>
          </View>
        </View>

        {/* Transaction History Link */}
        <TouchableOpacity style={styles.historyButton}>
          <Ionicons name="list-outline" size={20} color="#007AFF" />
          <Text style={styles.historyButtonText}>View Transaction History</Text>
          <Ionicons name="chevron-forward" size={20} color="#007AFF" />
        </TouchableOpacity>
      </ScrollView>

      {/* Add Payment Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Add {selectedType === "bank" ? "Bank Account" : selectedType === "card" ? "Debit Card" : "PayPal"}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {selectedType === "bank" && (
                <>
                  <Text style={styles.inputLabel}>Bank Name</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter bank name"
                    placeholderTextColor="#8E8E93"
                  />
                  <Text style={styles.inputLabel}>Account Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter account number"
                    placeholderTextColor="#8E8E93"
                    keyboardType="numeric"
                  />
                  <Text style={styles.inputLabel}>Routing Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter routing number"
                    placeholderTextColor="#8E8E93"
                    keyboardType="numeric"
                  />
                </>
              )}

              {selectedType === "card" && (
                <>
                  <Text style={styles.inputLabel}>Card Number</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor="#8E8E93"
                    keyboardType="numeric"
                  />
                  <View style={styles.rowInputs}>
                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>Expiry Date</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="MM/YY"
                        placeholderTextColor="#8E8E93"
                      />
                    </View>
                    <View style={styles.halfInput}>
                      <Text style={styles.inputLabel}>CVV</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="123"
                        placeholderTextColor="#8E8E93"
                        keyboardType="numeric"
                        secureTextEntry
                      />
                    </View>
                  </View>
                </>
              )}

              {selectedType === "paypal" && (
                <>
                  <Text style={styles.inputLabel}>PayPal Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="your.email@example.com"
                    placeholderTextColor="#8E8E93"
                    keyboardType="email-address"
                  />
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSavePaymentMethod}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  earningsCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  earningsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  earningsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  earningsGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 16,
  },
  earningItem: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
  },
  earningLabel: {
    fontSize: 13,
    color: "#8E8E93",
    marginBottom: 4,
  },
  earningValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  payoutInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  payoutText: {
    flex: 1,
    fontSize: 13,
    color: "#8E8E93",
  },
  payoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#34C759",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    gap: 6,
  },
  payoutButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
  },
  paymentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  paymentHeader: {
    marginBottom: 12,
  },
  paymentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  defaultBadge: {
    backgroundColor: "#34C759",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#fff",
  },
  paymentDetails: {
    fontSize: 14,
    color: "#8E8E93",
  },
  paymentActions: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  removeButton: {
    borderColor: "#FF3B30",
  },
  removeButtonText: {
    fontSize: 14,
    color: "#FF3B30",
    fontWeight: "500",
  },
  addMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  addMethodIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addMethodInfo: {
    flex: 1,
  },
  addMethodName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 2,
  },
  addMethodDesc: {
    fontSize: 13,
    color: "#8E8E93",
  },
  infoCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  historyButtonText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  modalBody: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#000",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#8E8E93",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
