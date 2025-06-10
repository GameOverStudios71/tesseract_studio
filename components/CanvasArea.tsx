
import React from 'react';
import { LayoutElement } from '../types';
import RenderedElement from './RenderedElement';

interface CanvasAreaProps {
  rootElementIds: string[];
  allElements: Record<string, LayoutElement>;
  onSelectElement: (id: string) => void;
  selectedElementId: string | null;
}

const CanvasArea: React.FC<CanvasAreaProps> = ({ 
  rootElementIds, 
  allElements, 
  onSelectElement, 
  selectedElementId 
}) => {
  return (
    // The parent div in LayoutEditor now handles bg-white and shadow.
    // This div is for internal padding and overflow scrolling.
    <div className="w-full h-full p-4 overflow-auto" aria-label="Slide Canvas">
      {rootElementIds.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p className="text-xl">Slide is empty. Add elements using the toolbar above.</p>
        </div>
      )}
      {rootElementIds.map(id => {
        const element = allElements[id];
        return element ? (
          <RenderedElement
            key={id}
            element={element}
            allElements={allElements}
            onSelectElement={onSelectElement}
            selectedElementId={selectedElementId}
          />
        ) : null;
      })}
    </div>
  );
};

export default CanvasArea;
