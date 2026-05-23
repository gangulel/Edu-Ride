import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft2,
  AddCircle,
  Call,
  Flash,
  Send2,
  TickCircle,
} from 'iconsax-react-native';

import Avatar from '../components/driver/Avatar';
import {
  colors,
  spacing,
  typography,
  radii,
  shadows,
  fs,
  hp,
  layout,
} from '../theme';
import {
  getConversation,
  getChatThread,
  getQuickReplies,
} from '../../services/mock/driver';

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const conversation = useMemo(() => getConversation(id), [id]);
  const initialThread = useMemo(() => getChatThread(id), [id]);
  const quickReplies = useMemo(() => getQuickReplies(), []);

  const [messages, setMessages] = useState(initialThread);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 30);
  }, []);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const newMsg = {
      id: Date.now(),
      sender: 'driver',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setDraft('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 30);
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) => (m.id === newMsg.id ? { ...m, sent: true } : m))
      );
    }, 700);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <SafeAreaView edges={['top']} style={styles.headerSafe}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
            hitSlop={6}
          >
            <ArrowLeft2 size={fs(20)} color={colors.textPrimary} variant="Linear" />
          </TouchableOpacity>
          <Avatar
            name={conversation.parentName}
            tone={conversation.avatarTone}
            size={42}
            online={conversation.online}
          />
          <View style={styles.headerBody}>
            <Text style={styles.headerName}>{conversation.parentName}</Text>
            <Text style={styles.headerSub} numberOfLines={1}>
              Parent of {conversation.studentName} · {conversation.online ? 'Online' : 'Offline'}
            </Text>
          </View>
          <TouchableOpacity style={styles.callBtn} hitSlop={6}>
            <Call size={fs(18)} color={colors.primary} variant="Bold" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.thread}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          <View style={styles.dayHeader}>
            <View style={styles.dayChip}>
              <Text style={styles.dayChipText}>Today</Text>
            </View>
          </View>

          {messages.map((msg) => {
            const mine = msg.sender === 'driver';
            return (
              <View
                key={msg.id}
                style={[
                  styles.bubbleRow,
                  mine ? styles.bubbleRowRight : styles.bubbleRowLeft,
                ]}
              >
                {!mine ? (
                  <Avatar
                    name={conversation.parentName}
                    tone={conversation.avatarTone}
                    size={28}
                  />
                ) : null}
                <View
                  style={[
                    styles.bubble,
                    mine ? styles.bubbleMine : styles.bubbleThem,
                  ]}
                >
                  <Text
                    style={[
                      styles.bubbleText,
                      mine ? styles.bubbleTextMine : styles.bubbleTextThem,
                    ]}
                  >
                    {msg.text}
                  </Text>
                  <View style={styles.bubbleMetaRow}>
                    <Text
                      style={[
                        styles.bubbleTime,
                        mine ? styles.bubbleTimeMine : styles.bubbleTimeThem,
                      ]}
                    >
                      {msg.time}
                    </Text>
                    {mine ? (
                      <TickCircle
                        size={12}
                        color={msg.sent ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.55)'}
                        variant={msg.sent ? 'Bold' : 'Linear'}
                      />
                    ) : null}
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* Quick replies */}
        <View style={styles.quickWrap}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickRow}
          >
            {quickReplies.map((reply, i) => (
              <TouchableOpacity
                key={i}
                style={styles.quickChip}
                onPress={() => setDraft(reply)}
                activeOpacity={0.85}
              >
                <Flash size={fs(13)} color={colors.primary} variant="Bold" />
                <Text style={styles.quickChipText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Input bar */}
        <SafeAreaView edges={['bottom']} style={styles.inputSafe}>
          <View style={styles.inputBar}>
            <TouchableOpacity style={styles.attachBtn} hitSlop={6}>
              <AddCircle size={fs(24)} color={colors.textSecondary} variant="Linear" />
            </TouchableOpacity>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.input}
                placeholder="Message..."
                placeholderTextColor={colors.textTertiary}
                value={draft}
                onChangeText={setDraft}
                multiline
                maxLength={500}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, draft.trim() && styles.sendBtnActive]}
              onPress={send}
              disabled={!draft.trim()}
              activeOpacity={0.85}
            >
              <Send2
                size={fs(18)}
                color={draft.trim() ? '#fff' : colors.textTertiary}
                variant="Bold"
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerSafe: { backgroundColor: colors.surface, ...shadows.sm },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  headerBody: { flex: 1 },
  headerName: { fontSize: typography.size.md, color: colors.textPrimary, fontFamily: typography.fontFamily.bold },
  headerSub: { fontSize: typography.size.xs, color: colors.textSecondary, marginTop: 2 },
  callBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.primarySurface,
    alignItems: 'center', justifyContent: 'center',
  },

  thread: { padding: spacing.lg, paddingBottom: spacing.md },
  dayHeader: { alignItems: 'center', marginBottom: spacing.lg },
  dayChip: {
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radii.full,
  },
  dayChipText: { fontSize: typography.size.xs, color: colors.textSecondary, fontFamily: typography.fontFamily.medium },

  bubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  bubbleRowLeft: { justifyContent: 'flex-start' },
  bubbleRowRight: { justifyContent: 'flex-end' },
  bubble: {
    maxWidth: '78%',
    padding: spacing.md,
    borderRadius: radii.lg,
  },
  bubbleMine: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleThem: {
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 4,
    ...shadows.xs,
  },
  bubbleText: { fontSize: typography.size.md, lineHeight: typography.size.md * 1.35 },
  bubbleTextMine: { color: '#fff' },
  bubbleTextThem: { color: colors.textPrimary },
  bubbleMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4, alignSelf: 'flex-end' },
  bubbleTime: { fontSize: 10 },
  bubbleTimeMine: { color: 'rgba(255,255,255,0.8)' },
  bubbleTimeThem: { color: colors.textTertiary },

  quickWrap: {
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingVertical: spacing.sm,
  },
  quickRow: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  quickChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    backgroundColor: colors.primarySurface,
  },
  quickChipText: { color: colors.primary, fontSize: typography.size.sm, fontFamily: typography.fontFamily.semibold },

  inputSafe: { backgroundColor: colors.surface },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
  },
  attachBtn: { padding: 4 },
  inputWrap: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radii.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm + 2 : spacing.sm,
    maxHeight: hp(100),
  },
  input: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    padding: 0,
    minHeight: 24,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center', justifyContent: 'center',
  },
  sendBtnActive: {
    backgroundColor: colors.primary,
  },
});
