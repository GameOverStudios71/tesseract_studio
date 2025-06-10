import { useState, useCallback } from 'react';

interface PanelConfig {
  initialWidth: number;
  minWidth: number;
  maxWidth: number;
  storageKey?: string;
}

interface PanelState {
  width: number;
  isResizing: boolean;
}

export const useResizablePanels = (leftConfig: PanelConfig, rightConfig: PanelConfig) => {
  // Initialize left panel
  const [leftPanel, setLeftPanel] = useState<PanelState>(() => {
    let width = leftConfig.initialWidth;
    if (leftConfig.storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(leftConfig.storageKey);
      if (saved) {
        const parsedWidth = parseInt(saved, 10);
        width = Math.max(leftConfig.minWidth, Math.min(leftConfig.maxWidth, parsedWidth));
      }
    }
    return { width, isResizing: false };
  });

  // Initialize right panel
  const [rightPanel, setRightPanel] = useState<PanelState>(() => {
    let width = rightConfig.initialWidth;
    if (rightConfig.storageKey && typeof window !== 'undefined') {
      const saved = localStorage.getItem(rightConfig.storageKey);
      if (saved) {
        const parsedWidth = parseInt(saved, 10);
        width = Math.max(rightConfig.minWidth, Math.min(rightConfig.maxWidth, parsedWidth));
      }
    }
    return { width, isResizing: false };
  });

  const updateLeftPanel = useCallback((updates: Partial<PanelState>) => {
    setLeftPanel(prev => {
      const newState = { ...prev, ...updates };
      if (updates.width !== undefined && leftConfig.storageKey && typeof window !== 'undefined') {
        localStorage.setItem(leftConfig.storageKey, updates.width.toString());
      }
      return newState;
    });
  }, [leftConfig.storageKey]);

  const updateRightPanel = useCallback((updates: Partial<PanelState>) => {
    setRightPanel(prev => {
      const newState = { ...prev, ...updates };
      if (updates.width !== undefined && rightConfig.storageKey && typeof window !== 'undefined') {
        localStorage.setItem(rightConfig.storageKey, updates.width.toString());
      }
      return newState;
    });
  }, [rightConfig.storageKey]);

  const resetPanels = useCallback(() => {
    updateLeftPanel({ width: leftConfig.initialWidth, isResizing: false });
    updateRightPanel({ width: rightConfig.initialWidth, isResizing: false });
    
    // Clear localStorage
    if (leftConfig.storageKey && typeof window !== 'undefined') {
      localStorage.removeItem(leftConfig.storageKey);
    }
    if (rightConfig.storageKey && typeof window !== 'undefined') {
      localStorage.removeItem(rightConfig.storageKey);
    }
  }, [leftConfig, rightConfig, updateLeftPanel, updateRightPanel]);

  const togglePanel = useCallback((side: 'left' | 'right') => {
    if (side === 'left') {
      const newWidth = leftPanel.width === leftConfig.minWidth ? leftConfig.initialWidth : leftConfig.minWidth;
      updateLeftPanel({ width: newWidth });
    } else {
      const newWidth = rightPanel.width === rightConfig.minWidth ? rightConfig.initialWidth : rightConfig.minWidth;
      updateRightPanel({ width: newWidth });
    }
  }, [leftPanel.width, rightPanel.width, leftConfig, rightConfig, updateLeftPanel, updateRightPanel]);

  return {
    leftPanel,
    rightPanel,
    updateLeftPanel,
    updateRightPanel,
    resetPanels,
    togglePanel,
    totalPanelWidth: leftPanel.width + rightPanel.width,
  };
};
