/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state'; // Import state to ensure it's initialized if needed, though direct use might be minimal here
import { initializeDomElements } from './domElements';
import { initializeLayer2Config, setupLayer2PanelListeners } from './layer2Controller';
import { initializeElementsConfig, setupDecorativeElementPanelListeners } from './decorativeElementController';
import { setupDroppedControlPanelListeners, handlePaletteItemDragStart }  from './droppedControlController';
import { setupTextColorsComponentPanelListeners } from './textColorsComponent';
import { populateAnimationControls, setupAnimationPanelListeners } from './animationController';
import { setupConfigPanelInteractionListeners, switchTab } from './configPanelManager';
import { updatePanelForNoSelection, selectElement, updateLayer2PanelInputs } from './selectionManager';
import { applyStylesToLayer2, applyStylesToDecorativeElement } from './styleUpdater';
import { handleNumberInputMouseWheel } from './utils';
import { setupDroppable } from './droppedControlController';
import { loadPresetsFromLocalStorage, handleSavePreset } from './presetsManager';
import { initializeSplashScreen } from './splashScreen';
import type { ControlPaletteItemType } from './types';


export function initializeApp() {
  initializeDomElements();
  initializeSplashScreen();

  if (dom.layer2Element) {
    initializeLayer2Config(); 
    setupDroppable(dom.layer2Element); 
  }
  
  initializeElementsConfig(); 
  populateAnimationControls(); 

  if (dom.layer2Element) {
      applyStylesToLayer2(); 
      updateLayer2PanelInputs(); // Ensure panel reflects initial state.layer2Config
      setupLayer2PanelListeners();
  } else { 
      // Fallback if layer2Element is somehow not found, apply styles to decorative elements directly
      Object.keys(state.elementsConfig).forEach(id => applyStylesToDecorativeElement(id));
  }
  
  setupDecorativeElementPanelListeners();
  setupDroppedControlPanelListeners();
  setupTextColorsComponentPanelListeners();
  setupAnimationPanelListeners(); 
  setupConfigPanelInteractionListeners();
  
  // Initial UI state for selections
  selectElement(null); 
  updatePanelForNoSelection(); // Ensures the panel shows "None selected" initially

  // Set initial tab
  switchTab(state.activeTabId); // Use the default from state or set a specific one

  // Global event listeners (like numeric input mouse wheel)
  if (dom.configPanel) {
    const numericInputs = dom.configPanel.querySelectorAll('input[type="number"], input[type="range"]');
    numericInputs.forEach(input => {
        input.addEventListener('wheel', (e) => handleNumberInputMouseWheel(e as WheelEvent), { passive: false });
    });
    // Ensure panel collapse state is visually correct on load
    const isCollapsed = dom.configPanel.classList.contains('collapsed');
    const tabNav = dom.configPanel.querySelector('nav[aria-label="Tabs"]');
    const tabContentArea = dom.configPanelBody?.querySelector('div.flex-grow');
    if (tabNav) (tabNav as HTMLElement).classList.toggle('hidden', isCollapsed);
    if (tabContentArea) (tabContentArea as HTMLElement).classList.toggle('hidden', isCollapsed);
  }

  // Control Palette Drag and Visibility
  const ALLOWED_PALETTE_CONTROLS: ControlPaletteItemType[] = ['row-container', 'column-container', 'text-block', 'image-element', 'text-colors', 'button', 'text-input', 'ansi-art'];
  if(dom.controlPaletteItems) {
      dom.controlPaletteItems.forEach(item => {
          item.addEventListener('dragstart', handlePaletteItemDragStart);
          const controlType = item.dataset.controlType as ControlPaletteItemType;
          if (!ALLOWED_PALETTE_CONTROLS.includes(controlType)) {
              item.classList.add('hidden'); 
          } else {
              item.classList.remove('hidden'); 
          }
      });
  }
  
  // Presets
  if(dom.savePresetButton) dom.savePresetButton.addEventListener('click', handleSavePreset);
  loadPresetsFromLocalStorage();

  console.log("Tesseract App Initialized");
}
