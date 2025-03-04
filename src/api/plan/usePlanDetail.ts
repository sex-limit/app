import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

type Variables = { year: number };
type Response = { data: IGetSexLimitDetailResponse };

const useQuery = createQuery<Response, Variables, AxiosError>({
  queryKey: ['plan-detail'],
  fetcher: (params) => {
    return client<Response>({
      method: 'GET',
      url: `/plan/my/sex-limit/detail`,
      params,
    });
  },
  variables: {
    year: new Date().getFullYear(),
  },
});

export const useMySexLimitPlanDetail = () => {
  const query = useQuery();
  const planId = query.data?.data?.id;

  return {
    ...query,
    planId,
  };
};
