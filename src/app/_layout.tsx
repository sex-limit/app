// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { APIProvider } from '@/api';
import {
  CheckInModeProvider,
  CheckInProvider,
} from '@/contexts/CheckInContext';
import { hydrateAuth, loadSelectedTheme } from '@/core';
import { useThemeConfig } from '@/core/use-theme-config';
import Douyin from '@/shared/native-module/douyin';
import { FocusAwareStatusBar } from '@/ui';

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();

  useEffect(() => {
    Douyin?.init('awcve1p71yemc3r7');
  }, []);

  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <SafeAreaProvider>
        <KeyboardProvider>
          <ThemeProvider value={theme}>
            <APIProvider>
              <BottomSheetModalProvider>
                <CheckInModeProvider>
                  <CheckInProvider>
                    <FocusAwareStatusBar translucent={true} />
                    {children}
                    <Toast />
                  </CheckInProvider>
                </CheckInModeProvider>
              </BottomSheetModalProvider>
            </APIProvider>
          </ThemeProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <CheckInProvider>
      <Providers>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
        </Stack>
      </Providers>
    </CheckInProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
