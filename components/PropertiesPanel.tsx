
import React from 'react';
import { LayoutElement, ElementProps, Spacing, ContainerProps, RowProps, ColProps, ControlProps, AllElementPropKeys } from '../types';
import { 
    SPACING_SCALES, BACKGROUND_COLORS, JUSTIFY_CONTENT_OPTIONS, 
    ALIGN_ITEMS_OPTIONS, ALIGN_SELF_OPTIONS, COL_SPAN_OPTIONS, 
    COL_OFFSET_OPTIONS, COL_ORDER_OPTIONS, GUTTER_OPTIONS, MIN_HEIGHT_OPTIONS
} from '../constants';
import SelectControl from './shared/SelectControl';
import SpinBox from './shared/SpinBox';
import Button from './shared/Button';

interface PropertiesPanelProps {
  selectedElement: LayoutElement | null;
  onUpdateProp: (id: string, propKey: AllElementPropKeys, value: any) => void;
  onUpdateSpacingProp: (id: string, type: 'padding' | 'margin', side: keyof Spacing, value: string) => void;
  onUpdateGutterProp: (id: string, axis: 'x' | 'y', value: string) => void;
  onDeleteElement: (id: string) => void;
}

const SpacingInputGroup: React.FC<{
  label: string;
  idPrefix: string;
  values: Spacing;
  onChange: (side: keyof Spacing, value: string) => void;
}> = ({ label, idPrefix, values, onChange }) => {
  return (
    <div className="mb-3 p-2 border border-gray-200 dark:border-gray-600 rounded-md">
      <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</h4>
      <div className="grid grid-cols-2 gap-2">
        {(['top', 'right', 'bottom', 'left'] as Array<keyof Spacing>).map(side => (
          <SpinBox
            key={side}
            id={`${idPrefix}-${side}`}
            label={side.charAt(0).toUpperCase() + side.slice(1)}
            value={values[side] || '0'}
            onChange={(val) => onChange(side, val)}
            min={-50}
            max={50}
            step={1}
            className="mb-0"
          />
        ))}
      </div>
    </div>
  );
};

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
    selectedElement, 
    onUpdateProp,
    onUpdateSpacingProp,
    onUpdateGutterProp,
    onDeleteElement
}) => {
  if (!selectedElement) {
    return (
      <div
        className="w-full p-4 text-slate-600 dark:text-slate-400 overflow-y-auto h-full"
        aria-labelledby="properties-panel-title-placeholder"
      >
        <h3 id="properties-panel-title-placeholder" className="text-base font-semibold mb-3 text-slate-700 dark:text-slate-300 sticky top-0 bg-slate-50 dark:bg-slate-800 py-2 z-10">Properties</h3>
        <p>Select an element on the canvas to see its properties.</p>
      </div>
    );
  }

  const { id, type, props, name } = selectedElement;
  const commonProps = props as ElementProps; 

  const handlePropChange = (propKey: AllElementPropKeys, value: any) => {
    onUpdateProp(id, propKey, value);
  };
  
  const handleSpacingChange = (spacingType: 'padding' | 'margin', side: keyof Spacing, value: string) => {
      onUpdateSpacingProp(id, spacingType, side, value);
  };

  const handleGutterChange = (axis: 'x' | 'y', value: string) => {
    onUpdateGutterProp(id, axis, value);
  };

  return (
    <div
        className="w-full p-4 overflow-y-auto h-full"
        aria-labelledby={`properties-panel-title-${id}`}
    >
      <h3 id={`properties-panel-title-${id}`} className="text-base font-semibold mb-1 text-slate-800 dark:text-slate-200 sticky top-0 bg-slate-50 dark:bg-slate-800 py-2 z-10 truncate pr-2" title={name}>{name}</h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Type: {type} (ID: {id})</p>

      <div className="space-y-3">
        {/* Common Properties */}
        <SelectControl
          label="Background Color"
          value={commonProps.backgroundColor || ''}
          options={BACKGROUND_COLORS}
          onChange={(val) => handlePropChange('backgroundColor', val)}
        />
        <SelectControl
          label="Minimum Height"
          value={commonProps.minHeight || '60px'}
          options={MIN_HEIGHT_OPTIONS.map(s => ({ label: s, value: s }))}
          onChange={(val) => handlePropChange('minHeight', val)}
        />

        <SpacingInputGroup 
            label="Padding" 
            idPrefix={`padding-${id}`}
            values={commonProps.padding as Spacing || {top:'0',right:'0',bottom:'0',left:'0'}}
            onChange={(side, val) => handleSpacingChange('padding', side, val)}
        />
        <SpacingInputGroup 
            label="Margin" 
            idPrefix={`margin-${id}`}
            values={commonProps.margin as Spacing || {top:'0',right:'0',bottom:'0',left:'0'}}
            onChange={(side, val) => handleSpacingChange('margin', side, val)}
        />
        
        <div>
            <label htmlFor={`customClasses-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Custom Tailwind Classes</label>
            <input
                type="text"
                id={`customClasses-${id}`}
                value={commonProps.customClasses || ''}
                onChange={(e) => handlePropChange('customClasses', e.target.value)}
                placeholder="e.g., rounded-lg shadow-md"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
        </div>


        {/* Type-Specific Properties */}
        {type === 'container' && (
          <>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 pt-2 border-t border-slate-200 dark:border-slate-600">Container Options</h4>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`isFullscreen-${id}`}
                checked={(props as Partial<ContainerProps>).isFullscreen || false}
                onChange={(e) => handlePropChange('isFullscreen', e.target.checked)}
                className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
              />
              <label htmlFor={`isFullscreen-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                Fullscreen (100% width & height)
              </label>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 ml-6">
              When enabled, this container will occupy the entire page and no other root elements can be added.
            </p>

            <div className="flex items-center">
              <input
                type="checkbox"
                id={`isFluid-${id}`}
                checked={(props as Partial<ContainerProps>).isFluid || false}
                onChange={(e) => handlePropChange('isFluid', e.target.checked)}
                className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                disabled={(props as Partial<ContainerProps>).isFullscreen || false}
              />
              <label htmlFor={`isFluid-${id}`} className={`text-xs ${(props as Partial<ContainerProps>).isFullscreen ? 'text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                Fluid (Full Width) {(props as Partial<ContainerProps>).isFullscreen ? '(disabled in fullscreen)' : ''}
              </label>
            </div>
          </>
        )}

        {type === 'row' && (
          <>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 pt-2 border-t border-slate-200 dark:border-slate-600">Row Options</h4>
            <div className="grid grid-cols-2 gap-2">
                <SpinBox
                    label="Gap X"
                    id={`guttersX-${id}`}
                    value={(props as Partial<RowProps>).gutters?.x || '0'}
                    onChange={(val) => handleGutterChange('x', val)}
                    min={0}
                    max={20}
                    step={1}
                />
                <SpinBox
                    label="Gap Y"
                    id={`guttersY-${id}`}
                    value={(props as Partial<RowProps>).gutters?.y || '0'}
                    onChange={(val) => handleGutterChange('y', val)}
                    min={0}
                    max={20}
                    step={1}
                />
            </div>
            <SelectControl
              label="Justify Content"
              id={`justifyContent-${id}`}
              value={(props as Partial<RowProps>).justifyContent || 'start'}
              options={JUSTIFY_CONTENT_OPTIONS}
              onChange={(val) => handlePropChange('justifyContent', val)}
            />
            <SelectControl
              label="Align Items"
              id={`alignItems-${id}`}
              value={(props as Partial<RowProps>).alignItems || 'stretch'}
              options={ALIGN_ITEMS_OPTIONS}
              onChange={(val) => handlePropChange('alignItems', val)}
            />
          </>
        )}

        {type === 'control' && (
          <>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 pt-2 border-t border-slate-200 dark:border-slate-600">Control Options</h4>

            <SelectControl
                label="Control Type"
                value={(props as Partial<ControlProps>).controlType || 'button'}
                onChange={(value) => handlePropChange('controlType', value)}
                options={[
                    { value: 'button', label: 'Button' },
                    { value: 'input', label: 'Input' },
                    { value: 'textarea', label: 'Textarea' },
                    { value: 'label', label: 'Label' },
                    { value: 'heading', label: 'Heading' },
                    { value: 'paragraph', label: 'Paragraph' },
                    { value: 'link', label: 'Link' },
                    { value: 'image', label: 'Image' },
                    { value: 'checkbox', label: 'Checkbox' },
                    { value: 'radio', label: 'Radio' },
                    { value: 'select', label: 'Select' },
                    { value: 'divider', label: 'Divider' },
                    { value: 'spacer', label: 'Spacer' },
                    { value: 'badge', label: 'Badge' }
                ]}
            />

            {/* Common Text Content */}
            {!['divider', 'spacer', 'image'].includes((props as Partial<ControlProps>).controlType || '') && (
              <>
                <label htmlFor={`text-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Text Content</label>
                <input
                    type="text"
                    id={`text-${id}`}
                    value={(props as Partial<ControlProps>).text || ''}
                    onChange={(e) => handlePropChange('text', e.target.value)}
                    placeholder="Enter text content..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </>
            )}

            {/* Button Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'button' && (
              <>
                <SelectControl
                  label="Button Variant"
                  value={(props as Partial<ControlProps>).variant || 'primary'}
                  onChange={(value) => handlePropChange('variant', value)}
                  options={[
                    { value: 'primary', label: 'Primary' },
                    { value: 'secondary', label: 'Secondary' },
                    { value: 'success', label: 'Success' },
                    { value: 'warning', label: 'Warning' },
                    { value: 'error', label: 'Error' },
                    { value: 'ghost', label: 'Ghost' }
                  ]}
                />
                <SelectControl
                  label="Button Size"
                  value={(props as Partial<ControlProps>).size || 'md'}
                  onChange={(value) => handlePropChange('size', value)}
                  options={[
                    { value: 'xs', label: 'Extra Small' },
                    { value: 'sm', label: 'Small' },
                    { value: 'md', label: 'Medium' },
                    { value: 'lg', label: 'Large' },
                    { value: 'xl', label: 'Extra Large' }
                  ]}
                />
                <div className="flex items-center mt-3">
                  <input
                    type="checkbox"
                    id={`disabled-${id}`}
                    checked={(props as Partial<ControlProps>).disabled || false}
                    onChange={(e) => handlePropChange('disabled', e.target.checked)}
                    className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                  />
                  <label htmlFor={`disabled-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                    Disabled
                  </label>
                </div>
              </>
            )}

            {/* Input Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'input' && (
              <>
                <SelectControl
                  label="Input Type"
                  value={(props as Partial<ControlProps>).type || 'text'}
                  onChange={(value) => handlePropChange('type', value)}
                  options={[
                    { value: 'text', label: 'Text' },
                    { value: 'email', label: 'Email' },
                    { value: 'password', label: 'Password' },
                    { value: 'number', label: 'Number' },
                    { value: 'tel', label: 'Telephone' },
                    { value: 'url', label: 'URL' },
                    { value: 'search', label: 'Search' },
                    { value: 'date', label: 'Date' },
                    { value: 'time', label: 'Time' },
                    { value: 'datetime-local', label: 'DateTime Local' },
                    { value: 'file', label: 'File' },
                    { value: 'hidden', label: 'Hidden' }
                  ]}
                />
                <label htmlFor={`placeholder-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Placeholder</label>
                <input
                    type="text"
                    id={`placeholder-${id}`}
                    value={(props as Partial<ControlProps>).placeholder || ''}
                    onChange={(e) => handlePropChange('placeholder', e.target.value)}
                    placeholder="Enter placeholder text..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
                <label htmlFor={`value-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Default Value</label>
                <input
                    type="text"
                    id={`value-${id}`}
                    value={(props as Partial<ControlProps>).value || ''}
                    onChange={(e) => handlePropChange('value', e.target.value)}
                    placeholder="Enter default value..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />

                {/* Number input specific properties */}
                {(props as Partial<ControlProps>).type === 'number' && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Min</label>
                      <input
                        type="number"
                        value={(props as Partial<ControlProps>).min || ''}
                        onChange={(e) => handlePropChange('min', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Max</label>
                      <input
                        type="number"
                        value={(props as Partial<ControlProps>).max || ''}
                        onChange={(e) => handlePropChange('max', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Step</label>
                      <input
                        type="number"
                        value={(props as Partial<ControlProps>).step || ''}
                        onChange={(e) => handlePropChange('step', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>
                )}

                {/* File input specific properties */}
                {(props as Partial<ControlProps>).type === 'file' && (
                  <>
                    <label htmlFor={`accept-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Accept (file types)</label>
                    <input
                        type="text"
                        id={`accept-${id}`}
                        value={(props as Partial<ControlProps>).accept || ''}
                        onChange={(e) => handlePropChange('accept', e.target.value)}
                        placeholder="e.g., .jpg,.png,.pdf"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                    <div className="flex items-center mt-3">
                      <input
                        type="checkbox"
                        id={`multiple-${id}`}
                        checked={(props as Partial<ControlProps>).multiple || false}
                        onChange={(e) => handlePropChange('multiple', e.target.checked)}
                        className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                      />
                      <label htmlFor={`multiple-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                        Allow Multiple Files
                      </label>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Min Length</label>
                    <input
                      type="number"
                      value={(props as Partial<ControlProps>).minLength || ''}
                      onChange={(e) => handlePropChange('minLength', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Max Length</label>
                    <input
                      type="number"
                      value={(props as Partial<ControlProps>).maxLength || ''}
                      onChange={(e) => handlePropChange('maxLength', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-${id}`}
                      checked={(props as Partial<ControlProps>).required || false}
                      onChange={(e) => handlePropChange('required', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`required-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Required
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`readonly-${id}`}
                      checked={(props as Partial<ControlProps>).readonly || false}
                      onChange={(e) => handlePropChange('readonly', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`readonly-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Read Only
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`disabled-input-${id}`}
                      checked={(props as Partial<ControlProps>).disabled || false}
                      onChange={(e) => handlePropChange('disabled', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`disabled-input-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Disabled
                    </label>
                  </div>
                </div>
              </>
            )}
            {/* Textarea Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'textarea' && (
              <>
                <label htmlFor={`placeholder-textarea-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Placeholder</label>
                <input
                    type="text"
                    id={`placeholder-textarea-${id}`}
                    value={(props as Partial<ControlProps>).placeholder || ''}
                    onChange={(e) => handlePropChange('placeholder', e.target.value)}
                    placeholder="Enter placeholder text..."
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <SpinBox
                    label="Rows"
                    value={(props as Partial<ControlProps>).rows || '3'}
                    onChange={(val) => handlePropChange('rows', val)}
                    min={1}
                    max={20}
                    step={1}
                  />
                  <SpinBox
                    label="Columns"
                    value={(props as Partial<ControlProps>).cols || '50'}
                    onChange={(val) => handlePropChange('cols', val)}
                    min={10}
                    max={200}
                    step={5}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Min Length</label>
                    <input
                      type="number"
                      value={(props as Partial<ControlProps>).minLength || ''}
                      onChange={(e) => handlePropChange('minLength', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Max Length</label>
                    <input
                      type="number"
                      value={(props as Partial<ControlProps>).maxLength || ''}
                      onChange={(e) => handlePropChange('maxLength', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-textarea-${id}`}
                      checked={(props as Partial<ControlProps>).required || false}
                      onChange={(e) => handlePropChange('required', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`required-textarea-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Required
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`readonly-textarea-${id}`}
                      checked={(props as Partial<ControlProps>).readonly || false}
                      onChange={(e) => handlePropChange('readonly', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`readonly-textarea-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Read Only
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`disabled-textarea-${id}`}
                      checked={(props as Partial<ControlProps>).disabled || false}
                      onChange={(e) => handlePropChange('disabled', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`disabled-textarea-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Disabled
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Heading Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'heading' && (
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Heading Level</label>
                <select
                  value={(props as Partial<ControlProps>).level || 'h1'}
                  onChange={(e) => handlePropChange('level', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="h1">H1 - Main Title</option>
                  <option value="h2">H2 - Section Title</option>
                  <option value="h3">H3 - Subsection</option>
                  <option value="h4">H4 - Minor Heading</option>
                  <option value="h5">H5 - Small Heading</option>
                  <option value="h6">H6 - Smallest Heading</option>
                </select>
              </div>
            )}

            {/* Link Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'link' && (
              <>
                <label htmlFor={`href-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Link URL</label>
                <input
                    type="url"
                    id={`href-${id}`}
                    value={(props as Partial<ControlProps>).href || ''}
                    onChange={(e) => handlePropChange('href', e.target.value)}
                    placeholder="https://example.com"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
                <SelectControl
                  label="Link Target"
                  value={(props as Partial<ControlProps>).target || '_self'}
                  onChange={(value) => handlePropChange('target', value)}
                  options={[
                    { value: '_self', label: 'Same Window (_self)' },
                    { value: '_blank', label: 'New Window (_blank)' },
                    { value: '_parent', label: 'Parent Frame (_parent)' },
                    { value: '_top', label: 'Top Frame (_top)' }
                  ]}
                />
                <label htmlFor={`title-link-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Title (Tooltip)</label>
                <input
                    type="text"
                    id={`title-link-${id}`}
                    value={(props as Partial<ControlProps>).title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="Link description for tooltip"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
              </>
            )}

            {/* Image Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'image' && (
              <>
                <label htmlFor={`src-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Image URL</label>
                <input
                    type="url"
                    id={`src-${id}`}
                    value={(props as Partial<ControlProps>).src || ''}
                    onChange={(e) => handlePropChange('src', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
                <label htmlFor={`alt-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Alt Text</label>
                <input
                    type="text"
                    id={`alt-${id}`}
                    value={(props as Partial<ControlProps>).alt || ''}
                    onChange={(e) => handlePropChange('alt', e.target.value)}
                    placeholder="Image description"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
                <label htmlFor={`title-image-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Title (Tooltip)</label>
                <input
                    type="text"
                    id={`title-image-${id}`}
                    value={(props as Partial<ControlProps>).title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="Image tooltip"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <SpinBox
                    label="Width"
                    value={(props as Partial<ControlProps>).width || '150'}
                    onChange={(val) => handlePropChange('width', val)}
                    min={10}
                    max={2000}
                    step={10}
                    suffix="px"
                  />
                  <SpinBox
                    label="Height"
                    value={(props as Partial<ControlProps>).height || '100'}
                    onChange={(val) => handlePropChange('height', val)}
                    min={10}
                    max={2000}
                    step={10}
                    suffix="px"
                  />
                </div>
              </>
            )}

            {/* Checkbox/Radio Specific Properties */}
            {(['checkbox', 'radio'].includes((props as Partial<ControlProps>).controlType || '')) && (
              <>
                <label htmlFor={`value-check-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Value</label>
                <input
                    type="text"
                    id={`value-check-${id}`}
                    value={(props as Partial<ControlProps>).value || ''}
                    onChange={(e) => handlePropChange('value', e.target.value)}
                    placeholder="Value when checked"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
                {(props as Partial<ControlProps>).controlType === 'radio' && (
                  <>
                    <label htmlFor={`name-radio-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Group Name</label>
                    <input
                        type="text"
                        id={`name-radio-${id}`}
                        value={(props as Partial<ControlProps>).name || ''}
                        onChange={(e) => handlePropChange('name', e.target.value)}
                        placeholder="Radio group name"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </>
                )}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`checked-${id}`}
                      checked={(props as Partial<ControlProps>).checked || false}
                      onChange={(e) => handlePropChange('checked', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`checked-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Checked
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-check-${id}`}
                      checked={(props as Partial<ControlProps>).required || false}
                      onChange={(e) => handlePropChange('required', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`required-check-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Required
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`disabled-check-${id}`}
                      checked={(props as Partial<ControlProps>).disabled || false}
                      onChange={(e) => handlePropChange('disabled', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`disabled-check-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Disabled
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Select Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'select' && (
              <>
                <label htmlFor={`options-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Options (one per line)</label>
                <textarea
                    id={`options-${id}`}
                    value={Array.isArray((props as Partial<ControlProps>).options)
                      ? (props as Partial<ControlProps>).options?.join('\n')
                      : (props as Partial<ControlProps>).options || 'Option 1\nOption 2\nOption 3'}
                    onChange={(e) => handlePropChange('options', e.target.value.split('\n').filter(opt => opt.trim()))}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    rows={4}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`multiple-select-${id}`}
                      checked={(props as Partial<ControlProps>).multiple || false}
                      onChange={(e) => handlePropChange('multiple', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`multiple-select-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Multiple
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`required-select-${id}`}
                      checked={(props as Partial<ControlProps>).required || false}
                      onChange={(e) => handlePropChange('required', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`required-select-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Required
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`disabled-select-${id}`}
                      checked={(props as Partial<ControlProps>).disabled || false}
                      onChange={(e) => handlePropChange('disabled', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`disabled-select-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Disabled
                    </label>
                  </div>
                </div>
              </>
            )}

            {/* Badge Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'badge' && (
              <SelectControl
                label="Badge Variant"
                value={(props as Partial<ControlProps>).variant || 'primary'}
                onChange={(value) => handlePropChange('variant', value)}
                options={[
                  { value: 'primary', label: 'Primary (Blue)' },
                  { value: 'secondary', label: 'Secondary (Gray)' },
                  { value: 'success', label: 'Success (Green)' },
                  { value: 'warning', label: 'Warning (Yellow)' },
                  { value: 'error', label: 'Error (Red)' },
                  { value: 'info', label: 'Info (Cyan)' }
                ]}
              />
            )}

            {/* Spacer Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'spacer' && (
              <div className="grid grid-cols-2 gap-2 mt-3">
                <SpinBox
                  label="Width"
                  value={(props as Partial<ControlProps>).width || '100'}
                  onChange={(val) => handlePropChange('width', val)}
                  min={10}
                  max={1000}
                  step={10}
                  suffix="px"
                />
                <SpinBox
                  label="Height"
                  value={(props as Partial<ControlProps>).height || '20'}
                  onChange={(val) => handlePropChange('height', val)}
                  min={5}
                  max={500}
                  step={5}
                  suffix="px"
                />
              </div>
            )}

            {/* Label Specific Properties */}
            {(props as Partial<ControlProps>).controlType === 'label' && (
              <label htmlFor={`htmlFor-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">For (Input ID)</label>
            )}
            {(props as Partial<ControlProps>).controlType === 'label' && (
              <input
                  type="text"
                  id={`htmlFor-${id}`}
                  value={(props as Partial<ControlProps>).htmlFor || ''}
                  onChange={(e) => handlePropChange('htmlFor', e.target.value)}
                  placeholder="ID of associated input"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
            )}

            {/* Common Form Properties */}
            {!['divider', 'spacer', 'image', 'heading', 'paragraph'].includes((props as Partial<ControlProps>).controlType || '') && (
              <>
                <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 pt-2 border-t border-slate-200 dark:border-slate-600">Form Properties</h5>

                <label htmlFor={`name-form-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Name</label>
                <input
                    type="text"
                    id={`name-form-${id}`}
                    value={(props as Partial<ControlProps>).name || ''}
                    onChange={(e) => handlePropChange('name', e.target.value)}
                    placeholder="Form field name"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />

                <label htmlFor={`id-form-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Element ID</label>
                <input
                    type="text"
                    id={`id-form-${id}`}
                    value={(props as Partial<ControlProps>).id || ''}
                    onChange={(e) => handlePropChange('id', e.target.value)}
                    placeholder="Unique element ID"
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                />

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`autoFocus-${id}`}
                      checked={(props as Partial<ControlProps>).autoFocus || false}
                      onChange={(e) => handlePropChange('autoFocus', e.target.checked)}
                      className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
                    />
                    <label htmlFor={`autoFocus-${id}`} className="text-xs text-gray-700 dark:text-gray-300">
                      Auto Focus
                    </label>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tab Index</label>
                    <input
                      type="number"
                      value={(props as Partial<ControlProps>).tabIndex || ''}
                      onChange={(e) => handlePropChange('tabIndex', e.target.value)}
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Accessibility Properties */}
            <h5 className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 pt-2 border-t border-slate-200 dark:border-slate-600">Accessibility</h5>

            <label htmlFor={`ariaLabel-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">ARIA Label</label>
            <input
                type="text"
                id={`ariaLabel-${id}`}
                value={(props as Partial<ControlProps>).ariaLabel || ''}
                onChange={(e) => handlePropChange('ariaLabel', e.target.value)}
                placeholder="Accessible label"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />

            <label htmlFor={`role-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">ARIA Role</label>
            <input
                type="text"
                id={`role-${id}`}
                value={(props as Partial<ControlProps>).role || ''}
                onChange={(e) => handlePropChange('role', e.target.value)}
                placeholder="ARIA role"
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </>
        )}

        {type === 'col' && (
          <>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 pt-2 border-t border-slate-200 dark:border-slate-600">Column Options</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Span</label>
                <select
                  value={(props as Partial<ColProps>).span || 'auto'}
                  onChange={(e) => handlePropChange('span', e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="auto">Auto</option>
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                    <option key={num} value={num.toString()}>{num}/12</option>
                  ))}
                </select>
              </div>
              <SpinBox
                label="Offset"
                id={`offset-${id}`}
                value={(props as Partial<ColProps>).offset || '0'}
                onChange={(val) => handlePropChange('offset', val)}
                min={0}
                max={11}
                step={1}
              />
            </div>
            <SelectControl
              label="Order"
              id={`order-${id}`}
              value={(props as Partial<ColProps>).order || 'none'}
              options={COL_ORDER_OPTIONS.map(s => ({ label: s, value: s }))}
              onChange={(val) => handlePropChange('order', val)}
            />
            <SelectControl
              label="Align Self"
              id={`alignSelf-${id}`}
              value={(props as Partial<ColProps>).alignSelf || 'auto'}
              options={ALIGN_SELF_OPTIONS}
              onChange={(val) => handlePropChange('alignSelf', val)}
            />
          </>
        )}

        {/* Actions Section */}
        <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-600">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Actions</h4>

          {/* Keyboard shortcuts info */}
          <div className="mb-3 p-2 bg-slate-100 dark:bg-slate-700 rounded-md">
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">
              <strong>Keyboard Shortcuts:</strong>
            </p>
            <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <li>• <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-xs">Delete</kbd> - Delete selected element</li>
              <li>• <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-xs">Escape</kbd> - Deselect element</li>
            </ul>
          </div>

          {/* Delete Button */}
          <Button
              variant="danger"
              size="sm"
              className="w-full"
              onClick={() => onDeleteElement(id)}
              aria-label={`Delete element ${name}`}
              title="You can also press Delete key to delete this element"
          >
              🗑️ Delete Element
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
