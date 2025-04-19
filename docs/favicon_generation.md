# Favicon Generation Guide

This document provides instructions for creating and updating the favicon for the OrienteeringApp.

## Required Favicon Files

The following favicon files should be placed in `/frontend/public/favicons/`:

- favicon.ico (16x16, 32x32, 48x48)
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png (180x180)
- android-chrome-192x192.png
- android-chrome-512x512.png
- safari-pinned-tab.svg
- mstile-150x150.png

## Generation Process

1. **Prepare the Source Image**:
   - Create a simple, recognizable image that represents the OrienteeringApp
   - Use a square format (at least 512x512 pixels)
   - Ensure good visibility when scaled down to 16x16 pixels

2. **Use a Favicon Generator Service**:
   - Upload your source image to a service like https://realfavicongenerator.net/
   - Configure the options for each platform (iOS, Android, Windows, etc.)
   - Download the generated package

3. **Install the Files**:
   - Place all generated files in `/frontend/public/favicons/`
   - Make sure the references in `index.html` match the file locations

## Testing the Favicon

Test the favicon in various contexts:
- Browser tabs
- Bookmarks
- Mobile home screens (iOS, Android)
- Windows tiles

## Using the Favicon in Development

The favicon should automatically load in development mode. If you make changes to the favicon files, you may need to:

1. Clear your browser cache
2. Restart the development server
3. Force reload the page (Ctrl+F5 or Cmd+Shift+R)

## Using the Asset Path Utility

If you need to reference the favicon in your application code, use the `getAssetPath` utility:

```tsx
import { getAssetPath } from '../utils/assetUtils';

// Example usage
const faviconPath = getAssetPath('favicons/favicon-32x32.png');
```

This ensures the correct path resolution across all environments.
