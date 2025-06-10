import React from 'react';
import { ColProps } from '../../types';

interface ColComponentProps {
  props: Partial<ColProps>;
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  id: string;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
}

const Col: React.FC<ColComponentProps> = ({
  props,
  children,
  isSelected,
  onClick,
  id,
  draggable = false,
  onDragStart
}) => {
  const {
    padding = { top: '2', right: '2', bottom: '2', left: '2' },
    margin = { top: '0', right: '0', bottom: '0', left: '0' },
    backgroundColor = 'neutral-100',
    customClasses = '',
    minHeight = '40px',
    span = 'auto',
    offset = '0',
    order = 'none',
    alignSelf = 'auto'
  } = props;

  // Build CSS classes
  const paddingClasses = `pt-${padding.top} pr-${padding.right} pb-${padding.bottom} pl-${padding.left}`;
  const marginClasses = `mt-${margin.top} mr-${margin.right} mb-${margin.bottom} ml-${margin.left}`;
  const backgroundClass = `bg-${backgroundColor}`;
  
  // Grid/Flex classes
  const spanClass = span === 'auto' ? 'flex-1' : `w-${span}/12`;
  const offsetClass = offset !== '0' ? `ml-${offset}/12` : '';
  const orderClass = order === 'none' ? '' : 
                    order === 'first' ? 'order-first' :
                    order === 'last' ? 'order-last' : `order-${order}`;
  const alignSelfClass = alignSelf === 'auto' ? '' : `self-${alignSelf}`;
  
  const selectionClasses = isSelected 
    ? 'ring-2 ring-purple-500 ring-offset-2' 
    : 'hover:ring-1 hover:ring-purple-300';

  const classes = [
    'flex-shrink-0',
    spanClass,
    offsetClass,
    orderClass,
    alignSelfClass,
    paddingClasses,
    marginClasses,
    backgroundClass,
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
      data-element-type="col"
      role="gridcell"
      aria-label={`Column ${span !== 'auto' ? `(${span}/12)` : '(auto)'}`}
      draggable={draggable}
      onDragStart={onDragStart}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-purple-600 text-white px-2 py-1 rounded-t text-xs font-medium">
          Col {span !== 'auto' && `(${span}/12)`}
        </div>
      )}
      
      {children}
      
      {/* Empty state */}
      {!children && (
        <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm min-h-[40px]">
          Empty Column - Add content here
        </div>
      )}
    </div>
  );
};

export default Col;
