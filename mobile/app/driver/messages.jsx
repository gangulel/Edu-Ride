import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { responsive, fs } from "../utils/responsive";

// Mock data for conversations
const MOCK_CONVERSATIONS = [
  {
    id: "1",
    studentName: "Nimalka Perera",
    lastMessage: "Thanks for the ride!",
    timestamp: "2m ago",
    unread: 2,
    avatar: "👩",
    online: true,
  },
  {
    id: "2",
    studentName: "Chaminda Silva",
    lastMessage: "I'm running 5 minutes late",
    timestamp: "15m ago",
    unread: 0,
    avatar: "👨",
    online: true,
  },
  {
    id: "3",
    studentName: "Dilini Fernando",
    lastMessage: "See you at the pickup point",
    timestamp: "1h ago",
    unread: 1,
    avatar: "👧",
    online: false,
  },
  {
    id: "4",
    studentName: "Roshan Jayawardena",
    lastMessage: "Can you pick me up from the library?",
    timestamp: "3h ago",
    unread: 0,
    avatar: "🧑",
    online: false,
  },
  {
    id: "5",
    studentName: "Malini Dissanayake",
    lastMessage: "Great ride, thanks!",
    timestamp: "Yesterday",
    unread: 0,
    avatar: "👩‍🎓",
    online: false,
  },
];

export default function DriverMessages() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);

  const filteredConversations = conversations.filter((conv) =>
    conv.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => router.push(`/driver/chat/${item.id}`)}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{item.avatar}</Text>
        </View>
        {item.online && <View style={styles.onlineIndicator} />}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.studentName}>{item.studentName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              item.unread > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>{item.unread}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Conversations List */}
      {filteredConversations.length > 0 ? (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="chatbubbles-outline" size={64} color="#C7C7CC" />
          <Text style={styles.emptyText}>No conversations found</Text>
          <Text style={styles.emptySubtext}>
            {searchQuery
              ? "Try a different search term"
              : "Your messages will appear here"}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: responsive.paddingLG,
    paddingVertical: responsive.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: fs(28),
    fontWeight: "bold",
    color: "#000",
  },
  searchContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: responsive.paddingLG,
    paddingVertical: responsive.paddingMD,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: responsive.radiusMD,
    paddingHorizontal: responsive.paddingMD,
    paddingVertical: responsive.paddingSM,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: responsive.fontMD,
    color: "#000",
  },
  listContainer: {
    paddingTop: responsive.paddingSM,
    paddingBottom: responsive.tabBarHeight + responsive.paddingLG,
  },
  conversationItem: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: responsive.paddingMD,
    paddingHorizontal: responsive.paddingLG,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: fs(52),
    height: fs(52),
    borderRadius: fs(26),
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarEmoji: {
    fontSize: fs(28),
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#34C759",
    borderWidth: 2,
    borderColor: "#fff",
  },
  conversationContent: {
    flex: 1,
    justifyContent: "center",
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  studentName: {
    fontSize: responsive.fontMD,
    fontWeight: "600",
    color: "#000",
  },
  timestamp: {
    fontSize: responsive.fontXS,
    color: "#8E8E93",
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  lastMessage: {
    flex: 1,
    fontSize: responsive.fontSM,
    color: "#8E8E93",
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: "600",
    color: "#000",
  },
  unreadBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  unreadCount: {
    color: "#fff",
    fontSize: responsive.fontXS,
    fontWeight: "bold",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: responsive.padding2XL,
  },
  emptyText: {
    fontSize: responsive.fontXL,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: responsive.paddingLG,
  },
  emptySubtext: {
    fontSize: responsive.fontSM,
    color: "#C7C7CC",
    marginTop: responsive.paddingSM,
    textAlign: "center",
  },
});
