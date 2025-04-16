declare module '@fortawesome/fontawesome-svg-core' {
  export interface IconDefinition {
    prefix: string;
    iconName: string;
    icon: [
      number, // width
      number, // height
      string[], // ligatures
      string, // unicode
      string // svgPathData
    ];
  }
}

declare module '@fortawesome/free-solid-svg-icons' {
  import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
  export const faCheck: IconDefinition;
  export const faTimes: IconDefinition;
  export const faCog: IconDefinition;
  export const faHome: IconDefinition;
  export const faArrowRight: IconDefinition;
  export const faArrowLeft: IconDefinition;
  export const faRedo: IconDefinition;
  export const faPlay: IconDefinition;
  export const faPlus: IconDefinition;
  export const faMinus: IconDefinition;
  export const faFilter: IconDefinition;
  export const faSearch: IconDefinition;
  export const faInfoCircle: IconDefinition;
  export const faExclamationTriangle: IconDefinition;
  export const faStar: IconDefinition;
  export const faCheckCircle: IconDefinition;
  export const faCircle: IconDefinition;
  export const faClock: IconDefinition;
  export const faBook: IconDefinition;
  export const faMoon: IconDefinition;
  export const faSun: IconDefinition;
  export const faQuestion: IconDefinition;
}

declare module '@fortawesome/react-native-fontawesome' {
  import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
  import React from 'react';
  
  export interface Props {
    icon: IconDefinition;
    color?: string;
    size?: number;
    style?: any;
  }
  
  export class FontAwesomeIcon extends React.Component<Props> {}
}