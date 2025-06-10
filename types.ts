export type ElementType = 'container' | 'row' | 'col';

export interface Spacing {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

export interface CommonProps {
  padding: Spacing;
  margin: Spacing;
  backgroundColor: string; // e.g., 'blue-200'
  customClasses: string;
  minHeight: string; // e.g. '60px'
}

export interface ContainerSpecificProps {
  isFluid: boolean;
  isFullscreen: boolean; // New property for fullscreen containers
}
export type ContainerProps = CommonProps & ContainerSpecificProps;

export interface RowSpecificProps {
  gutters: { x: string; y: string }; // 0-5
  justifyContent: string; // start, end, center, between, around, evenly
  alignItems: string; // start, end, center, baseline, stretch
}
export type RowProps = CommonProps & RowSpecificProps;


export interface ColSpecificProps {
  span: string; // 1-12, 'auto'
  offset: string; // 0-11
  order: string; // 1-12, 'first', 'last', 'none'
  alignSelf: string; // auto, start, end, center, baseline, stretch
}
export type ColProps = CommonProps & ColSpecificProps;

export type ElementProps = ContainerProps | RowProps | ColProps;

export interface LayoutElement {
  id: string;
  type: ElementType;
  name: string; 
  parentId: string | null;
  children: string[];
  props: Partial<ElementProps>; // Using Partial as props are built up
}

// New type definitions for property keys
export type CommonPropKeys = keyof CommonProps;
export type ContainerSpecificPropKeys = keyof ContainerSpecificProps;
export type RowSpecificPropKeys = keyof RowSpecificProps;
export type ColSpecificPropKeys = keyof ColSpecificProps;

export type AllElementPropKeys = CommonPropKeys | ContainerSpecificPropKeys | RowSpecificPropKeys | ColSpecificPropKeys;

// Type for predefined component keys
export type PredefinedComponentKey = 'INFO_CARDS_SECTION' | string; // Allow for more keys
