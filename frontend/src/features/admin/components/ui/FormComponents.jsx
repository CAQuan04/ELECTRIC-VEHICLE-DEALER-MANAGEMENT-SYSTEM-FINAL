import React from 'react';
import { ChevronRight } from "lucide-react";

// Wrapper cho các nhóm form
export const FormGroup = ({ children, className = '' }) => (
  <div className={`mb-5 ${className}`}>{children}</div>
);

// Label: Luôn màu sáng dễ đọc
export const Label = ({ children, required, className = '' }) => (
  <label className={`block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 ${className}`}>
    {children}
    {required && <span className="text-red-500 ml-1">*</span>}
  </label>
);

// Input: Nền tối, chữ trắng
export const Input = ({ className = '', error, ...props }) => (
  <div className="relative">
    <input 
      className={`
        w-full px-4 py-3 rounded-xl 
        bg-[#1e293b] /* Nền tối cố định */
        border border-gray-700 
        text-white placeholder:text-gray-500
        focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 
        transition-all duration-300 
        ${error ? 'border-red-500' : ''} ${className}
      `} 
      {...props} 
    />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

// Select: QUAN TRỌNG - Sửa lỗi nền trắng ở option
export const Select = ({ options = [], className = '', error, ...props }) => (
  <div className="relative">
    <select 
      className={`
        w-full px-4 py-3 rounded-xl 
        bg-[#1e293b] /* Nền Select tối */
        border border-gray-700 
        text-white   /* Chữ Select trắng */
        focus:outline-none focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 
        transition-all duration-300 cursor-pointer appearance-none 
        ${error ? 'border-red-500' : ''} ${className}
      `} 
      {...props}
    >
      {options.map((opt, idx) => (
        <option 
          key={idx} 
          value={opt.value} 
          className="bg-[#1e293b] text-white" /* ÉP CỨNG: Nền tối, chữ trắng cho từng option */
        >
          {opt.label}
        </option>
      ))}
    </select>
    
    {/* Icon mũi tên bên phải */}
    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
      <ChevronRight className="w-4 h-4 rotate-90" />
    </div>
  </div>
);