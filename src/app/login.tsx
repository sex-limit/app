import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

import { useDouyinLogin } from '@/core/auth/douyin';
import { TiktokIcon } from '@/ui/icons/tiktok';

const TiktokLogin: React.FC = () => {
  // const router = useRouter();
  // const signIn = useAuth.use.signIn();

  const mutation = useDouyinLogin({
    onSuccess(data) {
      console.log(data);
    },
  });

  const onLogin = async () => {
    mutation.mutate();
  };

  return (
    <>
      <TouchableOpacity
        className={'flex-row justify-center rounded-lg bg-black p-3'}
        activeOpacity={0.85}
        onPress={onLogin}
      >
        <View className={'flex-row items-center justify-center'}>
          <View className={'flex-row items-center'}>
            {mutation.isPending && (
              <View
                className={
                  'relative flex items-center justify-center bg-slate-100'
                }
              >
                <View className={'absolute right-4'}>
                  <ActivityIndicator
                    size={15}
                    color={'rgba(255, 255, 255, 0.6)'}
                  />
                </View>
              </View>
            )}
            <View>
              <TiktokIcon />
            </View>
            <Text className={'ml-3 text-lg text-white'}>抖音登录</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
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
      <View className={'space-y-2 px-[5vw] pb-10'}>
        <TiktokLogin />
        <PhoneLogin />
      </View>
    </SafeAreaView>
  );
}
