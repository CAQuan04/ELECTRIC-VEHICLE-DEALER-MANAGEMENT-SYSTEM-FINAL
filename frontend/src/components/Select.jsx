import React from 'react';

const Select = ({ options = [], value, onChange, placeholder = '' }) => {
  return (
    <select 
      value={value} 
      onChange={onChange} 
      className="p-2 border border-gray-300 rounded-lg"
    >
      <option value="">{placeholder}</option>
      {options.map((opt, index) => (
        <option key={index} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
