import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  MessageQuestion,
  MessageText1,
} from 'iconsax-react-native';

import ScreenContainer from '../components/driver/ScreenContainer';
import HeroHeader from '../components/driver/HeroHeader';
import SearchField from '../components/driver/SearchField';
import Avatar from '../components/driver/Avatar';
import EmptyState from '../components/driver/EmptyState';
import {
  colors,
  spacing,
  typography,
  radii,
  fs,
  layout,
} from '../theme';
import { getConversations } from '../../services/mock/driver';

export default function DriverMessages() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const conversations = useMemo(() => getConversations(), []);

  const filtered = conversations.filter((c) =>
    c.parentName.toLowerCase().includes(search.toLowerCase()) ||
    c.studentName.toLowerCase().includes(search.toLowerCase())
  );

  const totalUnread = conversations.reduce((acc, c) => acc + c.unread, 0);

  const renderItem = ({ item, index }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={[
        styles.row,
        index < filtered.length - 1 && styles.divider,
      ]}
      onPress={() => router.push(`/driver/chat?id=${item.id}`)}
    >
      <Avatar
        name={item.parentName}
        tone={item.avatarTone}
        size={52}
        online={item.online}
      />
      <View style={styles.body}>
        <View style={styles.bodyTop}>
          <Text style={styles.name} numberOfLines={1}>{item.parentName}</Text>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.studentLabel} numberOfLines={1}>
          Parent of {item.studentName}
        </Text>
        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              item.unread > 0 && styles.lastMessageUnread,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unread}</Text>
            </View>
          ) : null}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer edges={['left', 'right']} statusBarStyle="light-content">
      <HeroHeader
        greeting="Conversations"
        title="Messages"
        subtitle={totalUnread > 0 ? `${totalUnread} unread message${totalUnread === 1 ? '' : 's'}` : 'All caught up'}
        notificationCount={totalUnread}
        onAvatarPress={() => router.push('/driver/Profile/profile')}
        initials="KP"
      >
        <View style={{ paddingHorizontal: spacing.lg }}>
          <SearchField
            value={search}
            onChangeText={setSearch}
            placeholder="Search parents or students..."
          />
        </View>
      </HeroHeader>

      {filtered.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <EmptyState
            icon={MessageQuestion}
            title={search ? 'No matching messages' : 'No messages yet'}
            description={
              search
                ? 'Try searching for a different parent or student.'
                : 'When a parent reaches out, you can chat with them here.'
            }
          />
        </View>
      ) : (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: colors.surface,
    marginTop: spacing.lg,
    marginHorizontal: spacing.lg,
    borderRadius: radii.lg,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.divider,
  },
  body: { flex: 1 },
  bodyTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: typography.size.md,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semibold,
    flex: 1,
  },
  timestamp: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
  },
  studentLabel: {
    fontSize: typography.size.xs,
    color: colors.textTertiary,
    marginTop: 2,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
    gap: spacing.sm,
  },
  lastMessage: {
    flex: 1,
    fontSize: typography.size.sm,
    color: colors.textSecondary,
  },
  lastMessageUnread: {
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.semibold,
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 6,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: typography.size.xs,
    fontFamily: typography.fontFamily.bold,
  },
});
