import { getUserSexLimitDetail } from '@/api/plan/usePlanDetail';
import { useQuery } from '@tanstack/react-query';
import { createGlobalStore } from 'hox';
import { useState } from 'react';

export const [usePlanDetail] = createGlobalStore(() => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

  const query = useQuery({
    queryKey: ['plan-detail', currentYear, currentMonth],
    queryFn: () => {
      return getUserSexLimitDetail({
        year: currentYear,
      });
    },
  });

  const planId = query.data?.data?.id;

  return {
    query,
    planId,
  };
});
