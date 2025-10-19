import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Lấy theme từ localStorage hoặc mặc định là dark
    const savedTheme = localStorage.getItem('dealer-theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  useEffect(() => {
    // Lưu theme vào localStorage
    localStorage.setItem('dealer-theme', isDarkMode ? 'dark' : 'light');
    
    // Update document.documentElement (html tag) class
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
      console.log('✅ Dark mode activated - class "dark" added to <html>');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      console.log('☀️ Light mode activated - class "light" added to <html>');
    }
    
    // Debug: Log current classes
    console.log('Current <html> classes:', root.className);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
