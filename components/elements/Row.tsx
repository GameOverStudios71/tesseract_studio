import React from 'react';
import { RowProps } from '../../types';

interface RowComponentProps {
  props: Partial<RowProps>;
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  id: string;
}

const Row: React.FC<RowComponentProps> = ({
  props,
  children,
  isSelected,
  onClick,
  id
}) => {
  const {
    padding = { top: '0', right: '0', bottom: '0', left: '0' },
    margin = { top: '0', right: '0', bottom: '0', left: '0' },
    backgroundColor = 'zinc-100',
    customClasses = '',
    minHeight = '80px',
    gutters = { x: '4', y: '4' },
    justifyContent = 'start',
    alignItems = 'stretch'
  } = props;

  // Build CSS classes
  const paddingClasses = `pt-${padding.top} pr-${padding.right} pb-${padding.bottom} pl-${padding.left}`;
  const marginClasses = `mt-${margin.top} mr-${margin.right} mb-${margin.bottom} ml-${margin.left}`;
  const backgroundClass = `bg-${backgroundColor}`;
  const gutterClasses = `gap-x-${gutters.x} gap-y-${gutters.y}`;
  
  // Flexbox classes
  const justifyClass = `justify-${justifyContent}`;
  const alignClass = `items-${alignItems}`;
  
  const selectionClasses = isSelected 
    ? 'ring-2 ring-green-500 ring-offset-2' 
    : 'hover:ring-1 hover:ring-green-300';

  const classes = [
    'flex flex-wrap w-full',
    paddingClasses,
    marginClasses,
    backgroundClass,
    gutterClasses,
    justifyClass,
    alignClass,
    selectionClasses,
    'transition-all duration-200 cursor-pointer relative',
    customClasses
  ].filter(Boolean).join(' ');

  const style = {
    minHeight
  };

  return (
    <div
      className={classes}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      data-element-id={id}
      data-element-type="row"
      role="group"
      aria-label="Row container"
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-green-600 text-white px-2 py-1 rounded-t text-xs font-medium">
          Row
        </div>
      )}
      
      {children}
      
      {/* Empty state */}
      {!children && (
        <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm w-full min-h-[60px]">
          Empty Row - Add columns here
        </div>
      )}
    </div>
  );
};

export default Row;
