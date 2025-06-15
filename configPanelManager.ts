
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as dom from './domElements';
import * as state from './state';
import type { TabId } from './types';

export function toggleConfigPanel(show?: boolean) {
    if (!dom.configPanel) return;
    const isCurrentlyVisible = !dom.configPanel.classList.contains('hidden');
    if (typeof show === 'boolean') {
        dom.configPanel.classList.toggle('hidden', !show);
    } else {
        dom.configPanel.classList.toggle('hidden', isCurrentlyVisible);
    }
}

export function toggleCollapsePanel() {
    if (!dom.configPanel || !dom.configPanelBody || !dom.configPanelCollapseButton) return;
    
    const isCollapsing = !dom.configPanel.classList.contains('collapsed');
    dom.configPanel.classList.toggle('collapsed');
    
    const tabNav = dom.configPanel.querySelector('nav[aria-label="Tabs"]');
    const tabContentArea = dom.configPanelBody.querySelector('div.flex-grow'); 
    
    if (tabNav) (tabNav as HTMLElement).classList.toggle('hidden', isCollapsing);
    if (tabContentArea) (tabContentArea as HTMLElement).classList.toggle('hidden', isCollapsing);

    const expandIcon = dom.configPanelCollapseButton.querySelector('.panel-icon-expand');
    const collapseIcon = dom.configPanelCollapseButton.querySelector('.panel-icon-collapse');
    
    if (expandIcon) expandIcon.classList.toggle('hidden', !isCollapsing); 
    if (collapseIcon) collapseIcon.classList.toggle('hidden', isCollapsing);
}

export function dragMouseDown(e: MouseEvent) {
    if (!dom.configPanel || !(e.target as HTMLElement).closest('#config-panel-header')) return;
    state.setIsDragging(true);
    dom.configPanel.style.transition = 'none'; 
    state.setDragOffset(e.clientX - dom.configPanel.offsetLeft, e.clientY - dom.configPanel.offsetTop);
    document.addEventListener('mousemove', dragMouseMove);
    document.addEventListener('mouseup', dragMouseUp);
}

export function dragMouseMove(e: MouseEvent) {
    if (!state.isDragging || !dom.configPanel) return;
    e.preventDefault(); 
    let newLeft = e.clientX - state.dragOffsetX;
    let newTop = e.clientY - state.dragOffsetY;

    const panelWidth = dom.configPanel.offsetWidth;
    const panelHeight = dom.configPanel.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    newLeft = Math.max(0, Math.min(newLeft, viewportWidth - panelWidth));
    newTop = Math.max(0, Math.min(newTop, viewportHeight - panelHeight));
    
    dom.configPanel.style.left = newLeft + 'px';
    dom.configPanel.style.top = newTop + 'px';
}

export function dragMouseUp() {
    if (!state.isDragging || !dom.configPanel) return;
    state.setIsDragging(false);
    if (dom.configPanel) dom.configPanel.style.transition = ''; 
    document.removeEventListener('mousemove', dragMouseMove);
    document.removeEventListener('mouseup', dragMouseUp);
}

export function switchTab(tabId: TabId) {
    state.setActiveTabId(tabId);
    const tabButtons = [dom.tabButtonGlobals, dom.tabButtonElement, dom.tabButtonControls, dom.tabButtonAnimations, dom.tabButtonComponents, dom.tabButtonPresets];
    const tabContents = [dom.tabContentGlobals, dom.tabContentElement, dom.tabContentControls, dom.tabContentAnimations, dom.tabContentComponents, dom.tabContentPresets];
    const tabIds: TabId[] = ['globals', 'element', 'controls', 'animations', 'components', 'presets'];

    tabButtons.forEach((button, index) => {
        if (button) {
            button.classList.toggle('active-tab', tabIds[index] === tabId);
        }
    });

    tabContents.forEach((content, index) => {
        if (content) {
            content.classList.toggle('hidden', tabIds[index] !== tabId);
        }
    });
}

export function setupConfigPanelInteractionListeners() {
    if (dom.configPanelToggleButton) {
        dom.configPanelToggleButton.addEventListener('click', () => toggleConfigPanel());
    }
    if (dom.configPanelCloseButton) {
        dom.configPanelCloseButton.addEventListener('click', () => toggleConfigPanel(false));
    }
    if (dom.configPanelCollapseButton && dom.configPanel) {
        const isCollapsed = dom.configPanel.classList.contains('collapsed');
        const expandIcon = dom.configPanelCollapseButton.querySelector('.panel-icon-expand');
        const collapseIcon = dom.configPanelCollapseButton.querySelector('.panel-icon-collapse');
        if(expandIcon) expandIcon.classList.toggle('hidden', !isCollapsed);
        if(collapseIcon) collapseIcon.classList.toggle('hidden', isCollapsed);
        dom.configPanelCollapseButton.addEventListener('click', toggleCollapsePanel);
    }
    if (dom.configPanelHeader) {
        dom.configPanelHeader.addEventListener('mousedown', dragMouseDown);
    }

    if (dom.tabButtonGlobals) dom.tabButtonGlobals.addEventListener('click', () => switchTab('globals'));
    if (dom.tabButtonElement) dom.tabButtonElement.addEventListener('click', () => switchTab('element'));
    if (dom.tabButtonControls) dom.tabButtonControls.addEventListener('click', () => switchTab('controls'));
    if (dom.tabButtonAnimations) dom.tabButtonAnimations.addEventListener('click', () => switchTab('animations'));
    if (dom.tabButtonComponents) dom.tabButtonComponents.addEventListener('click', () => switchTab('components'));
    if (dom.tabButtonPresets) dom.tabButtonPresets.addEventListener('click', () => switchTab('presets'));

    // Initial tab state if needed, or rely on default activeTabId from state.ts
    // switchTab(state.activeTabId); 
}