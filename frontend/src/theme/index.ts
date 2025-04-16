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

export const statusColors = {
  light: {
    success: '#386A20',
    warning: '#7E5700',
    info: '#00639D',
  },
  dark: {
    success: '#8EF18C',
    warning: '#F5BD49',
    info: '#A8D5FF',
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};