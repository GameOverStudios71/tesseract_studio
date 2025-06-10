import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  side: 'left' | 'right';
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  className?: string;
  storageKey?: string; // For persisting width in localStorage
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  side,
  initialWidth = 300,
  minWidth = 200,
  maxWidth = 600,
  className = '',
  storageKey
}) => {
  // Initialize width from localStorage if available, otherwise use initialWidth
  const [width, setWidth] = useState(() => {
    if (storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsedWidth = parseInt(saved, 10);
        return Math.max(minWidth, Math.min(maxWidth, parsedWidth));
      }
    }
    return initialWidth;
  });
  const [isResizing, setIsResizing] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startXRef.current = e.clientX;
    startWidthRef.current = width;
    
    // Add cursor style to body during resize
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;

    const deltaX = e.clientX - startXRef.current;
    let newWidth;

    if (side === 'left') {
      newWidth = startWidthRef.current + deltaX;
    } else {
      newWidth = startWidthRef.current - deltaX;
    }

    // Constrain width within bounds
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    setWidth(newWidth);

    // Save to localStorage if storageKey is provided
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newWidth.toString());
    }
  }, [isResizing, side, minWidth, maxWidth]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, handleMouseMove, handleMouseUp]);

  const resizerPosition = side === 'left' ? 'right-0' : 'left-0';
  const resizerCursor = 'cursor-col-resize';

  return (
    <div
      ref={panelRef}
      className={`relative flex-shrink-0 h-full ${className}`}
      style={{ width: `${width}px` }}
    >
      {children}
      
      {/* Resize handle */}
      <div
        className={`absolute top-0 ${resizerPosition} w-1 h-full ${resizerCursor} bg-transparent hover:bg-blue-400 transition-colors duration-150 z-10 group`}
        onMouseDown={handleMouseDown}
        title={`Resize ${side} panel (${width}px)`}
      >
        {/* Visual indicator */}
        <div className="absolute inset-0 w-full h-full group-hover:bg-blue-400 opacity-0 group-hover:opacity-50 transition-opacity duration-150" />

        {/* Wider hit area for easier grabbing */}
        <div className="absolute inset-y-0 -inset-x-1 w-3" />
      </div>

      {/* Resize indicator when actively resizing */}
      {isResizing && (
        <>
          <div className="absolute inset-0 bg-blue-100 bg-opacity-20 pointer-events-none border-2 border-blue-400 border-dashed" />
          {/* Width indicator */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono z-20">
            {width}px
          </div>
        </>
      )}
    </div>
  );
};

export default ResizablePanel;
