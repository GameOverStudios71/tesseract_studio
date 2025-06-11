import { useState, useCallback } from 'react';
import { LayoutElement, ElementType, ElementProps, Spacing, ContainerSpecificProps, RowSpecificProps, ColSpecificProps, ControlSpecificProps, AllElementPropKeys, PredefinedComponentKey, TemplateProps } from '../types';
import { PREDEFINED_COMPONENTS } from '../lib/componentDefinitions.tsx';

// Default colors for the Adaptive Grid Template, matching the CSS
const ADAPTIVE_GRID_DEFAULT_COLORS = {
  topLeft: '230, 25, 75',
  topCenterLeft: '60, 180, 75',
  topMiddle: '255, 225, 25',
  topCenterRight: '67, 99, 216',
  topRight: '245, 130, 49',
  middleLeft: '145, 30, 180',
  centerLeft: '70, 240, 240',
  middleMiddle: '240, 50, 230',
  centerRight: '188, 246, 12',
  middleRight: '250, 190, 190',
  bottomLeft: '0, 128, 128',
  bottomCenterLeft: '230, 190, 255',
  bottomMiddle: '154, 99, 36',
  bottomCenterRight: '255, 250, 200',
  bottomRight: '128, 0, 0',
};


const initialSpacing: Spacing = { top: '0', right: '0', bottom: '0', left: '0' };

const getDefaultProps = (type: ElementType): Partial<ElementProps> => {
  const common = {
    padding: { ...initialSpacing, top: '2', right: '2', bottom: '2', left: '2' },
    margin: { ...initialSpacing },
    backgroundColor: 'gray-100',
    customClasses: '',
    minHeight: '60px',
  };
  switch (type) {
    case 'container':
      return {
        ...common,
        isFluid: false,
        isFullscreen: false,
        backgroundColor: 'slate-100',
      } as Partial<ContainerSpecificProps & typeof common>;
    case 'row':
      return {
        ...common,
        gutters: { x: '4', y: '4' },
        justifyContent: 'start',
        alignItems: 'stretch',
        backgroundColor: 'zinc-100',
        minHeight: '80px',
         padding: { ...initialSpacing },
      } as Partial<RowSpecificProps & typeof common>;
    case 'col':
      return {
        ...common,
        span: 'auto',
        offset: '0',
        order: 'none',
        alignSelf: 'auto',
        backgroundColor: 'neutral-100',
        minHeight: '40px',
      } as Partial<ColSpecificProps & typeof common>;
    case 'control':
      return {
        ...common,
        controlType: 'button',
        text: 'Button',
        backgroundColor: 'white',
        minHeight: 'auto',
        padding: { ...initialSpacing, top: '2', right: '3', bottom: '2', left: '3' },
      } as Partial<ControlSpecificProps & typeof common>;
    case 'template':
      return {
        ...common,
        templateKey: '' as PredefinedComponentKey,
        minHeight: '200px',
      } as Partial<TemplateProps & typeof common>;
    default:
      return common;
  }
};


export const useLayoutManager = () => {
  const updateTemplateColor = useCallback((elementId: string, objectKey: string, newColor: string) => {
    setElements(prevElements => {
      const newElements = { ...prevElements };
      const elementToUpdate = newElements[elementId];

      // Type guard to ensure we're working with a template
      if (elementToUpdate?.type !== 'template') {
        return newElements;
      }
      
      const currentProps = elementToUpdate.props as Partial<TemplateProps>;

      if (currentProps.templateProps?.colors) {
        const newTemplateProps = {
          ...currentProps.templateProps,
          colors: {
            ...currentProps.templateProps.colors,
            [objectKey]: newColor,
          },
        };

        newElements[elementId] = {
          ...elementToUpdate,
          props: {
            ...currentProps,
            templateProps: newTemplateProps,
          },
        };
      }
      return newElements;
    });
  }, []);
  const [elements, setElements] = useState<Record<string, LayoutElement>>({});
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [nextIdNum, setNextIdNum] = useState<number>(1); // Changed to number for easier incrementing

  const getElementName = useCallback((type: ElementType, idNum: number) => {
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    return `${capitalizedType} ${idNum}`;
  }, []);

  const addControl = useCallback((controlData: any, parentId: string | null = null) => {
    const newId = `el-${nextIdNum}`;
    const currentIdNumForName = nextIdNum;
    setNextIdNum(prev => prev + 1);

    const controlProps = {
      ...getDefaultProps('control'),
      controlType: controlData.id,
      ...controlData.defaultProps
    };

    const newElement: LayoutElement = {
      id: newId,
      type: 'control',
      name: `${controlData.name} ${currentIdNumForName}`,
      parentId,
      children: [],
      props: controlProps,
    };

    setElements(prevElements => {
      const updatedElements = { ...prevElements, [newId]: newElement };
      if (parentId && updatedElements[parentId]) {
        updatedElements[parentId] = {
          ...updatedElements[parentId],
          children: [...updatedElements[parentId].children, newId],
        };
      }
      return updatedElements;
    });
    setSelectedElementId(newId);
  }, [nextIdNum, getElementName, elements]);

  const addElement = useCallback((type: ElementType, parentId: string | null = null) => {
    // Check if there's already a fullscreen container and we're trying to add a root element
    const hasFullscreenContainer = Object.values(elements).some(el =>
      el.type === 'container' &&
      el.parentId === null &&
      (el.props as Partial<ContainerSpecificProps>).isFullscreen
    );

    if (hasFullscreenContainer && parentId === null) {
      alert('Cannot add elements when a fullscreen container is present. Please disable fullscreen mode first.');
      return;
    }

    const newId = `el-${nextIdNum}`;
    const currentIdNumForName = nextIdNum; // Capture current ID num for naming
    setNextIdNum(prev => prev + 1);

    const newElement: LayoutElement = {
      id: newId,
      type,
      name: getElementName(type, currentIdNumForName),
      parentId,
      children: [],
      props: getDefaultProps(type),
    };

    setElements(prevElements => {
      const updatedElements = { ...prevElements, [newId]: newElement };
      if (parentId && updatedElements[parentId]) {
        updatedElements[parentId] = {
          ...updatedElements[parentId],
          children: [...updatedElements[parentId].children, newId],
        };
      }
      return updatedElements;
    });
    setSelectedElementId(newId);
  }, [nextIdNum, getElementName, elements]);

  const addPredefinedComponent = useCallback((componentKey: PredefinedComponentKey, targetParentId: string | null = null) => {
    const componentDefinition = PREDEFINED_COMPONENTS.find(c => c.key === componentKey);
    if (!componentDefinition) {
      console.error(`Component definition for key "${componentKey}" not found.`);
      return;
    }

    if (componentDefinition.type === 'template') {
      const newId = `el-${nextIdNum}`;
      setNextIdNum(prev => prev + 1);

      const newElementProps: Partial<TemplateProps> = {
        ...getDefaultProps('template'),
        templateKey: componentKey,
      };

      if (componentKey === 'ADAPTIVE_GRID_TEMPLATE') {
        newElementProps.templateProps = {
          colors: ADAPTIVE_GRID_DEFAULT_COLORS,
        };
      }

      const newElement: LayoutElement = {
        id: newId,
        type: 'template',
        name: componentDefinition.name,
        parentId: targetParentId,
        children: [],
        props: newElementProps,
      };

      setElements(prevElements => {
        const updatedElements = { ...prevElements, [newId]: newElement };
        if (targetParentId && updatedElements[targetParentId]) {
          updatedElements[targetParentId] = {
            ...updatedElements[targetParentId],
            children: [...updatedElements[targetParentId].children, newId],
          };
        }
        return updatedElements;
      });
      setSelectedElementId(newId);

    } else if (componentDefinition.type === 'generative' && componentDefinition.generate) {
      const { elements: newComponentElements, rootId: newComponentRootId, nextIdNum: updatedNextIdNum } = 
          componentDefinition.generate(nextIdNum, targetParentId);

      setElements(prevElements => {
        const updatedElements = {
          ...prevElements,
          ...newComponentElements,
        };
        
        if (targetParentId && updatedElements[targetParentId] && !updatedElements[targetParentId].children.includes(newComponentRootId)) {
          updatedElements[targetParentId] = {
            ...updatedElements[targetParentId],
            children: [...updatedElements[targetParentId].children, newComponentRootId],
          };
        }
        return updatedElements;
      });
      
      setNextIdNum(updatedNextIdNum);
      setSelectedElementId(newComponentRootId);
    } else {
        console.error(`Component with key "${componentKey}" is misconfigured.`);
    }
  }, [nextIdNum]);

  const updateElementProps = useCallback((id: string, newProps: Partial<ElementProps>) => {
    setElements(prevElements => {
      if (!prevElements[id]) return prevElements;
      return {
        ...prevElements,
        [id]: {
          ...prevElements[id],
          props: { ...prevElements[id].props, ...newProps },
        },
      };
    });
  }, []);
  
  const updateElementSingleProp = useCallback(
    (id: string, propKey: AllElementPropKeys, value: any) => {
    setElements(prevElements => {
      if (!prevElements[id]) return prevElements;
      const currentElement = prevElements[id];

      // Special handling for fullscreen containers
      if (propKey === 'isFullscreen' && value === true && currentElement.type === 'container') {
        // Check if there are other root elements
        const otherRootElements = Object.values(prevElements).filter(el =>
          el.parentId === null && el.id !== id
        );

        if (otherRootElements.length > 0) {
          alert('Cannot enable fullscreen mode when other elements exist at root level. Please remove other root elements first.');
          return prevElements;
        }

        // Also check if this container has siblings
        if (currentElement.parentId === null) {
          // It's already a root element, so we're good
        } else {
          alert('Cannot enable fullscreen mode on a nested container. Only root containers can be fullscreen.');
          return prevElements;
        }
      }

      return {
        ...prevElements,
        [id]: {
          ...currentElement,
          props: {
            ...currentElement.props,
            [propKey]: value,
          },
        },
      };
    });
  }, []);

  const updateElementSpacingProp = useCallback((id: string, type: 'padding' | 'margin', side: keyof Spacing, value: string) => {
      setElements(prevElements => {
          if (!prevElements[id]) return prevElements;
          const currentElement = prevElements[id];
          const existingSpacing = currentElement.props[type] as Spacing || {...initialSpacing};
          return {
              ...prevElements,
              [id]: {
                  ...currentElement,
                  props: {
                      ...currentElement.props,
                      [type]: {
                          ...existingSpacing,
                          [side]: value,
                      }
                  }
              }
          };
      });
  }, []);

  const updateElementGutterProp = useCallback((id: string, axis: 'x' | 'y', value: string) => {
      setElements(prevElements => {
          if (!prevElements[id]) return prevElements;
          const currentElement = prevElements[id];
          const props = currentElement.props as Partial<RowSpecificProps>;
          const existingGutters = props.gutters || { x: '0', y: '0' };
          return {
              ...prevElements,
              [id]: {
                  ...currentElement,
                  props: {
                      ...currentElement.props,
                      gutters: {
                          ...existingGutters,
                          [axis]: value,
                      }
                  }
              }
          };
      });
  }, []);


  const deleteElement = useCallback((id: string) => {
    setElements(prevElements => {
      const newElements = { ...prevElements };
      const elementToDelete = newElements[id];
      if (!elementToDelete) return prevElements;

      // Recursively delete children
      const deleteWithChildren = (currentId: string) => {
        newElements[currentId]?.children.forEach(childId => deleteWithChildren(childId));
        delete newElements[currentId];
      };
      deleteWithChildren(id);

      // Remove from parent's children array
      if (elementToDelete.parentId && newElements[elementToDelete.parentId]) {
        newElements[elementToDelete.parentId].children = newElements[elementToDelete.parentId].children.filter(childId => childId !== id);
      }
      return newElements;
    });
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  }, [selectedElementId]);


  const selectElement = useCallback((id: string | null) => {
    setSelectedElementId(id);
  }, []);

  const rootElementIds = Object.values(elements).filter(el => el.parentId === null).map(el => el.id);
  const selectedElement = selectedElementId ? elements[selectedElementId] : null;

  return {
    elements,
    selectedElementId,
    selectedElement,
    rootElementIds,
    addElement,
    addControl,
    addPredefinedComponent,
    updateElementProps,
    updateElementSingleProp,
    updateElementSpacingProp,
    updateElementGutterProp,
    updateTemplateColor,
    deleteElement,
    selectElement,
  };
};