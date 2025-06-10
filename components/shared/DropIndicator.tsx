import React from 'react';

interface DropIndicatorProps {
  position: 'before' | 'after' | 'inside';
  isVisible: boolean;
}

const DropIndicator: React.FC<DropIndicatorProps> = ({ position, isVisible }) => {
  if (!isVisible) return null;

  const getIndicatorClasses = () => {
    const baseClasses = 'absolute z-50 transition-opacity duration-200';
    
    switch (position) {
      case 'before':
        return `${baseClasses} -top-1 left-0 right-0 h-0.5 bg-blue-500`;
      case 'after':
        return `${baseClasses} -bottom-1 left-0 right-0 h-0.5 bg-blue-500`;
      case 'inside':
        return `${baseClasses} inset-0 border-2 border-dashed border-blue-500 bg-blue-50 dark:bg-blue-900 bg-opacity-20 rounded`;
      default:
        return baseClasses;
    }
  };

  return (
    <div className={getIndicatorClasses()}>
      {position === 'inside' && (
        <div className="flex items-center justify-center h-full">
          <span className="text-blue-600 dark:text-blue-400 text-xs font-medium bg-white dark:bg-slate-800 px-2 py-1 rounded shadow">
            Drop here
          </span>
        </div>
      )}
    </div>
  );
};

export default DropIndicator;
