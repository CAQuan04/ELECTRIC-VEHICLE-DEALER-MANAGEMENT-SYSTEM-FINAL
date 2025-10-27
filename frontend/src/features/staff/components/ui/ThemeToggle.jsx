import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle - Floating button ở góc phải bên dưới
 * Click để chuyển đổi giữa Dark/Light mode với animation
 */
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        fixed bottom-8 right-8 z-50
        w-16 h-16 rounded-full 
        flex items-center justify-center
        bg-gradient-to-br from-emerald-500 to-emerald-600
        hover:from-emerald-600 hover:to-emerald-700
        shadow-xl hover:shadow-2xl
        transform hover:scale-110 active:scale-95
        transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-emerald-500/50
      "
      aria-label="Toggle theme"
      title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
    >
      {/* Sun Icon - Hiển thị khi Dark Mode */}
      <svg
        className={`absolute w-8 h-8 text-white transition-all duration-500 ${
          isDarkMode ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" 
          clipRule="evenodd" 
        />
      </svg>

      {/* Moon Icon - Hiển thị khi Light Mode */}
      <svg
        className={`absolute w-8 h-8 text-white transition-all duration-500 ${
          isDarkMode ? 'opacity-0 -rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>
    </button>
  );
};

export default ThemeToggle;
