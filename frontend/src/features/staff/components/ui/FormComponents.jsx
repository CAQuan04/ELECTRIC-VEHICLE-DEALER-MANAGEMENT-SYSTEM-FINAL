import React from 'react';

/**
 * FormGroup - Wrapper cho form field
 */
export const FormGroup = ({ children, className = '' }) => (
  <div className={`mb-6 ${className}`}>
    {children}
  </div>
);

/**
 * Label - Form label
 */
export const Label = ({ children, required, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`block text-sm font-medium text-gray-300 mb-2 ${className}`}>
    {children}
    {required && <span className="text-red-400 ml-1">*</span>}
  </label>
);

/**
 * Input - Text input field
 */
export const Input = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  className = '',
  ...props 
}) => (
  <>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 
        focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all
        ${error ? 'border-red-500' : 'border-white/10'}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </>
);

/**
 * Select - Dropdown select
 */
export const Select = ({ value, onChange, options, placeholder, error, className = '', ...props }) => (
  <>
    <select
      value={value}
      onChange={onChange}
      className={`
        w-full px-4 py-3 bg-white/5 border rounded-xl text-white 
        focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all
        ${error ? 'border-red-500' : 'border-white/10'}
        ${className}
      `}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value} className="bg-gray-800">
          {option.label}
        </option>
      ))}
    </select>
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </>
);

/**
 * Textarea - Multi-line text input
 */
export const Textarea = ({ placeholder, value, onChange, rows = 4, error, className = '', ...props }) => (
  <>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`
        w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-gray-500 
        focus:outline-none focus:border-emerald-500 focus:bg-white/10 transition-all resize-none
        ${error ? 'border-red-500' : 'border-white/10'}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </>
);
