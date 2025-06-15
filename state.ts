/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { ElementConfig, Layer2Config, Preset, TabId } from './types';

export let elementsConfig: Record<string, ElementConfig> = {};
export let selectedElementId: string | null = null;
export let lastSelectedElement: HTMLElement | null = null; // Used to remove highlight from previously selected
export const elementMouseOverListeners: Record<string, () => void> = {}; // Stores mouseover listeners for animations

export let selectedDroppedControl: HTMLElement | null = null;
export let lastSelectedDroppedControl: HTMLElement | null = null; // Used to remove highlight

export let layer2Config: Layer2Config = { 
    isVisible: true,
    widthPercent: 80, 
    heightPercent: 80, 
    paddingPx: 24,
    bgColor: 'rgb(51, 65, 85)', // slate-700
    borderWidthPx: 20,
    borderColor: 'rgb(71, 85, 105)', // slate-600
    shadowClass: 'shadow-2xl',
    backdropBlurClass: 'backdrop-blur-md', 
};

export let activeTabId: TabId = 'globals';
export let presets: Preset[] = [];

// Dragging state for the config panel
export let isDragging = false;
export let dragOffsetX = 0;
export let dragOffsetY = 0;

// Functions to modify state
export function setSelectedElementId(id: string | null) {
  selectedElementId = id;
}

export function setLayer2Config(newConfig: Layer2Config) {
  layer2Config = newConfig;
}

export function updateLayer2Config(partialConfig: Partial<Layer2Config>) {
  layer2Config = { ...layer2Config, ...partialConfig };
}

export function setActiveTabId(newTabId: TabId) {
   activeTabId = newTabId;
}

export function setIsDragging(dragging: boolean) {
    isDragging = dragging;
}

export function setDragOffset(x: number, y: number) {
    dragOffsetX = x;
    dragOffsetY = y;
}

export function setLastSelectedDroppedControl(element: HTMLElement | null) {
    lastSelectedDroppedControl = element;
}

export function setSelectedDroppedControl(element: HTMLElement | null) {
    selectedDroppedControl = element;
}

export function setLastSelectedElement(element: HTMLElement | null) {
    lastSelectedElement = element;
}

export function setElementsConfig(newConfig: Record<string, ElementConfig>) {
    elementsConfig = newConfig;
}

export function updateElementConfig(id: string, config: ElementConfig) {
    elementsConfig[id] = config;
}

export function removeElementConfig(id: string) {
    delete elementsConfig[id];
}

export function setPresets(newPresets: Preset[]) {
    presets = newPresets;
}

export function addPreset(preset: Preset) {
    presets.push(preset);
}

export function updatePresets(updatedPresets: Preset[]) {
    presets = updatedPresets;
}