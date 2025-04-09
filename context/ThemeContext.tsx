import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: Theme;
};

export type Theme = {
  background: string;
  text: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  card: string;
  error: string;
  success: string;
  warning: string;
};

const lightTheme: Theme = {
  background: '#f3f4f6',
  text: '#1f2937',
  primary: '#0369a1',
  secondary: '#6b7280',
  accent: '#0284c7',
  border: '#e5e7eb',
  card: '#ffffff',
  error: '#dc2626',
  success: '#059669',
  warning: '#d97706',
};

const darkTheme: Theme = {
  background: '#111827',
  text: '#f3f4f6',
  primary: '#38bdf8',
  secondary: '#9ca3af',
  accent: '#0284c7',
  border: '#374151',
  card: '#1f2937',
  error: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b',
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: lightTheme,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);