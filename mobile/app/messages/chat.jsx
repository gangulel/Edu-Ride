import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';

export default function ChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  // Mock data - replace with API calls
  const conversation = {
    id: params.id || '1',
    with: {
      name: 'Nimal Perera',
      role: 'driver', // or 'parent'
      photo: null,
      verified: true,
    },
  };

  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Good morning! Just confirming that tomorrow\'s pickup time is 6:45 AM.',
      sender: 'driver',
      timestamp: '2026-01-15 08:30 AM',
      read: true,
    },
    {
      id: '2',
      text: 'Yes, that\'s correct. Thank you for confirming!',
      sender: 'me',
      timestamp: '2026-01-15 08:32 AM',
      read: true,
    },
    {
      id: '3',
      text: 'You\'re welcome! Please let me know if there are any changes.',
      sender: 'driver',
      timestamp: '2026-01-15 08:33 AM',
      read: true,
    },
    {
      id: '4',
      text: 'Will do. Have a great day!',
      sender: 'me',
      timestamp: '2026-01-15 08:35 AM',
      read: true,
    },
  ]);

  const templates = {
    parent: [
      'My child will be absent today',
      'Running 10 minutes late',
      'Please don\'t pick up tomorrow',
      'Change of pickup address for today',
    ],
    driver: [
      'Schedule changed for tomorrow',
      'Traffic delay, arriving 15 minutes late',
      'School closed tomorrow',
      'Route update notification',
    ],
  };

  const userRole = 'parent'; // Get from auth context
  const availableTemplates = templates[userRole];

  const handleSend = () => {
    if (message.trim()) {
      const newMessage = {
        id: Date.now().toString(),
        text: message,
        sender: 'me',
        timestamp: new Date().toLocaleString(),
        read: false,
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const handleTemplateSelect = (template) => {
    setMessage(template);
    setShowTemplates(false);
  };

  const renderMessage = ({ item }) => {
    const isMyMessage = item.sender === 'me';

    return (
      <View style={[styles.messageContainer, isMyMessage && styles.myMessageContainer]}>
        {!isMyMessage && (
          <Avatar name={conversation.with.name} size={32} style={styles.messageAvatar} />
        )}
        <View style={[styles.messageBubble, isMyMessage && styles.myMessageBubble]}>
          <Text style={[styles.messageText, isMyMessage && styles.myMessageText]}>
            {item.text}
          </Text>
          <Text style={[styles.messageTime, isMyMessage && styles.myMessageTime]}>
            {item.timestamp}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1f2937" />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Avatar 
            name={conversation.with.name} 
            verified={conversation.with.verified}
            size={36} 
          />
          <View style={styles.headerText}>
            <Text style={styles.headerName}>{conversation.with.name}</Text>
            <Text style={styles.headerRole}>
              {conversation.with.role === 'driver' ? 'Driver' : 'Parent'}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#1f2937" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />

      {/* Templates Popup */}
      {showTemplates && (
        <View style={styles.templatesContainer}>
          <View style={styles.templatesHeader}>
            <Text style={styles.templatesTitle}>Quick Messages</Text>
            <TouchableOpacity onPress={() => setShowTemplates(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {availableTemplates.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={styles.templateItem}
              onPress={() => handleTemplateSelect(template)}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#2563eb" />
              <Text style={styles.templateText}>{template}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.templateButton}
          onPress={() => setShowTemplates(!showTemplates)}
        >
          <Ionicons name="apps" size={24} color="#6b7280" />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
        </View>

        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Ionicons name="send" size={20} color={message.trim() ? '#2563eb' : '#9ca3af'} />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 4,
  },
  headerInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  headerText: {
    marginLeft: 12,
  },
  headerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  headerRole: {
    fontSize: 12,
    color: '#6b7280',
  },
  moreButton: {
    padding: 4,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  messageAvatar: {
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#ffffff',
  },
  myMessageBubble: {
    backgroundColor: '#2563eb',
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 15,
    color: '#1f2937',
    lineHeight: 20,
  },
  myMessageText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 11,
    color: '#9ca3af',
    marginTop: 4,
  },
  myMessageTime: {
    color: '#dbeafe',
    textAlign: 'right',
  },
  templatesContainer: {
    position: 'absolute',
    bottom: 80,
    left: 16,
    right: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    maxHeight: 300,
  },
  templatesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  templatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  templateItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 8,
  },
  templateText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  templateButton: {
    padding: 8,
    marginBottom: 4,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  input: {
    fontSize: 15,
    color: '#1f2937',
    minHeight: 20,
  },
  sendButton: {
    padding: 8,
    marginBottom: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
