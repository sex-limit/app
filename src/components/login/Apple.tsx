import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { AuthType, useLogin } from '@/api/auth/useLogin';
import { useAuth } from '@/core/auth';
import { Button, Text } from '@/ui';
import { Icons } from '@/ui/icons/icons';

export const AppleLogin = () => {
  const router = useRouter();
  const signIn = useAuth.use.signIn();

  const loginMutation = useLogin({
    onSuccess: (data) => {
      signIn({
        token: (data as any)?.data?.token,
      });
      router.push('/(tabs)');
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) {
        throw new Error('Apple login failed');
      }

      loginMutation.mutate({
        type: AuthType.Apple,
        apple: {
          identityToken: credential.identityToken,
          realUserStatus: credential.realUserStatus,
        },
      });
    } catch (error: any) {
      if (error.code === 'ERR_CANCELED') {
        console.log('User canceled Apple login');
      } else {
        console.error('Apple login error:', error);
      }
    }
  };

  return (
    <Button
      onPress={handleAppleLogin}
      variant={'primary'}
      text={'Apple'}
      className={'py-2'}
    >
      <View className={'flex-row items-center gap-x-1'}>
        <Icons.Apple color={'#fff'} size={36} />
        <Text className="mt-1 text-md text-white font-medium">苹果登录</Text>
      </View>
    </Button>
  );
};
