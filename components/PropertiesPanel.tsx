
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

            <label htmlFor={`text-${id}`} className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 mt-3">Text Content</label>
            <input
                type="text"
                id={`text-${id}`}
                value={(props as Partial<ControlProps>).text || ''}
                onChange={(e) => handlePropChange('text', e.target.value)}
                placeholder="Enter text content..."
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 text-xs bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />

            {/* Numeric properties for controls */}
            {((props as Partial<ControlProps>).controlType === 'image' || (props as Partial<ControlProps>).controlType === 'spacer') && (
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
                  value={(props as Partial<ControlProps>).height || '100'}
                  onChange={(val) => handlePropChange('height', val)}
                  min={10}
                  max={1000}
                  step={10}
                  suffix="px"
                />
              </div>
            )}

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

            {(props as Partial<ControlProps>).controlType === 'textarea' && (
              <SpinBox
                label="Rows"
                value={(props as Partial<ControlProps>).rows || '3'}
                onChange={(val) => handlePropChange('rows', val)}
                min={1}
                max={20}
                step={1}
              />
            )}
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
        <Button 
            variant="danger" 
            size="sm" 
            className="w-full mt-6"
            onClick={() => onDeleteElement(id)}
            aria-label={`Delete element ${name}`}
        >
            Delete Element
        </Button>
      </div>
    </div>
  );
};

export default PropertiesPanel;
