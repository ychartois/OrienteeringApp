import React, { Component } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import SymbolLibraryScreen from './screens/SymbolLibraryScreen';

const Stack = createStackNavigator();

// Define the app theme
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0066CC',
    accent: '#FF6B6B',
    background: '#F5F5F5',
  },
};

class App extends Component {
  render() {
    return (
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <Stack.Navigator 
              initialRouteName="SymbolLibrary"
              screenOptions={{
                headerStyle: {
                  backgroundColor: theme.colors.primary,
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}
            >
              <Stack.Screen 
                name="SymbolLibrary" 
                component={SymbolLibraryScreen} 
                options={{ title: 'Symbol Library' }}
              />
            </Stack.Navigator>
          </SafeAreaView>
        </NavigationContainer>
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  }
});

export default App;
