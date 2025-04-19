import { getAssetPath } from '../../utils/assetUtils';

describe('getAssetPath', () => {
  // Store original window object
  const originalWindow = global.window;
  
  beforeEach(() => {
    // Create a new mock window for each test
    global.window = {
      location: {
        pathname: '/',
        port: ''
      }
    } as any;
    
    // Reset mocks before each test
    jest.resetModules();
  });
  
  afterEach(() => {
    // Restore original window
    global.window = originalWindow;
  });
  
  it('returns the original path for native platforms', () => {
    // Set up mock for this test only
    jest.mock('react-native', () => ({
      Platform: {
        OS: 'android'
      }
    }));
    
    // We need to re-import after the mock is set up
    const { getAssetPath } = require('../../utils/assetUtils');
    
    const result = getAssetPath('assets/test_image.png');
    expect(result).toBe('assets/test_image.png');
  });
  
  it('handles external URLs (starting with http) correctly', () => {
    // Set up mock for this test only
    jest.mock('react-native', () => ({
      Platform: {
        OS: 'web'
      }
    }));
    
    // Re-import after the mock is set up
    const { getAssetPath } = require('../../utils/assetUtils');
    
    const externalUrl = 'https://example.com/image.png';
    const result = getAssetPath(externalUrl);
    expect(result).toBe(externalUrl);
  });
  
  it('handles empty paths', () => {
    // Set up mock for this test only
    jest.mock('react-native', () => ({
      Platform: {
        OS: 'web'
      }
    }));
    
    // Re-import after the mock is set up
    const { getAssetPath } = require('../../utils/assetUtils');
    
    const result = getAssetPath('');
    expect(result).toBe('');
  });
  
  it('handles GitHub Pages deployment paths', () => {
    // Set up mock for this test only
    jest.mock('react-native', () => ({
      Platform: {
        OS: 'web'
      }
    }));
    
    // Re-import after the mock is set up
    const { getAssetPath } = require('../../utils/assetUtils');
    
    // Set up a mock window location for GitHub Pages
    Object.defineProperty(global.window, 'location', {
      value: {
        pathname: '/OrienteeringApp/index.html',
        port: ''
      },
      writable: true
    });
    
    // Test with assets path
    const result1 = getAssetPath('../../assets/test_image.png');
    expect(result1).toBe('/OrienteeringApp/assets/test_image.png');
    
    // Test with regular path
    const result2 = getAssetPath('/some/path/image.png');
    expect(result2).toBe('/OrienteeringApp/some/path/image.png');
  });
  
  it('handles local development paths correctly', () => {
    // Set up mock for this test only
    jest.mock('react-native', () => ({
      Platform: {
        OS: 'web'
      }
    }));
    
    // Re-import after the mock is set up
    const { getAssetPath } = require('../../utils/assetUtils');
    
    // Set up a mock window location for local development
    Object.defineProperty(global.window, 'location', {
      value: {
        pathname: '/',
        port: '3000'
      },
      writable: true
    });
    
    const result = getAssetPath('../../assets/test_image.png');
    expect(result).toBe('/assets/test_image.png');
  });
  
  it('handles undefined path', () => {
    // Set up mock for this test only
    jest.mock('react-native', () => ({
      Platform: {
        OS: 'web'
      }
    }));
    
    // Re-import after the mock is set up
    const { getAssetPath } = require('../../utils/assetUtils');
    
    const result = getAssetPath(undefined as any);
    expect(result).toBe('');
  });
});