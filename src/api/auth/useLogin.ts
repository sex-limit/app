import { type AxiosError } from 'axios';
import { createMutation } from 'react-query-kit';

import { client, AuthSymbol } from '../common';

export enum AuthType {
  Apple,
  Phone,
  Douyin,
}

type Variables = {
  type: AuthType;
  apple?: {
    identityToken: string;
    realUserStatus: number;
  };
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
      headers: {
        [AuthSymbol]: true,
      },
    }),
});
