# App Store Preparation Guide

This document provides guidelines and requirements for preparing the OrienteeringApp for submission to mobile app stores.

## Android (Google Play Store)

### Required Assets

- **App Icon**: High-resolution icon (512x512 px)
- **Feature Graphic**: 1024x500 px promotional image
- **Screenshots**: At least 2 screenshots for each supported device type
  - Phone: Min 2 screenshots, max 8
  - 7-inch tablet: Min 2 screenshots, max 8
  - 10-inch tablet: Min 2 screenshots, max 8

### App Signing

To create a signed APK for Google Play:

1. Generate a keystore file:
   ```bash
   cd frontend/android
   keytool -genkey -v -keystore orienteering-app.keystore -alias orienteering-app -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Configure signing in `android/app/build.gradle`:
   ```gradle
   android {
     ...
     signingConfigs {
       release {
         storeFile file('orienteering-app.keystore')
         storePassword System.getenv("KEYSTORE_PASSWORD")
         keyAlias 'orienteering-app'
         keyPassword System.getenv("KEY_PASSWORD")
       }
     }
     buildTypes {
       release {
         ...
         signingConfig signingConfigs.release
       }
     }
   }
   ```

3. Build signed APK:
   ```bash
   cd frontend/android
   ./gradlew assembleRelease
   ```

### App Bundle (Recommended)

Google Play prefers Android App Bundles over APKs:

```bash
cd frontend/android
./gradlew bundleRelease
```

The bundle will be at `android/app/build/outputs/bundle/release/app-release.aab`

### Google Play Store Listing Requirements

1. **App Title**: Max 50 characters
2. **Short Description**: Max 80 characters
3. **Full Description**: Max 4000 characters
4. **App Category**: Education & Reference
5. **Content Rating**: Provide information for official ESRB/PEGI rating
6. **Contact Information**: Email, website, privacy policy URL

## iOS (App Store)

### Required Assets

- **App Icon**: Various sizes from 20x20 to 1024x1024 px (see Xcode)
- **Screenshots**: At least one screenshot for each supported device type
  - iPhone: 1242x2688 px (or appropriate size for latest devices)
  - iPad: 2048x2732 px (or appropriate size for latest devices)

### App Signing

1. Register for an Apple Developer account
2. Create app ID in Apple Developer Portal
3. Create distribution certificate and provisioning profile
4. Configure signing in Xcode project

### TestFlight

Before submitting to App Store, test with TestFlight:

1. Upload build to App Store Connect using Xcode
2. Configure TestFlight information
3. Add internal and external testers
4. Distribute build to testers

### App Store Listing Requirements

1. **App Name**: Max 30 characters
2. **Subtitle**: Max 30 characters
3. **Description**: Max 4000 characters
4. **Keywords**: Max 100 characters
5. **Support URL**: Required
6. **Privacy Policy URL**: Required
7. **App Store Category**: Education & Reference

## App Metadata Templates

### App Name
OrienteeringApp: Learn Map Symbols

### Short Description/Subtitle
Learn orienteering map symbols and test your knowledge.

### Description
OrienteeringApp is the essential tool for anyone looking to learn orienteering map symbols and improve their map reading skills.

Features:
- Complete symbol library with visual references and descriptions
- Interactive quizzes with multiple difficulty levels
- Filter symbols by category
- Track your progress and identify areas for improvement
- Dark mode support for comfortable viewing in any environment

Whether you're a beginner just starting out or an experienced orienteer looking to brush up on your map reading skills, OrienteeringApp provides a comprehensive and engaging learning experience.

Learn to identify terrain features, vegetation, man-made objects, and special features used in international orienteering maps. Master control descriptions and symbols to improve your performance in competitions.

Download now and start your journey to becoming a better orienteer!

### Keywords
orienteering, map symbols, navigation, outdoor, compass, learning

### Category
Education & Reference

## Version Naming Convention

Use semantic versioning (MAJOR.MINOR.PATCH):

- **MAJOR**: Significant changes or redesigns
- **MINOR**: New features
- **PATCH**: Bug fixes and minor improvements

Example: 1.0.0 for initial release, 1.1.0 for feature addition, 1.1.1 for bug fix