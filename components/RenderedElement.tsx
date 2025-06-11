
import React from 'react';
import { LayoutElement, ElementProps, ContainerProps, RowProps, ColProps, ControlProps, Spacing } from '../types';
import { Container, Row, Col, Control } from './elements';

interface RenderedElementProps {
  element: LayoutElement;
  allElements: Record<string, LayoutElement>;
  onSelectElement: (id: string) => void;
  selectedElementId: string | null;
}



const RenderedElement: React.FC<RenderedElementProps> = ({
  element,
  allElements,
  onSelectElement,
  selectedElementId
}) => {
  const { id, type, props, children, name } = element;
  const isSelected = selectedElementId === id;

  // Render children elements
  const childElements = children.map(childId => {
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
  }).filter(Boolean);

  // Use the appropriate component based on type
  switch (type) {
    case 'container':
      return (
        <Container
          props={props as Partial<ContainerProps>}
          isSelected={isSelected}
          onClick={() => onSelectElement(id)}
          id={id}
        >
          {childElements}
        </Container>
      );

    case 'row':
      return (
        <Row
          props={props as Partial<RowProps>}
          isSelected={isSelected}
          onClick={() => onSelectElement(id)}
          id={id}
        >
          {childElements}
        </Row>
      );

    case 'col':
      return (
        <Col
          props={props as Partial<ColProps>}
          isSelected={isSelected}
          onClick={() => onSelectElement(id)}
          id={id}
        >
          {childElements}
        </Col>
      );

    case 'control':
      return (
        <Control
          props={props as Partial<ControlProps>}
          isSelected={isSelected}
          onClick={() => onSelectElement(id)}
          id={id}
        >
          {childElements}
        </Control>
      );

    default:
      // Fallback for unknown types
      return (
        <div
          className="border border-dashed border-red-400 p-2 bg-red-50 dark:bg-red-900"
          onClick={(e) => {
            e.stopPropagation();
            onSelectElement(id);
          }}
        >
          <div className="text-red-600 dark:text-red-300 text-xs">
            Unknown element type: {type}
          </div>
          {childElements}
        </div>
      );
  }
};

export default RenderedElement;