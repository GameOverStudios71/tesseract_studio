import React, { useEffect } from 'react';

interface PanelControlsProps {
  onToggleLeft: () => void;
  onToggleRight: () => void;
  onResetPanels: () => void;
  leftWidth: number;
  rightWidth: number;
}

const PanelControls: React.FC<PanelControlsProps> = ({
  onToggleLeft,
  onToggleRight,
  onResetPanels,
  leftWidth,
  rightWidth
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd is pressed
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case '1':
            event.preventDefault();
            onToggleLeft();
            break;
          case '2':
            event.preventDefault();
            onToggleRight();
            break;
          case '0':
            event.preventDefault();
            onResetPanels();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggleLeft, onToggleRight, onResetPanels]);

  return (
    <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
      <button
        onClick={onToggleLeft}
        className="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
        title="Toggle left panel (Ctrl+1)"
      >
        L: {leftWidth}px
      </button>
      <button
        onClick={onToggleRight}
        className="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
        title="Toggle right panel (Ctrl+2)"
      >
        R: {rightWidth}px
      </button>
      <button
        onClick={onResetPanels}
        className="px-2 py-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition-colors"
        title="Reset panels (Ctrl+0)"
      >
        Reset
      </button>
    </div>
  );
};

export default PanelControls;
