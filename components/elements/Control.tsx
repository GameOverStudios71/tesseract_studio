import React from 'react';
import { ControlProps } from '../../types';

interface ControlComponentProps {
  props: Partial<ControlProps>;
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  id: string;
}

const Control: React.FC<ControlComponentProps> = ({
  props,
  children,
  isSelected,
  onClick,
  id
}) => {
  const {
    padding = { top: '2', right: '3', bottom: '2', left: '3' },
    margin = { top: '0', right: '0', bottom: '0', left: '0' },
    backgroundColor = 'white',
    customClasses = '',
    controlType = 'button',
    text = 'Control',
    placeholder = '',
    href = '#',
    src = '',
    alt = '',
    type = 'text',
    value = '',
    checked = false,
    disabled = false,
    htmlFor = '',
    target = '_self',
    variant = 'primary',
    size = 'md',
    width = '100',
    height = '100',
    level = 'h1',
    rows = '3'
  } = props;

  // Build CSS classes
  const paddingClasses = `pt-${padding.top} pr-${padding.right} pb-${padding.bottom} pl-${padding.left}`;
  const marginClasses = `mt-${margin.top} mr-${margin.right} mb-${margin.bottom} ml-${margin.left}`;
  const backgroundClass = `bg-${backgroundColor}`;
  
  const selectionClasses = isSelected 
    ? 'ring-2 ring-orange-500 ring-offset-2' 
    : 'hover:ring-1 hover:ring-orange-300';

  const baseClasses = [
    paddingClasses,
    marginClasses,
    backgroundClass,
    selectionClasses,
    'transition-all duration-200 cursor-pointer relative inline-block',
    customClasses
  ].filter(Boolean).join(' ');

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClick();
  };

  const renderControl = () => {
    switch (controlType) {
      case 'button':
        return (
          <button
            className={`${baseClasses} border border-slate-300 dark:border-slate-600 rounded ${
              variant === 'primary' ? 'bg-blue-500 text-white' : 
              variant === 'secondary' ? 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100' :
              'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100'
            }`}
            onClick={handleClick}
            disabled={disabled}
          >
            {text}
          </button>
        );

      case 'input':
        return (
          <input
            type={type}
            placeholder={placeholder}
            value={value}
            className={`${baseClasses} border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-100 dark:bg-slate-700`}
            onClick={handleClick}
            disabled={disabled}
            readOnly
          />
        );

      case 'textarea':
        return (
          <textarea
            placeholder={placeholder}
            value={value}
            className={`${baseClasses} border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-100 dark:bg-slate-700 resize-none`}
            onClick={handleClick}
            disabled={disabled}
            readOnly
            rows={parseInt(rows) || 3}
          />
        );

      case 'label':
        return (
          <label
            htmlFor={htmlFor}
            className={`${baseClasses} text-slate-700 dark:text-slate-300 font-medium`}
            onClick={handleClick}
          >
            {text}
          </label>
        );

      case 'heading':
        const HeadingTag = (level || 'h1') as keyof JSX.IntrinsicElements;
        return (
          <HeadingTag
            className={`${baseClasses} font-bold text-slate-900 dark:text-slate-100 ${
              HeadingTag === 'h1' ? 'text-2xl' :
              HeadingTag === 'h2' ? 'text-xl' :
              HeadingTag === 'h3' ? 'text-lg' :
              HeadingTag === 'h4' ? 'text-base' :
              HeadingTag === 'h5' ? 'text-sm' :
              'text-xs'
            }`}
            onClick={handleClick}
          >
            {text}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p
            className={`${baseClasses} text-slate-700 dark:text-slate-300`}
            onClick={handleClick}
          >
            {text}
          </p>
        );

      case 'link':
        return (
          <a
            href={href}
            target={target}
            className={`${baseClasses} text-blue-500 hover:text-blue-700 underline`}
            onClick={handleClick}
          >
            {text}
          </a>
        );

      case 'image':
        return (
          <img
            src={src || 'https://via.placeholder.com/150x100'}
            alt={alt}
            className={`${baseClasses} max-w-full h-auto`}
            style={{
              width: width ? `${width}px` : 'auto',
              height: height ? `${height}px` : 'auto'
            }}
            onClick={handleClick}
          />
        );

      case 'checkbox':
        return (
          <label className={`${baseClasses} flex items-center space-x-2`} onClick={handleClick}>
            <input
              type="checkbox"
              checked={checked}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              readOnly
            />
            <span className="text-slate-700 dark:text-slate-300">{text}</span>
          </label>
        );

      case 'radio':
        return (
          <label className={`${baseClasses} flex items-center space-x-2`} onClick={handleClick}>
            <input
              type="radio"
              checked={checked}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              readOnly
            />
            <span className="text-slate-700 dark:text-slate-300">{text}</span>
          </label>
        );

      case 'select':
        return (
          <select
            className={`${baseClasses} border border-slate-300 dark:border-slate-600 rounded text-slate-900 dark:text-slate-100 dark:bg-slate-700`}
            onClick={handleClick}
            disabled={disabled}
          >
            <option>Select option...</option>
          </select>
        );

      case 'divider':
        return (
          <hr
            className={`${baseClasses} border-slate-300 dark:border-slate-600 w-full`}
            onClick={handleClick}
          />
        );

      case 'spacer':
        return (
          <div
            className={`${baseClasses} bg-slate-100 dark:bg-slate-700 border-2 border-dashed border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs text-slate-500`}
            style={{
              width: width ? `${width}px` : '100%',
              height: height ? `${height}px` : '20px',
              minHeight: '20px'
            }}
            onClick={handleClick}
          >
            Spacer
          </div>
        );

      case 'badge':
        return (
          <span
            className={`${baseClasses} inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              variant === 'success' ? 'bg-green-100 text-green-800' :
              variant === 'warning' ? 'bg-yellow-100 text-yellow-800' :
              variant === 'error' ? 'bg-red-100 text-red-800' :
              'bg-blue-100 text-blue-800'
            }`}
            onClick={handleClick}
          >
            {text}
          </span>
        );

      default:
        return (
          <div
            className={`${baseClasses} border border-red-400 bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300`}
            onClick={handleClick}
          >
            Unknown control: {controlType}
          </div>
        );
    }
  };

  return (
    <div className="inline-block">
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-orange-600 text-white px-2 py-1 rounded-t text-xs font-medium z-10">
          {controlType} ({id})
        </div>
      )}
      
      {renderControl()}
    </div>
  );
};

export default Control;
