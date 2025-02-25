import * as AppleAuthentication from 'expo-apple-authentication';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { AuthType, useLogin } from '@/api/auth/useLogin';
import { useAuth } from '@/core/auth';
import { Text } from '@/ui';
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
    <TouchableOpacity
      className="items-center"
      onPress={handleAppleLogin}
      activeOpacity={0.7}
    >
      <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
        <Icons.Apple color={'#000'} size={24} />
      </View>
      <Text className="mt-1 text-xs text-gray-500">Apple</Text>
    </TouchableOpacity>
  );
};
