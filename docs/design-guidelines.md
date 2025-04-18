# Orienteering App Design Guidelines

This document outlines the design standards and component usage guidelines to ensure consistency across the Orienteering App, following React Native Paper's theming approach.

## Theme Configuration

We follow React Native Paper's theming system to support both light and dark modes.

### Theme Definition

```typescript
// Theme configuration following React Native Paper guidelines
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0066CC',
    onPrimary: '#FFFFFF',
    primaryContainer: '#D1E4FF',
    onPrimaryContainer: '#001D36',
    secondary: '#535F70',
    onSecondary: '#FFFFFF',
    secondaryContainer: '#D7E3F7',
    onSecondaryContainer: '#101C2B',
    tertiary: '#6B5778',
    onTertiary: '#FFFFFF',
    tertiaryContainer: '#F2DAFF',
    onTertiaryContainer: '#251431',
    error: '#BA1A1A',
    onError: '#FFFFFF',
    errorContainer: '#FFDAD6',
    onErrorContainer: '#410002',
    background: '#F5F5F5',
    onBackground: '#1A1C1E',
    surface: '#FFFFFF',
    onSurface: '#1A1C1E',
    surfaceVariant: '#DFE2EB',
    onSurfaceVariant: '#43474E',
    outline: '#73777F',
    outlineVariant: '#C3C7CF',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#9ECAFF',
    onPrimary: '#003258',
    primaryContainer: '#004A7C',
    onPrimaryContainer: '#D1E4FF',
    secondary: '#BBC7DB',
    onSecondary: '#253140',
    secondaryContainer: '#3C4858',
    onSecondaryContainer: '#D7E3F7',
    tertiary: '#D8BDE6',
    onTertiary: '#3B2948',
    tertiaryContainer: '#534060',
    onTertiaryContainer: '#F2DAFF',
    error: '#FFB4AB',
    onError: '#690005',
    errorContainer: '#93000A',
    onErrorContainer: '#FFDAD6',
    background: '#1A1C1E',
    onBackground: '#E2E2E6',
    surface: '#121416',
    onSurface: '#E2E2E6',
    surfaceVariant: '#43474E',
    onSurfaceVariant: '#C3C7CF',
    outline: '#8D9199',
    outlineVariant: '#43474E',
  },
};
```

## Color Palette

Our color palette is derived from the React Native Paper MD3 theme:

### Primary Colors
- Primary: `#0066CC` (Light) / `#9ECAFF` (Dark)
- Primary Container: `#D1E4FF` (Light) / `#004A7C` (Dark)
- On Primary: `#FFFFFF` (Light) / `#003258` (Dark)
- On Primary Container: `#001D36` (Light) / `#D1E4FF` (Dark)

### Secondary Colors
- Secondary: `#535F70` (Light) / `#BBC7DB` (Dark)
- Secondary Container: `#D7E3F7` (Light) / `#3C4858` (Dark)
- On Secondary: `#FFFFFF` (Light) / `#253140` (Dark)
- On Secondary Container: `#101C2B` (Light) / `#D7E3F7` (Dark)

### Accent Colors
- Tertiary: `#6B5778` (Light) / `#D8BDE6` (Dark)
- Tertiary Container: `#F2DAFF` (Light) / `#534060` (Dark)
- On Tertiary: `#FFFFFF` (Light) / `#3B2948` (Dark)
- On Tertiary Container: `#251431` (Light) / `#F2DAFF` (Dark)

### Status Colors
- Error: `#BA1A1A` (Light) / `#FFB4AB` (Dark)
- Success: `#386A20` (Light) / `#8EF18C` (Dark)
- Warning: `#7E5700` (Light) / `#F5BD49` (Dark)
- Info: `#00639D` (Light) / `#A8D5FF` (Dark)

### Surface Colors
- Background: `#F5F5F5` (Light) / `#1A1C1E` (Dark)
- Surface: `#FFFFFF` (Light) / `#121416` (Dark)
- Surface Variant: `#DFE2EB` (Light) / `#43474E` (Dark)
- On Surface: `#1A1C1E` (Light) / `#E2E2E6` (Dark)
- On Surface Variant: `#43474E` (Light) / `#C3C7CF` (Dark)

## Typography

Following React Native Paper's typography guidelines:

### Headings
- Large Title: 34px, bold
- Title: 22px, bold
- Subtitle: 18px, medium
- Section Header: 16px, medium

### Body Text
- Body Large: 16px, regular
- Body Medium: 14px, regular
- Body Small: 12px, regular
- Caption: 10px, regular

## Component Guidelines

### Using Theme in Components

```jsx
import { useTheme } from 'react-native-paper';

const MyComponent = () => {
  const theme = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.onBackground }}>
        Themed text
      </Text>
    </View>
  );
};
```

### Buttons

#### Primary Actions
- Use `mode="contained"`
- Include appropriate icon
- Follow contrast guidelines with theme colors
- Example:
  ```jsx
  <Button 
    mode="contained"
    onPress={onPressHandler}
    icon="check"
  >
    Submit
  </Button>
  ```

#### Secondary Actions
- Use `mode="outlined"`
- Include appropriate icon
- Example:
  ```jsx
  <Button 
    mode="outlined"
    onPress={onPressHandler}
    icon="close"
  >
    Cancel
  </Button>
  ```

#### Navigation/Tertiary Actions
- Use `mode="text"`
- Include appropriate icon
- Example:
  ```jsx
  <Button 
    mode="text"
    onPress={onPressHandler}
    icon="arrow-left"
  >
    Back
  </Button>
  ```

### Chips

#### Filter/Selection Chips
- Always include an appropriate icon
- Use theme colors for selection states
- Example:
  ```jsx
  <Chip
    selected={isSelected}
    onPress={onPressHandler}
    icon={isSelected ? "check" : "circle"}
  >
    Option Name
  </Chip>
  ```

#### Difficulty Chips
- Use consistent icons for each difficulty level:
  - Easy: `star-outline`
  - Medium: `star-half`
  - Hard: `star`
- Example:
  ```jsx
  <Chip 
    selected={difficulty === QuizDifficulty.EASY}
    onPress={() => handleChangeDifficulty(QuizDifficulty.EASY)}
    icon="star-outline"
  >
    Easy
  </Chip>
  ```

### Cards

- Use for grouping related content
- Apply consistent padding: 16px
- Ensure proper contrast between card and content
- Maintain rounded corners (8px radius)
- Example:
  ```jsx
  <Card style={{ margin: 16 }}>
    <Card.Content>
      <Title>Card Title</Title>
      <Paragraph>Card content</Paragraph>
    </Card.Content>
    <Card.Actions>
      <Button>Cancel</Button>
      <Button mode="contained">Ok</Button>
    </Card.Actions>
  </Card>
  ```

### Progress Indicators

#### Progress Bar
- Use theme colors for context (timer, progress)
- Maintain consistent height (6px)
- Apply rounded corners (3px radius)
- Example:
  ```jsx
  <ProgressBar 
    progress={0.5} 
    color={theme.colors.primary} 
    style={{height: 6, borderRadius: 3}} 
  />
  ```

#### Loading Spinner
- Use `ActivityIndicator` with primary color
- Include descriptive text below spinner
- Example:
  ```jsx
  <View style={{alignItems: 'center'}}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    <Text style={{marginTop: 8, color: theme.colors.onBackground}}>
      Loading...
    </Text>
  </View>
  ```

## Spacing

- Extra small: 4px
- Small: 8px
- Medium: 16px
- Large: 24px
- Extra large: 32px

Component specific spacing:
- Standard margin between components: 16px
- Standard padding for containers: 16px
- Button vertical spacing: 8px
- Chip spacing: 8px horizontal, 8px vertical

## Icon System

The app uses Font Awesome icons throughout the interface via a custom implementation in `src/utils/MaterialCommunityIcons.js`. This approach provides a rich, consistent icon set that works well across all platforms.

### Implementation Details

- Uses `@fortawesome/react-native-fontawesome` for rendering icons
- Icons are used via React Native Paper's icon prop system
- Material Design icon names are mapped to corresponding Font Awesome icons
- Located in `src/utils/MaterialCommunityIcons.js`

### Usage in Components

```jsx
import { Button, IconButton } from 'react-native-paper';

// In a Button
<Button 
  icon="check" 
  mode="contained"
  onPress={onSubmit}
>
  Submit
</Button>

// As a standalone icon
<IconButton
  icon="sun"
  size={24}
  onPress={onPress}
/>
```

### Common Icon Usage

| Action | Icon Name | Font Awesome Icon |
|--------|-----------|------------------|
| Submit/Confirm | `check` | faCheck |
| Cancel/Clear | `close` | faTimes |
| Next | `arrow-right` | faArrowRight |
| Previous | `arrow-left` | faArrowLeft |
| Settings | `settings` | faCog |
| Restart | `refresh` | faRedo |
| Start | `play` | faPlay |
| Filter | `filter-variant` | faFilter |
| Library | `book-open-variant` | faBook |
| Easy Difficulty | `star-outline` | faStar (with opacity) |
| Medium/Hard Difficulty | `star` | faStar |
| Timer | `clock` | faClock |
| Selected | `check-circle` | faCheckCircle |
| Unselected | `circle` | faCircle |
| Information | `information` | faInfoCircle |
| Warning | `alert` | faExclamationTriangle |
| Search | `magnify` | faSearch |
| Add | `plus` | faPlus |
| Remove | `minus` | faMinus |
| Light Theme | `sun` | faSun |
| Dark Theme | `moon` | faMoon |

## Layout Structure

### Screen Layout
- Consistent header with title centered
- Use ScrollView for content that may exceed screen height
- Keep primary actions within thumb reach (bottom of screen)
- Apply safe area insets for notched devices

### Form Layout
- Label positioned above input field
- Help text below input when needed
- Validation errors displayed below input with error color

## Accessibility Guidelines

- Maintain touch targets of at least 44x44 points
- Use sufficient color contrast (WCAG AA compliance)
- Include descriptive text for screen readers
- Support dynamic text sizing
- Ensure keyboard navigation works for web version

## Theme Implementation

To implement theme switching:

```jsx
import React, { useState, useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { lightTheme, darkTheme } from './src/theme';
import { useColorScheme } from 'react-native';

export default function Main() {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme]);

  return (
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  );
}
```

---

This document should be referenced when developing new features or modifying existing UI components to maintain consistency throughout the application.