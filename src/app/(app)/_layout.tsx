import { SplashScreen } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/core';

export default function TabLayout() {
  const status = useAuth.use.status();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <SafeAreaView style={{ flex: 1 }}></SafeAreaView>;
}
