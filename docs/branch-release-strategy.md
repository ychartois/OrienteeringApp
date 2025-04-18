# Branch and Release Strategy

This document outlines the branching model and release process for the OrienteeringApp project to ensure a smooth and controlled development workflow.

## Branching Strategy

We follow a modified GitFlow branching model that's optimized for our project needs. This approach helps us maintain a clean repository and control when builds are triggered.

### Main Branches

- **main** - The production branch containing the current released version. All code in this branch should be stable and deployable.
- **develop** - The main development branch where feature branches are merged. This branch contains the latest development changes that will be included in the next release.

### Branch Naming Conventions

All branches should follow these specific naming patterns for consistency and to enable proper automation:

- **Feature branches**: `feature/<issue-number>-<short-description>`
  - Example: `feature/42-add-quiz-scoring`
  - Always branch from: `develop`
  - Merge back to: `develop`

- **Bug fix branches**: `bugfix/<issue-number>-<short-description>`
  - Example: `bugfix/57-fix-symbol-rendering`
  - Always branch from: `develop`
  - Merge back to: `develop`

- **Release branches**: `release/v<major>.<minor>.<patch>`
  - Example: `release/v1.2.0`
  - Always branch from: `develop`
  - Merge to: `main` and back to `develop`

- **Hotfix branches**: `hotfix/<issue-number>-<short-description>`
  - Example: `hotfix/68-fix-crash-on-startup`
  - Always branch from: `main`
  - Merge to: `main` and `develop`

Including the issue number in the branch name helps with traceability and enables GitHub automation.

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

Our workflows are specifically configured for different branch events:

#### Branch-Based Workflow Triggers:

| Workflow | Trigger Event | Branch Pattern | Purpose |
|----------|--------------|----------------|---------|
| **CI Test** | Push, Pull Request | `feature/*`, `bugfix/*`, PRs to `develop` | Run tests and linting for development changes |
| **Development Build** | Push | `develop` | Create development build for testing |
| **Web Preview** | Push | `develop` | Deploy to staging/preview environment |
| **Web Deployment** | Push | `main` | Deploy to production website |
| **Android Build** | Push | `main` | Build release candidate for Android |
| **Release Build** | Tag Push | `v*.*.*` | Build production versions for app stores |

Example workflow configurations:

```yaml
# CI Test workflow
on:
  push:
    branches:
      - 'feature/**'
      - 'bugfix/**'
  pull_request:
    branches:
      - develop
      - main

# Development build workflow
on:
  push:
    branches:
      - develop
    paths:
      - 'frontend/**'
      - 'backend/**'

# Release build workflow
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

### Version Update Tool

To maintain consistent version numbers across all files, we provide a version update script:

```bash
# Navigate to the frontend directory
cd frontend

# Update all version numbers to 1.2.3
npm run update-version 1.2.3
```

This script will:
- Update the version in package.json
- Update the version in app.json (both root and expo section)
- Increment the Android versionCode in app.json
- Increment the iOS buildNumber in app.json

Always run this script when preparing a release to ensure version consistency.

## Release Checklist

Before creating a release:

1. Ensure all tests pass on the develop branch
2. Update the CHANGELOG.md file with all notable changes
3. Update version numbers using the version update tool:
   ```bash
   cd frontend
   npm run update-version 1.2.3  # Use appropriate version number
   ```
4. Create the release branch following the process above
5. Test the development build on multiple devices:
   ```bash
   # For local testing
   cd frontend
   npm run android
   
   # Or trigger a development build via GitHub Actions
   # by pushing to develop or using the manual workflow trigger
   ```
6. Submit for team review
7. Merge to main and tag the release:
   ```bash
   git tag -a v1.2.3 -m "Version 1.2.3"
   git push origin v1.2.3
   ```
8. The tag push will automatically trigger the production build for app stores via GitHub Actions

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