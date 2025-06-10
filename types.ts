export type ElementType = 'container' | 'row' | 'col' | 'control';

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

export interface ControlSpecificProps {
  controlType: string; // button, input, label, etc.
  text?: string;
  placeholder?: string;
  href?: string;
  src?: string;
  alt?: string;
  type?: string; // input type: text, email, password, number, etc.
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  htmlFor?: string;
  target?: string; // link target: _self, _blank, _parent, _top
  variant?: string; // button/badge variant: primary, secondary, success, warning, error
  size?: string; // size: xs, sm, md, lg, xl
  width?: string;
  height?: string;
  level?: string; // for headings: h1, h2, h3, h4, h5, h6
  rows?: string; // for textarea
  cols?: string; // for textarea
  maxLength?: string; // for input/textarea
  minLength?: string; // for input/textarea
  min?: string; // for number input
  max?: string; // for number input
  step?: string; // for number input
  multiple?: boolean; // for select/file input
  accept?: string; // for file input
  autoComplete?: string; // for input
  autoFocus?: boolean; // for input/textarea/select
  name?: string; // form field name
  id?: string; // element id
  className?: string; // additional CSS classes
  style?: Record<string, string>; // inline styles
  title?: string; // tooltip text
  tabIndex?: string; // tab order
  role?: string; // ARIA role
  ariaLabel?: string; // ARIA label
  ariaDescribedBy?: string; // ARIA described by
  dataAttributes?: Record<string, string>; // data-* attributes
  [key: string]: any; // Allow additional properties
}
export type ControlProps = CommonProps & ControlSpecificProps;

export type ElementProps = ContainerProps | RowProps | ColProps | ControlProps;

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
export type ControlSpecificPropKeys = keyof ControlSpecificProps;

export type AllElementPropKeys = CommonPropKeys | ContainerSpecificPropKeys | RowSpecificPropKeys | ColSpecificPropKeys | ControlSpecificPropKeys;

// Type for predefined component keys
export type PredefinedComponentKey = 'INFO_CARDS_SECTION' | string; // Allow for more keys
