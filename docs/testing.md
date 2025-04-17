# Testing Guide

This document provides guidelines and instructions for testing the OrienteeringApp.

## Testing Architecture

The application uses a multi-layered testing approach:

1. **Unit Tests**: Test individual functions and components in isolation
2. **Integration Tests**: Test how components work together
3. **End-to-End Tests**: Test full user workflows from start to finish

## Running Tests

### Unit Tests

Unit tests are implemented using Jest and can be run with:

```bash
# Navigate to the frontend directory
cd frontend

# Run all tests
npm test

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test -- path/to/test/file.test.ts

# Run tests in watch mode (rerun on file changes)
npm test -- --watch
```

### Test File Organization

Tests are organized in the `src/__tests__` directory, mirroring the structure of the source code:

- `src/__tests__/utils/`: Tests for utility functions
- `src/__tests__/components/`: Tests for UI components
- `src/__tests__/screens/`: Tests for screens

## Writing Tests

### Unit Test Guidelines

When writing unit tests:

1. Focus on testing critical business logic
2. Mock external dependencies
3. Test edge cases and error conditions
4. Keep tests fast and independent

### Example Unit Test

```typescript
import { shuffleArray } from '../../utils/assetUtils';

describe('shuffleArray', () => {
  test('returns an array of the same length', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled.length).toBe(original.length);
  });

  test('contains all the same elements as the original array', () => {
    const original = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray(original);
    expect(shuffled).toEqual(expect.arrayContaining(original));
    expect(original).toEqual(expect.arrayContaining(shuffled));
  });
});
```

## Continuous Integration

Tests run automatically on GitHub Actions:

1. On every pull request to the main branch
2. On every push to the main branch

The CI configuration is defined in `.github/workflows/frontend-ci-cd.yml`.

## Code Coverage

Code coverage reports are generated automatically when running tests with the `--coverage` flag. The reports can be found in the `coverage` directory.

Current testing focus is on critical utility functions that power core application features:

- `shuffleArray`: Powers randomization throughout the app
- `generateQuizQuestion`: Creates quiz questions with appropriate difficulty
- `getSymbolsByTypesAndComplexity`: Filters symbols for quizzes

## Future Testing Plans

### Integration Tests

Integration tests will focus on:

- Quiz flow from start to finish
- Symbol filtering and searching
- Theme switching

### End-to-End Testing with Detox

End-to-end tests will cover critical user paths:

- App startup and navigation
- Completing a quiz
- Filtering and viewing symbols

### Component Testing

UI component tests will verify:

- Rendering of the symbol cards
- Filter component behavior
- Quiz question display and interaction