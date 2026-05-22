import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, TextInput, Modal } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { responsive, wp, hp } from "../utils/responsive";

export default function StudentManagement() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [showStudentDetails, setShowStudentDetails] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const students = [
        {
            id: 1,
            name: "Ashan Perera",
            grade: "Grade 10",
            school: "Royal College",
            pickupAddress: "45, Galle Road, Colombo 03",
            dropoffAddress: "Royal College, Colombo 07",
            pickupTime: "6:45 AM",
            parentName: "Mr. Perera",
            parentPhone: "+94 77 123 4567",
            status: "active",
            attendance: "95%",
            specialNotes: "Please call 5 minutes before arrival",
        },
        {
            id: 2,
            name: "Sithmi Fernando",
            grade: "Grade 8",
            school: "Royal College",
            pickupAddress: "12, Duplication Road, Colombo 04",
            dropoffAddress: "Royal College, Colombo 07",
            pickupTime: "6:50 AM",
            parentName: "Mrs. Fernando",
            parentPhone: "+94 76 234 5678",
            status: "active",
            attendance: "98%",
            specialNotes: "Pickup from grandmother's house on Wednesdays",
        },
        {
            id: 3,
            name: "Kavindu Silva",
            grade: "Grade 9",
            school: "Royal College",
            pickupAddress: "78, Baseline Road, Colombo 09",
            dropoffAddress: "Royal College, Colombo 07",
            pickupTime: "7:00 AM",
            parentName: "Mr. Silva",
            parentPhone: "+94 75 345 6789",
            status: "active",
            attendance: "92%",
            specialNotes: "",
        },
    ];

    const filteredStudents = students.filter(student => {
        const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.parentName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = selectedFilter === "all" || student.status === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    const openStudentDetails = (student) => {
        setSelectedStudent(student);
        setShowStudentDetails(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Student Management</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Ionicons name="person-add" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={20} color="#8E8E93" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search students or parents..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#8E8E93"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={20} color="#8E8E93" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Filter Tabs */}
            <View style={styles.filterContainer}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                        style={[styles.filterButton, selectedFilter === "all" && styles.filterButtonActive]}
                        onPress={() => setSelectedFilter("all")}
                    >
                        <Text style={[styles.filterText, selectedFilter === "all" && styles.filterTextActive]}>
                            All ({students.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, selectedFilter === "active" && styles.filterButtonActive]}
                        onPress={() => setSelectedFilter("active")}
                    >
                        <Text style={[styles.filterText, selectedFilter === "active" && styles.filterTextActive]}>
                            Active
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.filterButton, selectedFilter === "absent" && styles.filterButtonActive]}
                        onPress={() => setSelectedFilter("absent")}
                    >
                        <Text style={[styles.filterText, selectedFilter === "absent" && styles.filterTextActive]}>
                            Absent Today
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Student List */}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {filteredStudents.map((student) => (
                        <TouchableOpacity
                            key={student.id}
                            style={styles.studentCard}
                            onPress={() => openStudentDetails(student)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.studentHeader}>
                                <View style={styles.avatarContainer}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
                                    </View>
                                    <View style={[styles.statusDot, student.status === "active" && styles.statusDotActive]} />
                                </View>

                                <View style={styles.studentInfo}>
                                    <Text style={styles.studentName}>{student.name}</Text>
                                    <Text style={styles.studentGrade}>{student.grade} • {student.school}</Text>
                                    <View style={styles.pickupInfo}>
                                        <Ionicons name="time-outline" size={14} color="#8E8E93" />
                                        <Text style={styles.pickupTime}>{student.pickupTime}</Text>
                                    </View>
                                </View>

                                <View style={styles.studentActions}>
                                    <TouchableOpacity style={styles.iconButton}>
                                        <Ionicons name="call" size={20} color="#007AFF" />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.iconButton}>
                                        <Ionicons name="chatbubble" size={20} color="#007AFF" />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.studentDetails}>
                                <View style={styles.detailRow}>
                                    <Ionicons name="location" size={16} color="#8E8E93" />
                                    <Text style={styles.detailText} numberOfLines={1}>{student.pickupAddress}</Text>
                                </View>
                                <View style={styles.detailRow}>
                                    <Ionicons name="person" size={16} color="#8E8E93" />
                                    <Text style={styles.detailText}>{student.parentName} • {student.parentPhone}</Text>
                                </View>
                            </View>

                            <View style={styles.studentFooter}>
                                <View style={styles.attendanceBadge}>
                                    <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                                    <Text style={styles.attendanceText}>Attendance: {student.attendance}</Text>
                                </View>
                                <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Student Details Modal */}
            <Modal
                visible={showStudentDetails}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowStudentDetails(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Student Details</Text>
                            <TouchableOpacity onPress={() => setShowStudentDetails(false)}>
                                <Ionicons name="close" size={28} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedStudent && (
                                <>
                                    <View style={styles.modalStudentHeader}>
                                        <View style={styles.modalAvatar}>
                                            <Text style={styles.modalAvatarText}>{selectedStudent.name.charAt(0)}</Text>
                                        </View>
                                        <Text style={styles.modalStudentName}>{selectedStudent.name}</Text>
                                        <Text style={styles.modalStudentGrade}>{selectedStudent.grade}</Text>
                                    </View>

                                    <View style={styles.infoSection}>
                                        <Text style={styles.infoSectionTitle}>School Information</Text>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoLabel}>School</Text>
                                            <Text style={styles.infoValue}>{selectedStudent.school}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoLabel}>Grade</Text>
                                            <Text style={styles.infoValue}>{selectedStudent.grade}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.infoSection}>
                                        <Text style={styles.infoSectionTitle}>Pickup & Drop-off</Text>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoLabel}>Pickup Location</Text>
                                            <Text style={styles.infoValue}>{selectedStudent.pickupAddress}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoLabel}>Pickup Time</Text>
                                            <Text style={styles.infoValue}>{selectedStudent.pickupTime}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoLabel}>Drop-off Location</Text>
                                            <Text style={styles.infoValue}>{selectedStudent.dropoffAddress}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.infoSection}>
                                        <Text style={styles.infoSectionTitle}>Parent/Guardian</Text>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoLabel}>Name</Text>
                                            <Text style={styles.infoValue}>{selectedStudent.parentName}</Text>
                                        </View>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoLabel}>Phone</Text>
                                            <Text style={styles.infoValue}>{selectedStudent.parentPhone}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.infoSection}>
                                        <Text style={styles.infoSectionTitle}>Performance</Text>
                                        <View style={styles.infoItem}>
                                            <Text style={styles.infoLabel}>Attendance Rate</Text>
                                            <Text style={[styles.infoValue, { color: "#34C759" }]}>{selectedStudent.attendance}</Text>
                                        </View>
                                    </View>

                                    {selectedStudent.specialNotes && (
                                        <View style={styles.infoSection}>
                                            <Text style={styles.infoSectionTitle}>Special Notes</Text>
                                            <View style={styles.notesCard}>
                                                <Ionicons name="information-circle" size={20} color="#FF9500" />
                                                <Text style={styles.notesText}>{selectedStudent.specialNotes}</Text>
                                            </View>
                                        </View>
                                    )}

                                    <View style={styles.modalActions}>
                                        <TouchableOpacity style={styles.modalActionButton}>
                                            <Ionicons name="call" size={20} color="#fff" />
                                            <Text style={styles.modalActionText}>Call Parent</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={[styles.modalActionButton, styles.modalActionButtonSecondary]}>
                                            <Ionicons name="chatbubble" size={20} color="#007AFF" />
                                            <Text style={[styles.modalActionText, { color: "#007AFF" }]}>Message</Text>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )}
                        </ScrollView>
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
        justifyContent: "space-between",
        alignItems: "center",
        padding: responsive.paddingLG,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5EA",
    },
    backButton: {
        padding: responsive.paddingSM,
    },
    headerTitle: {
        fontSize: responsive.fontXL,
        fontWeight: "bold",
        color: "#000",
    },
    addButton: {
        padding: responsive.paddingSM,
    },
    searchContainer: {
        padding: responsive.paddingLG,
        backgroundColor: "#fff",
    },
    searchBar: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F7",
        borderRadius: responsive.radiusMD,
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingSM,
    },
    searchInput: {
        flex: 1,
        fontSize: responsive.fontLG,
        color: "#000",
        marginLeft: responsive.paddingSM,
    },
    filterContainer: {
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingMD,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5EA",
    },
    filterButton: {
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingSM,
        borderRadius: responsive.radiusFull,
        backgroundColor: "#F2F2F7",
        marginRight: responsive.paddingSM,
    },
    filterButtonActive: {
        backgroundColor: "#007AFF",
    },
    filterText: {
        fontSize: responsive.fontMD,
        color: "#8E8E93",
        fontWeight: "500",
    },
    filterTextActive: {
        color: "#fff",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: responsive.paddingLG,
    },
    studentCard: {
        backgroundColor: "#fff",
        borderRadius: responsive.radiusLG,
        padding: responsive.paddingLG,
        marginBottom: responsive.paddingMD,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    studentHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: responsive.paddingMD,
    },
    avatarContainer: {
        position: "relative",
        marginRight: responsive.paddingMD,
    },
    avatar: {
        width: wp(56),
        height: wp(56),
        borderRadius: wp(28),
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarText: {
        fontSize: responsive.font2XL,
        fontWeight: "bold",
        color: "#fff",
    },
    statusDot: {
        position: "absolute",
        bottom: 2,
        right: 2,
        width: wp(14),
        height: wp(14),
        borderRadius: wp(7),
        backgroundColor: "#8E8E93",
        borderWidth: 2,
        borderColor: "#fff",
    },
    statusDotActive: {
        backgroundColor: "#34C759",
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#000",
        marginBottom: 2,
    },
    studentGrade: {
        fontSize: responsive.fontMD,
        color: "#8E8E93",
        marginBottom: responsive.paddingXS,
    },
    pickupInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    pickupTime: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
    },
    studentActions: {
        flexDirection: "row",
        gap: responsive.paddingSM,
    },
    iconButton: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
    },
    studentDetails: {
        marginBottom: responsive.paddingMD,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: responsive.paddingSM,
        gap: responsive.paddingSM,
    },
    detailText: {
        flex: 1,
        fontSize: responsive.fontSM,
        color: "#8E8E93",
    },
    studentFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: responsive.paddingMD,
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
    },
    attendanceBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    attendanceText: {
        fontSize: responsive.fontSM,
        color: "#34C759",
        fontWeight: "500",
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "flex-end",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderTopLeftRadius: responsive.radiusXL,
        borderTopRightRadius: responsive.radiusXL,
        padding: responsive.paddingXL,
        maxHeight: "90%",
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: responsive.paddingXL,
    },
    modalTitle: {
        fontSize: responsive.font2XL,
        fontWeight: "bold",
        color: "#000",
    },
    modalStudentHeader: {
        alignItems: "center",
        marginBottom: responsive.paddingXL,
    },
    modalAvatar: {
        width: wp(80),
        height: wp(80),
        borderRadius: wp(40),
        backgroundColor: "#007AFF",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: responsive.paddingMD,
    },
    modalAvatarText: {
        fontSize: responsive.font3XL,
        fontWeight: "bold",
        color: "#fff",
    },
    modalStudentName: {
        fontSize: responsive.font2XL,
        fontWeight: "bold",
        color: "#000",
        marginBottom: responsive.paddingXS,
    },
    modalStudentGrade: {
        fontSize: responsive.fontLG,
        color: "#8E8E93",
    },
    infoSection: {
        marginBottom: responsive.paddingXL,
    },
    infoSectionTitle: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#000",
        marginBottom: responsive.paddingMD,
    },
    infoItem: {
        marginBottom: responsive.paddingMD,
    },
    infoLabel: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
        marginBottom: 4,
    },
    infoValue: {
        fontSize: responsive.fontLG,
        color: "#000",
    },
    notesCard: {
        flexDirection: "row",
        backgroundColor: "#FFF3E0",
        padding: responsive.paddingMD,
        borderRadius: responsive.radiusMD,
        gap: responsive.paddingMD,
    },
    notesText: {
        flex: 1,
        fontSize: responsive.fontMD,
        color: "#FF9500",
    },
    modalActions: {
        flexDirection: "row",
        gap: responsive.paddingMD,
        marginTop: responsive.paddingLG,
    },
    modalActionButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#007AFF",
        padding: responsive.paddingLG,
        borderRadius: responsive.radiusMD,
        justifyContent: "center",
        alignItems: "center",
        gap: responsive.paddingSM,
    },
    modalActionButtonSecondary: {
        backgroundColor: "#F2F2F7",
    },
    modalActionText: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#fff",
    },
});
