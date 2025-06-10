import { useState, useCallback } from 'react';
import { LayoutElement, ElementType, ElementProps, Spacing, ContainerSpecificProps, RowSpecificProps, ColSpecificProps, ControlSpecificProps, AllElementPropKeys, PredefinedComponentKey } from '../types';
import { PREDEFINED_COMPONENTS } from '../lib/componentDefinitions.tsx';


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
    default:
      return common;
  }
};


export const useLayoutManager = () => {
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
      ...getDefaultProps('control', parentId),
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

    // Generate the component elements. parentIdToAttach is null for root components for now.
    // If targetParentId is provided and valid, future logic could attach it there.
    // For this iteration, components are added as root elements.
    const { elements: newComponentElements, rootId: newComponentRootId, nextIdNum: updatedNextIdNum } = 
        componentDefinition.generate(nextIdNum, null /* parentIdToAttach */);

    setElements(prevElements => ({
      ...prevElements,
      ...newComponentElements,
      // If targetParentId logic was implemented:
      // ...(targetParentId && prevElements[targetParentId] && {
      //   [targetParentId]: {
      //     ...prevElements[targetParentId],
      //     children: [...prevElements[targetParentId].children, newComponentRootId],
      //   },
      // }),
    }));
    
    setNextIdNum(updatedNextIdNum);
    setSelectedElementId(newComponentRootId); // Select the root of the newly added component
  }, [nextIdNum, getElementName]);


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
    setElements,
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
    deleteElement,
    selectElement,
  };
};