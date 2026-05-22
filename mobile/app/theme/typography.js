import { fs } from '../utils/responsive';

// Roboto is loaded in app/_layout.jsx via @expo-google-fonts/roboto.
export const fontFamily = {
  thin: 'Roboto-Thin',
  light: 'Roboto-Light',
  regular: 'Roboto-Regular',
  medium: 'Roboto-Medium',
  bold: 'Roboto-Bold',
  black: 'Roboto-Black',
};

export const fontSize = {
  xs: fs(11),
  sm: fs(13),
  md: fs(15),
  lg: fs(17),
  xl: fs(20),
  '2xl': fs(24),
  '3xl': fs(28),
  '4xl': fs(34),
};

// Pre-composed text styles — pass any of these straight to <Text style={...}>.
export const textStyles = {
  display: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['3xl'],
    lineHeight: fontSize['3xl'] * 1.2,
    letterSpacing: -0.5,
  },
  h1: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize['2xl'],
    lineHeight: fontSize['2xl'] * 1.25,
  },
  h2: {
    fontFamily: fontFamily.bold,
    fontSize: fontSize.xl,
    lineHeight: fontSize.xl * 1.3,
  },
  h3: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * 1.35,
  },
  bodyLg: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.lg,
    lineHeight: fontSize.lg * 1.4,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.md,
    lineHeight: fontSize.md * 1.45,
  },
  bodySm: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.45,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.sm,
    lineHeight: fontSize.sm * 1.3,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: fontSize.xs,
    lineHeight: fontSize.xs * 1.4,
  },
  button: {
    fontFamily: fontFamily.medium,
    fontSize: fontSize.md,
    letterSpacing: 0.2,
  },
};

export default { fontFamily, fontSize, textStyles };
