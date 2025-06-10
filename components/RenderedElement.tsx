
import React from 'react';
import { LayoutElement, ElementProps, ContainerProps, RowProps, ColProps, Spacing } from '../types';
import { BACKGROUND_COLORS } from '../constants'; // For placeholder text color

interface RenderedElementProps {
  element: LayoutElement;
  allElements: Record<string, LayoutElement>;
  onSelectElement: (id: string) => void;
  selectedElementId: string | null;
}

const getSpacingClasses = (spacing: Spacing | undefined, prefix: string): string => {
  if (!spacing) return '';
  // Order matters for Tailwind: specific sides override general if both were somehow present
  // However, our state uses specific sides. An 'all' property is not used here.
  return ` ${prefix}t-${spacing.top} ${prefix}r-${spacing.right} ${prefix}b-${spacing.bottom} ${prefix}l-${spacing.left}`;
};

const RenderedElement: React.FC<RenderedElementProps> = ({ 
  element, 
  allElements, 
  onSelectElement, 
  selectedElementId 
}) => {
  const { id, type, props, children, name } = element;
  const isSelected = selectedElementId === id;

  let styleClasses = 'relative transition-all duration-150 ease-in-out ';

  // Common Props
  if (props.padding) styleClasses += getSpacingClasses(props.padding as Spacing, 'p');
  if (props.margin) styleClasses += getSpacingClasses(props.margin as Spacing, 'm');
  if (props.backgroundColor && props.backgroundColor !== '') {
    styleClasses += ` bg-${props.backgroundColor}`;
  }
  if (props.customClasses) styleClasses += ` ${props.customClasses}`;
  
  const minHeightStyle = props.minHeight ? { minHeight: props.minHeight } : { minHeight: '40px' };


  // Type-specific props
  if (type === 'container') {
    const containerProps = props as Partial<ContainerProps>;
    styleClasses += containerProps.isFluid ? ' w-full' : ' max-w-screen-xl mx-auto';
    styleClasses += ' border border-dashed border-sky-400';
  } else if (type === 'row') {
    const rowProps = props as Partial<RowProps>;
    styleClasses += ' flex flex-wrap';
    if (rowProps.gutters) {
      styleClasses += ` gap-x-${rowProps.gutters.x} gap-y-${rowProps.gutters.y}`;
    }
    if (rowProps.justifyContent) styleClasses += ` justify-${rowProps.justifyContent}`;
    if (rowProps.alignItems) styleClasses += ` items-${rowProps.alignItems}`;
    styleClasses += ' border border-dashed border-green-400';
  } else if (type === 'col') {
    const colProps = props as Partial<ColProps>;
    if (colProps.span === 'auto') {
      styleClasses += ' w-auto flex-initial';
    } else if (colProps.span) {
      styleClasses += ` w-${colProps.span}/12 flex-shrink-0`; // Use flex-shrink-0 to maintain width
    } else {
      styleClasses += ' flex-1'; // Default to flex-1 if no span, to fill space
    }

    if (colProps.offset && colProps.offset !== '0') {
       // Tailwind JIT supports arbitrary values like ml-[calc(X/12*100%)]
       // For simplicity, mapping to Tailwind's fractionals or fixed margins if available,
       // or using arbitrary values. Example: ml-[8.333%] for offset-1
       const offsetPercentage = (parseInt(colProps.offset) / 12) * 100;
       styleClasses += ` ml-[${offsetPercentage.toFixed(3)}%]`;
    }
    if (colProps.order && colProps.order !== 'none') {
        styleClasses += ` order-${colProps.order}`;
    }
    if (colProps.alignSelf && colProps.alignSelf !== 'auto') {
        styleClasses += ` self-${colProps.alignSelf}`;
    }
    styleClasses += ' border border-dashed border-amber-400';
  }

  if (isSelected) {
    styleClasses += ' ring-2 ring-offset-2 ring-indigo-500 z-10';
  } else {
    styleClasses += ' hover:ring-1 hover:ring-indigo-300';
  }

  // Determine text color based on background for better visibility
  const bgColorName = props.backgroundColor?.split('-')[0] || '';
  const isDarkBg = ['slate', 'zinc', 'stone', 'red', 'orange', 'green', 'teal', 'blue', 'indigo', 'violet', 'purple', 'pink', 'rose'].includes(bgColorName) && props.backgroundColor?.endsWith('500') || props.backgroundColor?.endsWith('600') || props.backgroundColor?.endsWith('700') || props.backgroundColor?.endsWith('800') || props.backgroundColor?.endsWith('900');
  const textColorClass = isDarkBg ? 'text-white' : 'text-gray-600';


  return (
    <div
      className={styleClasses.trim()}
      style={minHeightStyle}
      onClick={(e) => {
        e.stopPropagation(); // Prevent parent elements from being selected
        onSelectElement(id);
      }}
    >
      <div className={`absolute top-0 left-1 px-1 py-0.5 text-xs ${textColorClass} bg-black bg-opacity-20 rounded-br-md z-20`}>
        {name} ({type})
      </div>
      {children.length === 0 && (
        <div className={`flex items-center justify-center h-full text-xs ${textColorClass} opacity-75 p-2`}>
          Click to select. Add children via Toolbar.
        </div>
      )}
      {children.map(childId => {
        const childElement = allElements[childId];
        return childElement ? (
          <RenderedElement
            key={childId}
            element={childElement}
            allElements={allElements}
            onSelectElement={onSelectElement}
            selectedElementId={selectedElementId}
          />
        ) : null;
      })}
    </div>
  );
};

export default RenderedElement;