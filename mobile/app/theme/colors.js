// Centralized color palette for the Edu-Ride mobile app.
// Primary brand: blue. All screens & atoms should pull colors from here
// instead of hard-coding hex values, so theming changes are a single edit.

const blue = {
  50: '#EFF6FF',
  100: '#DBEAFE',
  200: '#BFDBFE',
  300: '#93C5FD',
  400: '#60A5FA',
  500: '#3B82F6', // primary brand blue
  600: '#2563EB',
  700: '#1D4ED8',
  800: '#1E40AF',
  900: '#1E3A8A',
};

const slate = {
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
};

const green = {
  50: '#ECFDF5',
  100: '#D1FAE5',
  500: '#10B981',
  600: '#059669',
  700: '#047857',
};

const amber = {
  50: '#FFFBEB',
  100: '#FEF3C7',
  500: '#F59E0B',
  600: '#D97706',
};

const red = {
  50: '#FEF2F2',
  100: '#FEE2E2',
  500: '#EF4444',
  600: '#DC2626',
};

const purple = {
  50: '#F5F3FF',
  100: '#EDE9FE',
  500: '#8B5CF6',
  600: '#7C3AED',
};

// Light theme — only one mode for Phase 1.
export const lightColors = {
  // Brand
  primary: blue[500],
  primaryDark: blue[600],
  primaryDarker: blue[700],
  primaryLight: blue[100],
  primarySoft: blue[50],
  primaryGradient: [blue[500], blue[600], blue[700]],

  // Surfaces
  background: slate[50],
  surface: '#FFFFFF',
  surfaceMuted: slate[100],
  surfaceElevated: '#FFFFFF',

  // Text
  textPrimary: slate[800],
  textSecondary: slate[600],
  textMuted: slate[500],
  textInverse: '#FFFFFF',
  textOnPrimary: '#FFFFFF',

  // Borders & dividers
  border: slate[200],
  borderStrong: slate[300],
  divider: slate[100],

  // Semantic
  success: green[500],
  successDark: green[600],
  successSoft: green[50],
  successGradient: [green[500], green[600]],

  warning: amber[500],
  warningDark: amber[600],
  warningSoft: amber[50],

  danger: red[500],
  dangerDark: red[600],
  dangerSoft: red[50],

  info: blue[500],
  infoSoft: blue[50],

  accent: purple[500],
  accentSoft: purple[50],

  // Inputs
  inputBackground: '#FAFAFA',
  inputBorder: slate[200],
  inputBorderFocused: blue[500],
  inputPlaceholder: slate[400],

  // Overlay & shadow
  overlay: 'rgba(15, 23, 42, 0.45)',
  shadow: 'rgba(15, 23, 42, 0.10)',
  shadowStrong: 'rgba(15, 23, 42, 0.20)',
  shadowPrimary: 'rgba(59, 130, 246, 0.25)',

  // Palette refs (for advanced use)
  palette: { blue, slate, green, amber, red, purple },
};

export const palettes = { blue, slate, green, amber, red, purple };

export default lightColors;
