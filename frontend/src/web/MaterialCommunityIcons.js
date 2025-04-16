// This is a web-specific implementation for MaterialCommunityIcons
import React from 'react';
import { Text } from 'react-native';

// Map of icon names to unicode symbols or emoji
const iconMap = {
  // Common UI icons
  'check': '✓',
  'close': '✕',
  'magnify': '🔍',
  'filter-variant': '⚙️',
  'arrow-left': '←',
  'arrow-right': '→',
  'plus': '+',
  'minus': '-',
  'menu': '☰',
  'home': '🏠',
  'settings': '⚙️',
  'account': '👤',
  'star': '★',
  'star-outline': '☆',
  'heart': '❤️',
  'heart-outline': '♡',
  'bookmark': '🔖',
  'bookmark-outline': '🔖',
  'delete': '🗑️',
  'edit': '✏️',
  'share': '↗️',
  'download': '⬇️',
  'upload': '⬆️',
  'refresh': '🔄',
  'alert': '⚠️',
  'information': 'ℹ️',
  'help-circle': '❓',
  'calendar': '📅',
  'clock': '🕒',
  'map-marker': '📍',
  'phone': '📞',
  'email': '✉️',
  'link': '🔗',
  'camera': '📷',
  'image': '🖼️',
  'file': '📄',
  'folder': '📁',
  'play': '▶️',
  'pause': '⏸️',
  'stop': '⏹️',
  'skip-next': '⏭️',
  'skip-previous': '⏮️',
  'volume-high': '🔊',
  'volume-off': '🔇',
  'lock': '🔒',
  'lock-open': '🔓',
  'eye': '👁️',
  'eye-off': '👁️‍🗨️',
  'send': '📤',
  'bell': '🔔',
  'bell-off': '🔕',
  'thumb-up': '👍',
  'thumb-down': '👎',
  'comment': '💬',
  'chat': '💬',
  'dots-vertical': '⋮',
  'dots-horizontal': '⋯',
  'chevron-down': '▼',
  'chevron-up': '▲',
  'chevron-left': '◀',
  'chevron-right': '▶',
  'sort': '⇅',
  'filter': '⚙️',
  'search': '🔍',
  'cart': '🛒',
  'tag': '🏷️',
  'tag-outline': '🏷️',
  'logout': '🚪',
  'login': '🚪',
  'check-circle': '✓',
  'check-circle-outline': '○',
  'alert-circle': '⚠️',
  'alert-circle-outline': '⚠️',
  'information-outline': 'ℹ️',
  'help-circle-outline': '❓',
  'plus-circle': '⊕',
  'minus-circle': '⊖',
  'close-circle': '⊗',
  'close-circle-outline': '⊗',
  'account-circle': '👤',
  'account-circle-outline': '👤',
  'star-circle': '★',
  'star-circle-outline': '☆',
  'heart-circle': '❤️',
  'heart-circle-outline': '♡',
  'bookmark-check': '🔖✓',
  'bookmark-check-outline': '🔖✓',
};

// Enhanced implementation that renders unicode symbols for common icons
const MaterialCommunityIcons = ({ name, size, color, style }) => {
  // Use the mapped icon if available, otherwise fallback to the name
  const iconContent = iconMap[name] || name;
  
  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {iconContent}
    </Text>
  );
};

MaterialCommunityIcons.displayName = 'MaterialCommunityIcons';

export default MaterialCommunityIcons;
