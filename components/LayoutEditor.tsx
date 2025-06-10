import React, { useState, useCallback } from 'react';
import Toolbar from './Toolbar';
import CanvasArea from './CanvasArea';
import PropertiesPanel from './PropertiesPanel';
import LeftPanel from './LeftPanel'; // Import the new tabbed panel
import ResizablePanel from './ResizablePanel'; // Import the resizable panel
import PanelControls from './PanelControls'; // Import panel controls
import ThemeToggle from './ThemeToggle'; // Import theme toggle
import { useLayoutManager } from '../hooks/useLayoutManager';
import { useResizablePanels } from '../hooks/useResizablePanels';
import { VIEWPORT_BREAKPOINTS } from '../constants';
import { PredefinedComponentKey, ContainerSpecificProps } from '../types';

const LayoutEditor: React.FC = () => {
  const {
    elements,
    setElements,
    selectedElementId,
    selectedElement,
    rootElementIds,
    addElement,
    addControl,
    addPredefinedComponent, // Get the new function
    updateElementSingleProp,
    updateElementSpacingProp,
    updateElementGutterProp,
    deleteElement,
    selectElement,
  } = useLayoutManager();

  // Function to move an existing element to a new parent
  const moveElement = useCallback((elementId: string, newParentId: string | null) => {
    setElements(prevElements => {
      const updatedElements = { ...prevElements };
      const elementToMove = updatedElements[elementId];

      if (!elementToMove) return prevElements;

      // Remove from old parent
      if (elementToMove.parentId) {
        const oldParent = updatedElements[elementToMove.parentId];
        if (oldParent) {
          updatedElements[elementToMove.parentId] = {
            ...oldParent,
            children: oldParent.children.filter(childId => childId !== elementId)
          };
        }
      }

      // Add to new parent
      updatedElements[elementId] = {
        ...elementToMove,
        parentId: newParentId
      };

      if (newParentId && updatedElements[newParentId]) {
        updatedElements[newParentId] = {
          ...updatedElements[newParentId],
          children: [...updatedElements[newParentId].children, elementId]
        };
      }

      return updatedElements;
    });
  }, [setElements]);

  const [currentViewportWidth, setCurrentViewportWidth] = useState<string>(
    VIEWPORT_BREAKPOINTS.find(bp => bp.label === 'Full')?.width || '100%'
  );
  const [draggedElementType, setDraggedElementType] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Initialize resizable panels
  const {
    leftPanel,
    rightPanel,
    updateLeftPanel,
    updateRightPanel,
    resetPanels,
    togglePanel,
  } = useResizablePanels(
    {
      initialWidth: 288,
      minWidth: 200,
      maxWidth: 500,
      storageKey: 'slide-editor-left-panel-width'
    },
    {
      initialWidth: 384,
      minWidth: 250,
      maxWidth: 600,
      storageKey: 'slide-editor-right-panel-width'
    }
  );

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Necessary to allow dropping
    event.dataTransfer.dropEffect = 'move';

    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    // Try to get component key (old format)
    const componentKey = event.dataTransfer.getData('application/layout-component-key') as PredefinedComponentKey;
    if (componentKey) {
      addPredefinedComponent(componentKey, null);
      return;
    }

    // Try to get JSON data (new format for controls and toolbar elements)
    try {
      const jsonData = event.dataTransfer.getData('application/json');
      if (jsonData) {
        const data = JSON.parse(jsonData);

        if (data.type === 'control') {
          // Find the best parent for the control
          const target = event.target as HTMLElement;
          const containerElement = target.closest('[data-element-type="container"], [data-element-type="col"]');
          const parentId = containerElement?.getAttribute('data-element-id') || null;
          addControl(data.control, parentId);
        } else if (data.type === 'toolbar-element') {
          // Handle toolbar elements (container, row, col)
          const target = event.target as HTMLElement;
          let parentId: string | null = null;

          // Determine the appropriate parent based on element type
          if (data.elementType === 'container') {
            // Containers are added as root elements
            parentId = null;
          } else if (data.elementType === 'row') {
            // Rows should be added to containers
            const containerElement = target.closest('[data-element-type="container"]');
            parentId = containerElement?.getAttribute('data-element-id') || null;
          } else if (data.elementType === 'col') {
            // Columns should be added to rows
            const rowElement = target.closest('[data-element-type="row"]');
            parentId = rowElement?.getAttribute('data-element-id') || null;
          }

          addElement(data.elementType, parentId);
        } else if (data.type === 'existing-element') {
          // Handle moving existing elements
          const target = event.target as HTMLElement;
          let newParentId: string | null = null;

          // Determine the appropriate parent based on element type being moved
          if (data.elementType === 'container') {
            // Containers can only be moved to root or other containers
            const containerElement = target.closest('[data-element-type="container"]');
            newParentId = containerElement?.getAttribute('data-element-id') || null;
          } else if (data.elementType === 'row') {
            // Rows should be moved to containers
            const containerElement = target.closest('[data-element-type="container"]');
            newParentId = containerElement?.getAttribute('data-element-id') || null;
          } else if (data.elementType === 'col') {
            // Columns should be moved to rows
            const rowElement = target.closest('[data-element-type="row"]');
            newParentId = rowElement?.getAttribute('data-element-id') || null;
          } else if (data.elementType === 'control') {
            // Controls can be moved to containers or columns
            // First try to find the closest column, then container
            const colElement = target.closest('[data-element-type="col"]');
            const containerElement = target.closest('[data-element-type="container"]');

            if (colElement) {
              newParentId = colElement.getAttribute('data-element-id');
            } else if (containerElement) {
              newParentId = containerElement.getAttribute('data-element-id');
            } else {
              newParentId = null;
            }
          }

          // Don't move if it would create a circular reference
          const elementToMove = elements[data.elementId];
          if (elementToMove && newParentId !== elementToMove.parentId) {
            // Check if the new parent is not a descendant of the element being moved
            let currentParent = newParentId;
            let isCircular = false;
            while (currentParent) {
              if (currentParent === data.elementId) {
                isCircular = true;
                break;
              }
              currentParent = elements[currentParent]?.parentId || null;
            }

            if (!isCircular) {
              moveElement(data.elementId, newParentId);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error parsing drop data:', error);
    }
  }, [addPredefinedComponent, addControl, addElement, elements, moveElement]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedElementType(null);
  }, []);

  return (
    <div className="flex flex-col h-screen">
        <Toolbar
            onAddElement={addElement}
            selectedElement={selectedElement}
            currentViewportWidth={currentViewportWidth}
            onViewportChange={setCurrentViewportWidth}
            allElements={elements}
        />

        {/* Panel Controls */}
        <div className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 py-2 flex justify-between items-center">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Slide Area: {window.innerWidth ? Math.max(0, window.innerWidth - leftPanel.width - rightPanel.width - 32) : 'auto'}px
          </div>
          <div className="flex items-center space-x-3">
            <PanelControls
              onToggleLeft={() => togglePanel('left')}
              onToggleRight={() => togglePanel('right')}
              onResetPanels={resetPanels}
              leftWidth={leftPanel.width}
              rightWidth={rightPanel.width}
            />
            <ThemeToggle />
          </div>
        </div>
        <div className="flex flex-grow overflow-hidden"> {/* Main content area for panels */}
            {/* Left Resizable Panel - Components & Controls */}
            <div
              className="relative flex-shrink-0 h-full bg-slate-50 dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700"
              style={{ width: `${leftPanel.width}px` }}
            >
              <LeftPanel />

              {/* Resize handle for left panel */}
              <div
                className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-400 transition-colors duration-150 z-10 group"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateLeftPanel({ isResizing: true });

                  const startX = e.clientX;
                  const startWidth = leftPanel.width;

                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaX = e.clientX - startX;
                    const newWidth = Math.max(200, Math.min(500, startWidth + deltaX));
                    updateLeftPanel({ width: newWidth });
                  };

                  const handleMouseUp = () => {
                    updateLeftPanel({ isResizing: false });
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                  document.body.style.cursor = 'col-resize';
                  document.body.style.userSelect = 'none';
                }}
                title={`Resize left panel (${leftPanel.width}px)`}
              >
                <div className="absolute inset-0 w-full h-full group-hover:bg-blue-400 opacity-0 group-hover:opacity-50 transition-opacity duration-150" />
                <div className="absolute inset-y-0 -inset-x-1 w-3" />
              </div>

              {leftPanel.isResizing && (
                <>
                  <div className="absolute inset-0 bg-blue-100 bg-opacity-20 pointer-events-none border-2 border-blue-400 border-dashed" />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono z-20">
                    {leftPanel.width}px
                  </div>
                </>
              )}
            </div>

            {/* Canvas Area Wrapper for viewport simulation and drop handling */}
            <div
              className="flex-grow flex flex-col items-center bg-slate-200 dark:bg-slate-900 p-4 overflow-auto"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              role="application" // Indicates this region is an application to assistive technologies
              aria-label="Slide Canvas Drop Area"
            >
              {/* Check if there's a fullscreen container */}
              {(() => {
                const fullscreenContainer = Object.values(elements).find(el =>
                  el.type === 'container' &&
                  el.parentId === null &&
                  (el.props as Partial<ContainerSpecificProps>).isFullscreen
                );

                if (fullscreenContainer) {
                  // Render fullscreen container directly without wrapper
                  return (
                    <div className="w-full h-full relative">
                      <CanvasArea
                          rootElementIds={[fullscreenContainer.id]}
                          allElements={elements}
                          onSelectElement={selectElement}
                          selectedElementId={selectedElementId}
                      />
                    </div>
                  );
                }

                // Normal viewport rendering
                return (
                  <div
                    className="transition-all duration-300 ease-in-out bg-white dark:bg-slate-800 shadow-lg relative"
                    style={{
                      width: currentViewportWidth,
                      maxWidth: '100%',
                      height: currentViewportWidth === '100%' ? '100%' : undefined,
                      minHeight: '200px'
                    }}
                    // Clicks on the canvas background can deselect elements
                    onClick={(e) => { if (e.target === e.currentTarget) selectElement(null);}}
                  >
                    <CanvasArea
                        rootElementIds={rootElementIds}
                        allElements={elements}
                        onSelectElement={selectElement}
                        selectedElementId={selectedElementId}
                    />
                  </div>
                );
              })()}
            </div>

            {/* Right Resizable Panel - Properties */}
            <div
              className="relative flex-shrink-0 h-full bg-slate-50 dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700"
              style={{ width: `${rightPanel.width}px` }}
            >
              <PropertiesPanel
                  selectedElement={selectedElement}
                  onUpdateProp={updateElementSingleProp}
                  onUpdateSpacingProp={updateElementSpacingProp}
                  onUpdateGutterProp={updateElementGutterProp}
                  onDeleteElement={deleteElement}
              />

              {/* Resize handle for right panel */}
              <div
                className="absolute top-0 left-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-blue-400 transition-colors duration-150 z-10 group"
                onMouseDown={(e) => {
                  e.preventDefault();
                  updateRightPanel({ isResizing: true });

                  const startX = e.clientX;
                  const startWidth = rightPanel.width;

                  const handleMouseMove = (e: MouseEvent) => {
                    const deltaX = startX - e.clientX;
                    const newWidth = Math.max(250, Math.min(600, startWidth + deltaX));
                    updateRightPanel({ width: newWidth });
                  };

                  const handleMouseUp = () => {
                    updateRightPanel({ isResizing: false });
                    document.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseup', handleMouseUp);
                    document.body.style.cursor = '';
                    document.body.style.userSelect = '';
                  };

                  document.addEventListener('mousemove', handleMouseMove);
                  document.addEventListener('mouseup', handleMouseUp);
                  document.body.style.cursor = 'col-resize';
                  document.body.style.userSelect = 'none';
                }}
                title={`Resize right panel (${rightPanel.width}px)`}
              >
                <div className="absolute inset-0 w-full h-full group-hover:bg-blue-400 opacity-0 group-hover:opacity-50 transition-opacity duration-150" />
                <div className="absolute inset-y-0 -inset-x-1 w-3" />
              </div>

              {rightPanel.isResizing && (
                <>
                  <div className="absolute inset-0 bg-blue-100 bg-opacity-20 pointer-events-none border-2 border-blue-400 border-dashed" />
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono z-20">
                    {rightPanel.width}px
                  </div>
                </>
              )}
            </div>
        </div>
    </div>
  );
};

export default LayoutEditor;
