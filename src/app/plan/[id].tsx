import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import PlanDetailPage from '@/components/home/detail';

export default function PlanDetail() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PlanDetailPage />
    </SafeAreaView>
  );
}
