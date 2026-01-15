import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView,
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RoleSelectionScreen() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState(null);

  const handleContinue = () => {
    if (selectedRole === 'parent') {
      router.push('/login/login?role=parent');
    } else if (selectedRole === 'driver') {
      router.push('/login/login?role=driver');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo and Title */}
        <View style={styles.header}>
          <Text style={styles.logo}>🚌</Text>
          <Text style={styles.title}>Edu-Ride</Text>
          <Text style={styles.subtitle}>Safe Rides to School Transport</Text>
        </View>

        {/* Role Selection */}
        <View style={styles.rolesContainer}>
          <Text style={styles.question}>Who are you?</Text>

          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'parent' && styles.roleCardSelected
            ]}
            onPress={() => setSelectedRole('parent')}
            activeOpacity={0.7}
          >
            <View style={styles.roleIcon}>
              <Ionicons 
                name="people" 
                size={40} 
                color={selectedRole === 'parent' ? '#2563eb' : '#6b7280'} 
              />
            </View>
            <Text style={[
              styles.roleTitle,
              selectedRole === 'parent' && styles.roleTextSelected
            ]}>
              I'm a Parent
            </Text>
            <Text style={styles.roleDescription}>
              Find safe and reliable school bus services for my children
            </Text>
            {selectedRole === 'parent' && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleCard,
              selectedRole === 'driver' && styles.roleCardSelected
            ]}
            onPress={() => setSelectedRole('driver')}
            activeOpacity={0.7}
          >
            <View style={styles.roleIcon}>
              <Ionicons 
                name="bus" 
                size={40} 
                color={selectedRole === 'driver' ? '#2563eb' : '#6b7280'} 
              />
            </View>
            <Text style={[
              styles.roleTitle,
              selectedRole === 'driver' && styles.roleTextSelected
            ]}>
              I'm a Driver
            </Text>
            <Text style={styles.roleDescription}>
              Provide school transportation services and manage my business
            </Text>
            {selectedRole === 'driver' && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedRole && styles.continueButtonDisabled
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  rolesContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: -60,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 32,
  },
  roleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    position: 'relative',
  },
  roleCardSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  roleTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  roleTextSelected: {
    color: '#2563eb',
  },
  roleDescription: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  continueButton: {
    backgroundColor: '#2563eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  continueButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});
