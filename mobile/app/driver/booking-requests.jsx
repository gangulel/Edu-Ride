import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { responsive, wp, hp } from "../utils/responsive";

export default function BookingRequests() {
    const router = useRouter();
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState("");
    const [requestMessage, setRequestMessage] = useState("");

    const [requests, setRequests] = useState([
        {
            id: 1,
            parentName: "Mrs. Jayawardena",
            childName: "Nimesh Jayawardena",
            grade: "Grade 11",
            school: "Royal College",
            pickupAddress: "23, Flower Road, Colombo 07",
            dropoffAddress: "Royal College, Colombo 07",
            requestedDate: "2026-02-01",
            monthlyFee: "LKR 8,500",
            parentPhone: "+94 77 888 9999",
            specialInstructions: "Please honk twice when arriving",
            status: "pending",
            requestedOn: "2 hours ago",
        },
        {
            id: 2,
            parentName: "Mr. de Silva",
            childName: "Kaveesha de Silva",
            grade: "Grade 9",
            school: "Royal College",
            pickupAddress: "15, Green Path, Colombo 03",
            dropoffAddress: "Royal College, Colombo 07",
            requestedDate: "2026-02-05",
            monthlyFee: "LKR 9,000",
            parentPhone: "+94 76 777 8888",
            specialInstructions: "",
            status: "pending",
            requestedOn: "1 day ago",
        },
    ]);

    const openRequestDetails = (request) => {
        setSelectedRequest(request);
        setShowRequestModal(true);
    };

    const acceptRequest = () => {
        // Handle accept logic
        setShowRequestModal(false);
        // You would typically make an API call here
    };

    const openRejectModal = () => {
        setShowRequestModal(false);
        setShowRejectModal(true);
    };

    const rejectRequest = () => {
        // Handle reject logic
        setShowRejectModal(false);
        setRejectReason("");
        // You would typically make an API call here
    };

    const requestMoreInfo = () => {
        // Handle request more info logic
        setShowRequestModal(false);
        // You would typically open a chat or send a message
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Booking Requests</Text>
                <View style={styles.badgeContainer}>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>{requests.length}</Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {requests.length > 0 ? (
                        <>
                            <Text style={styles.sectionSubtitle}>
                                You have {requests.length} pending {requests.length === 1 ? 'request' : 'requests'}
                            </Text>

                            {requests.map((request) => (
                                <TouchableOpacity
                                    key={request.id}
                                    style={styles.requestCard}
                                    onPress={() => openRequestDetails(request)}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.requestHeader}>
                                        <View style={styles.parentInfo}>
                                            <View style={styles.parentAvatar}>
                                                <Ionicons name="person" size={24} color="#007AFF" />
                                            </View>
                                            <View style={styles.parentDetails}>
                                                <Text style={styles.parentName}>{request.parentName}</Text>
                                                <Text style={styles.requestTime}>{request.requestedOn}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.statusBadge}>
                                            <Text style={styles.statusText}>New</Text>
                                        </View>
                                    </View>

                                    <View style={styles.studentSection}>
                                        <View style={styles.studentIcon}>
                                            <Ionicons name="school" size={20} color="#34C759" />
                                        </View>
                                        <View style={styles.studentDetails}>
                                            <Text style={styles.studentName}>{request.childName}</Text>
                                            <Text style={styles.studentInfo}>{request.grade} • {request.school}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.routeSection}>
                                        <View style={styles.routeItem}>
                                            <View style={styles.routeDot} />
                                            <Text style={styles.routeText} numberOfLines={1}>{request.pickupAddress}</Text>
                                        </View>
                                        <View style={styles.routeLine} />
                                        <View style={styles.routeItem}>
                                            <View style={[styles.routeDot, styles.routeDotDestination]} />
                                            <Text style={styles.routeText} numberOfLines={1}>{request.dropoffAddress}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.requestFooter}>
                                        <View style={styles.feeContainer}>
                                            <Text style={styles.feeLabel}>Monthly Fee</Text>
                                            <Text style={styles.feeAmount}>{request.monthlyFee}</Text>
                                        </View>
                                        <View style={styles.dateContainer}>
                                            <Ionicons name="calendar" size={16} color="#8E8E93" />
                                            <Text style={styles.dateText}>Starts {request.requestedDate}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.quickActions}>
                                        <TouchableOpacity
                                            style={styles.acceptButton}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                openRequestDetails(request);
                                            }}
                                        >
                                            <Ionicons name="checkmark" size={20} color="#fff" />
                                            <Text style={styles.acceptButtonText}>Accept</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.declineButton}
                                            onPress={(e) => {
                                                e.stopPropagation();
                                                setSelectedRequest(request);
                                                openRejectModal();
                                            }}
                                        >
                                            <Ionicons name="close" size={20} color="#FF3B30" />
                                            <Text style={styles.declineButtonText}>Decline</Text>
                                        </TouchableOpacity>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </>
                    ) : (
                        <View style={styles.emptyState}>
                            <Ionicons name="checkmark-done-circle" size={64} color="#C7C7CC" />
                            <Text style={styles.emptyStateTitle}>No Pending Requests</Text>
                            <Text style={styles.emptyStateText}>
                                You're all caught up! New booking requests will appear here.
                            </Text>
                        </View>
                    )}
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>

            {/* Request Details Modal */}
            <Modal
                visible={showRequestModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowRequestModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Booking Request</Text>
                            <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                                <Ionicons name="close" size={28} color="#000" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView showsVerticalScrollIndicator={false}>
                            {selectedRequest && (
                                <>
                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Parent Information</Text>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Name</Text>
                                            <Text style={styles.modalValue}>{selectedRequest.parentName}</Text>
                                        </View>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Phone</Text>
                                            <Text style={styles.modalValue}>{selectedRequest.parentPhone}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Student Information</Text>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Student Name</Text>
                                            <Text style={styles.modalValue}>{selectedRequest.childName}</Text>
                                        </View>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Grade</Text>
                                            <Text style={styles.modalValue}>{selectedRequest.grade}</Text>
                                        </View>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>School</Text>
                                            <Text style={styles.modalValue}>{selectedRequest.school}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Pickup & Drop-off</Text>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Pickup Address</Text>
                                            <Text style={styles.modalValue}>{selectedRequest.pickupAddress}</Text>
                                        </View>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Drop-off Address</Text>
                                            <Text style={styles.modalValue}>{selectedRequest.dropoffAddress}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.modalSection}>
                                        <Text style={styles.modalSectionTitle}>Subscription Details</Text>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Start Date</Text>
                                            <Text style={styles.modalValue}>{selectedRequest.requestedDate}</Text>
                                        </View>
                                        <View style={styles.modalInfoRow}>
                                            <Text style={styles.modalLabel}>Monthly Fee</Text>
                                            <Text style={[styles.modalValue, { color: "#34C759", fontWeight: "600" }]}>
                                                {selectedRequest.monthlyFee}
                                            </Text>
                                        </View>
                                    </View>

                                    {selectedRequest.specialInstructions && (
                                        <View style={styles.modalSection}>
                                            <Text style={styles.modalSectionTitle}>Special Instructions</Text>
                                            <View style={styles.instructionsCard}>
                                                <Ionicons name="information-circle" size={20} color="#FF9500" />
                                                <Text style={styles.instructionsText}>{selectedRequest.specialInstructions}</Text>
                                            </View>
                                        </View>
                                    )}

                                    <View style={styles.modalActions}>
                                        <TouchableOpacity style={styles.modalAcceptButton} onPress={acceptRequest}>
                                            <Ionicons name="checkmark-circle" size={24} color="#fff" />
                                            <Text style={styles.modalAcceptButtonText}>Accept Request</Text>
                                        </TouchableOpacity>

                                        <View style={styles.secondaryActions}>
                                            <TouchableOpacity style={styles.modalSecondaryButton} onPress={requestMoreInfo}>
                                                <Ionicons name="chatbubble-outline" size={20} color="#007AFF" />
                                                <Text style={styles.modalSecondaryButtonText}>Request More Info</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity style={styles.modalRejectButton} onPress={openRejectModal}>
                                                <Ionicons name="close-circle-outline" size={20} color="#FF3B30" />
                                                <Text style={styles.modalRejectButtonText}>Decline</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </>
                            )}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Reject Modal */}
            <Modal
                visible={showRejectModal}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setShowRejectModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.rejectModalContent}>
                        <Text style={styles.rejectModalTitle}>Decline Request</Text>
                        <Text style={styles.rejectModalSubtitle}>
                            Please provide a reason for declining this booking request
                        </Text>

                        <TextInput
                            style={styles.rejectInput}
                            placeholder="Reason for declining..."
                            value={rejectReason}
                            onChangeText={setRejectReason}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        <View style={styles.rejectActions}>
                            <TouchableOpacity
                                style={styles.rejectCancelButton}
                                onPress={() => setShowRejectModal(false)}
                            >
                                <Text style={styles.rejectCancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.rejectConfirmButton}
                                onPress={rejectRequest}
                            >
                                <Text style={styles.rejectConfirmButtonText}>Decline Request</Text>
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
    badgeContainer: {
        minWidth: wp(40),
        alignItems: "flex-end",
    },
    badge: {
        backgroundColor: "#FF3B30",
        borderRadius: responsive.radiusFull,
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: 4,
        minWidth: wp(24),
        alignItems: "center",
    },
    badgeText: {
        color: "#fff",
        fontSize: responsive.fontSM,
        fontWeight: "600",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: responsive.paddingLG,
    },
    sectionSubtitle: {
        fontSize: responsive.fontMD,
        color: "#8E8E93",
        marginBottom: responsive.paddingLG,
    },
    requestCard: {
        backgroundColor: "#fff",
        borderRadius: responsive.radiusLG,
        padding: responsive.paddingLG,
        marginBottom: responsive.paddingLG,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    requestHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: responsive.paddingLG,
    },
    parentInfo: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    parentAvatar: {
        width: wp(48),
        height: wp(48),
        borderRadius: wp(24),
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
        marginRight: responsive.paddingMD,
    },
    parentDetails: {
        flex: 1,
    },
    parentName: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#000",
    },
    requestTime: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
        marginTop: 2,
    },
    statusBadge: {
        backgroundColor: "#FF9500",
        borderRadius: responsive.radiusSM,
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: 4,
    },
    statusText: {
        color: "#fff",
        fontSize: responsive.fontSM,
        fontWeight: "600",
    },
    studentSection: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F7",
        borderRadius: responsive.radiusMD,
        padding: responsive.paddingMD,
        marginBottom: responsive.paddingMD,
    },
    studentIcon: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: "#E8F5E9",
        justifyContent: "center",
        alignItems: "center",
        marginRight: responsive.paddingMD,
    },
    studentDetails: {
        flex: 1,
    },
    studentName: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#000",
    },
    studentInfo: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
        marginTop: 2,
    },
    routeSection: {
        marginBottom: responsive.paddingLG,
    },
    routeItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    routeDot: {
        width: wp(10),
        height: wp(10),
        borderRadius: wp(5),
        backgroundColor: "#007AFF",
        marginRight: responsive.paddingMD,
    },
    routeDotDestination: {
        backgroundColor: "#34C759",
    },
    routeLine: {
        width: 2,
        height: hp(20),
        backgroundColor: "#E5E5EA",
        marginLeft: wp(4),
        marginVertical: responsive.paddingXS,
    },
    routeText: {
        flex: 1,
        fontSize: responsive.fontMD,
        color: "#000",
    },
    requestFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: responsive.paddingMD,
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
        marginBottom: responsive.paddingMD,
    },
    feeContainer: {
        flex: 1,
    },
    feeLabel: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
        marginBottom: 2,
    },
    feeAmount: {
        fontSize: responsive.fontXL,
        fontWeight: "bold",
        color: "#34C759",
    },
    dateContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    dateText: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
    },
    quickActions: {
        flexDirection: "row",
        gap: responsive.paddingMD,
    },
    acceptButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#34C759",
        paddingVertical: responsive.paddingMD,
        borderRadius: responsive.radiusMD,
        justifyContent: "center",
        alignItems: "center",
        gap: responsive.paddingSM,
    },
    acceptButtonText: {
        color: "#fff",
        fontSize: responsive.fontLG,
        fontWeight: "600",
    },
    declineButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#F2F2F7",
        paddingVertical: responsive.paddingMD,
        borderRadius: responsive.radiusMD,
        justifyContent: "center",
        alignItems: "center",
        gap: responsive.paddingSM,
    },
    declineButtonText: {
        color: "#FF3B30",
        fontSize: responsive.fontLG,
        fontWeight: "600",
    },
    emptyState: {
        alignItems: "center",
        paddingTop: hp(80),
    },
    emptyStateTitle: {
        fontSize: responsive.font2XL,
        fontWeight: "600",
        color: "#000",
        marginTop: responsive.paddingLG,
    },
    emptyStateText: {
        fontSize: responsive.fontLG,
        color: "#8E8E93",
        textAlign: "center",
        marginTop: responsive.paddingSM,
        paddingHorizontal: responsive.paddingXL,
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
    modalSection: {
        marginBottom: responsive.paddingXL,
    },
    modalSectionTitle: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#000",
        marginBottom: responsive.paddingMD,
    },
    modalInfoRow: {
        marginBottom: responsive.paddingMD,
    },
    modalLabel: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
        marginBottom: 4,
    },
    modalValue: {
        fontSize: responsive.fontLG,
        color: "#000",
    },
    instructionsCard: {
        flexDirection: "row",
        backgroundColor: "#FFF3E0",
        padding: responsive.paddingMD,
        borderRadius: responsive.radiusMD,
        gap: responsive.paddingMD,
    },
    instructionsText: {
        flex: 1,
        fontSize: responsive.fontMD,
        color: "#FF9500",
    },
    modalActions: {
        marginTop: responsive.paddingLG,
    },
    modalAcceptButton: {
        flexDirection: "row",
        backgroundColor: "#34C759",
        padding: responsive.paddingLG,
        borderRadius: responsive.radiusMD,
        justifyContent: "center",
        alignItems: "center",
        gap: responsive.paddingSM,
        marginBottom: responsive.paddingMD,
    },
    modalAcceptButtonText: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#fff",
    },
    secondaryActions: {
        flexDirection: "row",
        gap: responsive.paddingMD,
    },
    modalSecondaryButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#F2F2F7",
        padding: responsive.paddingMD,
        borderRadius: responsive.radiusMD,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    modalSecondaryButtonText: {
        fontSize: responsive.fontMD,
        fontWeight: "600",
        color: "#007AFF",
    },
    modalRejectButton: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#F2F2F7",
        padding: responsive.paddingMD,
        borderRadius: responsive.radiusMD,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
    },
    modalRejectButtonText: {
        fontSize: responsive.fontMD,
        fontWeight: "600",
        color: "#FF3B30",
    },
    rejectModalContent: {
        backgroundColor: "#fff",
        margin: responsive.paddingXL,
        borderRadius: responsive.radiusXL,
        padding: responsive.paddingXL,
    },
    rejectModalTitle: {
        fontSize: responsive.font2XL,
        fontWeight: "bold",
        color: "#000",
        marginBottom: responsive.paddingSM,
    },
    rejectModalSubtitle: {
        fontSize: responsive.fontMD,
        color: "#8E8E93",
        marginBottom: responsive.paddingXL,
    },
    rejectInput: {
        backgroundColor: "#F2F2F7",
        borderRadius: responsive.radiusMD,
        padding: responsive.paddingLG,
        fontSize: responsive.fontLG,
        color: "#000",
        minHeight: hp(120),
        marginBottom: responsive.paddingXL,
    },
    rejectActions: {
        flexDirection: "row",
        gap: responsive.paddingMD,
    },
    rejectCancelButton: {
        flex: 1,
        backgroundColor: "#F2F2F7",
        padding: responsive.paddingLG,
        borderRadius: responsive.radiusMD,
        alignItems: "center",
    },
    rejectCancelButtonText: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#000",
    },
    rejectConfirmButton: {
        flex: 1,
        backgroundColor: "#FF3B30",
        padding: responsive.paddingLG,
        borderRadius: responsive.radiusMD,
        alignItems: "center",
    },
    rejectConfirmButtonText: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#fff",
    },
});
