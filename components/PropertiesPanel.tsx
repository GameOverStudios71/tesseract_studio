
import React from 'react';
import { LayoutElement, ElementProps, Spacing, ContainerProps, RowProps, ColProps, AllElementPropKeys } from '../types';
import { 
    SPACING_SCALES, BACKGROUND_COLORS, JUSTIFY_CONTENT_OPTIONS, 
    ALIGN_ITEMS_OPTIONS, ALIGN_SELF_OPTIONS, COL_SPAN_OPTIONS, 
    COL_OFFSET_OPTIONS, COL_ORDER_OPTIONS, GUTTER_OPTIONS, MIN_HEIGHT_OPTIONS
} from '../constants';
import SelectControl from './shared/SelectControl';
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
    <div className="mb-3 p-2 border border-gray-200 rounded-md">
      <h4 className="text-sm font-medium text-gray-600 mb-1">{label}</h4>
      <div className="grid grid-cols-2 gap-2">
        {(['top', 'right', 'bottom', 'left'] as Array<keyof Spacing>).map(side => (
          <SelectControl
            key={side}
            id={`${idPrefix}-${side}`}
            label={side.charAt(0).toUpperCase() + side.slice(1)}
            value={values[side] || '0'}
            options={SPACING_SCALES.map(s => ({ label: s, value: s }))}
            onChange={(val) => onChange(side, val)}
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
            <div className="flex items-center">
              <input
                type="checkbox"
                id={`isFluid-${id}`}
                checked={(props as Partial<ContainerProps>).isFluid || false}
                onChange={(e) => handlePropChange('isFluid', e.target.checked)}
                className="h-4 w-4 text-sky-600 border-gray-300 dark:border-gray-600 rounded focus:ring-sky-500 mr-2"
              />
              <label htmlFor={`isFluid-${id}`} className="text-xs text-gray-700 dark:text-gray-300">Fluid (Full Width)</label>
            </div>
          </>
        )}

        {type === 'row' && (
          <>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 pt-2 border-t border-slate-200 dark:border-slate-600">Row Options</h4>
            <div className="grid grid-cols-2 gap-2">
                <SelectControl
                    label="Gutters X (Gap X)"
                    id={`guttersX-${id}`}
                    value={(props as Partial<RowProps>).gutters?.x || '0'}
                    options={GUTTER_OPTIONS.map(s => ({ label: s, value: s }))}
                    onChange={(val) => handleGutterChange('x', val)}
                />
                <SelectControl
                    label="Gutters Y (Gap Y)"
                    id={`guttersY-${id}`}
                    value={(props as Partial<RowProps>).gutters?.y || '0'}
                    options={GUTTER_OPTIONS.map(s => ({ label: s, value: s }))}
                    onChange={(val) => handleGutterChange('y', val)}
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

        {type === 'col' && (
          <>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-4 pt-2 border-t border-slate-200 dark:border-slate-600">Column Options</h4>
            <SelectControl
              label="Span (1-12, Auto)"
              id={`span-${id}`}
              value={(props as Partial<ColProps>).span || 'auto'}
              options={COL_SPAN_OPTIONS.map(s => ({ label: s.toString(), value: s.toString() }))}
              onChange={(val) => handlePropChange('span', val)}
            />
            <SelectControl
              label="Offset (0-11)"
              id={`offset-${id}`}
              value={(props as Partial<ColProps>).offset || '0'}
              options={COL_OFFSET_OPTIONS.map(s => ({ label: s, value: s }))}
              onChange={(val) => handlePropChange('offset', val)}
            />
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
