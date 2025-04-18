import { Platform } from 'react-native';

/**
 * A utility module to handle asset loading consistently across platforms and environments
 */

// Get assets from different environments
export const getAssetSource = (fileName) => {
  // If it's a network URL, use it directly
  if (fileName.startsWith('http')) {
    return { uri: fileName };
  }

  // Extract the filename from paths like "../../assets/filename.png"
  const simpleFileName = fileName.includes('/') ? fileName.split('/').pop() : fileName;
  
  // Web environments
  if (Platform.OS === 'web') {
    // For webpack (port 3000)
    if (window.location.port === '3000') {
      return { uri: `/assets/${simpleFileName}` };
    }
    
    // For Metro (port 8081-8085)
    return { uri: `/src/assets/${simpleFileName}` };
  }
  
  // For native platforms, use URI references since dynamic requires aren't supported
  // This should work for most use cases in development and testing
  return { uri: `asset:/src/assets/${simpleFileName}` };
};