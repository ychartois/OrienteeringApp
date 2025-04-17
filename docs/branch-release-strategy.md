# Branch and Release Strategy

This document outlines the branching model and release process for the OrienteeringApp project to ensure a smooth and controlled development workflow.

## Branching Strategy

We follow a modified GitFlow branching model that's optimized for our project needs. This approach helps us maintain a clean repository and control when builds are triggered.

### Main Branches

- **main** - The production branch containing the current released version. All code in this branch should be stable and deployable.
- **develop** - The main development branch where feature branches are merged. This branch contains the latest development changes that will be included in the next release.

### Supporting Branches

- **feature/<feature-name>** - Feature branches are created from the develop branch and contain work for specific features or improvements.
- **release/<version>** - Created from develop when preparing a new release. Only bug fixes and release-specific changes go here.
- **hotfix/<issue>** - Created from main to quickly address critical production issues.

## Branch Workflow

### Feature Development

1. Create a feature branch from develop:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/my-new-feature
   ```

2. Develop and commit changes to your feature branch.

3. When the feature is complete, create a pull request to the develop branch.

4. After code review and approval, merge the feature branch into develop.

### Release Process

1. Create a release branch from develop when ready to prepare a release:
   ```bash
   git checkout develop
   git pull
   git checkout -b release/1.2.0
   ```

2. Update version numbers in:
   - package.json
   - app.json
   - Any other version-specific files

3. Make any release-specific adjustments or bug fixes directly on the release branch.

4. Create a pull request to merge into main.

5. After approval, merge the release branch into main AND back into develop:
   ```bash
   # First merge to main
   git checkout main
   git merge --no-ff release/1.2.0
   git tag -a v1.2.0 -m "Version 1.2.0"
   git push origin main --tags
   
   # Then merge back to develop
   git checkout develop
   git merge --no-ff release/1.2.0
   git push origin develop
   ```

6. Delete the release branch when done.

### Hotfixes

1. Create a hotfix branch from main:
   ```bash
   git checkout main
   git pull
   git checkout -b hotfix/critical-bug-fix
   ```

2. Fix the issue and update version numbers (e.g., 1.2.0 → 1.2.1).

3. Create pull requests to merge into both main and develop.

4. Tag the new version on main.

## Automated Builds and Deployments

### Build Trigger Rules

Our GitHub Actions workflows are configured to trigger builds based on specific branch and tag conditions:

1. **Web Deployment**:
   - Builds automatically on pushes to main
   - Deploys to GitHub Pages after successful build

2. **Test Builds**:
   - Run on all pull requests to develop and main
   - Run on pushes to feature/* branches
   - Does not deploy anywhere

3. **Android Development Builds**:
   - Triggered manually or on push to develop
   - Uses EAS Build with development profile
   - Produces debug APK for testing

4. **Release Builds**:
   - Triggered only when a new tag is pushed (v*.*.*)
   - Uses EAS Build with production profile
   - Produces release builds for app stores

### GitHub Actions Configuration

Our workflows are defined to respect these trigger rules:

```yaml
# Example trigger for web deployment workflow
on:
  push:
    branches:
      - main
    paths:
      - 'frontend/**'

# Example trigger for Android release build
on:
  push:
    tags:
      - 'v*.*.*'
```

## EAS Build Configuration

For Android builds, we use Expo Application Services (EAS) Build:

1. **Development Builds**:
   ```bash
   eas build --platform android --profile development
   ```

2. **Preview Builds** (for testing release candidates):
   ```bash
   eas build --platform android --profile preview
   ```

3. **Production Builds** (for app store):
   ```bash
   eas build --platform android --profile production
   ```

These different profiles are defined in the `eas.json` file.

## Version Numbering

We follow semantic versioning (SemVer) for our releases:

- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward compatible manner
- **PATCH** version for backward compatible bug fixes

Example: 1.4.2 (major.minor.patch)

## Release Checklist

Before creating a release:

1. Ensure all tests pass on the develop branch
2. Update the CHANGELOG.md file with all notable changes
3. Update version numbers in all necessary files
4. Create the release branch following the process above
5. Test the release build on multiple devices
6. Submit for team review
7. Merge to main and tag the release
8. Initiate the production build for app stores

## GitHub Actions Authentication for EAS Build

To enable EAS Build in GitHub Actions:

1. Store your Expo credentials as GitHub repository secrets:
   - `EXPO_TOKEN` - An Expo access token

2. Use these secrets in your workflow:
   ```yaml
   - name: Setup Expo
     uses: expo/expo-github-action@v8
     with:
       expo-version: latest
       token: ${{ secrets.EXPO_TOKEN }}
   
   - name: Build Android app
     run: npx eas-cli build --platform android --profile production --non-interactive
   ```