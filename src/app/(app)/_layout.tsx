import { FontAwesome } from '@expo/vector-icons';
import { Redirect, SplashScreen, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView edges={['bottom']} style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#76B947',
          tabBarInactiveTintColor: '#999999',
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: '首页',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="community"
          options={{
            title: '社区',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="users" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: '#76B947',
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: -25,
                }}
              >
                <FontAwesome name="pencil" size={24} color="white" />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="message"
          options={{
            title: '消息',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="envelope" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: '我的',
            tabBarIcon: ({ color }) => (
              <FontAwesome name="user" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
