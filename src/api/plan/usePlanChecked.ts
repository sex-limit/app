import { client } from '../common';
import { useQuery } from '@tanstack/react-query';
import { useMySexLimitPlanDetail } from './usePlanDetail';

type Response = { data: IGetSexLimitCheckedResponse };

export const useMyPlanCheckedDays = ({ year }: { year: number }) => {
  const { planId } = useMySexLimitPlanDetail();

  const query = useQuery({
    queryKey: ['plan-checked', year, planId],
    queryFn: () => {
      return client<Response>({
        method: 'GET',
        url: `/plan/my/day-checked`,
        params: {
          year,
          planId,
        },
      });
    },
    enabled: !!planId,
  });

  return {
    ...query,
    planId,
  };
};
