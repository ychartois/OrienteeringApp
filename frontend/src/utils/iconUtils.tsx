import React from 'react';
import MaterialCommunityIcons from '../web/MaterialCommunityIcons';

/**
 * This file is now a simple re-export of our MaterialCommunityIcons implementation
 * to maintain a clean API for components that want to use icons.
 * 
 * All icon mapping and rendering logic is consolidated in MaterialCommunityIcons.js
 */

// Re-export the MaterialCommunityIcons component as PaperFontAwesomeIcon for backward compatibility
export const PaperFontAwesomeIcon = MaterialCommunityIcons;
