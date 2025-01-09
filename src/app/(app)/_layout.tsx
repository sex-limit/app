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
    </Stack>
  );
}
