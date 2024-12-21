import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client } from '../common';

export enum LoginType {
  APPLE = 'apple',
  GOOGLE = 'phone',
  TIKTOK = 'tiktok',
}

type Variables = {
  loginType: LoginType;
  apple?: any;
  tiktok?: any;
  phone?: {
    phone: string;
    code: string;
  };
};

type Response = {
  token: string;
};

export const useLogin = createMutation<Response, Variables, AxiosError>({
  mutationFn: async (variables) =>
    client({
      url: '/auth/login',
      method: 'POST',
      data: variables,
    }).then((response) => response.data),
});
