import React from 'react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle - Modern floating button với animations nâng cao
 * Click để chuyển đổi giữa Dark/Light mode
 */
const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        fixed bottom-8 right-8 z-50
        w-20 h-20 rounded-3xl 
        flex items-center justify-center
        bg-gradient-to-br from-cyan-500 to-blue-600
        dark:from-emerald-500 dark:to-emerald-600
        hover:from-cyan-600 hover:to-blue-700
        dark:hover:from-emerald-600 dark:hover:to-emerald-700
        shadow-2xl hover:shadow-3xl
        border-2 border-white/20 dark:border-white/10
        transform hover:scale-110 active:scale-95
        transition-all duration-500
        focus:outline-none focus:ring-4 focus:ring-cyan-500/50 dark:focus:ring-emerald-500/50
        group
        backdrop-blur-xl
      "
      aria-label="Toggle theme"
      title={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      
      {/* Sun Icon - Hiển thị khi Dark Mode */}
      <svg
        className={`absolute w-10 h-10 text-white transition-all duration-700 ${
          isDarkMode 
            ? 'opacity-100 rotate-0 scale-100' 
            : 'opacity-0 rotate-180 scale-0'
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
        className={`absolute w-10 h-10 text-white transition-all duration-700 ${
          isDarkMode 
            ? 'opacity-0 -rotate-180 scale-0' 
            : 'opacity-100 rotate-0 scale-100'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
      </svg>

      {/* Tooltip */}
      <span className="
        absolute -top-12 left-1/2 -translate-x-1/2
        px-4 py-2 rounded-xl
        bg-gray-900 dark:bg-white
        text-white dark:text-gray-900
        text-sm font-bold whitespace-nowrap
        opacity-0 group-hover:opacity-100
        transform scale-0 group-hover:scale-100
        transition-all duration-300
        pointer-events-none
        shadow-xl
      ">
        {isDarkMode ? '☀️ Sáng' : '🌙 Tối'}
      </span>
    </button>
  );
};

export default ThemeToggle;