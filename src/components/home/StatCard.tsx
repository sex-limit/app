import React from 'react';
import { Text, View } from 'react-native';

interface StatCardProps {
  value: string;
  label: string;
  icon: React.ReactNode;
}

export const StatCard = ({ value, label, icon }: StatCardProps) => (
  <View className="items-center">
    {icon}
    <Text className="mt-1 text-base font-medium">{value}</Text>
    <Text className="mt-0.5 text-sm text-[#666666]">{label}</Text>
  </View>
);
