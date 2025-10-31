import React from 'react';

/**
 * SearchBar - Modern search input với icon và animations
 * @param {string} placeholder - Placeholder text
 * @param {string} value - Search value
 * @param {function} onChange - Change handler
 */
const SearchBar = ({ placeholder = 'Tìm kiếm...', value, onChange, className = '' }) => {
  return (
    <div className={`relative group ${className}`}>
      {/* Search Icon */}
      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl transition-all duration-300 group-focus-within:text-cyan-600 dark:group-focus-within:text-emerald-400 group-focus-within:scale-110">
        🔍
      </span>
      
      {/* Input Field */}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="
          w-full pl-16 pr-6 py-5 
          rounded-2xl 
           dark:bg-gray-800/50
          border-2 border-gray-200 dark:border-cyan-700
          text-gray-900 dark:text-white
          placeholder:text-gray-400 dark:placeholder:text-gray-500
          focus:outline-none focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-cyan-500/20
          focus:border-cyan-500 dark:focus:border-cyan-500
          transition-all duration-300
          backdrop-blur-sm
          hover:border-cyan-400 dark:hover:border-cyan-600
          shadow-lg hover:shadow-xl
          font-medium
        "
      />
      
      {/* Clear Button (shows when there's text) */}
      {value && (
        <button
          onClick={() => onChange({ target: { value: '' } })}
          className="
            absolute right-6 top-1/2 -translate-y-1/2
            text-gray-400 hover:text-red-500 dark:hover:text-red-400
            transition-all duration-300
            hover:scale-125 active:scale-95
            text-xl
          "
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default SearchBar;