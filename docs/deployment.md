# Deployment Guide

This document provides instructions for deploying the OrienteeringApp to different environments.

## Web Deployment

### Deploying to GitHub Pages

The application is set up to automatically deploy to GitHub Pages when changes are pushed to the main branch. This is handled by the GitHub Actions workflow defined in `.github/workflows/frontend-ci-cd.yml`.

#### Automatic Deployment

1. Push changes to the main branch
2. The GitHub Actions workflow will:
   - Check out the code
   - Install dependencies
   - Run tests
   - Build the web application
   - Deploy to GitHub Pages

#### Manual Deployment

If you need to deploy manually:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Build the application
npm run build-web

# The build output will be in the 'dist' directory
```

### Custom Domain Configuration

If you want to use a custom domain with GitHub Pages:

1. Go to your GitHub repository settings
2. Navigate to "Pages"
3. Under "Custom domain", enter your domain
4. Configure your DNS provider with:
   - A CNAME record pointing to `<username>.github.io` if using a subdomain
   - A records pointing to GitHub's IP addresses if using an apex domain

## Mobile Deployment

### Android

#### Building an Android APK

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Generate the APK
cd android && ./gradlew assembleRelease
```

The APK will be located at `android/app/build/outputs/apk/release/app-release.apk`

### iOS

#### Building for iOS App Store

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Build the iOS app
cd ios && pod install
open OrienteeringApp.xcworkspace
```

Then use Xcode to build and archive the app for submission.

## Environment Configuration

The application uses different environment configurations based on the build environment:

- **Development**: Used when running locally with `npm run web`
- **Production**: Used when building for deployment with `npm run build-web`

Environment-specific values are set in the webpack configuration (`webpack.config.js`).

## Troubleshooting

### Common Issues

1. **Missing dependencies**:
   ```bash
   npm install
   ```

2. **Build fails due to outdated Node.js**:
   Ensure you are using Node.js version 18 or higher.

3. **Assets not loading after deployment**:
   Check that the publicPath in webpack.config.js matches your deployment URL structure.

## Continuous Integration

The CI/CD pipeline is configured to:

1. Run on push to main branch and pull requests
2. Run tests for code changes
3. Build the web application
4. Deploy to GitHub Pages (only on push to main)