import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, ScrollView, View } from 'react-native';
import HomeHeader from '@/components/home/Header';
import { Image } from 'expo-image';

const CalAIHomeScreen = () => {
  return (
    <>
      <StatusBar style="dark" />
      <Image source={require('@/ui/assets/image/bg-header.png')} className="absolute opacity-80 top-0 left-0 w-full h-full" />
      <SafeAreaView className="flex-1">
        <ScrollView>
          <HomeHeader />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default CalAIHomeScreen;
