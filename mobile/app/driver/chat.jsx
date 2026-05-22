import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, StatusBar, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { responsive, wp, hp } from "../utils/responsive";

export default function Chat() {
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "parent",
            text: "Good morning! Will my child be picked up on time today?",
            time: "8:30 AM",
            sent: true,
        },
        {
            id: 2,
            sender: "driver",
            text: "Good morning Mrs. Perera! Yes, I'll be there at 6:45 AM as usual.",
            time: "8:32 AM",
            sent: true,
        },
        {
            id: 3,
            sender: "parent",
            text: "Thank you! Also, please note that tomorrow my child will be absent due to a doctor's appointment.",
            time: "8:35 AM",
            sent: true,
        },
        {
            id: 4,
            sender: "driver",
            text: "Noted! Thank you for informing me. Hope everything is okay.",
            time: "8:36 AM",
            sent: true,
        },
    ]);

    // Quick reply templates
    const quickReplies = [
        "Running 10 minutes late",
        "On my way",
        "Thank you",
        "Will be there soon",
    ];

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                sender: "driver",
                text: message,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sent: false,
            };
            setMessages([...messages, newMessage]);
            setMessage("");

            // Simulate message being sent
            setTimeout(() => {
                setMessages(prev => prev.map(msg =>
                    msg.id === newMessage.id ? { ...msg, sent: true } : msg
                ));
            }, 1000);
        }
    };

    const useQuickReply = (reply) => {
        setMessage(reply);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={24} color="#007AFF" />
                        </View>
                        <View style={styles.onlineIndicator} />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.headerTitle}>Mrs. Perera</Text>
                        <Text style={styles.headerSubtitle}>Parent of Ashan Perera</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.callButton}>
                    <Ionicons name="call" size={22} color="#007AFF" />
                </TouchableOpacity>
            </View>

            {/* Messages */}
            <ScrollView
                style={styles.messagesContainer}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.dateHeader}>
                    <View style={styles.dateBadge}>
                        <Text style={styles.dateText}>Today</Text>
                    </View>
                </View>

                {messages.map((msg) => (
                    <View
                        key={msg.id}
                        style={[
                            styles.messageWrapper,
                            msg.sender === "driver" ? styles.messageWrapperRight : styles.messageWrapperLeft
                        ]}
                    >
                        {msg.sender === "parent" && (
                            <View style={styles.messageAvatar}>
                                <Ionicons name="person" size={16} color="#007AFF" />
                            </View>
                        )}

                        <View
                            style={[
                                styles.messageBubble,
                                msg.sender === "driver" ? styles.messageBubbleDriver : styles.messageBubbleParent
                            ]}
                        >
                            <Text style={[
                                styles.messageText,
                                msg.sender === "driver" ? styles.messageTextDriver : styles.messageTextParent
                            ]}>
                                {msg.text}
                            </Text>
                            <View style={styles.messageFooter}>
                                <Text style={[
                                    styles.messageTime,
                                    msg.sender === "driver" ? styles.messageTimeDriver : styles.messageTimeParent
                                ]}>
                                    {msg.time}
                                </Text>
                                {msg.sender === "driver" && (
                                    <Ionicons
                                        name={msg.sent ? "checkmark-done" : "checkmark"}
                                        size={14}
                                        color={msg.sent ? "#34C759" : "#fff"}
                                    />
                                )}
                            </View>
                        </View>
                    </View>
                ))}

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* Quick Replies */}
            <View style={styles.quickRepliesContainer}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.quickRepliesContent}
                >
                    {quickReplies.map((reply, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.quickReplyButton}
                            onPress={() => useQuickReply(reply)}
                        >
                            <Ionicons name="flash" size={14} color="#007AFF" />
                            <Text style={styles.quickReplyText}>{reply}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Input Area */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={0}
            >
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="add-circle" size={28} color="#8E8E93" />
                    </TouchableOpacity>

                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            value={message}
                            onChangeText={setMessage}
                            multiline
                            maxLength={500}
                            placeholderTextColor="#8E8E93"
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.sendButton, message.trim() && styles.sendButtonActive]}
                        onPress={sendMessage}
                        disabled={!message.trim()}
                    >
                        <Ionicons
                            name="send"
                            size={20}
                            color={message.trim() ? "#fff" : "#8E8E93"}
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    backButton: {
        marginRight: responsive.paddingMD,
    },
    avatarContainer: {
        position: "relative",
        marginRight: responsive.paddingMD,
    },
    avatar: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
    },
    onlineIndicator: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: wp(12),
        height: wp(12),
        borderRadius: wp(6),
        backgroundColor: "#34C759",
        borderWidth: 2,
        borderColor: "#fff",
    },
    headerInfo: {
        flex: 1,
    },
    headerTitle: {
        fontSize: responsive.fontLG,
        fontWeight: "600",
        color: "#000",
    },
    headerSubtitle: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
        marginTop: 2,
    },
    callButton: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
    },
    messagesContainer: {
        flex: 1,
    },
    messagesContent: {
        padding: responsive.paddingLG,
    },
    dateHeader: {
        alignItems: "center",
        marginVertical: responsive.paddingLG,
    },
    dateBadge: {
        backgroundColor: "#E5E5EA",
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingSM,
        borderRadius: responsive.radiusFull,
    },
    dateText: {
        fontSize: responsive.fontSM,
        color: "#8E8E93",
        fontWeight: "500",
    },
    messageWrapper: {
        flexDirection: "row",
        marginBottom: responsive.paddingMD,
        alignItems: "flex-end",
    },
    messageWrapperLeft: {
        justifyContent: "flex-start",
    },
    messageWrapperRight: {
        justifyContent: "flex-end",
    },
    messageAvatar: {
        width: wp(28),
        height: wp(28),
        borderRadius: wp(14),
        backgroundColor: "#E3F2FD",
        justifyContent: "center",
        alignItems: "center",
        marginRight: responsive.paddingSM,
    },
    messageBubble: {
        maxWidth: "75%",
        borderRadius: responsive.radiusLG,
        padding: responsive.paddingMD,
    },
    messageBubbleDriver: {
        backgroundColor: "#007AFF",
        borderBottomRightRadius: 4,
    },
    messageBubbleParent: {
        backgroundColor: "#fff",
        borderBottomLeftRadius: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    messageText: {
        fontSize: responsive.fontLG,
        lineHeight: responsive.fontXL,
    },
    messageTextDriver: {
        color: "#fff",
    },
    messageTextParent: {
        color: "#000",
    },
    messageFooter: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 4,
    },
    messageTime: {
        fontSize: responsive.fontXS,
    },
    messageTimeDriver: {
        color: "rgba(255,255,255,0.7)",
    },
    messageTimeParent: {
        color: "#8E8E93",
    },
    quickRepliesContainer: {
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
        paddingVertical: responsive.paddingSM,
    },
    quickRepliesContent: {
        paddingHorizontal: responsive.paddingLG,
        gap: responsive.paddingSM,
    },
    quickReplyButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F2F2F7",
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingSM,
        borderRadius: responsive.radiusFull,
        gap: 4,
    },
    quickReplyText: {
        fontSize: responsive.fontSM,
        color: "#007AFF",
        fontWeight: "500",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        padding: responsive.paddingLG,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#E5E5EA",
        gap: responsive.paddingSM,
    },
    attachButton: {
        padding: 4,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: "#F2F2F7",
        borderRadius: responsive.radiusXL,
        paddingHorizontal: responsive.paddingLG,
        paddingVertical: responsive.paddingSM,
        maxHeight: hp(100),
    },
    input: {
        fontSize: responsive.fontLG,
        color: "#000",
        minHeight: hp(36),
    },
    sendButton: {
        width: wp(40),
        height: wp(40),
        borderRadius: wp(20),
        backgroundColor: "#E5E5EA",
        justifyContent: "center",
        alignItems: "center",
    },
    sendButtonActive: {
        backgroundColor: "#007AFF",
    },
});
