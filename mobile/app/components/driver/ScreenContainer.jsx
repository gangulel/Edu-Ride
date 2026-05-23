import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, layout } from '../../theme';

/**
 * Standard screen wrapper for driver tabs/details.
 *
 * Handles: status bar style, background, optional safe-area top padding
 * (skip it when a gradient header should bleed under the notch), and
 * the bottom padding needed so content clears the fixed DriverBottomNav.
 */
const ScreenContainer = ({
  children,
  edges = ['top', 'left', 'right'],
  withTabBarSpace = true,
  background = colors.background,
  statusBarStyle = 'dark-content',
  statusBarBg,
  style,
}) => {
  const insets = useSafeAreaInsets();
  const bottomPad = withTabBarSpace ? layout.tabBarHeight + insets.bottom : 0;

  return (
    <View style={[styles.root, { backgroundColor: background }, style]}>
      <StatusBar
        barStyle={statusBarStyle}
        backgroundColor={statusBarBg ?? 'transparent'}
        translucent={Platform.OS === 'android'}
      />
      <SafeAreaView
        edges={edges}
        style={[styles.safe, { paddingBottom: bottomPad }]}
      >
        {children}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: { flex: 1 },
  safe: { flex: 1 },
});

export default ScreenContainer;
