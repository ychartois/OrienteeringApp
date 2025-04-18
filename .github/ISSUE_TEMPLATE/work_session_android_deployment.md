---
name: Work Session Objectives
about: Plan and track objectives for a focused work session
title: '[Work Session] 2025-04-18 - Android APK Deployment Implementation'
labels: 'work-session'
assignees: ''
---

## Session Information
**Date:** 2025-04-18  
**Session #:** 2  
**Participants:** Yannig, GitHub Copilot  
**Focus Area:** Android APK Deployment Pipeline  
**Session Duration:** 2-3 hours  

## Session Goals and Success Criteria
<!-- Each goal should be linked to GitHub issues and have clear success criteria -->

### Goal 1: Configure EAS Build in GitHub Actions for Android APK Deployment
**Related Issues:** N/A
**Success Criteria:**
- [ ] Create GitHub Actions workflow file for Android builds using EAS
- [ ] Configure the workflow to use EXPO_TOKEN for authentication with EAS
- [ ] Set up the workflow to trigger on appropriate branch events (develop for dev builds, tags for releases)
- [ ] Test the workflow to ensure it correctly builds Android APKs

### Goal 2: Set up Android Development Build Workflow
**Related Issues:** N/A
**Success Criteria:**
- [ ] Create a development profile in eas.json (if not already present)
- [ ] Configure workflow to build debug APKs on push to develop branch
- [ ] Add steps to store build artifacts for easy download
- [ ] Document how to access and install development builds

### Goal 3: Set up Android Production Build Workflow
**Related Issues:** N/A
**Success Criteria:**
- [ ] Configure production profile in eas.json for app store submissions
- [ ] Set up workflow to trigger on version tags (v*.*.*)
- [ ] Implement proper versioning handling
- [ ] Add documentation for the release process

## Technical Requirements
<!-- What technical considerations should be kept in mind? -->
- Expo Application Services (EAS) account and configuration
- EXPO_TOKEN secret must be stored in GitHub repository secrets
- Proper configuration of Android app.json for EAS builds
- Understanding of GitHub Actions workflow syntax and job dependencies
- Build profiles for different environments (development, production)

## References & Resources
<!-- Links to relevant documentation, code, or other resources -->
- [EAS Build Documentation](https://docs.expo.dev/eas/build/)
- [GitHub Actions with Expo](https://docs.expo.dev/eas/github-actions/)
- [Branch and Release Strategy](/docs/branch-release-strategy.md)
- [Deployment Guide](/docs/deployment.md)
- [App Store Preparation Guide](/docs/app-store-preparation.md)

## Questions/Clarifications for AI Assistance
<!-- List any questions or clarifications needed -->
1. What's the best way to handle version numbers between app.json and package.json?
2. How should we structure the workflow file to support both development and production builds?
3. How can we provide easy access to the built APKs for team members?
4. Should we implement any submission automation to app stores, or keep that manual for now?
5. How can we ensure the build workflow integrates well with our branching strategy?

## Next Steps
<!-- What should be done after this session? -->
- [ ] Create GitHub Actions workflow file for Android builds
- [ ] Set up repository secrets for EXPO_TOKEN
- [ ] Test development build workflow
- [ ] Test production build workflow
- [ ] Update deployment documentation with the new Android build process

## Session Retrospective
<!-- To be filled at the end of the session -->

### What went well
- <!-- Point 1 -->
- <!-- Point 2 -->

### What could be improved
- <!-- Point 1 -->
- <!-- Point 2 -->

### Blockers/Issues Encountered
- <!-- Issue 1 or "None" -->