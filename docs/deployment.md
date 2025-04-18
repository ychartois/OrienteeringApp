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

#### Automated Builds with EAS Build

We use Expo Application Services (EAS) Build for creating Android app builds. This is configured to run automatically through GitHub Actions.

##### Build Types

- **Development Builds**: Triggered automatically when pushing to the `develop` branch
- **Production Builds**: Triggered automatically when pushing version tags (e.g., `v1.0.0`)
- **Manual Builds**: Can be triggered manually from the GitHub Actions tab

##### Using the GitHub Actions Workflow

1. **For Development Builds**:
   - Push changes to the `develop` branch
   - GitHub Actions will automatically start a development build
   - The build will be available in the Expo dashboard

2. **For Production Builds**:
   - Create and push a version tag:
     ```bash
     git tag v1.0.0
     git push origin v1.0.0
     ```
   - GitHub Actions will automatically start a production build
   - The production build will be available in the Expo dashboard

3. **For Manual Builds**:
   - Go to the GitHub Actions tab in the repository
   - Select the "Android Build" workflow
   - Click "Run workflow"
   - Select the build type (development, preview, or production)
   - Click "Run workflow"

##### Accessing Builds

Once a build is complete, you can access it through:
- The Expo dashboard at https://expo.dev
- The build URL provided in the GitHub Actions run summary

##### Build Profiles

The build profiles are defined in `frontend/eas.json`:
- **Development**: Creates a debug APK with the development client
- **Preview**: Creates an internal distribution APK for testing
- **Production**: Creates an app bundle for Google Play Store submission

#### Building an Android APK Locally

If you need to build an APK manually:

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