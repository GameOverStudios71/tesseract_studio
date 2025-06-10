
import React from 'react';
import { ElementType, LayoutElement, ContainerSpecificProps } from '../types';
import Button from './shared/Button';
import { VIEWPORT_BREAKPOINTS } from '../constants';

interface ToolbarProps {
  onAddElement: (type: ElementType, parentId?: string) => void;
  selectedElement: LayoutElement | null;
  currentViewportWidth: string;
  onViewportChange: (width: string) => void;
  allElements: Record<string, LayoutElement>;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddElement,
  selectedElement,
  currentViewportWidth,
  onViewportChange,
  allElements
}) => {
  const canAddRow = selectedElement?.type === 'container';
  const canAddCol = selectedElement?.type === 'row';

  // Check if there's a fullscreen container
  const hasFullscreenContainer = Object.values(allElements).some(el =>
    el.type === 'container' &&
    el.parentId === null &&
    (el.props as Partial<ContainerSpecificProps>).isFullscreen
  );

  const canAddContainer = !hasFullscreenContainer;

  const handleDragStart = (e: React.DragEvent, elementType: ElementType) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'toolbar-element',
      elementType: elementType
    }));
  };

  return (
    <div className="p-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
      {hasFullscreenContainer && (
        <div className="bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded px-3 py-1 text-xs text-blue-800 dark:text-blue-200 mr-4">
          Fullscreen mode active - Disable fullscreen to add more elements
        </div>
      )}

      <div className="flex space-x-2 items-center">
        <Button
          onClick={() => onAddElement('container')}
          variant="primary"
          size="sm"
          disabled={!canAddContainer}
          aria-label={canAddContainer ? "Add Container (click or drag)" : "Cannot add container - fullscreen mode active"}
          title={canAddContainer ? "Click to add or drag to canvas" : "Cannot add container - fullscreen mode active"}
          draggable={canAddContainer}
          onDragStart={(e) => handleDragStart(e, 'container')}
          className={canAddContainer ? 'cursor-grab active:cursor-grabbing' : ''}
        >
          Add Container
        </Button>
        <Button
          onClick={() => selectedElement && onAddElement('row', selectedElement.id)}
          disabled={!canAddRow}
          variant="primary"
          size="sm"
          aria-label={canAddRow ? `Add Row to selected ${selectedElement?.name} (click or drag)` : "Select a Container to add a Row"}
          title={canAddRow ? "Click to add to selected container or drag to canvas" : "Select a Container to add a Row"}
          aria-disabled={!canAddRow}
          draggable={canAddRow}
          onDragStart={(e) => handleDragStart(e, 'row')}
          className={canAddRow ? 'cursor-grab active:cursor-grabbing' : ''}
        >
          Add Row
        </Button>
        <Button
          onClick={() => selectedElement && onAddElement('col', selectedElement.id)}
          disabled={!canAddCol}
          variant="primary"
          size="sm"
          aria-label={canAddCol ? `Add Column to selected ${selectedElement?.name} (click or drag)` : "Select a Row to add a Column"}
          title={canAddCol ? "Click to add to selected row or drag to canvas" : "Select a Row to add a Column"}
          aria-disabled={!canAddCol}
          draggable={canAddCol}
          onDragStart={(e) => handleDragStart(e, 'col')}
          className={canAddCol ? 'cursor-grab active:cursor-grabbing' : ''}
        >
          Add Column
        </Button>
      </div>
      
      <div className="flex space-x-1 items-center" role="group" aria-label="Viewport Sizing Controls">
        {VIEWPORT_BREAKPOINTS.map(bp => (
          <Button
            key={bp.label}
            onClick={() => onViewportChange(bp.width)}
            variant={currentViewportWidth === bp.width ? 'primary' : 'ghost'}
            size="sm"
            className={`px-2.5 py-1 ${currentViewportWidth === bp.width ? '' : 'text-slate-600'}`}
            aria-pressed={currentViewportWidth === bp.width}
            aria-label={`Set viewport to ${bp.label} (${bp.width === '100%' ? 'Full width' : bp.width})`}
          >
            {bp.displayText}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
