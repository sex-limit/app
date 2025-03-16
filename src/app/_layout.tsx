// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';

import { APIProvider } from '@/api';
import { hydrateAuth, loadSelectedTheme } from '@/core';
import { useThemeConfig } from '@/core/use-theme-config';
import { FocusAwareStatusBar } from '@/ui';
import { HoxRoot } from 'hox';
import GlobalBottomSheet from '@/ui/bottom-sheet/global';
import FlashMessage from 'react-native-flash-message';

// Hide the React Native refresh/hot reload banner
// Hide the yellow box warnings


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

  return (
    <GestureHandlerRootView
      style={styles.container}
      className={theme.dark ? `dark` : undefined}
    >
      <PaperProvider>
        <SafeAreaProvider>
          <KeyboardProvider>
            <ThemeProvider value={theme}>
              <APIProvider>
                <BottomSheetModalProvider>
                  <FocusAwareStatusBar translucent={true} />
                  <HoxRoot>
                    {children}
                    <FlashMessage position="top" />
                    <GlobalBottomSheet />
                    <Toast />
                  </HoxRoot>
                </BottomSheetModalProvider>
              </APIProvider>
            </ThemeProvider>
          </KeyboardProvider>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default function App() {
  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
