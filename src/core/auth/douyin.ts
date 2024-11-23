import { useMutation } from '@tanstack/react-query';

import Douyin from '@/shared/native-module/douyin';

interface Options {
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

export function useDouyinLogin(options: Options = {}) {
  const mutation = useMutation({
    mutationKey: ['douyin-login'],
    mutationFn: async () => {
      const resp = await Douyin.login('user_info');

      return resp;
    },
    onSuccess(data) {
      options.onSuccess?.(data);
    },
    onError(e) {
      console.log(e);
      options.onError?.(e);
    },
  });

  return {
    ...mutation,
  };
}
