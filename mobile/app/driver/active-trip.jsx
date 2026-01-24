import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { responsive, wp, hp } from "../utils/responsive";

export default function ActiveTrip() {
    const router = useRouter();
    const [tripStatus, setTripStatus] = useState("in-progress"); // "not-started", "in-progress", "completed"
    const [currentStop, setCurrentStop] = useState(1);

    const [students, setStudents] = useState([
        {
            id: 1,
            name: "Ashan Perera",
            pickup: "45, Galle Road, Colombo 03",
            pickupTime: "6:45 AM",
            status: "picked-up", // "waiting", "picked-up", "dropped-off"
            parentPhone: "+94 77 123 4567",
        },
        {
            id: 2,
            name: "Sithmi Fernando",
            pickup: "12, Duplication Road, Colombo 04",
            pickupTime: "6:50 AM",
            status: "picked-up",
            parentPhone: "+94 76 234 5678",
        },
        {
            id: 3,
            name: "Kavindu Silva",
            pickup: "78, Baseline Road, Colombo 09",
            pickupTime: "7:00 AM",
            status: "waiting",
            parentPhone: "+94 75 345 6789",
        },
        {
            id: 4,
            name: "Nethmi Wickramasinghe",
            pickup: "23, Green Path, Colombo 07",
            pickupTime: "7:10 AM",
            status: "waiting",
            parentPhone: "+94 74 456 7890",
        },
    ]);

    const toggleStudentStatus = (id) => {
        setStudents(students.map(student => {
            if (student.id === id) {
                const newStatus = student.status === "waiting" ? "picked-up" :
                    student.status === "picked-up" ? "dropped-off" : "waiting";
                return { ...student, status: newStatus };
            }
            return student;
        }));
    };

    const pickedUpCount = students.filter(s => s.status === "picked-up" || s.status === "dropped-off").length;
    const totalStudents = students.length;

    const startTrip = () => {
        setTripStatus("in-progress");
    };

    const endTrip = () => {
        setTripStatus("completed");
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Morning Trip</Text>
                    <Text style={styles.headerSubtitle}>Royal College Route</Text>
                </View>
                <TouchableOpacity style={styles.emergencyButton}>
                    <Ionicons name="warning" size={24} color="#FF3B30" />
                </TouchableOpacity>
            </View>

            {/* Trip Stats */}
            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Ionicons name="people" size={24} color="#007AFF" />
                    <Text style={styles.statValue}>{pickedUpCount}/{totalStudents}</Text>
                    <Text style={styles.statLabel}>Students</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="time" size={24} color="#34C759" />
                    <Text style={styles.statValue}>25m</Text>
                    <Text style={styles.statLabel}>Duration</Text>
                </View>
                <View style={styles.statCard}>
                    <Ionicons name="navigate" size={24} color="#FF9500" />
                    <Text style={styles.statValue}>4.2 km</Text>
                    <Text style={styles.statLabel}>Distance</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressTitle}>Trip Progress</Text>
                    <Text style={styles.progressPercentage}>{Math.round((pickedUpCount / totalStudents) * 100)}%</Text>
                </View>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${(pickedUpCount / totalStudents) * 100}%` }]} />
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Student Checklist */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Student Checklist</Text>

                        {students.map((student, index) => (
                            <View key={student.id} style={styles.studentCard}>
                                <View style={styles.studentRow}>
                                    <View style={styles.studentNumber}>
                                        <Text style={styles.studentNumberText}>{index + 1}</Text>
                                    </View>

                                    <View style={styles.studentInfo}>
                                        <Text style={styles.studentName}>{student.name}</Text>
                                        <View style={styles.locationRow}>
                                            <Ionicons name="location" size={14} color="#8E8E93" />
                                            <Text style={styles.locationText} numberOfLines={1}>{student.pickup}</Text>
                                        </View>
                                        <View style={styles.timeRow}>
                                            <Ionicons name="time" size={14} color="#8E8E93" />
                                            <Text style={styles.timeText}>{student.pickupTime}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.studentActions}>
                                        <TouchableOpacity
                                            style={[
                                                styles.statusButton,
                                                student.status === "picked-up" && styles.statusButtonPickedUp,
                                                student.status === "dropped-off" && styles.statusButtonDropped
                                            ]}
                                            onPress={() => toggleStudentStatus(student.id)}
                                        >
                                            <Ionicons
                                                name={
                                                    student.status === "waiting" ? "ellipse-outline" :
                                                        student.status === "picked-up" ? "checkmark-circle" :
                                                            "checkmark-done-circle"
                                                }
                                                size={24}
                                                color={
                                                    student.status === "waiting" ? "#8E8E93" :
                                                        student.status === "picked-up" ? "#34C759" :
                                                            "#007AFF"
                                                }
                                            />
                                        </TouchableOpacity>

                                        <TouchableOpacity style={styles.callButton}>
                                            <Ionicons name="call" size={18} color="#007AFF" />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                {student.status !== "waiting" && (
                                    <View style={[
                                        styles.statusBadge,
                                        student.status === "picked-up" && styles.statusBadgePickedUp,
                                        student.status === "dropped-off" && styles.statusBadgeDropped
                                    ]}>
                                        <Ionicons
                                            name={student.status === "picked-up" ? "checkmark" : "checkmark-done"}
                                            size={14}
                                            color={student.status === "picked-up" ? "#34C759" : "#007AFF"}
                                        />
                                        <Text style={[
                                            styles.statusBadgeText,
                                            student.status === "picked-up" && styles.statusBadgeTextPickedUp,
                                            student.status === "dropped-off" && styles.statusBadgeTextDropped
                                        ]}>
                                            {student.status === "picked-up" ? "Picked Up" : "Dropped Off"}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Quick Actions */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Quick Actions</Text>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="navigation" size={22} color="#007AFF" />
                            <Text style={styles.actionButtonText}>Open Navigation</Text>
                            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="megaphone" size={22} color="#FF9500" />
                            <Text style={styles.actionButtonText}>Send Broadcast Message</Text>
                            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton}>
                            <Ionicons name="alert-circle" size={22} color="#FF3B30" />
                            <Text style={styles.actionButtonText}>Report Issue</Text>
                            <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Bottom Action Button */}
            <View style={styles.bottomActions}>
                {tripStatus === "not-started" ? (
                    <TouchableOpacity style={styles.startTripButton} onPress={startTrip}>
                        <Ionicons name="play-circle" size={24} color="#fff" />
                        <Text style={styles.startTripButtonText}>Start Trip</Text>
                    </TouchableOpacity>
                ) : tripStatus === "in-progress" ? (
                    <TouchableOpacity style={styles.endTripButton} onPress={endTrip}>
                        <Ionicons name="checkmark-circle" size={24} color="#fff" />
                        <Text style={styles.endTripButtonText}>End Trip</Text>
                    </TouchableOpacity>
                ) : null}
            </View>
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
    headerCenter: {
        flex: 1,
        alignItems: "center",
    },
    headerTitle: {
        fontSize: responsive.fontXL,
        fontWeight: "bold",
        color: "#000",
    },
    headerSubtitle: {
        fontSize: responsive.fontMD,
        color: "#8E8E93",
        marginTop: 2,
    },
    emergencyButton: {
        padding: responsive.paddingSM,
    },
    statsContainer: {
        flexDirection: "row",
        padding: responsive.paddingLG,
        gap: responsive.paddingMD,
        backgroundColor: "#fff",
    },
    statCard: {
        flex: 1,
        backgroundColor: "#F2F2F7",
        borderRadius: responsive.radiusLG,
        padding: responsive.paddingMD,
        alignItems: "center",
    },
    statValue: {
        fontSize: responsive.fontXL,
        fontWeight: "bold",
        color: "#000",
        marginTop: responsive.paddingSM,
    },
    statLabel: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
        marginTop: 2,
    },
    progressSection: {
        backgroundColor: "#fff",
        padding: responsive.paddingLG,
        borderBottomWidth: 1,
        borderBottomColor: "#E5E5EA",
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: responsive.paddingSM,
    },
    progressTitle: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#000",
    },
    progressPercentage: {
        fontSize: responsive.fontLG,
        fontWeight: "bold",
        color: "#007AFF",
    },
    progressBarContainer: {
        height: hp(8),
        backgroundColor: "#E5E5EA",
        borderRadius: responsive.radiusSM,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        backgroundColor: "#34C759",
        borderRadius: responsive.radiusSM,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: responsive.paddingLG,
    },
    section: {
        marginTop: responsive.paddingLG,
    },
    sectionTitle: {
        fontSize: responsive.fontXL,
        fontWeight: "600",
        color: "#000",
        marginBottom: responsive.paddingMD,
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
    studentRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    studentNumber: {
        width: wp(32),
        height: wp(32),
        borderRadius: wp(16),
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
        marginRight: responsive.paddingMD,
    },
    studentNumberText: {
        fontSize: responsive.fontLG,
        fontWeight: "bold",
        color: "#007AFF",
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    locationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginBottom: 2,
    },
    locationText: {
        flex: 1,
        fontSize: responsive.fontSM,
        color: "#8E8E93",
    },
    timeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    timeText: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
    },
    studentActions: {
        flexDirection: "row",
        gap: responsive.paddingSM,
        alignItems: "center",
    },
    statusButton: {
        width: wp(44),
        height: wp(44),
        borderRadius: wp(22),
        backgroundColor: "#F2F2F7",
        justifyContent: "center",
        alignItems: "center",
    },
    statusButtonPickedUp: {
        backgroundColor: "#E8F5E9",
    },
    statusButtonDropped: {
        backgroundColor: "#E3F2FD",
    },
    callButton: {
        width: wp(36),
        height: wp(36),
        borderRadius: wp(18),
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
    },
    statusBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: responsive.paddingMD,
        paddingTop: responsive.paddingMD,
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
    },
    statusBadgePickedUp: {
        borderTopColor: "#C8E6C9",
    },
    statusBadgeDropped: {
        borderTopColor: "#BBDEFB",
    },
    statusBadgeText: {
        fontSize: responsive.fontSM,
        fontWeight: "600",
        color: "#8E8E93",
    },
    statusBadgeTextPickedUp: {
        color: "#34C759",
    },
    statusBadgeTextDropped: {
        color: "#007AFF",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
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
    actionButtonText: {
        flex: 1,
        fontSize: responsive.fontLG,
        color: "#000",
        marginLeft: responsive.paddingMD,
    },
    bottomActions: {
        backgroundColor: "#fff",
        padding: responsive.paddingLG,
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
    },
    startTripButton: {
        flexDirection: "row",
        backgroundColor: "#34C759",
        padding: responsive.paddingLG,
        borderRadius: responsive.radiusMD,
        justifyContent: "center",
        alignItems: "center",
        gap: responsive.paddingSM,
    },
    startTripButtonText: {
        fontSize: responsive.fontXL,
        fontWeight: "600",
        color: "#fff",
    },
    endTripButton: {
        flexDirection: "row",
        backgroundColor: "#007AFF",
        padding: responsive.paddingLG,
        borderRadius: responsive.radiusMD,
        justifyContent: "center",
        alignItems: "center",
        gap: responsive.paddingSM,
    },
    endTripButtonText: {
        fontSize: responsive.fontXL,
        fontWeight: "600",
        color: "#fff",
    },
});
