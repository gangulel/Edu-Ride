import React, { useEffect, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home2,
  Routing2,
  MessageText1,
  Wallet3,
  User,
} from 'iconsax-react-native';
import {
  colors,
  shadows,
  spacing,
  typography,
  fs,
  layout,
} from '../theme';

const NAV_ITEMS = [
  { name: 'Home', icon: Home2, route: '/driver', match: (p) => p === '/driver' },
  { name: 'Trips', icon: Routing2, route: '/driver/rides', match: (p) => p?.startsWith('/driver/rides') || p?.startsWith('/driver/route-management') || p?.startsWith('/driver/active-trip') },
  { name: 'Messages', icon: MessageText1, route: '/driver/messages', match: (p) => p?.startsWith('/driver/messages') || p?.startsWith('/driver/chat') },
  { name: 'Earnings', icon: Wallet3, route: '/driver/earnings', match: (p) => p?.startsWith('/driver/earnings') },
  { name: 'Profile', icon: User, route: '/driver/Profile/profile', match: (p) => p?.toLowerCase().startsWith('/driver/profile') },
];

// Routes where the bottom tab bar should be visible. Detail screens
// (chat, active-trip, profile sub-pages, route editor) hide it so a
// sticky action button or keyboard input has room to breathe.
const TAB_ROOTS = [
  '/driver',
  '/driver/rides',
  '/driver/messages',
  '/driver/earnings',
  '/driver/Profile/profile',
];

const isTabRoot = (path) => {
  if (!path) return false;
  return TAB_ROOTS.includes(path) || path === '/driver/';
};

const DriverBottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  if (!isTabRoot(pathname)) return null;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, spacing.sm),
          minHeight: layout.tabBarHeight + insets.bottom,
        },
      ]}
    >
      <View style={styles.inner}>
        {NAV_ITEMS.map((item) => {
          const active = item.match(pathname ?? '');
          return (
            <NavTab
              key={item.name}
              item={item}
              active={active}
              onPress={() => router.push(item.route)}
            />
          );
        })}
      </View>
    </View>
  );
};

const NavTab = ({ item, active, onPress }) => {
  const Icon = item.icon;
  const scale = useRef(new Animated.Value(active ? 1 : 0.85)).current;
  const opacity = useRef(new Animated.Value(active ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: active ? 1 : 0.85,
        useNativeDriver: true,
        bounciness: 8,
      }),
      Animated.timing(opacity, {
        toValue: active ? 1 : 0,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [active, scale, opacity]);

  return (
    <TouchableOpacity
      style={styles.tab}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      <Animated.View
        style={[
          styles.activePill,
          {
            opacity,
            transform: [{ scale }],
          },
        ]}
      />
      <View style={styles.iconStack}>
        <Icon
          size={fs(22)}
          color={active ? colors.primary : colors.textSecondary}
          variant={active ? 'Bold' : 'Linear'}
        />
      </View>
      <Text
        style={[
          styles.label,
          active ? styles.labelActive : styles.labelInactive,
        ]}
        numberOfLines={1}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: { elevation: 12 },
    }),
  },
  inner: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
    paddingBottom: 4,
    position: 'relative',
  },
  activePill: {
    position: 'absolute',
    top: 0,
    width: 48,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primarySurface,
  },
  iconStack: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: fs(11),
    fontFamily: typography.fontFamily.medium,
    marginTop: 2,
  },
  labelActive: { color: colors.primary, fontFamily: typography.fontFamily.bold },
  labelInactive: { color: colors.textSecondary },
});

export default DriverBottomNav;
