// This is a web-specific implementation for MaterialCommunityIcons
import React from 'react';
import { Text } from 'react-native';

// Simple implementation that just renders the name of the icon
// In a real app, you would use a proper icon library for web
const MaterialCommunityIcons = ({ name, size, color, style }) => {
  return (
    <Text style={[{ fontSize: size, color }, style]}>
      {name}
    </Text>
  );
};

MaterialCommunityIcons.displayName = 'MaterialCommunityIcons';

export default MaterialCommunityIcons;
