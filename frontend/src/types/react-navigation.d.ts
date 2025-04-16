declare module '@react-navigation/native' {
  export interface NavigationContainerProps {
    children: React.ReactNode;
    theme?: any;
    ref?: any;
    onReady?: () => void;
    onStateChange?: (state: any) => void;
    linking?: any;
    fallback?: React.ReactNode;
    documentTitle?: any;
    onUnhandledAction?: (action: any) => void;
  }

  export const NavigationContainer: React.FC<NavigationContainerProps>;
  export const DefaultTheme: any;
  export const DarkTheme: any;
  export const useNavigation: () => any;
  export const useRoute: () => any;
  export const useFocusEffect: (effect: React.EffectCallback) => void;
  export const useIsFocused: () => boolean;
}

declare module '@react-navigation/stack' {
  export interface StackNavigationOptions {
    title?: string;
    headerStyle?: any;
    headerTintColor?: string;
    headerTitleStyle?: any;
    headerLeft?: (props: any) => React.ReactNode;
    headerRight?: (props: any) => React.ReactNode;
    headerTitle?: string | ((props: any) => React.ReactNode);
    headerBackTitle?: string;
    headerBackTitleVisible?: boolean;
    headerShown?: boolean;
    cardStyle?: any;
    presentation?: 'card' | 'modal' | 'transparentModal';
    animationEnabled?: boolean;
    gestureEnabled?: boolean;
    gestureDirection?: 'horizontal' | 'vertical';
  }

  export interface StackNavigationConfig {
    headerMode?: 'float' | 'screen' | 'none';
    mode?: 'card' | 'modal';
    initialRouteName?: string;
    screenOptions?: StackNavigationOptions | ((props: any) => StackNavigationOptions);
  }

  export function createStackNavigator<T extends Record<string, object | undefined>>(): {
    Navigator: React.ComponentType<StackNavigationConfig & { children: React.ReactNode }>;
    Screen: React.ComponentType<{
      name: Extract<keyof T, string>;
      component: React.ComponentType<any>;
      options?: StackNavigationOptions | ((props: any) => StackNavigationOptions);
      initialParams?: T[Extract<keyof T, string>];
      listeners?: any;
    }>;
  };
}
