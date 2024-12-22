import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import BototmTabs from '@/components/_base_/tabs/bottom';
import { useAuth } from '@/core';

export default function TabLayout() {
  const status = useAuth.use.status();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  if (status === 'signOut') {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <BototmTabs {...props} />}
      initialRouteName={'index'}
    >
      <Tabs.Screen name="index" options={{ title: '主页' }} />
      <Tabs.Screen name="community" options={{ title: '社区' }} />
      <Tabs.Screen name="message" options={{ title: '消息' }} />
      <Tabs.Screen name="profile" options={{ title: '我的' }} />
    </Tabs>
  );
}
