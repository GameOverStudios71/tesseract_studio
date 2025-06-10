import React from 'react';
import { ContainerProps } from '../../types';

interface ContainerComponentProps {
  props: Partial<ContainerProps>;
  children: React.ReactNode;
  isSelected: boolean;
  onClick: () => void;
  id: string;
}

const Container: React.FC<ContainerComponentProps> = ({
  props,
  children,
  isSelected,
  onClick,
  id
}) => {
  const {
    padding = { top: '2', right: '2', bottom: '2', left: '2' },
    margin = { top: '0', right: '0', bottom: '0', left: '0' },
    backgroundColor = 'slate-100',
    customClasses = '',
    minHeight = '60px',
    isFluid = false,
    isFullscreen = false
  } = props;

  // Build CSS classes
  const paddingClasses = `pt-${padding.top} pr-${padding.right} pb-${padding.bottom} pl-${padding.left}`;
  const marginClasses = `mt-${margin.top} mr-${margin.right} mb-${margin.bottom} ml-${margin.left}`;
  const backgroundClass = `bg-${backgroundColor}`;
  
  // Fullscreen mode overrides most other styling
  const baseClasses = isFullscreen 
    ? 'w-screen h-screen fixed top-0 left-0 z-50 overflow-auto'
    : isFluid 
      ? 'w-full' 
      : 'container mx-auto';

  const selectionClasses = isSelected 
    ? 'ring-2 ring-blue-500 ring-offset-2' 
    : 'hover:ring-1 hover:ring-blue-300';

  const classes = [
    baseClasses,
    !isFullscreen && paddingClasses,
    !isFullscreen && marginClasses,
    backgroundClass,
    selectionClasses,
    'transition-all duration-200 cursor-pointer relative',
    customClasses
  ].filter(Boolean).join(' ');

  const style = {
    minHeight: isFullscreen ? '100vh' : minHeight,
    ...(isFullscreen && {
      padding: `${padding.top * 4}px ${padding.right * 4}px ${padding.bottom * 4}px ${padding.left * 4}px`,
      margin: 0
    })
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
      data-element-type="container"
      role="region"
      aria-label={`Container ${isFullscreen ? '(Fullscreen)' : isFluid ? '(Fluid)' : ''}`}
    >
      {/* Fullscreen indicator */}
      {isFullscreen && (
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium z-10">
          FULLSCREEN
        </div>
      )}
      
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-6 left-0 bg-blue-600 text-white px-2 py-1 rounded-t text-xs font-medium">
          Container {isFullscreen && '(Fullscreen)'} {isFluid && '(Fluid)'}
        </div>
      )}
      
      {children}
      
      {/* Empty state */}
      {!children && (
        <div className="flex items-center justify-center text-slate-500 dark:text-slate-400 text-sm min-h-[60px]">
          {isFullscreen ? 'Fullscreen Container - Add content here' : 'Empty Container - Add rows or content here'}
        </div>
      )}
    </div>
  );
};

export default Container;
