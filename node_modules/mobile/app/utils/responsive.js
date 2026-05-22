import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design reference)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(value, max));
};

// Width percentage
export const wp = (size) => {
  return (size / BASE_WIDTH) * SCREEN_WIDTH;
};

// Height percentage
export const hp = (size) => {
  return (size / BASE_HEIGHT) * SCREEN_HEIGHT;
};

// Font scaling
export const fs = (size) => {
  const scale = clamp(SCREEN_WIDTH / BASE_WIDTH, 0.9, 1.18);
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Responsive design tokens
export const responsive = {
  // Padding
  paddingXS: hp(4),
  paddingSM: hp(8),
  paddingMD: hp(12),
  paddingLG: hp(16),
  paddingXL: hp(24),
  padding2XL: hp(32),

  // Margin
  marginXS: hp(4),
  marginSM: hp(8),
  marginMD: hp(12),
  marginLG: hp(16),
  marginXL: hp(24),
  margin2XL: hp(32),

  // Border radius
  radiusXS: 4,
  radiusSM: 8,
  radiusMD: 12,
  radiusLG: 16,
  radiusXL: 24,
  radiusFull: 9999,

  // Font sizes
  fontXS: fs(12),
  fontSM: fs(14),
  fontMD: fs(16),
  fontLG: fs(18),
  fontXL: fs(20),
  font2XL: fs(24),
  font3XL: fs(30),

  // Button height
  buttonHeight: hp(48),

  // Navigation heights
  tabBarMinHeight: 64,
  tabBarHeight: hp(72),
  headerHeight: hp(60),
};
