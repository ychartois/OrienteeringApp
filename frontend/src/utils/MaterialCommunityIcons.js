/**
 * MaterialCommunityIcons implementation using Font Awesome
 * This file provides a bridge between React Native Paper (which expects MaterialCommunityIcons)
 * and our Font Awesome icon implementation.
 */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import * as Icons from '@fortawesome/free-solid-svg-icons';

// Map of Material icon names to FontAwesome icons
const iconMap = {
  'check': Icons.faCheck,
  'close': Icons.faTimes,
  'settings': Icons.faCog,
  'home': Icons.faHome,
  'arrow-right': Icons.faArrowRight,
  'arrow-left': Icons.faArrowLeft,
  'refresh': Icons.faRedo,
  'play': Icons.faPlay,
  'plus': Icons.faPlus,
  'minus': Icons.faMinus,
  'filter-variant': Icons.faFilter,
  'magnify': Icons.faSearch,
  'information': Icons.faInfoCircle,
  'alert': Icons.faExclamationTriangle,
  'star': Icons.faStar,
  'star-outline': Icons.faStar,
  'check-circle': Icons.faCheckCircle,
  'circle': Icons.faCircle,
  'clock': Icons.faClock,
  'cog': Icons.faCog,
  'book-open-variant': Icons.faBook,
  'moon': Icons.faMoon,
  'sun': Icons.faSun,
  'flag-checkered': Icons.faCheckCircle,
  'question': Icons.faQuestion,
  // Fallback icon
  'default': Icons.faQuestion
};

// Function to get the appropriate FontAwesome icon
const getIcon = (name) => {
  return iconMap[name] || iconMap['default'];
};

// This component mimics the interface of MaterialCommunityIcons from react-native-vector-icons
const MaterialCommunityIcons = (props) => {
  // Extract the props we need
  const { name, size, color, style } = props;
  
  // Special case for star-outline (React Native Paper uses outline, FA doesn't)
  if (name === 'star-outline') {
    return (
      <FontAwesomeIcon 
        icon={Icons.faStar} 
        color={color} 
        size={size} 
        style={{ ...style, opacity: 0.5 }} 
      />
    );
  }
  
  return (
    <FontAwesomeIcon 
      icon={getIcon(name)} 
      color={color} 
      size={size} 
      style={style} 
    />
  );
};

// Add the displayName property to match the original component
MaterialCommunityIcons.displayName = 'MaterialCommunityIcons';

export default MaterialCommunityIcons;