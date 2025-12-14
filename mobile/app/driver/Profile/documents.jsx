import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function DriverDocuments() {
  const router = useRouter();

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Driver's License",
      status: "verified",
      expiryDate: "2026-08-15",
      uploadedDate: "2024-01-10",
      icon: "card-outline",
      color: "#34C759",
    },
    {
      id: 2,
      name: "Vehicle Registration",
      status: "verified",
      expiryDate: "2025-12-31",
      uploadedDate: "2024-01-10",
      icon: "document-text-outline",
      color: "#34C759",
    },
    {
      id: 3,
      name: "Insurance Certificate",
      status: "pending",
      expiryDate: "2025-06-30",
      uploadedDate: "2024-12-10",
      icon: "shield-checkmark-outline",
      color: "#FF9500",
    },
    {
      id: 4,
      name: "Vehicle Inspection",
      status: "expired",
      expiryDate: "2024-11-20",
      uploadedDate: "2023-11-15",
      icon: "checkmark-done-outline",
      color: "#FF3B30",
    },
    {
      id: 5,
      name: "Background Check",
      status: "verified",
      expiryDate: "2026-03-01",
      uploadedDate: "2024-03-01",
      icon: "finger-print-outline",
      color: "#34C759",
    },
    {
      id: 6,
      name: "Profile Photo",
      status: "verified",
      expiryDate: "N/A",
      uploadedDate: "2024-01-10",
      icon: "camera-outline",
      color: "#34C759",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "#34C759";
      case "pending":
        return "#FF9500";
      case "expired":
        return "#FF3B30";
      default:
        return "#8E8E93";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending Review";
      case "expired":
        return "Expired";
      default:
        return "Not Uploaded";
    }
  };

  const handleUpload = (documentName) => {
    Alert.alert(
      "Upload Document",
      `Select how you want to upload ${documentName}`,
      [
        { text: "Take Photo", onPress: () => console.log("Camera opened") },
        { text: "Choose from Gallery", onPress: () => console.log("Gallery opened") },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleView = (documentName) => {
    Alert.alert("View Document", `Opening ${documentName}...`);
  };

  const formatDate = (dateString) => {
    if (dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "numeric" 
    });
  };

  const isExpiringSoon = (expiryDate) => {
    if (expiryDate === "N/A") return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            Keep your documents up to date to continue driving
          </Text>
        </View>

        {/* Documents Stats */}
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {documents.filter(d => d.status === "verified").length}
            </Text>
            <Text style={styles.statLabel}>Verified</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {documents.filter(d => d.status === "pending").length}
            </Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {documents.filter(d => d.status === "expired").length}
            </Text>
            <Text style={styles.statLabel}>Expired</Text>
          </View>
        </View>

        {/* Documents List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Documents</Text>
          
          {documents.map((doc) => (
            <View key={doc.id} style={styles.documentCard}>
              <View style={styles.documentHeader}>
                <View style={styles.documentLeft}>
                  <View style={[styles.documentIcon, { backgroundColor: `${doc.color}15` }]}>
                    <Ionicons name={doc.icon} size={24} color={doc.color} />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentName}>{doc.name}</Text>
                    <View style={styles.statusContainer}>
                      <View style={[styles.statusDot, { backgroundColor: getStatusColor(doc.status) }]} />
                      <Text style={[styles.statusText, { color: getStatusColor(doc.status) }]}>
                        {getStatusText(doc.status)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.documentDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Uploaded:</Text>
                  <Text style={styles.detailValue}>{formatDate(doc.uploadedDate)}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Expires:</Text>
                  <Text style={[
                    styles.detailValue,
                    isExpiringSoon(doc.expiryDate) && styles.expiringText
                  ]}>
                    {formatDate(doc.expiryDate)}
                    {isExpiringSoon(doc.expiryDate) && " (Expiring Soon)"}
                  </Text>
                </View>
              </View>

              <View style={styles.documentActions}>
                {doc.status === "expired" ? (
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.uploadButton]}
                    onPress={() => handleUpload(doc.name)}
                  >
                    <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
                    <Text style={styles.uploadButtonText}>Re-upload</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleView(doc.name)}
                    >
                      <Ionicons name="eye-outline" size={18} color="#007AFF" />
                      <Text style={styles.actionButtonText}>View</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleUpload(doc.name)}
                    >
                      <Ionicons name="cloud-upload-outline" size={18} color="#007AFF" />
                      <Text style={styles.actionButtonText}>Update</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>

        {/* Requirements Info */}
        <View style={styles.requirementsCard}>
          <Text style={styles.requirementsTitle}>Document Requirements</Text>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.requirementText}>All documents must be clear and readable</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.requirementText}>Documents should not be expired</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.requirementText}>Update documents 30 days before expiry</Text>
          </View>
          <View style={styles.requirementItem}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.requirementText}>Verification usually takes 24-48 hours</Text>
          </View>
        </View>

        {/* Help Button */}
        <TouchableOpacity style={styles.helpButton}>
          <Ionicons name="help-circle-outline" size={20} color="#007AFF" />
          <Text style={styles.helpButtonText}>Need help with documents?</Text>
        </TouchableOpacity>
      </ScrollView>
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
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#007AFF",
    lineHeight: 20,
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#8E8E93",
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#E5E5EA",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  documentCard: {
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
  documentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  documentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "500",
  },
  documentDetails: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  detailValue: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  expiringText: {
    color: "#FF9500",
  },
  documentActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
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
  uploadButton: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
  },
  uploadButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  requirementsCard: {
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
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: "#3C3C43",
    lineHeight: 20,
  },
  helpButton: {
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
  helpButtonText: {
    fontSize: 15,
    color: "#007AFF",
    fontWeight: "500",
  },
});
