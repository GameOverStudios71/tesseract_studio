/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BackgroundSizeType = 'cover' | 'contain' | 'auto';
export type BackgroundRepeatType = 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y' | 'space' | 'round';
export type ElementDisplayType = 'flex' | 'block' | 'inline-block' | 'grid' | 'none';
export type ElementOverflowType = 'visible' | 'hidden' | 'scroll' | 'auto';

export type AnchorXType = 'left' | 'center' | 'right';
export type AnchorYType = 'top' | 'center' | 'bottom';
export type TabId = 'globals' | 'element' | 'animations' | 'controls' | 'components' | 'presets'; 
export type ElementBorderStyle = 'solid' | 'dashed' | 'dotted' | 'none';
export type ControlPaletteItemType = 'button' | 'text-input' | 'row-container' | 'column-container' | 'text-block' | 'image-element' | 'text-colors' | 'ansi-art';

export type TextAlignmentHorizontal = 'left' | 'center' | 'right' | 'justify';
export type TextAlignmentVertical = 'flex-start' | 'center' | 'flex-end'; // For internal text alignment using flex

export type FlexJustifyContent = 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
export type FlexAlignItems = 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';

export type TextColorGradientType = 'word' | 'sentence' | 'dark-light-dark-sentence' | 'dark-light-dark-word';
export type FontStyleType = 'normal' | 'italic';
export type TextTransformType = 'none' | 'uppercase' | 'lowercase' | 'capitalize';
export type TextDecorationType = 'none' | 'underline' | 'overline' | 'line-through';


export interface ElementConfig {
  id: string;
  element: HTMLElement; // This will remain as it's a direct reference.
  anchorX: AnchorXType;
  anchorY: AnchorYType;
  isVisible: boolean;
  display: ElementDisplayType;
  zIndex: number;
  overflowX: ElementOverflowType;
  overflowY: ElementOverflowType;
  widthVmin: number;
  heightVmin: number;
  marginTopVmin: number;
  marginRightVmin: number;
  marginBottomVmin: number;
  marginLeftVmin: number;
  bgColor: string;
  imageUrl: string;
  backgroundSize: BackgroundSizeType;
  bgRepeat: BackgroundRepeatType;
  bgPosition: string;
  shadowClass: string;
  opacity: number;
  // Filters
  filterBlur: number; 
  filterBrightness: number;
  filterContrast: number;
  filterGrayscale: number;
  filterSaturate: number;
  filterSepia: number;
  filterHueRotate: number;
  filterInvert: number;
  // Border
  borderWidthVmin: number;
  borderStyle: ElementBorderStyle;
  borderColor: string;
  borderRadiusVmin: number;
  // Transforms
  rotationDeg: number;
  transformScale: number;
  transformTranslateX: number;
  transformTranslateY: number;
  transformSkewX: number;
  transformSkewY: number;
  // Animation
  animationName: string;
  animationIterationClass: string;
  animationDelayClass: string;
  animationSpeedClass: string;
  animationOnHover: boolean; 
}

export interface Layer2Config {
  isVisible: boolean;
  widthPercent: number;
  heightPercent: number;
  paddingPx: number;
  bgColor: string;
  borderWidthPx: number;
  borderColor: string;
  shadowClass: string;
  backdropBlurClass: string; 
}

export interface Preset {
    id: string;
    name: string;
    timestamp: number;
    layer2Config: Layer2Config;
    elementsConfig: Record<string, Omit<ElementConfig, 'element'>>; // Store config without live element
    layer2HTML: string;
    decorativeElementsHTML: Record<string, string>;
    layer2BgColorForThumbnail: string; 
}
