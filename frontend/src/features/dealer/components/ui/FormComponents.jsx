import React from 'react';

/**
 * FormGroup - Wrapper cho form field
 */
export const FormGroup = ({ children, className = '' }) => (
  <div className={`mb-8 ${className}`}>
    {children}
  </div>
);

/**
 * Label - Modern form label
 */
export const Label = ({ children, required, htmlFor, className = '' }) => (
  <label 
    htmlFor={htmlFor} 
    className={`block text-sm font-bold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-3 ${className}`}
  >
    {children}
    {required && <span className="text-red-500 dark:text-red-400 ml-2 text-lg">*</span>}
  </label>
);

/**
 * Input - Modern text input field
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
  <div>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-full px-6 py-4 rounded-2xl 
        bg-white dark:bg-gray-800/50
        border-2 border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-white
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        focus:outline-none focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-emerald-500/20
        focus:border-cyan-500 dark:focus:border-emerald-500
        transition-all duration-300
        backdrop-blur-sm
        hover:border-cyan-400 dark:hover:border-emerald-600
        ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
        ${className}
      `}
      {...props}
    />
    {error && (
      <p className="text-red-500 dark:text-red-400 text-sm mt-2 font-semibold flex items-center gap-2">
        <span>⚠️</span>
        {error}
      </p>
    )}
  </div>
);

/**
 * Select - Modern dropdown select
 */
export const Select = ({ value, onChange, options, placeholder, error, className = '', ...props }) => (
  <div>
    <select
      value={value}
      onChange={onChange}
      className={`
        w-full px-6 py-4 rounded-2xl 
        bg-white dark:bg-gray-800/50
        border-2 border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-white
        focus:outline-none focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-emerald-500/20
        focus:border-cyan-500 dark:focus:border-emerald-500
        transition-all duration-300
        backdrop-blur-sm
        hover:border-cyan-400 dark:hover:border-emerald-600
        cursor-pointer
        ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
        ${className}
      `}
      {...props}
    >
      {placeholder && (
        <option value="" className="text-gray-400 dark:text-gray-500">
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option 
          key={option.value} 
          value={option.value}
          className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        >
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-red-500 dark:text-red-400 text-sm mt-2 font-semibold flex items-center gap-2">
        <span>⚠️</span>
        {error}
      </p>
    )}
  </div>
);

/**
 * Textarea - Modern multi-line text input
 */
export const Textarea = ({ placeholder, value, onChange, rows = 4, error, className = '', ...props }) => (
  <div>
    <textarea
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      rows={rows}
      className={`
        w-full px-6 py-4 rounded-2xl 
        bg-white dark:bg-gray-800/50
        border-2 border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-white
        placeholder:text-gray-400 dark:placeholder:text-gray-500
        focus:outline-none focus:ring-4 focus:ring-cyan-500/20 dark:focus:ring-emerald-500/20
        focus:border-cyan-500 dark:focus:border-emerald-500
        transition-all duration-300
        backdrop-blur-sm
        resize-none
        hover:border-cyan-400 dark:hover:border-emerald-600
        ${error ? 'border-red-500 dark:border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
        ${className}
      `}
      {...props}
    />
    {error && (
      <p className="text-red-500 dark:text-red-400 text-sm mt-2 font-semibold flex items-center gap-2">
        <span>⚠️</span>
        {error}
      </p>
    )}
  </div>
);