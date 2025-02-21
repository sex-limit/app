import { Image } from 'expo-image';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppleLogin } from '@/components/login/Apple';
import { PhoneLogin } from '@/components/login/Phone';
import { TiktokLogin } from '@/components/login/Tiktok';
import { useAuth } from '@/core/auth';

export default function Login() {
  const status = useAuth.use.status();
  const platform = Platform.OS;
  return (
    <SafeAreaView className={'flex h-screen flex-1 flex-col bg-white'}>
      <View className={'h-full justify-between'}>
        <View className={'mt-8 items-center justify-center'}>
          <Image
            className={'h-24 w-24 rounded-2xl'}
            source={require('@/ui/assets/logo/logo.png')}
          />
          <Text className={'mt-4 text-2xl font-bold'}>鲁国</Text>
          <Text className={'mt-2 text-gray-500'}>一句宣传语在这里</Text>
        </View>

        <View className={'flex flex-col gap-y-4'}>
          <View className={'mt-auto space-y-3 px-[5vw]'}>
            <TiktokLogin />
            <PhoneLogin />
          </View>

          <View className={'flex flex-row justify-center gap-x-4 pb-12'}>
            {Platform.select({
              ios: <AppleLogin />,
            })}

            <TouchableOpacity className={'items-center'}>
              <View
                className={
                  'h-12 w-12 items-center justify-center rounded-full bg-gray-100'
                }
              >
                <Text className={'text-xl'}>···</Text>
              </View>
              <Text className={'mt-1 text-xs text-gray-500'}>找回账号</Text>
            </TouchableOpacity>
          </View>

          <View className={'flex-row justify-center'}>
            <Text className={'text-xs text-gray-400'}>
              我们的服务依赖于抖音、苹果、手机账号登录，请阅读
            </Text>
            <TouchableOpacity>
              <Text className={'text-xs text-blue-500'}>用户登录指引协议</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
