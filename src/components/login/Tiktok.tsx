import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

import { useDouyinLogin } from '@/core/auth/douyin';
import { Icons } from '@/ui/icons/icons';
import { Text } from '@/ui/text';

export const TiktokLogin: React.FC = () => {
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
              <Icons.Tiktok />
            </View>
            <Text className={'ml-3 text-lg text-white'}>抖音登录</Text>
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
};
