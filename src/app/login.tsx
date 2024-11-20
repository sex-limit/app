import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
  NativeModules,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '@/core';
import { TiktokIcon } from '@/ui/icons/tiktok';

const Douyin = NativeModules.CalendarModule;

const TiktokLogin: React.FC = () => {
  const router = useRouter();
  const signIn = useAuth.use.signIn();

  useEffect(() => {
    Douyin.init('awcve1p71yemc3r7');
  }, []);

  const handleLogin = async () => {
    console.log(1);
    try {
      console.log('Init success, start login...');
      const res = await Douyin.login('user_info');
      console.log('login Success', res);
    } catch (error) {
      console.log(error);
    }
    // await NativeModules.CalendarModule.createCalendarEvent(
    //   'Party',
    //   '04-12-2020',
    //   (eventId) => {
    //     console.log(`Created a new event with id ${eventId}`);
    //   },
    // );

    // return;
    // signIn({ access: '123', refresh: '123' });
    // router.replace('/');
  };

  return (
    <TouchableOpacity
      className={'flex-row justify-center rounded-lg bg-black p-3'}
      activeOpacity={0.85}
      onPress={handleLogin}
    >
      <View className={'flex-row items-center justify-center'}>
        <View>
          <TiktokIcon />
        </View>
        <Text className={'ml-1 text-lg text-white'}>抖音登录</Text>
      </View>
    </TouchableOpacity>
  );
};

const PhoneLogin: React.FC = () => {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/(app)');
  };

  return (
    <TouchableOpacity
      className={
        'mt-2 flex-row justify-center rounded-lg bg-button-secondary p-3'
      }
      activeOpacity={0.85}
      onPress={handleLogin}
    >
      <View className={'flex-row items-center justify-center'}>
        <Text className={'ml-1 text-lg text-black/80'}>手机号登录</Text>
      </View>
    </TouchableOpacity>
  );
};

export default function Login() {
  const router = useRouter();

  return (
    <SafeAreaView className={'flex-1'}>
      <View className={'flex-row justify-end p-4'}>
        <TouchableOpacity
          onPress={() => router.push('/settings')}
          activeOpacity={0.85}
        >
          <Text className={'text-lg text-black/80'}>帮助与反馈</Text>
        </TouchableOpacity>
      </View>
      <View className={'flex-1'}>
        <View className={'flex-row items-center justify-center'}>
          <Image
            className={'h-64 w-64'}
            source={require('@/ui/assets/logo/logo.png')}
          />
        </View>
        <View className={'mt-4 flex-row items-center justify-center'}>
          <Text className={'text-center text-lg'}>
            埃及吧干啥干啥，速速登录开🦌
          </Text>
        </View>
      </View>
      <View className={'space-y-2 px-4 pb-10'}>
        <TiktokLogin />
        <PhoneLogin />
      </View>
    </SafeAreaView>
  );
}
