import React from 'react';

/**
 * SearchBar - Search input với icon
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Search value
 * @param {function} onChange - Change handler
 */
const SearchBar = ({ placeholder = 'Tìm kiếm...', value, onChange, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-gray-400 text-gray-500 text-xl">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-12 pr-4 py-4 dark:bg-white/5 bg-white dark:border-white/10 border-gray-300 border rounded-xl dark:text-white text-gray-900 dark:placeholder-gray-500 placeholder-gray-400 focus:outline-none focus:border-emerald-500 dark:focus:bg-white/10 focus:bg-gray-50 transition-all"
      />
    </div>
  );
};

export default SearchBar;
