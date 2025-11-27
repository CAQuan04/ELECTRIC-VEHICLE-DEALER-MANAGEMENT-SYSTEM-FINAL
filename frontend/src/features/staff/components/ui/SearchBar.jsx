import React from 'react';
import { Search, X } from "lucide-react";

const SearchBar = ({ placeholder, value, onChange, className = '' }) => (
  <div className={`relative group ${className}`}>
    {/* Icon Search */}
    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
    
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="
        w-full pl-12 pr-10 py-3 rounded-xl 
        bg-gray-800/50 dark:bg-[#1e293b] /* Nền tối, hơi trong suốt */
        border border-gray-600 dark:border-gray-700 /* Viền xám tối */
        text-gray-100 dark:text-white /* Chữ màu trắng sáng */
        placeholder:text-gray-500 /* Placeholder màu xám chìm */
        focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 /* Hiệu ứng focus màu Cyan */
        outline-none transition-all duration-300
      "
    />
    
    {/* Nút xóa (X) */}
    {value && (
      <button 
        onClick={() => onChange({ target: { value: '' } })} 
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-red-400 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default SearchBar;