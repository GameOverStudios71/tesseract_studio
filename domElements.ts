
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Config Panel Elements
export let configPanel: HTMLElement | null = null;
export let configPanelToggleButton: HTMLButtonElement | null = null;
export let configPanelCloseButton: HTMLButtonElement | null = null;
export let configPanelCollapseButton: HTMLButtonElement | null = null;
export let configPanelHeader: HTMLElement | null = null;
export let configPanelBody: HTMLElement | null = null; 

// Tab Buttons
export let tabButtonGlobals: HTMLButtonElement | null = null;
export let tabButtonElement: HTMLButtonElement | null = null;
export let tabButtonAnimations: HTMLButtonElement | null = null; 
export let tabButtonControls: HTMLButtonElement | null = null;
export let tabButtonComponents: HTMLButtonElement | null = null;
export let tabButtonPresets: HTMLButtonElement | null = null;

// Tab Content Panes
export let tabContentGlobals: HTMLElement | null = null;
export let tabContentElement: HTMLElement | null = null;
export let tabContentAnimations: HTMLElement | null = null; 
export let tabContentControls: HTMLElement | null = null;
export let tabContentComponents: HTMLElement | null = null;
export let tabContentPresets: HTMLElement | null = null;
export let elementVisibilityTogglesContainer: HTMLElement | null = null;

// Element Tab - General
export let selectedElementNameDisplay: HTMLElement | null = null;
export let decorativeElementPropsSection: HTMLElement | null = null;
export let droppedControlPropsSection: HTMLElement | null = null;
export let textColorsPropsSection: HTMLElement | null = null;
export let controlsContainer: HTMLElement | null = null; // Might be unused or misnamed previously
export let noElementSelectedMsg: HTMLElement | null = null;

// Decorative Element Inputs
export let visibleInput: HTMLInputElement | null = null;
export let elDisplaySelect: HTMLSelectElement | null = null;
export let elZIndexInput: HTMLInputElement | null = null;
export let elOverflowXSelect: HTMLSelectElement | null = null;
export let elOverflowYSelect: HTMLSelectElement | null = null;
export let widthInput: HTMLInputElement | null = null;
export let heightInput: HTMLInputElement | null = null;
export let marginTopInput: HTMLInputElement | null = null;
export let marginRightInput: HTMLInputElement | null = null;
export let marginBottomInput: HTMLInputElement | null = null;
export let marginLeftInput: HTMLInputElement | null = null;
export let bgColorInput: HTMLInputElement | null = null;
export let imageUrlInput: HTMLInputElement | null = null;
export let bgSizeSelect: HTMLSelectElement | null = null;
export let elBgRepeatSelect: HTMLSelectElement | null = null;
export let elBgPositionInput: HTMLInputElement | null = null;
export let shadowSelect: HTMLSelectElement | null = null;
export let opacityInput: HTMLInputElement | null = null;
export let opacityValueDisplay: HTMLElement | null = null;
export let elBlurInput: HTMLInputElement | null = null; 
export let elBlurValueDisplay: HTMLElement | null = null; 
export let elBrightnessInput: HTMLInputElement | null = null;
export let elBrightnessValueDisplay: HTMLElement | null = null;
export let elContrastInput: HTMLInputElement | null = null;
export let elContrastValueDisplay: HTMLElement | null = null;
export let elSaturateInput: HTMLInputElement | null = null;
export let elSaturateValueDisplay: HTMLElement | null = null;
export let elGrayscaleInput: HTMLInputElement | null = null;
export let elGrayscaleValueDisplay: HTMLElement | null = null;
export let elSepiaInput: HTMLInputElement | null = null;
export let elSepiaValueDisplay: HTMLElement | null = null;
export let elInvertInput: HTMLInputElement | null = null;
export let elInvertValueDisplay: HTMLElement | null = null;
export let elHueRotateInput: HTMLInputElement | null = null;
export let elHueRotateValueDisplay: HTMLElement | null = null;
export let elBorderWidthInput: HTMLInputElement | null = null;
export let elBorderStyleSelect: HTMLSelectElement | null = null;
export let elBorderColorInput: HTMLInputElement | null = null;
export let elBorderRadiusInput: HTMLInputElement | null = null;
export let elRotationInput: HTMLInputElement | null = null;
export let elRotationValueDisplay: HTMLElement | null = null;
export let elScaleInput: HTMLInputElement | null = null;
export let elScaleValueDisplay: HTMLElement | null = null;
export let elTranslateXInput: HTMLInputElement | null = null;
export let elTranslateYInput: HTMLInputElement | null = null;
export let elSkewXInput: HTMLInputElement | null = null;
export let elSkewYInput: HTMLInputElement | null = null;

// Dropped Control Inputs
export let droppedControlVisibleInput: HTMLInputElement | null = null;
export let droppedControlTextContentInput: HTMLTextAreaElement | null = null;
export let droppedControlPlaceholderInput: HTMLInputElement | null = null;
export let droppedControlImageSrcInput: HTMLInputElement | null = null;
export let droppedControlWidthInput: HTMLInputElement | null = null;
export let droppedControlHeightInput: HTMLInputElement | null = null;
export let droppedControlBgColorInput: HTMLInputElement | null = null;
export let droppedControlTextColorInput: HTMLInputElement | null = null;
export let droppedControlOpacityInput: HTMLInputElement | null = null;
export let droppedControlOpacityValueDisplay: HTMLElement | null = null;
export let droppedControlBorderRadiusInput: HTMLInputElement | null = null;
export let droppedControlBorderWidthInput: HTMLInputElement | null = null;
export let droppedControlBorderStyleSelect: HTMLSelectElement | null = null;
export let droppedControlBorderColorInput: HTMLInputElement | null = null;
export let droppedControlBoxShadowXInput: HTMLInputElement | null = null;
export let droppedControlBoxShadowYInput: HTMLInputElement | null = null;
export let droppedControlBoxShadowBlurInput: HTMLInputElement | null = null;
export let droppedControlBoxShadowColorInput: HTMLInputElement | null = null;
export let deleteControlBtn: HTMLButtonElement | null = null;

// Dropped Control Typography Section & Inputs
export let droppedControlTypographySection: HTMLElement | null = null;
export let droppedControlFontFamilyInput: HTMLInputElement | null = null;
export let droppedControlFontSizeInput: HTMLInputElement | null = null;
export let droppedControlFontWeightSelect: HTMLSelectElement | null = null;
export let droppedControlFontStyleSelect: HTMLSelectElement | null = null;
export let droppedControlLineHeightInput: HTMLInputElement | null = null;
export let droppedControlLetterSpacingInput: HTMLInputElement | null = null;
export let droppedControlTextTransformSelect: HTMLSelectElement | null = null;
export let droppedControlTextDecorationSelect: HTMLSelectElement | null = null;
export let droppedControlTextShadowXInput: HTMLInputElement | null = null;
export let droppedControlTextShadowYInput: HTMLInputElement | null = null;
export let droppedControlTextShadowBlurInput: HTMLInputElement | null = null;
export let droppedControlTextShadowColorInput: HTMLInputElement | null = null;

// Text Alignment Controls (for dropped textual controls)
export let textAlignmentControlsContainer: HTMLElement | null = null;
export let textAlignHorizontalSelect: HTMLSelectElement | null = null;
export let textAlignVerticalSelect: HTMLSelectElement | null = null;

// Container Alignment Controls (for dropped container controls)
export let containerAlignmentControlsContainer: HTMLElement | null = null;
export let containerAlignItemsSelect: HTMLSelectElement | null = null;
export let containerJustifyContentSelect: HTMLSelectElement | null = null;

// TextColors Component Inputs
export let textColorsContentInput: HTMLTextAreaElement | null = null;
export let textColorsGradientTypeSelect: HTMLSelectElement | null = null;
export let textColorsBaseColorPicker: HTMLInputElement | null = null;
export let textColorsLightenColorPicker: HTMLInputElement | null = null;
export let deleteTextColorsControlBtn: HTMLButtonElement | null = null;

// Layer 2 (Globals Tab) Inputs
export let layer2Element: HTMLElement | null = null; // Main layer-2 div itself
export let splashScreen: HTMLElement | null = null;
export let splashCloseButton: HTMLElement | null = null;
export let layer2VisibleInput: HTMLInputElement | null = null;
export let layer2WidthInput: HTMLInputElement | null = null;
export let layer2HeightInput: HTMLInputElement | null = null;
export let layer2PaddingInput: HTMLInputElement | null = null;
export let layer2BgColorInput: HTMLInputElement | null = null;
export let layer2BorderWidthInput: HTMLInputElement | null = null;
export let layer2BorderColorInput: HTMLInputElement | null = null;
export let layer2ShadowSelect: HTMLSelectElement | null = null;
export let layer2BackdropBlurSelect: HTMLSelectElement | null = null; 

// Animation Tab
export let animationSelectedElementNameDisplay: HTMLElement | null = null;
export let animationControlsContainer: HTMLElement | null = null;
export let noElementSelectedAnimationMsg: HTMLElement | null = null;
export let animationNameSelect: HTMLSelectElement | null = null;
export let animationIterationSelect: HTMLSelectElement | null = null;
export let animationDelaySelect: HTMLSelectElement | null = null;
export let animationSpeedSelect: HTMLSelectElement | null = null;
export let playAnimationButton: HTMLButtonElement | null = null;
export let animationOnHoverCheckbox: HTMLInputElement | null = null; 

// Controls Tab (Palette)
export let controlPaletteItems: NodeListOf<HTMLElement> | null = null;

// Presets Tab
export let savePresetButton: HTMLButtonElement | null = null;
export let presetsListContainer: HTMLElement | null = null;
export let noPresetsMessage: HTMLElement | null = null;


export function initializeDomElements() {
    configPanel = document.getElementById('config-panel');
    configPanelToggleButton = document.getElementById('toggle-config-panel-btn') as HTMLButtonElement;
    configPanelCloseButton = document.getElementById('config-panel-close-btn') as HTMLButtonElement;
    configPanelCollapseButton = document.getElementById('config-panel-collapse-btn') as HTMLButtonElement;
    configPanelHeader = document.getElementById('config-panel-header');
    configPanelBody = document.getElementById('config-panel-body');

    tabButtonGlobals = document.getElementById('tab-btn-globals') as HTMLButtonElement;
    tabButtonElement = document.getElementById('tab-btn-element') as HTMLButtonElement;
    tabButtonAnimations = document.getElementById('tab-btn-animations') as HTMLButtonElement;
    tabButtonControls = document.getElementById('tab-btn-controls') as HTMLButtonElement; 
    tabButtonComponents = document.getElementById('tab-btn-components') as HTMLButtonElement;
    tabButtonPresets = document.getElementById('tab-btn-presets') as HTMLButtonElement;

    tabContentGlobals = document.getElementById('global-settings-tab-content');
    tabContentElement = document.getElementById('element-settings-tab-content');
    tabContentAnimations = document.getElementById('animations-tab-content');
    tabContentControls = document.getElementById('controls-tab-content'); 
    tabContentComponents = document.getElementById('components-tab-content');
    tabContentPresets = document.getElementById('presets-tab-content');
    elementVisibilityTogglesContainer = document.getElementById('element-visibility-toggles');

    decorativeElementPropsSection = document.getElementById('decorative-element-props-section');
    droppedControlPropsSection = document.getElementById('dropped-control-props-section');
    textColorsPropsSection = document.getElementById('text-colors-props-section');

    selectedElementNameDisplay = document.getElementById('selected-element-name');
    controlsContainer = document.getElementById('selected-element-controls-container'); 
    noElementSelectedMsg = document.getElementById('no-element-selected-msg');

    visibleInput = document.getElementById('config-visible') as HTMLInputElement;
    elDisplaySelect = document.getElementById('config-el-display') as HTMLSelectElement;
    elZIndexInput = document.getElementById('config-el-zindex') as HTMLInputElement;
    elOverflowXSelect = document.getElementById('config-el-overflow-x') as HTMLSelectElement;
    elOverflowYSelect = document.getElementById('config-el-overflow-y') as HTMLSelectElement;
    widthInput = document.getElementById('config-width') as HTMLInputElement;
    heightInput = document.getElementById('config-height') as HTMLInputElement;
    marginTopInput = document.getElementById('config-margin-top') as HTMLInputElement;
    marginRightInput = document.getElementById('config-margin-right') as HTMLInputElement;
    marginBottomInput = document.getElementById('config-margin-bottom') as HTMLInputElement;
    marginLeftInput = document.getElementById('config-margin-left') as HTMLInputElement;
    bgColorInput = document.getElementById('config-bgcolor') as HTMLInputElement;
    imageUrlInput = document.getElementById('config-image-url') as HTMLInputElement;
    bgSizeSelect = document.getElementById('config-bg-size') as HTMLSelectElement;
    elBgRepeatSelect = document.getElementById('config-el-bg-repeat') as HTMLSelectElement;
    elBgPositionInput = document.getElementById('config-el-bg-position') as HTMLInputElement;
    shadowSelect = document.getElementById('config-shadow') as HTMLSelectElement;
    opacityInput = document.getElementById('config-opacity') as HTMLInputElement;
    opacityValueDisplay = document.getElementById('config-opacity-value');
    elBlurInput = document.getElementById('config-blur') as HTMLInputElement;
    elBlurValueDisplay = document.getElementById('config-blur-value');
    elBrightnessInput = document.getElementById('config-el-brightness') as HTMLInputElement;
    elBrightnessValueDisplay = document.getElementById('config-el-brightness-value');
    elContrastInput = document.getElementById('config-el-contrast') as HTMLInputElement;
    elContrastValueDisplay = document.getElementById('config-el-contrast-value');
    elSaturateInput = document.getElementById('config-el-saturate') as HTMLInputElement;
    elSaturateValueDisplay = document.getElementById('config-el-saturate-value');
    elGrayscaleInput = document.getElementById('config-el-grayscale') as HTMLInputElement;
    elGrayscaleValueDisplay = document.getElementById('config-el-grayscale-value');
    elSepiaInput = document.getElementById('config-el-sepia') as HTMLInputElement;
    elSepiaValueDisplay = document.getElementById('config-el-sepia-value');
    elInvertInput = document.getElementById('config-el-invert') as HTMLInputElement;
    elInvertValueDisplay = document.getElementById('config-el-invert-value');
    elHueRotateInput = document.getElementById('config-el-hue-rotate') as HTMLInputElement;
    elHueRotateValueDisplay = document.getElementById('config-el-hue-rotate-value');
    elBorderWidthInput = document.getElementById('config-border-width-el') as HTMLInputElement;
    elBorderStyleSelect = document.getElementById('config-border-style-el') as HTMLSelectElement;
    elBorderColorInput = document.getElementById('config-border-color-el') as HTMLInputElement;
    elBorderRadiusInput = document.getElementById('config-border-radius') as HTMLInputElement;
    elRotationInput = document.getElementById('config-rotation') as HTMLInputElement;
    elRotationValueDisplay = document.getElementById('config-rotation-value');
    elScaleInput = document.getElementById('config-el-scale') as HTMLInputElement;
    elScaleValueDisplay = document.getElementById('config-el-scale-value');
    elTranslateXInput = document.getElementById('config-el-translate-x') as HTMLInputElement;
    elTranslateYInput = document.getElementById('config-el-translate-y') as HTMLInputElement;
    elSkewXInput = document.getElementById('config-el-skew-x') as HTMLInputElement;
    elSkewYInput = document.getElementById('config-el-skew-y') as HTMLInputElement;
    
    droppedControlVisibleInput = document.getElementById('dropped-control-visible') as HTMLInputElement;
    droppedControlTextContentInput = document.getElementById('dropped-control-text-content') as HTMLTextAreaElement;
    droppedControlPlaceholderInput = document.getElementById('dropped-control-placeholder') as HTMLInputElement;
    droppedControlImageSrcInput = document.getElementById('dropped-control-image-src') as HTMLInputElement;
    droppedControlWidthInput = document.getElementById('dropped-control-width') as HTMLInputElement;
    droppedControlHeightInput = document.getElementById('dropped-control-height') as HTMLInputElement;
    droppedControlBgColorInput = document.getElementById('dropped-control-bgcolor') as HTMLInputElement;
    droppedControlTextColorInput = document.getElementById('dropped-control-textcolor') as HTMLInputElement;
    droppedControlOpacityInput = document.getElementById('dropped-control-opacity') as HTMLInputElement;
    droppedControlOpacityValueDisplay = document.getElementById('dropped-control-opacity-value');
    droppedControlBorderRadiusInput = document.getElementById('dropped-control-border-radius') as HTMLInputElement;
    droppedControlBorderWidthInput = document.getElementById('dropped-control-border-width') as HTMLInputElement;
    droppedControlBorderStyleSelect = document.getElementById('dropped-control-border-style') as HTMLSelectElement;
    droppedControlBorderColorInput = document.getElementById('dropped-control-border-color') as HTMLInputElement;
    droppedControlBoxShadowXInput = document.getElementById('dropped-control-boxshadow-x') as HTMLInputElement;
    droppedControlBoxShadowYInput = document.getElementById('dropped-control-boxshadow-y') as HTMLInputElement;
    droppedControlBoxShadowBlurInput = document.getElementById('dropped-control-boxshadow-blur') as HTMLInputElement;
    droppedControlBoxShadowColorInput = document.getElementById('dropped-control-boxshadow-color') as HTMLInputElement;
    deleteControlBtn = document.getElementById('delete-control-btn') as HTMLButtonElement;

    droppedControlTypographySection = document.getElementById('dropped-control-typography-section');
    droppedControlFontFamilyInput = document.getElementById('dropped-control-font-family') as HTMLInputElement;
    droppedControlFontSizeInput = document.getElementById('dropped-control-font-size') as HTMLInputElement;
    droppedControlFontWeightSelect = document.getElementById('dropped-control-font-weight') as HTMLSelectElement;
    droppedControlFontStyleSelect = document.getElementById('dropped-control-font-style') as HTMLSelectElement;
    droppedControlLineHeightInput = document.getElementById('dropped-control-line-height') as HTMLInputElement;
    droppedControlLetterSpacingInput = document.getElementById('dropped-control-letter-spacing') as HTMLInputElement;
    droppedControlTextTransformSelect = document.getElementById('dropped-control-text-transform') as HTMLSelectElement;
    droppedControlTextDecorationSelect = document.getElementById('dropped-control-text-decoration') as HTMLSelectElement;
    droppedControlTextShadowXInput = document.getElementById('dropped-control-textshadow-x') as HTMLInputElement;
    droppedControlTextShadowYInput = document.getElementById('dropped-control-textshadow-y') as HTMLInputElement;
    droppedControlTextShadowBlurInput = document.getElementById('dropped-control-textshadow-blur') as HTMLInputElement;
    droppedControlTextShadowColorInput = document.getElementById('dropped-control-textshadow-color') as HTMLInputElement;

    textAlignmentControlsContainer = document.getElementById('text-alignment-controls-container');
    textAlignHorizontalSelect = document.getElementById('text-align-horizontal') as HTMLSelectElement;
    textAlignVerticalSelect = document.getElementById('text-align-vertical') as HTMLSelectElement;
    containerAlignmentControlsContainer = document.getElementById('container-alignment-controls-container');
    containerAlignItemsSelect = document.getElementById('container-align-items') as HTMLSelectElement;
    containerJustifyContentSelect = document.getElementById('container-justify-content') as HTMLSelectElement;

    textColorsContentInput = document.getElementById('text-colors-content-input') as HTMLTextAreaElement;
    textColorsGradientTypeSelect = document.getElementById('text-colors-gradient-type-select') as HTMLSelectElement;
    textColorsBaseColorPicker = document.getElementById('text-colors-base-color-picker') as HTMLInputElement;
    textColorsLightenColorPicker = document.getElementById('text-colors-lighten-color-picker') as HTMLInputElement;
    deleteTextColorsControlBtn = document.getElementById('delete-text-colors-control-btn') as HTMLButtonElement;

    layer2Element = document.getElementById('layer-2');
    splashScreen = document.getElementById('splash-screen');
    splashCloseButton = document.getElementById('splash-close-btn');
    layer2VisibleInput = document.getElementById('layer2-visible') as HTMLInputElement;
    layer2WidthInput = document.getElementById('layer2-width') as HTMLInputElement;
    layer2HeightInput = document.getElementById('layer2-height') as HTMLInputElement;
    layer2PaddingInput = document.getElementById('layer2-padding') as HTMLInputElement;
    layer2BgColorInput = document.getElementById('layer2-bgcolor') as HTMLInputElement;
    layer2BorderWidthInput = document.getElementById('layer2-border-width') as HTMLInputElement;
    layer2BorderColorInput = document.getElementById('layer2-border-color') as HTMLInputElement;
    layer2ShadowSelect = document.getElementById('layer2-shadow') as HTMLSelectElement;
    layer2BackdropBlurSelect = document.getElementById('layer2-backdrop-blur') as HTMLSelectElement;

    animationSelectedElementNameDisplay = document.getElementById('animation-selected-element-name');
    animationControlsContainer = document.getElementById('animation-controls-container');
    noElementSelectedAnimationMsg = document.getElementById('no-element-selected-animation-msg');
    animationNameSelect = document.getElementById('config-animation-name') as HTMLSelectElement;
    animationIterationSelect = document.getElementById('config-animation-iteration') as HTMLSelectElement;
    animationDelaySelect = document.getElementById('config-animation-delay') as HTMLSelectElement;
    animationSpeedSelect = document.getElementById('config-animation-speed') as HTMLSelectElement;
    playAnimationButton = document.getElementById('play-animation-btn') as HTMLButtonElement;
    animationOnHoverCheckbox = document.getElementById('config-animation-on-hover') as HTMLInputElement; 

    controlPaletteItems = document.querySelectorAll('#control-palette .control-palette-item');

    savePresetButton = document.getElementById('save-preset-btn') as HTMLButtonElement;
    presetsListContainer = document.getElementById('presets-list-container');
    noPresetsMessage = document.getElementById('no-presets-message');
}
