import React, { useState, useEffect } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, IconButton } from 'react-native-paper';
import SymbolLibraryScreen from './screens/SymbolLibraryScreen';
import QuizScreen from './screens/QuizScreen';
import { lightTheme, darkTheme } from './theme';
// Import MaterialCommunityIcons from utils directory
import MaterialCommunityIcons from './utils/MaterialCommunityIcons';

// Define the app stack navigator params
type RootStackParamList = {
  SymbolLibrary: undefined;
  Quiz: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  const systemColorScheme = useColorScheme();
  const [isSystemTheme, setIsSystemTheme] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(systemColorScheme === 'dark');
  
  // Update theme when system theme changes if following system
  useEffect(() => {
    if (isSystemTheme) {
      setIsDarkTheme(systemColorScheme === 'dark');
    }
  }, [systemColorScheme, isSystemTheme]);

  const theme = isDarkTheme ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setIsSystemTheme(false);
    setIsDarkTheme(prev => !prev);
  };

  return (
    <PaperProvider
      theme={theme}
      settings={{
        icon: props => <MaterialCommunityIcons {...props} />
      }}
    >
      <NavigationContainer>
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <StatusBar 
            barStyle={isDarkTheme ? 'light-content' : 'dark-content'}
            backgroundColor={theme.colors.surface} 
          />
          <Stack.Navigator 
            initialRouteName="SymbolLibrary"
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.primary,
              },
              headerTintColor: theme.colors.onPrimary,
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: () => (
                <IconButton
                  icon={isDarkTheme ? 'moon' : 'sun'}
                  iconColor={theme.colors.onPrimary}
                  size={24}
                  onPress={toggleTheme}
                  style={styles.themeToggle}
                />
              ),
            }}
          >
            <Stack.Screen 
              name="SymbolLibrary" 
              component={SymbolLibraryScreen} 
              options={{ title: 'Symbol Library' }}
            />
            <Stack.Screen 
              name="Quiz" 
              component={QuizScreen} 
              options={{ title: 'Symbol Quiz' }}
            />
          </Stack.Navigator>
        </SafeAreaView>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themeToggle: {
    marginRight: 8,
  }
});

export default App;
