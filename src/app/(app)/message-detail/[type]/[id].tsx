import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';

import { messages } from '@/app/(tabs)/message';
import { PageHeader } from '@/components/page-header';

export default function Page() {
  const { type, id } = useLocalSearchParams();
  const msg = messages.find((msg) => msg.id === +id);
  return (
    <>
      <PageHeader title={msg?.name} />
      <Text>
        message page {type} {id}
      </Text>
    </>
  );
}
