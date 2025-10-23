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
      <span className="absolute left-4 top-1/2 -translate-y-1/2 theme-text-muted text-xl">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="theme-input w-full pl-12 pr-4 py-4 rounded-xl border focus:outline-none focus:ring-2"
      />
    </div>
  );
};

export default SearchBar;
