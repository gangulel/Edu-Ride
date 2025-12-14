import { Dimensions, Platform, PixelRatio } from 'react-native';

// iPhone 12 Pro dimensions
const DESIGN_WIDTH = 390;
const DESIGN_HEIGHT = 844;

// Get device dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

/**
 * Responsive width - scales width based on screen size
 * @param {number} size - Design size
 * @returns {number} Scaled size
 */
export const wp = (size) => {
  return (SCREEN_WIDTH / DESIGN_WIDTH) * size;
};

/**
 * Responsive height - scales height based on screen size
 * @param {number} size - Design size
 * @returns {number} Scaled size
 */
export const hp = (size) => {
  return (SCREEN_HEIGHT / DESIGN_HEIGHT) * size;
};

/**
 * Responsive font size
 * @param {number} size - Design font size
 * @returns {number} Scaled font size
 */
export const fs = (size) => {
  const scale = SCREEN_WIDTH / DESIGN_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

/**
 * Responsive spacing
 * @param {number} size - Design spacing
 * @returns {number} Scaled spacing
 */
export const spacing = (size) => {
  return wp(size);
};

// Pre-calculated common values for iPhone 12 Pro
export const responsive = {
  // Padding & Margins
  paddingXS: spacing(4),
  paddingSM: spacing(8),
  paddingMD: spacing(12),
  paddingLG: spacing(16),
  paddingXL: spacing(24),
  padding2XL: spacing(32),
  
  // Font Sizes
  fontXS: fs(10),
  fontSM: fs(12),
  fontMD: fs(14),
  fontLG: fs(16),
  fontXL: fs(18),
  font2XL: fs(20),
  font3XL: fs(24),
  font4XL: fs(28),
  font5XL: fs(32),
  font6XL: fs(40),
  
  // Common dimensions
  inputHeight: hp(48),
  buttonHeight: hp(48),
  headerHeight: hp(60),
  iconSM: fs(20),
  iconMD: fs(24),
  iconLG: fs(32),
  iconXL: fs(40),
  
  // Border radius
  radiusXS: spacing(4),
  radiusSM: spacing(6),
  radiusMD: spacing(8),
  radiusLG: spacing(12),
  radiusXL: spacing(16),
  radiusFull: spacing(999),
  
  // Screen dimensions
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
};

export default responsive;
