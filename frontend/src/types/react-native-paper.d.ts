import { MD3Theme } from 'react-native-paper';

declare global {
  namespace ReactNativePaper {
    interface Theme extends MD3Theme {}
  }
}