import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { responsive, wp, hp } from '../utils/responsive';

// Components
import { Avatar } from '../components/atoms';
import { Header } from '../components/organisms';

export default function ChatScreen() {
    const router = useRouter();
    const { driverId, name } = useLocalSearchParams();
    const flatListRef = useRef(null);
    const [message, setMessage] = useState('');

    // Mock messages
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: 'Good morning! I wanted to let you know that the bus will be arriving 5 minutes earlier today due to light traffic.',
            sender: 'driver',
            timestamp: '2026-01-24T08:30:00',
            read: true,
        },
        {
            id: 2,
            text: 'Thank you for letting me know! I will make sure Kavindi is ready.',
            sender: 'parent',
            timestamp: '2026-01-24T08:32:00',
            read: true,
        },
        {
            id: 3,
            text: 'Perfect! See you soon.',
            sender: 'driver',
            timestamp: '2026-01-24T08:33:00',
            read: true,
        },
    ]);

    const quickReplies = [
        "My child will be absent today",
        "Running 10 minutes late",
        "Please pick up earlier today",
        "Thank you!",
    ];

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const handleSend = () => {
        if (!message.trim()) return;

        const newMessage = {
            id: messages.length + 1,
            text: message,
            sender: 'parent',
            timestamp: new Date().toISOString(),
            read: false,
        };

        setMessages([...messages, newMessage]);
        setMessage('');

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const handleQuickReply = (reply) => {
        setMessage(reply);
    };

    const renderMessage = ({ item }) => {
        const isParent = item.sender === 'parent';

        return (
            <View style={[
                styles.messageContainer,
                isParent ? styles.messageContainerRight : styles.messageContainerLeft
            ]}>
                {!isParent && (
                    <Avatar name={name} size="small" style={styles.messageAvatar} />
                )}
                <View style={[
                    styles.messageBubble,
                    isParent ? styles.messageBubbleParent : styles.messageBubbleDriver
                ]}>
                    <Text style={[
                        styles.messageText,
                        isParent ? styles.messageTextParent : styles.messageTextDriver
                    ]}>
                        {item.text}
                    </Text>
                    <View style={styles.messageFooter}>
                        <Text style={[
                            styles.messageTime,
                            isParent ? styles.messageTimeParent : styles.messageTimeDriver
                        ]}>
                            {formatTime(item.timestamp)}
                        </Text>
                        {isParent && (
                            <Ionicons
                                name={item.read ? 'checkmark-done' : 'checkmark'}
                                size={14}
                                color={item.read ? '#007AFF' : '#C7C7CC'}
                                style={styles.readReceipt}
                            />
                        )}
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Custom Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
                <Avatar name={name || 'Driver'} size="medium" />
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{name || 'Driver'}</Text>
                    <View style={styles.onlineStatus}>
                        <View style={styles.onlineDot} />
                        <Text style={styles.onlineText}>Online</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.headerAction}>
                    <Ionicons name="call-outline" size={22} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={styles.content}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                {/* Messages List */}
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesList}
                    showsVerticalScrollIndicator={false}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
                />

                {/* Quick Replies */}
                <View style={styles.quickRepliesContainer}>
                    <FlatList
                        horizontal
                        data={quickReplies}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.quickReplyChip}
                                onPress={() => handleQuickReply(item)}
                            >
                                <Text style={styles.quickReplyText}>{item}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={styles.quickRepliesList}
                    />
                </View>

                {/* Input Area */}
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.attachButton}>
                        <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
                    </TouchableOpacity>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            placeholderTextColor="#C7C7CC"
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
                        <Ionicons
                            name="send"
                            size={22}
                            color={message.trim() ? '#007AFF' : '#C7C7CC'}
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
        backgroundColor: '#F2F2F7',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: responsive.paddingMD,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E5EA',
    },
    backButton: {
        padding: responsive.paddingSM,
        marginRight: responsive.paddingSM,
    },
    headerInfo: {
        flex: 1,
        marginLeft: responsive.paddingMD,
    },
    headerName: {
        fontSize: responsive.fontLG,
        fontWeight: '600',
        color: '#000',
    },
    onlineStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#34C759',
        marginRight: 4,
    },
    onlineText: {
        fontSize: responsive.fontSM,
        color: '#34C759',
    },
    headerAction: {
        padding: responsive.paddingSM,
    },
    content: {
        flex: 1,
    },
    messagesList: {
        padding: responsive.paddingMD,
        paddingBottom: responsive.paddingXL,
    },
    messageContainer: {
        flexDirection: 'row',
        marginBottom: responsive.paddingMD,
        alignItems: 'flex-end',
    },
    messageContainerLeft: {
        justifyContent: 'flex-start',
    },
    messageContainerRight: {
        justifyContent: 'flex-end',
    },
    messageAvatar: {
        marginRight: responsive.paddingSM,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: responsive.paddingMD,
        borderRadius: responsive.radiusLG,
    },
    messageBubbleDriver: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 4,
    },
    messageBubbleParent: {
        backgroundColor: '#007AFF',
        borderBottomRightRadius: 4,
    },
    messageText: {
        fontSize: responsive.fontMD,
        lineHeight: responsive.fontMD * 1.4,
    },
    messageTextDriver: {
        color: '#000',
    },
    messageTextParent: {
        color: '#fff',
    },
    messageFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: responsive.paddingXS,
    },
    messageTime: {
        fontSize: responsive.fontXS,
    },
    messageTimeDriver: {
        color: '#8E8E93',
    },
    messageTimeParent: {
        color: 'rgba(255,255,255,0.7)',
    },
    readReceipt: {
        marginLeft: 4,
    },
    quickRepliesContainer: {
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
        paddingVertical: responsive.paddingSM,
    },
    quickRepliesList: {
        paddingHorizontal: responsive.paddingMD,
    },
    quickReplyChip: {
        backgroundColor: '#E3F2FD',
        paddingHorizontal: responsive.paddingMD,
        paddingVertical: responsive.paddingSM,
        borderRadius: responsive.radiusFull,
        marginRight: responsive.paddingSM,
    },
    quickReplyText: {
        fontSize: responsive.fontSM,
        color: '#007AFF',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        padding: responsive.paddingMD,
        paddingBottom: hp(20),
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E5EA',
    },
    attachButton: {
        padding: responsive.paddingSM,
    },
    inputWrapper: {
        flex: 1,
        backgroundColor: '#F2F2F7',
        borderRadius: responsive.radiusLG,
        paddingHorizontal: responsive.paddingMD,
        marginHorizontal: responsive.paddingSM,
        minHeight: 40,
        maxHeight: 100,
        justifyContent: 'center',
    },
    input: {
        fontSize: responsive.fontMD,
        color: '#000',
        paddingVertical: responsive.paddingSM,
    },
    sendButton: {
        padding: responsive.paddingSM,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});
