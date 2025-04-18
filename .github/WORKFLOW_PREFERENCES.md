# Workflow Preferences

This document outlines established workflow conventions, preferences, and best practices for the OrienteeringApp project. It serves as a reference for both developers and AI assistants working on the codebase.

## Development Workflow

### Before Making Changes

- Always create a branch following our [branch naming conventions](../docs/branch-release-strategy.md)
- Verify that you understand the requirements by checking related issues and documentation
- Make a plan for implementation before writing code

### During Development

- Run tests frequently to catch issues early
- Make small, focused commits with descriptive messages that reference issue numbers
- Keep commit messages consistent with our format: `#<issue-number>: <brief description>`
- Include multi-line details for significant changes

### Testing Process

1. **Run code quality checks** before making any commits:
   ```bash
   # Check code formatting
   cd frontend && npm run format:check
   
   # Run TypeScript type checking
   cd frontend && npm run typecheck
   ```

2. **Run unit tests** before making any commits:
   ```bash
   cd frontend && npm test
   # or for specific tests:
   cd frontend && npm test -- <test-name>
   ```

3. **Always wait for visual confirmation** after testing UI changes:
   - Start the development server and manually verify changes
   - Check both mobile and web interfaces when applicable
   - Verify behavior with different input scenarios

4. **After implementing changes**:
   - Run tests again to ensure nothing was broken
   - Check for TypeScript errors
   - Verify test coverage for new functionality

### Code Review Process

- All changes must be submitted via pull request
- Use our PR template and fill it out completely
- Address all review comments before merging
- Ensure CI checks pass before requesting review

## Quality Standards

### Code Quality

- Follow TypeScript best practices
- Maintain consistent code style throughout the project
- Document complex functions with JSDoc comments
- Keep components focused on a single responsibility
- Always use the `getAssetPath` utility function when accessing any assets to ensure proper path resolution across all platforms and environments

### Testing Standards

- Write unit tests for all new utility functions
- Test edge cases, not just the happy path
- Aim for meaningful test coverage, not just percentage
- Include accessibility testing for UI components

### UI/UX Practices

- Follow the design guidelines in our documentation
- Test across multiple device sizes
- Ensure all UI elements have proper accessibility features

## Asset Management

### Asset Path Handling

- **Always use `getAssetPath`** from `/frontend/src/utils/assetUtils.ts` when accessing any assets
- Never hardcode asset paths in components or screens
- For image sources in React Native components, use the following pattern:
  ```tsx
  import { getAssetPath } from '../utils/assetUtils';
  
  // For image elements
  <Image source={{ uri: getAssetPath(imagePath) }} />
  ```
- This ensures consistent path resolution across:
  - Web deployments (local development server)
  - GitHub Pages deployment
  - Native mobile apps
  - Different operating systems

### Favicon Usage

- All favicon files are stored in `/frontend/public/favicons/`
- Favicons are automatically loaded via HTML links in index.html and should not be referenced in application components
- Do not use `getAssetPath` for favicons, as they are served directly from the public directory
- When referencing favicons in HTML, use relative paths like `./favicons/favicon.ico` instead of using %PUBLIC_URL%
- When updating the favicon, make sure to generate all required sizes and formats as documented in `.github/favicon_generation.md`
- Test favicon appearance across different browsers and devices after making changes

## Troubleshooting Tips

- Check the console for errors
- Verify data sources and API endpoints
- Isolate the problem by commenting out code sections
- Use the React Developer Tools for component debugging

---

*This document serves as a reference for project collaborators. Please keep it updated as our workflow evolves.*