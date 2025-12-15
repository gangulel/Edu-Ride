import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

// Mock messages data
const MOCK_MESSAGES = {
  "1": [
    {
      id: "m1",
      text: "Hi! I'm on my way to pick you up",
      sender: "driver",
      timestamp: "10:15 AM",
    },
    {
      id: "m2",
      text: "Great! I'll be waiting at the main entrance",
      sender: "student",
      timestamp: "10:16 AM",
    },
    {
      id: "m3",
      text: "Perfect, see you in 5 minutes",
      sender: "driver",
      timestamp: "10:17 AM",
    },
    {
      id: "m4",
      text: "Thanks for the ride!",
      sender: "student",
      timestamp: "10:45 AM",
    },
  ],
  "2": [
    {
      id: "m1",
      text: "Hello! I'm running 5 minutes late",
      sender: "student",
      timestamp: "9:30 AM",
    },
    {
      id: "m2",
      text: "No problem! Take your time",
      sender: "driver",
      timestamp: "9:31 AM",
    },
  ],
  "3": [
    {
      id: "m1",
      text: "See you at the pickup point",
      sender: "student",
      timestamp: "8:00 AM",
    },
  ],
};

const STUDENT_NAMES = {
  "1": "Sarah Johnson",
  "2": "Michael Chen",
  "3": "Emily Davis",
  "4": "James Wilson",
  "5": "Olivia Martinez",
};

const STUDENT_AVATARS = {
  "1": "👩",
  "2": "👨",
  "3": "👧",
  "4": "🧑",
  "5": "👩‍🎓",
};

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const flatListRef = useRef(null);

  const [messages, setMessages] = useState(MOCK_MESSAGES[id] || []);
  const [inputText, setInputText] = useState("");

  const studentName = STUDENT_NAMES[id] || "Student";
  const studentAvatar = STUDENT_AVATARS[id] || "👤";

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = () => {
    if (inputText.trim().length === 0) return;

    const newMessage = {
      id: `m${messages.length + 1}`,
      text: inputText.trim(),
      sender: "driver",
      timestamp: new Date().toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, newMessage]);
    setInputText("");
  };

  const renderMessage = ({ item }) => {
    const isDriver = item.sender === "driver";

    return (
      <View
        style={[
          styles.messageContainer,
          isDriver ? styles.driverMessage : styles.studentMessage,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            isDriver ? styles.driverBubble : styles.studentBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isDriver ? styles.driverText : styles.studentText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.messageTime,
              isDriver ? styles.driverTime : styles.studentTime,
            ]}
          >
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Text style={styles.headerAvatarEmoji}>{studentAvatar}</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{studentName}</Text>
            <Text style={styles.headerStatus}>Active now</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Messages List */}
        {messages.length > 0 ? (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>
              Start the conversation with {studentName}
            </Text>
          </View>
        )}

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
          </TouchableOpacity>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              placeholderTextColor="#8E8E93"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim().length > 0 && styles.sendButtonActive,
            ]}
            onPress={handleSend}
            disabled={inputText.trim().length === 0}
          >
            <Ionicons
              name="send"
              size={20}
              color={inputText.trim().length > 0 ? "#fff" : "#8E8E93"}
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
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
    marginRight: 8,
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerAvatarEmoji: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  headerStatus: {
    fontSize: 12,
    color: "#34C759",
    marginTop: 2,
  },
  moreButton: {
    padding: 4,
    marginLeft: 8,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
    maxWidth: "75%",
  },
  driverMessage: {
    alignSelf: "flex-end",
  },
  studentMessage: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  driverBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  studentBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  driverText: {
    color: "#fff",
  },
  studentText: {
    color: "#000",
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  driverTime: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  studentTime: {
    color: "#8E8E93",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#C7C7CC",
    marginTop: 8,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  attachButton: {
    padding: 8,
    marginRight: 4,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    maxHeight: 100,
  },
  input: {
    fontSize: 16,
    color: "#000",
    minHeight: 36,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  sendButtonActive: {
    backgroundColor: "#007AFF",
  },
});
