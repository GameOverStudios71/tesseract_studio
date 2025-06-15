
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export function generateUniqueId(prefix: string = 'id'): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function rgbToHex(rgb: string): string {
    if (!rgb || rgb.startsWith('#')) return rgb || '#000000'; 
    if (rgb === 'transparent' || rgb.startsWith('rgba(0, 0, 0, 0)')) return '#00000000'; 
    
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/);
    if (!match) return '#000000'; 
    
    const r = parseInt(match[1], 10);
    const g = parseInt(match[2], 10);
    const b = parseInt(match[3], 10);
    
    if (match[4] !== undefined) { // RGBA
        const a = parseFloat(match[4]);
        const alphaHex = Math.round(a * 255).toString(16).padStart(2, '0');
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase() + alphaHex.toUpperCase();
    } else { // RGB
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
    }
}

export function getSafeFilename(name: string): string {
    return name.replace(/[^a-z0-9_\-\s.]/gi, '_').replace(/\s+/g, '_');
}

export function updatePlaceholderVisibility(container: HTMLElement | null, placeholderSelector: string) {
    if (!container) return;
    const placeholder = container.querySelector(placeholderSelector);
    if (placeholder) {
        let childElementCount = 0;
        for (let i = 0; i < container.children.length; i++) {
            if (!container.children[i].matches(placeholderSelector)) {
                childElementCount++;
            }
        }
        placeholder.classList.toggle('hidden', childElementCount > 0);
    }
}

export function handleNumberInputMouseWheel(event: WheelEvent) {
    const target = event.target as HTMLInputElement;
    if (target.type !== 'number' && target.type !== 'range') return; 

    event.preventDefault();

    const step = parseFloat(target.step) || 1;
    let value = parseFloat(target.value);
    if (isNaN(value)) value = parseFloat(target.min) || 0; 

    if (event.deltaY < 0) { 
        value += step;
    } else { 
        value -= step;
    }
    
    if (target.min !== "" && value < parseFloat(target.min)) {
        value = parseFloat(target.min);
    }
    if (target.max !== "" && value > parseFloat(target.max)) {
        value = parseFloat(target.max);
    }

    const stepString = target.step.toString();
    const decimalPlaces = stepString.includes('.') ? stepString.split('.')[1].length : 0;
    target.value = value.toFixed(decimalPlaces);

    target.dispatchEvent(new Event('input', { bubbles: true }));
}
