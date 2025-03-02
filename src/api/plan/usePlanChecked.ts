import type { AxiosError } from 'axios';
import { createQuery } from 'react-query-kit';

import { client } from '../common';

type Variables = {
  planId: string;
  year: number;
};
type Response = { data: IGetSexLimitCheckedResponse };

const useQuery = createQuery<Response, Variables, AxiosError>({
  queryKey: ['plan-checked'],
  fetcher: (params) => {
    return client<Response>({
      method: 'GET',
      url: `/plan/my/day-checked`,
      params,
    });
  },
});

export const useMyPlanCheckedDays = ({
  planId,
  year,
}: {
  planId: string;
  year: number;
}) => {
  const query = useQuery({
    variables: {
      planId,
      year,
    },
  });

  return {
    ...query,
  };
};
