import React, { createContext, useContext, useMemo } from 'react';
import { theme as defaultTheme } from '../theme';

const ThemeContext = createContext(defaultTheme);

export function ThemeProvider({ children, value }) {
  const themeValue = useMemo(() => value || defaultTheme, [value]);
  return <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
