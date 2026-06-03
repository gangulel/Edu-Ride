/**
 * Edu-Ride design tokens.
 *
 * Mirrors the visual language already used inline by the Parent App home
 * (Tailwind-style blue family + emerald accent) and exposes it as semantic
 * tokens so screens never have to know the underlying hex.
 *
 * Dark palette is defined alongside light so a future ThemeProvider can
 * swap them without touching consumers. Today, screens import `colors`
 * directly and get the light palette.
 */

import { responsive, wp, hp, fs } from '../utils/responsive';

export { wp, hp, fs };

export const palette = {
  // Brand blue — primary identity
  blue: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  // Emerald — positive states (active trip, earnings, success)
  emerald: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    500: '#10B981',
    600: '#059669',
    700: '#047857',
  },
  // Amber — warnings, ratings, pending
  amber: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B',
    600: '#D97706',
  },
  // Rose — destructive, alerts, danger
  rose: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444',
    600: '#DC2626',
  },
  // Violet — secondary accent for variety
  violet: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    500: '#8B5CF6',
    600: '#7C3AED',
  },
  // Cyan — informational secondary
  cyan: {
    50: '#ECFEFF',
    500: '#06B6D4',
    600: '#0891B2',
  },
  // Neutrals — slate scale
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },
  white: '#FFFFFF',
  black: '#000000',
};

const light = {
  // Brand
  primary: palette.blue[500],
  primaryDark: palette.blue[600],
  primaryDarker: palette.blue[700],
  primaryLight: palette.blue[400],
  primarySurface: palette.blue[50],
  primarySurfaceStrong: palette.blue[100],
  onPrimary: palette.white,

  // Accents
  success: palette.emerald[500],
  successDark: palette.emerald[600],
  successSurface: palette.emerald[50],
  warning: palette.amber[500],
  warningDark: palette.amber[600],
  warningSurface: palette.amber[50],
  danger: palette.rose[500],
  dangerDark: palette.rose[600],
  dangerSurface: palette.rose[50],
  info: palette.violet[500],
  infoDark: palette.violet[600],
  infoSurface: palette.violet[50],
  accent: palette.cyan[500],
  accentSurface: palette.cyan[50],

  // Surfaces
  background: palette.slate[50],
  surface: palette.white,
  surfaceMuted: palette.slate[100],
  surfaceElevated: palette.white,
  overlay: 'rgba(15,23,42,0.45)',
  scrim: 'rgba(15,23,42,0.05)',

  // Text
  textPrimary: palette.slate[800],
  textSecondary: palette.slate[500],
  textTertiary: palette.slate[400],
  textOnPrimary: palette.white,
  textLink: palette.blue[600],

  // Borders & dividers
  border: palette.slate[200],
  borderStrong: palette.slate[300],
  divider: palette.slate[100],

  // Transparency overlays on dark surfaces (used inside gradient headers)
  onDark: {
    text: palette.white,
    textMuted: 'rgba(255,255,255,0.78)',
    textSubtle: 'rgba(255,255,255,0.6)',
    surface: 'rgba(255,255,255,0.15)',
    surfaceStrong: 'rgba(255,255,255,0.22)',
    border: 'rgba(255,255,255,0.22)',
  },

  // Raw palette escape hatch (use sparingly)
  palette,
};

const dark = {
  ...light,
  primary: palette.blue[400],
  primaryDark: palette.blue[500],
  primaryDarker: palette.blue[600],
  primaryLight: palette.blue[300],
  primarySurface: 'rgba(59,130,246,0.12)',
  primarySurfaceStrong: 'rgba(59,130,246,0.22)',

  background: palette.slate[900],
  surface: palette.slate[800],
  surfaceMuted: palette.slate[700],
  surfaceElevated: palette.slate[800],
  overlay: 'rgba(0,0,0,0.6)',
  scrim: 'rgba(255,255,255,0.06)',

  textPrimary: palette.slate[50],
  textSecondary: palette.slate[300],
  textTertiary: palette.slate[400],
  textLink: palette.blue[300],

  border: palette.slate[700],
  borderStrong: palette.slate[600],
  divider: palette.slate[700],

  successSurface: 'rgba(16,185,129,0.14)',
  warningSurface: 'rgba(245,158,11,0.14)',
  dangerSurface: 'rgba(239,68,68,0.14)',
  infoSurface: 'rgba(139,92,246,0.14)',
};

// Active palette — flip this (or wire a context) to enable dark mode.
export const colors = light;
export const colorsDark = dark;
export const colorsLight = light;

// Curated gradient pairs/triples — keep all gradients here so the
// brand stays consistent.
export const gradients = {
  brand: [palette.blue[500], palette.blue[700]],
  brandSoft: [palette.blue[400], palette.blue[600]],
  brandDeep: [palette.blue[600], palette.blue[800]],
  headerHero: [palette.blue[500], palette.blue[600], palette.blue[700]],
  success: [palette.emerald[500], palette.emerald[600]],
  warning: ['#FBBF24', palette.amber[600]],
  danger: ['#F87171', palette.rose[600]],
  info: [palette.violet[500], palette.violet[600]],
  earnings: [palette.emerald[500], '#0EA5E9'],
  surface: [palette.white, palette.slate[50]],
  avatar: [palette.white, palette.slate[100]],
};

export const typography = {
  fontFamily: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    semibold: 'Roboto-Bold', // Roboto-SemiBold may not be loaded; bold reads well
    bold: 'Roboto-Bold',
  },
  size: {
    xs: responsive.fontXS,   // 12
    sm: responsive.fontSM,   // 14
    md: responsive.fontMD,   // 16
    lg: responsive.fontLG,   // 18
    xl: responsive.fontXL,   // 20
    '2xl': responsive.font2XL, // 24
    '3xl': responsive.font3XL, // 30
    display: fs(36),
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeight: {
    tight: 1.2,
    snug: 1.35,
    normal: 1.5,
    relaxed: 1.65,
  },
  letterSpacing: {
    tight: -0.4,
    normal: 0,
    wide: 0.4,
    label: 0.6,
  },
};

export const spacing = {
  xs: responsive.paddingXS,   // 4
  sm: responsive.paddingSM,   // 8
  md: responsive.paddingMD,   // 12
  lg: responsive.paddingLG,   // 16
  xl: responsive.paddingXL,   // 24
  '2xl': responsive.padding2XL, // 32
  '3xl': hp(48),
  '4xl': hp(64),
};

export const radii = {
  xs: responsive.radiusXS,    // 4
  sm: responsive.radiusSM,    // 8
  md: responsive.radiusMD,    // 12
  lg: responsive.radiusLG,    // 16
  xl: responsive.radiusXL,    // 24
  '2xl': 32,
  full: responsive.radiusFull,
};

export const shadows = {
  none: {},
  xs: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  // Coloured shadow for hero gradient cards (matches gradient base).
  brand: {
    shadowColor: palette.blue[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  success: {
    shadowColor: palette.emerald[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
  danger: {
    shadowColor: palette.rose[500],
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const layout = {
  screenPadding: spacing.lg,
  sectionGap: spacing.xl,
  cardGap: spacing.md,
  tabBarHeight: responsive.tabBarHeight,
  headerHeight: responsive.headerHeight,
};

// Single default export for the rare consumer that wants everything.
const theme = {
  colors,
  colorsDark,
  colorsLight,
  gradients,
  typography,
  spacing,
  radii,
  shadows,
  layout,
  responsive,
  wp,
  hp,
  fs,
};

export default theme;
