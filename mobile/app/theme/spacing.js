import { hp, wp } from '../utils/responsive';

// Spacing scale based on a 4pt grid, scaled to device height.
export const spacing = {
  none: 0,
  xs: hp(4),
  sm: hp(8),
  md: hp(12),
  lg: hp(16),
  xl: hp(20),
  '2xl': hp(24),
  '3xl': hp(32),
  '4xl': hp(40),
  '5xl': hp(56),
};

// Horizontal padding for screen edges — slightly wider than vertical.
export const screenPadding = {
  horizontal: wp(20),
  vertical: hp(16),
};

export const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  pill: 9999,
};

export default { spacing, screenPadding, radius };
