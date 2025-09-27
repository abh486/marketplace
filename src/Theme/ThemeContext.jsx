import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';

// Define your Light & Dark theme objects — COPY OF YOUR EXACT STYLES
const LIGHT_THEME = {
  background: "#FFFFFF",
  card: "#FAFAFA",
  text: "#000000",
  textSecondary: "#666666",
  primary: "#00DB84",
  border: "#E0E0E0",
  success: "#00DB84",
  danger: "#DB0000",
};

const DARK_THEME = {
  background: "#001A13",
  card: "#07392dff",
  text: "#FFFFFF",
  textSecondary: "#aaaaaa",
  primary: "#00DB84",
  border: "#1a402c",
  success: "#42e7a2",
  danger: "#ff4d4d",
};

// Create Context
const ThemeContext = createContext();

// Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Provider Component
export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(LIGHT_THEME);

  // Optional: Sync with system appearance on mount
  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setIsDarkMode(colorScheme === 'dark');
    setTheme(colorScheme === 'dark' ? DARK_THEME : LIGHT_THEME);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
    setTheme(prev => (prev === LIGHT_THEME ? DARK_THEME : LIGHT_THEME));
  };

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};