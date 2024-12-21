import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export const PhoneLogin: React.FC = () => {
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
