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
  <label htmlFor={htmlFor} className={`block text-sm font-medium theme-text-secondary mb-2 ${className}`}>
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
        theme-input w-full px-4 py-3 rounded-xl border
        focus:outline-none focus:ring-2
        ${error ? 'border-red-500 focus:border-red-500' : ''}
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
        theme-input w-full px-4 py-3 rounded-xl border
        focus:outline-none focus:ring-2
        ${error ? 'border-red-500 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
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
        theme-input w-full px-4 py-3 rounded-xl border resize-none
        focus:outline-none focus:ring-2
        ${error ? 'border-red-500 focus:border-red-500' : ''}
        ${className}
      `}
      {...props}
    />
    {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
  </>
);
