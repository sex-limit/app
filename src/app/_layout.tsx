// Import  global CSS file
import '../../global.css';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack } from 'expo-router';
import React from 'react';
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

export { ErrorBoundary } from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(app)',
};

import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://9bb3dabb3513db7dff9f835884e9f435@o4508985423036416.ingest.us.sentry.io/4508985423233024',

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
  tracesSampleRate: 0.75,
});

hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();

  return (
    <GestureHandlerRootView
      style={{ flex: 1 }}
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

function App() {
  return (
    <Providers>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack>
    </Providers>
  );
}


export default Sentry.wrap(App);
