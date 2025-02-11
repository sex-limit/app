import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';

import { useAuth } from '@/core';

export default function TabLayout() {
  const status = useAuth.use.status();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="plan-detail" options={{ headerShown: false }} />
      <Stack.Screen
        name="message-detail/interaction"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="message-detail/[type]/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
