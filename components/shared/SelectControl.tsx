
import React from 'react';

interface Option {
  value: string | number;
  label: string;
}

interface SelectControlProps {
  id?: string;
  label: string;
  value: string | number;
  options: Option[];
  onChange: (value: string) => void;
  className?: string;
}

const SelectControl: React.FC<SelectControlProps> = ({
  id,
  label,
  value,
  options,
  onChange,
  className = ''
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      <label htmlFor={id || label} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        id={id || label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectControl;