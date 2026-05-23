import { Platform } from 'react-native';

// Cross-platform shadow presets. Spreads onto a style object so iOS and
// Android each get the right properties.
const shadow = (color, offsetY, opacity, radius, elevation) => ({
  shadowColor: color,
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: Platform.OS === 'ios' ? opacity : 0,
  shadowRadius: radius,
  elevation,
});

const baseShadow = '#0F172A';
const primaryShadow = '#3B82F6';

export const shadows = {
  none: shadow(baseShadow, 0, 0, 0, 0),
  xs: shadow(baseShadow, 1, 0.04, 2, 1),
  sm: shadow(baseShadow, 2, 0.06, 6, 2),
  md: shadow(baseShadow, 4, 0.08, 12, 4),
  lg: shadow(baseShadow, 8, 0.12, 20, 8),
  xl: shadow(baseShadow, 12, 0.18, 28, 12),

  // Primary-tinted shadows for CTAs and highlight cards.
  primarySm: shadow(primaryShadow, 4, 0.18, 10, 4),
  primaryMd: shadow(primaryShadow, 8, 0.25, 16, 8),
  primaryLg: shadow(primaryShadow, 12, 0.32, 22, 12),
};

export default shadows;
