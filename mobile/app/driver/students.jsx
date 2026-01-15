import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../components/ui/SearchBar';
import { Card } from '../components/ui/Card';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export default function StudentsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSchool, setFilterSchool] = useState('all');

  // Mock data - replace with API calls
  const students = [
    {
      id: '1',
      name: 'Sahan Silva',
      grade: '7',
      school: 'Royal College',
      parentName: 'Kumari Silva',
      parentPhone: '+94 77 123 4567',
      pickupAddress: 'No 45, Galle Road, Colombo 05',
      pickupTime: '6:45 AM',
      dropoffTime: '2:15 PM',
      specialInstructions: 'Pickup from grandmother\'s house on Wednesdays',
      photo: null,
      status: 'active',
    },
    {
      id: '2',
      name: 'Amaya Fernando',
      grade: '5',
      school: 'Royal College',
      parentName: 'Nadeeka Fernando',
      parentPhone: '+94 77 234 5678',
      pickupAddress: 'No 12, Marine Drive, Bambalapitiya',
      pickupTime: '6:55 AM',
      dropoffTime: '2:15 PM',
      specialInstructions: null,
      photo: null,
      status: 'active',
    },
    {
      id: '3',
      name: 'Thisara Perera',
      grade: '8',
      school: 'Royal College',
      parentName: 'Kasun Perera',
      parentPhone: '+94 77 345 6789',
      pickupAddress: 'No 78, Station Road, Wellawatta',
      pickupTime: '7:05 AM',
      dropoffTime: '2:15 PM',
      specialInstructions: null,
      photo: null,
      status: 'active',
    },
  ];

  const schools = ['all', 'Royal College', 'Ladies College', 'St. Thomas College'];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSchool = filterSchool === 'all' || student.school === filterSchool;
    return matchesSearch && matchesSchool;
  });

  const renderStudent = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/driver/student-details?id=${item.id}`)}
    >
      <Card style={styles.studentCard}>
        <View style={styles.studentHeader}>
          <Avatar name={item.name} source={item.photo} size={48} />
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.name}</Text>
            <Text style={styles.studentGrade}>Grade {item.grade} • {item.school}</Text>
            <Text style={styles.parentInfo}>
              <Ionicons name="person" size={12} color="#6b7280" /> {item.parentName}
            </Text>
          </View>
          <Badge variant="success">Active</Badge>
        </View>

        <View style={styles.studentDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location" size={16} color="#6b7280" />
            <Text style={styles.detailText} numberOfLines={1}>{item.pickupAddress}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time" size={16} color="#6b7280" />
            <Text style={styles.detailText}>
              Pickup: {item.pickupTime} • Dropoff: {item.dropoffTime}
            </Text>
          </View>
          {item.specialInstructions && (
            <View style={styles.instructionsRow}>
              <Ionicons name="alert-circle" size={16} color="#f59e0b" />
              <Text style={styles.instructionsText}>{item.specialInstructions}</Text>
            </View>
          )}
        </View>

        <View style={styles.studentActions}>
          <Button 
            variant="outline" 
            size="small"
            style={styles.actionButton}
            onPress={() => router.push(`/messages/chat?id=${item.id}`)}
          >
            <Ionicons name="chatbubble-outline" size={16} color="#2563eb" />
            <Text style={styles.actionButtonText}>Message</Text>
          </Button>
          <Button 
            variant="outline" 
            size="small"
            style={styles.actionButton}
            onPress={() => {/* Call parent */}}
          >
            <Ionicons name="call-outline" size={16} color="#16a34a" />
            <Text style={styles.actionButtonText}>Call</Text>
          </Button>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Students</Text>
          <Badge variant="info">{filteredStudents.length} students</Badge>
        </View>
      </View>

      {/* Search and Filters */}
      <View style={styles.filtersContainer}>
        <SearchBar
          placeholder="Search students or parents..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          style={styles.searchBar}
        />

        <View style={styles.schoolFilters}>
          {schools.map((school) => (
            <TouchableOpacity
              key={school}
              style={[
                styles.filterChip,
                filterSchool === school && styles.filterChipActive
              ]}
              onPress={() => setFilterSchool(school)}
            >
              <Text style={[
                styles.filterChipText,
                filterSchool === school && styles.filterChipTextActive
              ]}>
                {school === 'all' ? 'All Schools' : school}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Students List */}
      <FlatList
        data={filteredStudents}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.studentsList}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={64} color="#d1d5db" />
            <Text style={styles.emptyStateText}>No students found</Text>
            <Text style={styles.emptyStateSubtext}>
              {searchQuery ? 'Try adjusting your search' : 'Students will appear here once they book your service'}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  filtersContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  searchBar: {
    marginBottom: 12,
  },
  schoolFilters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
  filterChipText: {
    fontSize: 13,
    color: '#6b7280',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  studentsList: {
    padding: 20,
  },
  studentCard: {
    marginBottom: 12,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  studentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  studentGrade: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  parentInfo: {
    fontSize: 13,
    color: '#9ca3af',
  },
  studentDetails: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
  },
  instructionsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 6,
    marginTop: 4,
  },
  instructionsText: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
  },
  studentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  actionButtonText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
