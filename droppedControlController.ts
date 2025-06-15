/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state';
import { applyStylesToDroppedControl } from './styleUpdater';
import { updatePanelForNoSelection, handleControlSelection as selectControlInPanel } from './selectionManager';
import { updatePlaceholderVisibility, generateUniqueId } from './utils';
import { renderTextColorsComponent } from './textColorsComponent';
import { DEFAULT_TEXTCOLORS_CONTENT, DEFAULT_TEXTCOLORS_GRADIENT_TYPE, DEFAULT_TEXTCOLORS_BASE_COLOR, DEFAULT_TEXTCOLORS_LIGHTEN_COLOR } from './constants';
import type { ControlPaletteItemType } from './types';


export function deleteSelectedControl() {
    if (!state.selectedDroppedControl) return;

    const parent = state.selectedDroppedControl.parentElement;
    if (parent) {
        parent.removeChild(state.selectedDroppedControl);
    }
    state.setSelectedDroppedControl(null);
    if (state.lastSelectedDroppedControl) {
        state.lastSelectedDroppedControl.classList.remove('selected-dropped-control-highlight');
        state.setLastSelectedDroppedControl(null);
    }
    updatePanelForNoSelection();
    
    if (parent) {
        if (parent.id === 'layer-2') {
            updatePlaceholderVisibility(parent, '.layer2-empty-placeholder');
        } else if (parent.classList.contains('decorative-element')) {
            updatePlaceholderVisibility(parent, '.decorative-element-empty-placeholder');
        } else if (parent.classList.contains('dropped-row-container') || parent.classList.contains('dropped-column-container')) {
           updatePlaceholderVisibility(parent, '.container-empty-placeholder');
        }
    }
}

export function setupDroppedControlPanelListeners() {
    if (!dom.droppedControlVisibleInput || !dom.droppedControlTextContentInput || !dom.droppedControlPlaceholderInput ||
        !dom.droppedControlImageSrcInput || !dom.droppedControlWidthInput || !dom.droppedControlHeightInput ||
        !dom.droppedControlBgColorInput || !dom.droppedControlTextColorInput ||
        !dom.droppedControlOpacityInput || !dom.droppedControlOpacityValueDisplay ||
        !dom.droppedControlBorderRadiusInput || !dom.droppedControlBorderWidthInput || !dom.droppedControlBorderStyleSelect || !dom.droppedControlBorderColorInput ||
        !dom.droppedControlBoxShadowXInput || !dom.droppedControlBoxShadowYInput || !dom.droppedControlBoxShadowBlurInput || !dom.droppedControlBoxShadowColorInput ||
        !dom.droppedControlFontFamilyInput || !dom.droppedControlFontSizeInput || !dom.droppedControlFontWeightSelect ||
        !dom.droppedControlFontStyleSelect || !dom.droppedControlLineHeightInput || !dom.droppedControlLetterSpacingInput ||
        !dom.droppedControlTextTransformSelect || !dom.droppedControlTextDecorationSelect ||
        !dom.droppedControlTextShadowXInput || !dom.droppedControlTextShadowYInput || !dom.droppedControlTextShadowBlurInput || !dom.droppedControlTextShadowColorInput ||
        !dom.deleteControlBtn || !dom.textAlignHorizontalSelect || !dom.textAlignVerticalSelect || !dom.containerAlignItemsSelect || !dom.containerJustifyContentSelect ) return;

    const updateFn = () => { if (state.selectedDroppedControl) applyStylesToDroppedControl(); };

    dom.droppedControlVisibleInput.addEventListener('change', updateFn);
    dom.droppedControlTextContentInput.addEventListener('input', updateFn);
    dom.droppedControlPlaceholderInput.addEventListener('input', updateFn);
    dom.droppedControlImageSrcInput.addEventListener('change', updateFn);
    dom.droppedControlWidthInput.addEventListener('input', updateFn);
    dom.droppedControlHeightInput.addEventListener('input', updateFn);
    dom.droppedControlBgColorInput.addEventListener('input', updateFn);
    dom.droppedControlTextColorInput.addEventListener('input', updateFn);
    
    dom.droppedControlOpacityInput.addEventListener('input', (e) => { if (dom.droppedControlOpacityValueDisplay) { dom.droppedControlOpacityValueDisplay.textContent = parseFloat((e.target as HTMLInputElement).value).toFixed(2); } updateFn(); });
    dom.droppedControlBorderRadiusInput.addEventListener('input', updateFn);
    dom.droppedControlBorderWidthInput.addEventListener('input', updateFn);
    dom.droppedControlBorderStyleSelect.addEventListener('change', updateFn);
    dom.droppedControlBorderColorInput.addEventListener('input', updateFn);
    dom.droppedControlBoxShadowXInput.addEventListener('input', updateFn);
    dom.droppedControlBoxShadowYInput.addEventListener('input', updateFn);
    dom.droppedControlBoxShadowBlurInput.addEventListener('input', updateFn);
    dom.droppedControlBoxShadowColorInput.addEventListener('input', updateFn);

    dom.droppedControlFontFamilyInput.addEventListener('input', updateFn);
    dom.droppedControlFontSizeInput.addEventListener('input', updateFn);
    dom.droppedControlFontWeightSelect.addEventListener('change', updateFn);
    dom.droppedControlFontStyleSelect.addEventListener('change', updateFn);
    dom.droppedControlLineHeightInput.addEventListener('input', updateFn);
    dom.droppedControlLetterSpacingInput.addEventListener('input', updateFn);
    dom.droppedControlTextTransformSelect.addEventListener('change', updateFn);
    dom.droppedControlTextDecorationSelect.addEventListener('change', updateFn);
    dom.droppedControlTextShadowXInput.addEventListener('input', updateFn);
    dom.droppedControlTextShadowYInput.addEventListener('input', updateFn);
    dom.droppedControlTextShadowBlurInput.addEventListener('input', updateFn);
    dom.droppedControlTextShadowColorInput.addEventListener('input', updateFn);

    dom.deleteControlBtn.addEventListener('click', deleteSelectedControl);

    dom.textAlignHorizontalSelect.addEventListener('change', updateFn);
    dom.textAlignVerticalSelect.addEventListener('change', updateFn);
    dom.containerAlignItemsSelect.addEventListener('change', updateFn);
    dom.containerJustifyContentSelect.addEventListener('change', updateFn);
}


export function handlePaletteItemDragStart(event: DragEvent) {
    const target = event.target as HTMLElement;
    const controlType = target.dataset.controlType;
    if (controlType && event.dataTransfer) {
        event.dataTransfer.setData('text/plain', controlType); 
        event.dataTransfer.effectAllowed = 'copy';
    }
}

export function handleDroppedControlDragStart(event: DragEvent) {
    const target = event.target as HTMLElement;
    if (target.dataset.droppedControlId && event.dataTransfer) {
        event.dataTransfer.setData('application/tesseract-dropped-control-id', target.dataset.droppedControlId);
        event.dataTransfer.effectAllowed = 'move';
        target.classList.add('dragging-control');
        target.style.opacity = '0.3'; 
    }
}

export function handleDroppedControlDragEnd(event: DragEvent) {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging-control');
    target.style.opacity = ''; 
}

export function handleDragEnter(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over-active');
    if (event.dataTransfer) {
        if (event.dataTransfer.types.includes('application/tesseract-dropped-control-id')) {
            event.dataTransfer.dropEffect = 'move';
        } else {
            event.dataTransfer.dropEffect = 'copy';
        }
    }
}

export function handleDragOver(event: DragEvent) {
    event.preventDefault(); 
    event.stopPropagation();
    if (event.dataTransfer) {
        if (event.dataTransfer.types.includes('application/tesseract-dropped-control-id')) {
            event.dataTransfer.dropEffect = 'move';
        } else {
            event.dataTransfer.dropEffect = 'copy';
        }
    }
}

export function handleDragLeave(event: DragEvent) {
    event.preventDefault(); 
    event.stopPropagation();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over-active');
}


export function handleDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation(); 
    const dropTarget = event.currentTarget as HTMLElement;
    dropTarget.classList.remove('drag-over-active');

    if (!event.dataTransfer) return;

    const droppedControlId = event.dataTransfer.getData('application/tesseract-dropped-control-id');

    if (droppedControlId) { 
        const controlToMove = document.querySelector(`[data-dropped-control-id="${droppedControlId}"]`) as HTMLElement;
        if (controlToMove && controlToMove.parentElement !== dropTarget) { 
            const oldParent = controlToMove.parentElement;
            if (oldParent) {
                oldParent.removeChild(controlToMove);
                if (oldParent.id === 'layer-2') updatePlaceholderVisibility(oldParent, '.layer2-empty-placeholder');
                else if (oldParent.classList.contains('decorative-element')) updatePlaceholderVisibility(oldParent, '.decorative-element-empty-placeholder');
                else if (oldParent.classList.contains('dropped-row-container') || oldParent.classList.contains('dropped-column-container')) updatePlaceholderVisibility(oldParent, '.container-empty-placeholder');
            }
            dropTarget.appendChild(controlToMove);

            if (dropTarget.id === 'layer-2') updatePlaceholderVisibility(dropTarget, '.layer2-empty-placeholder');
            else if (dropTarget.classList.contains('decorative-element')) updatePlaceholderVisibility(dropTarget, '.decorative-element-empty-placeholder');
            else if (dropTarget.classList.contains('dropped-row-container') || dropTarget.classList.contains('dropped-column-container')) updatePlaceholderVisibility(dropTarget, '.container-empty-placeholder');
            
            return;
        } else if (controlToMove && controlToMove.parentElement === dropTarget) {
            return; 
        }
    } else { 
        const controlType = event.dataTransfer.getData('text/plain') as ControlPaletteItemType;
        let newControl: HTMLElement | null = null;

        switch (controlType) {
            case 'button':
                newControl = document.createElement('button');
                newControl.className = 'dropped-control dropped-button bg-blue-500 text-white p-2 rounded';
                newControl.textContent = 'Button';
                newControl.style.display = 'flex';
                newControl.style.alignItems = 'center'; 
                newControl.style.justifyContent = 'center'; 
                newControl.style.textAlign = 'center';
                break;
            case 'text-input':
                newControl = document.createElement('input');
                const textInput = newControl as HTMLInputElement;
                textInput.type = 'text';
                textInput.placeholder = 'Text Input';
                newControl.className = 'dropped-control dropped-input p-2 border border-gray-400 rounded bg-white text-gray-800';
                newControl.style.textAlign = 'left';
                break;
            case 'row-container':
                newControl = document.createElement('div');
                newControl.className = 'dropped-control dropped-row-container flex flex-row border border-dashed border-gray-500 p-2 min-h-[50px] space-x-2 items-start w-full';
                newControl.dataset.droppableType = 'container';
                newControl.innerHTML = '<span class="container-empty-placeholder text-xs text-gray-400 italic p-1 self-center pointer-events-none">Row</span>';
                newControl.style.alignItems = 'flex-start';
                newControl.style.justifyContent = 'flex-start';
                setupDroppable(newControl); 
                break;
            case 'column-container':
                newControl = document.createElement('div');
                newControl.className = 'dropped-control dropped-column-container flex flex-col border border-dashed border-gray-500 p-2 min-h-[50px] space-y-2 items-start w-full';
                newControl.dataset.droppableType = 'container';
                newControl.innerHTML = '<span class="container-empty-placeholder text-xs text-gray-400 italic p-1 self-center pointer-events-none">Col</span>';
                newControl.style.alignItems = 'flex-start'; 
                newControl.style.justifyContent = 'flex-start'; 
                setupDroppable(newControl); 
                break;
            case 'text-block':
                newControl = document.createElement('p');
                newControl.className = 'dropped-control dropped-text-block text-gray-200 p-1';
                newControl.textContent = 'Some text content...';
                newControl.style.display = 'flex';
                newControl.style.alignItems = 'flex-start'; 
                newControl.style.textAlign = 'left';
                break;
            case 'image-element':
                newControl = document.createElement('div');
                newControl.className = 'dropped-control dropped-image-element w-24 h-24 bg-gray-600 bg-cover bg-center flex items-center justify-center text-gray-400 italic';
                newControl.textContent = 'Image';
                break;
            case 'text-colors':
                newControl = document.createElement('div');
                newControl.className = 'dropped-control dropped-text-colors-component';
                newControl.dataset.textContent = DEFAULT_TEXTCOLORS_CONTENT;
                newControl.dataset.gradientType = DEFAULT_TEXTCOLORS_GRADIENT_TYPE;
                newControl.dataset.baseColor = DEFAULT_TEXTCOLORS_BASE_COLOR;
                newControl.dataset.lightenColor = DEFAULT_TEXTCOLORS_LIGHTEN_COLOR;
                renderTextColorsComponent(newControl);
                break;
            case 'ansi-art':
                newControl = document.createElement('div');
                newControl.className = 'dropped-control dropped-ansi-art bg-black text-white p-2 rounded w-full h-48 flex flex-col ansi-font';
                const uniqueId = generateUniqueId();
                newControl.dataset.controlType = 'ansi-art';
                newControl.dataset.droppedControlId = uniqueId;
                newControl.dataset.ansiCode = '';  // Default empty ANSI code
                const previewElement = document.createElement('div');
                previewElement.className = 'mt-2 p-2 bg-black font-mono overflow-auto ansi-preview ansi-font';
                previewElement.innerHTML = '';  // Initial empty render
                newControl.appendChild(previewElement);  // Add preview element
                renderAnsiPreview(newControl);  // Initial render call
                break;
            default:
                console.error(`Unknown control type: ${controlType}`);
                return; // Exit early if control type is invalid
        }

        if (newControl) {
            newControl.draggable = true; 
            newControl.addEventListener('dragstart', handleDroppedControlDragStart);
            newControl.addEventListener('dragend', handleDroppedControlDragEnd);
            newControl.addEventListener('click', (e) => selectControlInPanel(newControl as HTMLElement, e));
            
            dropTarget.appendChild(newControl);

            // Automatically select the new control
            selectControlInPanel(newControl, undefined);
           
            if (dropTarget.id === 'layer-2') updatePlaceholderVisibility(dropTarget, '.layer2-empty-placeholder');
            else if (dropTarget.classList.contains('decorative-element')) updatePlaceholderVisibility(dropTarget, '.decorative-element-empty-placeholder');
            else if (dropTarget.classList.contains('dropped-row-container') || dropTarget.classList.contains('dropped-column-container')) updatePlaceholderVisibility(dropTarget, '.container-empty-placeholder');
        }
    }
}

function renderAnsiPreview(control: HTMLElement) {
    const ansiCode = control.dataset.ansiCode || '';
    const previewElement = control.querySelector('.ansi-preview');
    if (previewElement) {
        // Improved ANSI rendering: handle colors and basic formatting
        let html = ansiCode;
        // Reset all attributes
        html = html.replace(/\x1b\[0m/g, '</span>');
        // Colors (foreground and background)
        html = html.replace(/\x1b\[30m/g, '<span style="color:black;">');
        html = html.replace(/\x1b\[31m/g, '<span style="color:red;">');
        html = html.replace(/\x1b\[32m/g, '<span style="color:green;">');
        html = html.replace(/\x1b\[33m/g, '<span style="color:yellow;">');
        html = html.replace(/\x1b\[34m/g, '<span style="color:blue;">');
        html = html.replace(/\x1b\[35m/g, '<span style="color:magenta;">');
        html = html.replace(/\x1b\[36m/g, '<span style="color:cyan;">');
        html = html.replace(/\x1b\[37m/g, '<span style="color:white;">');
        html = html.replace(/\x1b\[40m/g, '<span style="background-color:black;">');
        html = html.replace(/\x1b\[41m/g, '<span style="background-color:red;">');
        html = html.replace(/\x1b\[42m/g, '<span style="background-color:green;">');
        html = html.replace(/\x1b\[43m/g, '<span style="background-color:yellow;">');
        html = html.replace(/\x1b\[44m/g, '<span style="background-color:blue;">');
        html = html.replace(/\x1b\[45m/g, '<span style="background-color:magenta;">');
        html = html.replace(/\x1b\[46m/g, '<span style="background-color:cyan;">');
        html = html.replace(/\x1b\[47m/g, '<span style="background-color:white;">');
        // Basic formatting
        html = html.replace(/\x1b\[1m/g, '<span style="font-weight:bold;">');
        html = html.replace(/\x1b\[4m/g, '<span style="text-decoration:underline;">');
        // Remove any remaining unhandled escape sequences
        html = html.replace(/\x1b\[[0-?]*[ -/]*[@-~]/g, '');
        previewElement.innerHTML = html;
    }
}

export function setupDroppable(element: HTMLElement) {
    element.addEventListener('dragenter', handleDragEnter);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('dragleave', handleDragLeave);
    element.addEventListener('drop', handleDrop);

    let placeholderSelector = '';
    let placeholderText = 'Drop here';
    let placeholderClass = '';

    if (element.id === 'layer-2') {
        placeholderSelector = '.layer2-empty-placeholder';
        placeholderClass = 'layer2-empty-placeholder text-slate-500 italic text-center w-full p-10 pointer-events-none';
        placeholderText = 'Drop controls here';
    } else if (element.classList.contains('decorative-element')) {
        placeholderSelector = '.decorative-element-empty-placeholder';
        placeholderClass = 'decorative-element-empty-placeholder text-slate-500 italic text-center w-full p-2 pointer-events-none text-xs';
    } else if (element.classList.contains('dropped-row-container') || element.classList.contains('dropped-column-container')) {
        placeholderSelector = '.container-empty-placeholder';
    }


    if (placeholderSelector && !element.querySelector(placeholderSelector) && placeholderClass) {
        const placeholder = document.createElement('span');
        placeholder.className = placeholderClass;
        placeholder.textContent = placeholderText;
        element.appendChild(placeholder); 
    }
    
    if(placeholderSelector) {
        updatePlaceholderVisibility(element, placeholderSelector);
    }
}

// Renaming the import from selectionManager to avoid conflict if this file also needs to export a function named handleControlSelection internally.
// The one from selectionManager is used for updating the panel when a control is selected.
export { selectControlInPanel as handleControlSelection };
