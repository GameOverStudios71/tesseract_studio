
import React from 'react';
import { PREDEFINED_COMPONENTS, PredefinedComponent } from '../lib/componentDefinitions.tsx';
import { PredefinedComponentKey } from '../types';

interface ComponentsPanelProps {
  // Future props might include search/filter functionality
}

const ComponentsPanel: React.FC<ComponentsPanelProps> = () => {

  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, componentKey: PredefinedComponentKey) => {
    event.dataTransfer.setData('application/layout-component-key', componentKey);
    event.dataTransfer.effectAllowed = 'copy';
  };

  // Defensive check for PREDEFINED_COMPONENTS
  if (!PREDEFINED_COMPONENTS || !Array.isArray(PREDEFINED_COMPONENTS)) {
    console.error("CRITICAL: PREDEFINED_COMPONENTS is not available or not an array. Value:", PREDEFINED_COMPONENTS);
    return (
      <div
          className="w-full p-4 overflow-y-auto h-full"
          aria-labelledby="components-panel-title"
      >
        <h3 id="components-panel-title" className="text-lg font-semibold mb-4 text-slate-800 sticky top-0 bg-slate-50 py-2 z-10">
          Components
        </h3>
        <p className="text-xs text-red-600 bg-red-100 p-2 rounded-md">
          Error: Components data could not be loaded. Please check the console for details.
        </p>
      </div>
    );
  }

  return (
    <div
        className="w-full p-4 overflow-y-auto h-full"
        aria-labelledby="components-panel-title"
    >
      <h3 id="components-panel-title" className="text-base font-semibold mb-3 text-slate-800 dark:text-slate-200 sticky top-0 bg-slate-50 dark:bg-slate-800 py-2 z-10">
        Components
      </h3>
      <div className="space-y-3">
        {PREDEFINED_COMPONENTS.map((component: PredefinedComponent) => (
          <div
            key={component.key}
            draggable
            onDragStart={(e) => handleDragStart(e, component.key)}
            className="p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 hover:shadow-md hover:border-sky-500 dark:hover:border-sky-400 cursor-grab transition-all"
            role="button"
            tabIndex={0}
            aria-label={`Drag to add ${component.name} component`}
          >
            <h4 className="font-medium text-xs text-slate-700 dark:text-slate-300 mb-1">{component.name}</h4>
            {component.visualPreview && <div className="mb-1 pointer-events-none">{React.createElement(component.visualPreview)}</div>}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{component.description}</p>
          </div>
        ))}
        {PREDEFINED_COMPONENTS.length === 0 && (
            <p className="text-xs text-slate-500 dark:text-slate-400">No predefined components available.</p>
        )}
      </div>
    </div>
  );
};

export default ComponentsPanel;
