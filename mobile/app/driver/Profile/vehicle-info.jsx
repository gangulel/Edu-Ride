import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function VehicleInformation() {
  const router = useRouter();

  // Vehicle state
  const [vehicleData, setVehicleData] = useState({
    make: "Toyota",
    model: "Camry",
    year: "2022",
    color: "Silver",
    licensePlate: "ABC-1234",
    vin: "1HGBH41JXMN109186",
    registrationExpiry: "2025-12-31",
    insuranceProvider: "State Farm Insurance",
    insurancePolicy: "SF-123456789",
    insuranceExpiry: "2025-12-31",
    capacity: "4",
    vehicleType: "Sedan",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setVehicleData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!vehicleData.make.trim()) {
      newErrors.make = "Vehicle make is required";
    }

    if (!vehicleData.model.trim()) {
      newErrors.model = "Vehicle model is required";
    }

    if (!vehicleData.year.trim()) {
      newErrors.year = "Year is required";
    } else if (!/^\d{4}$/.test(vehicleData.year)) {
      newErrors.year = "Please enter a valid year";
    }

    if (!vehicleData.licensePlate.trim()) {
      newErrors.licensePlate = "License plate is required";
    }

    if (!vehicleData.vin.trim()) {
      newErrors.vin = "VIN is required";
    }

    if (!vehicleData.capacity.trim()) {
      newErrors.capacity = "Passenger capacity is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, make API call to update vehicle information
      // await updateVehicleInfo(vehicleData);

      Alert.alert("Success", "Vehicle information updated successfully");
      setIsEditing(false);
    } catch (error) {
      Alert.alert("Error", "Failed to update vehicle information. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data if needed
    setIsEditing(false);
    setErrors({});
  };

  const renderField = (label, field, placeholder, keyboardType = "default", multiline = false) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.fieldLabel}>{label}</Text>
        {isEditing ? (
          <>
            <TextInput
              style={[styles.input, errors[field] && styles.inputError, multiline && styles.inputMultiline]}
              value={vehicleData[field]}
              onChangeText={(value) => handleInputChange(field, value)}
              placeholder={placeholder}
              keyboardType={keyboardType}
              multiline={multiline}
              editable={!isLoading}
            />
            {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
          </>
        ) : (
          <Text style={styles.fieldValue}>{vehicleData[field] || "Not provided"}</Text>
        )}
      </View>
    );
  };

  const getStatusColor = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "#FF3B30"; // Expired - Red
    if (daysUntilExpiry < 30) return "#FF9500"; // Expiring soon - Orange
    return "#34C759"; // Valid - Green
  };

  const getStatusText = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.floor((expiry - today) / (1000 * 60 * 60 * 24));

    if (daysUntilExpiry < 0) return "Expired";
    if (daysUntilExpiry < 30) return `Expires in ${daysUntilExpiry} days`;
    return "Valid";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vehicle Information</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Vehicle Image Placeholder */}
        <View style={styles.vehicleImageContainer}>
          <View style={styles.vehicleImagePlaceholder}>
            <Ionicons name="car-sport" size={64} color="#007AFF" />
            <Text style={styles.vehicleImageText}>
              {vehicleData.year} {vehicleData.make} {vehicleData.model}
            </Text>
            {isEditing && (
              <TouchableOpacity style={styles.uploadButton}>
                <Ionicons name="camera" size={20} color="#007AFF" />
                <Text style={styles.uploadButtonText}>Upload Photo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Status Cards */}
        <View style={styles.statusSection}>
          <View style={[styles.statusCard, { borderLeftColor: getStatusColor(vehicleData.registrationExpiry) }]}>
            <View style={styles.statusHeader}>
              <Ionicons name="document-text" size={24} color={getStatusColor(vehicleData.registrationExpiry)} />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>Registration</Text>
                <Text style={[styles.statusBadge, { color: getStatusColor(vehicleData.registrationExpiry) }]}>
                  {getStatusText(vehicleData.registrationExpiry)}
                </Text>
              </View>
            </View>
            <Text style={styles.statusDate}>Expires: {vehicleData.registrationExpiry}</Text>
          </View>

          <View style={[styles.statusCard, { borderLeftColor: getStatusColor(vehicleData.insuranceExpiry) }]}>
            <View style={styles.statusHeader}>
              <Ionicons name="shield-checkmark" size={24} color={getStatusColor(vehicleData.insuranceExpiry)} />
              <View style={styles.statusTextContainer}>
                <Text style={styles.statusTitle}>Insurance</Text>
                <Text style={[styles.statusBadge, { color: getStatusColor(vehicleData.insuranceExpiry) }]}>
                  {getStatusText(vehicleData.insuranceExpiry)}
                </Text>
              </View>
            </View>
            <Text style={styles.statusDate}>Expires: {vehicleData.insuranceExpiry}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Ionicons name="pencil" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Information</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActionsContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
                onPress={handleCancel}
                disabled={isLoading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, isLoading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={isLoading}
              >
                <Text style={styles.saveButtonText}>{isLoading ? "Saving..." : "Save Changes"}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Vehicle Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>
          {renderField("Make", "make", "e.g., Toyota")}
          {renderField("Model", "model", "e.g., Camry")}
          {renderField("Year", "year", "e.g., 2022", "numeric")}
          {renderField("Color", "color", "e.g., Silver")}
          {renderField("License Plate", "licensePlate", "e.g., ABC-1234")}
          {renderField("VIN", "vin", "Vehicle Identification Number")}
          {renderField("Passenger Capacity", "capacity", "e.g., 4", "numeric")}
          {renderField("Vehicle Type", "vehicleType", "e.g., Sedan, SUV, Van")}
        </View>

        {/* Registration Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Registration</Text>
          {renderField("Expiry Date", "registrationExpiry", "YYYY-MM-DD")}
        </View>

        {/* Insurance Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insurance</Text>
          {renderField("Insurance Provider", "insuranceProvider", "e.g., State Farm")}
          {renderField("Policy Number", "insurancePolicy", "e.g., SF-123456789")}
          {renderField("Expiry Date", "insuranceExpiry", "YYYY-MM-DD")}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  vehicleImageContainer: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  vehicleImagePlaceholder: {
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#E5E5EA",
    borderStyle: "dashed",
  },
  vehicleImageText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginTop: 12,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  uploadButtonText: {
    marginLeft: 8,
    color: "#007AFF",
    fontWeight: "600",
  },
  statusSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statusCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  statusBadge: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusDate: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 36,
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  fieldValue: {
    fontSize: 16,
    color: "#000",
    paddingVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#000",
  },
  inputError: {
    borderColor: "#FF3B30",
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: "top",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 4,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  editButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  editActionsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
