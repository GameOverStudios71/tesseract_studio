import React, { useState, useEffect } from 'react';

interface SpinBoxProps {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  id?: string;
  className?: string;
  disabled?: boolean;
}

const SpinBox: React.FC<SpinBoxProps> = ({
  label,
  value,
  onChange,
  min = -999,
  max = 999,
  step = 1,
  suffix = '',
  id,
  className = '',
  disabled = false
}) => {
  const [inputValue, setInputValue] = useState(value.toString());
  const [isFocused, setIsFocused] = useState(false);
  const [isShiftPressed, setIsShiftPressed] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setInputValue(value.toString());
    }
  }, [value, isFocused]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift' && isFocused) {
        setIsShiftPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftPressed(false);
      }
    };

    if (isFocused) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }
  }, [isFocused]);

  const parseValue = (val: string): number => {
    const parsed = parseFloat(val);
    return isNaN(parsed) ? 0 : parsed;
  };

  const clampValue = (val: number): number => {
    return Math.max(min, Math.min(max, val));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    // Allow empty input or negative sign
    if (newValue === '' || newValue === '-') {
      return;
    }
    
    const parsed = parseValue(newValue);
    if (!isNaN(parsed)) {
      const clamped = clampValue(parsed);
      onChange(clamped.toString());
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    setIsShiftPressed(false);
    const parsed = parseValue(inputValue);
    const clamped = clampValue(parsed);
    const finalValue = clamped.toString();
    setInputValue(finalValue);
    onChange(finalValue);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleIncrement = () => {
    const current = parseValue(inputValue);
    const newValue = clampValue(current + step);
    const finalValue = newValue.toString();
    setInputValue(finalValue);
    onChange(finalValue);
  };

  const handleDecrement = () => {
    const current = parseValue(inputValue);
    const newValue = clampValue(current - step);
    const finalValue = newValue.toString();
    setInputValue(finalValue);
    onChange(finalValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const keyStep = e.shiftKey ? step * 10 : step;
      const current = parseValue(inputValue);
      const newValue = clampValue(current + keyStep);
      const finalValue = newValue.toString();
      setInputValue(finalValue);
      onChange(finalValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const keyStep = e.shiftKey ? step * 10 : step;
      const current = parseValue(inputValue);
      const newValue = clampValue(current - keyStep);
      const finalValue = newValue.toString();
      setInputValue(finalValue);
      onChange(finalValue);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleInputBlur();
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Only handle wheel events when the input is focused
    if (!isFocused) return;

    e.preventDefault();

    // Use larger steps when Shift is held
    const wheelStep = e.shiftKey ? step * 10 : step;
    const current = parseValue(inputValue);

    // deltaY > 0 means scrolling down, deltaY < 0 means scrolling up
    let newValue;
    if (e.deltaY > 0) {
      newValue = clampValue(current - wheelStep);
    } else if (e.deltaY < 0) {
      newValue = clampValue(current + wheelStep);
    } else {
      return;
    }

    const finalValue = newValue.toString();
    setInputValue(finalValue);
    onChange(finalValue);
  };

  const currentValue = parseValue(inputValue);
  const canIncrement = currentValue < max;
  const canDecrement = currentValue > min;

  return (
    <div className={`mb-3 ${className}`}>
      <label 
        htmlFor={id || label} 
        className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </label>
      <div className="relative flex">
        <input
          type="text"
          id={id || label}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          onWheel={handleWheel}
          disabled={disabled}
          className="w-full pl-2 pr-12 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-500"
          placeholder="0"
          title="Use arrow keys or mouse wheel to increment/decrement. Hold Shift for larger steps."
        />
        
        {suffix && !isShiftPressed && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-xs text-gray-500 dark:text-gray-400 pointer-events-none">
            {suffix}
          </div>
        )}

        {isShiftPressed && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 dark:text-blue-400 pointer-events-none font-medium">
            ×10
          </div>
        )}
        
        <div className="flex flex-col border-l-0 border border-gray-300 dark:border-gray-600 rounded-r-md overflow-hidden">
          <button
            type="button"
            onClick={handleIncrement}
            disabled={disabled || !canIncrement}
            className="px-2 py-0.5 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-gray-600 dark:text-gray-300 text-xs leading-none border-b border-gray-300 dark:border-gray-600 transition-colors"
            title="Increment"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDecrement}
            disabled={disabled || !canDecrement}
            className="px-2 py-0.5 bg-white dark:bg-slate-700 hover:bg-gray-50 dark:hover:bg-slate-600 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 text-gray-600 dark:text-gray-300 text-xs leading-none transition-colors"
            title="Decrement"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {(min !== -999 || max !== 999) && (
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Range: {min} to {max} • Hold Shift for ×10 steps
        </div>
      )}
    </div>
  );
};

export default SpinBox;
