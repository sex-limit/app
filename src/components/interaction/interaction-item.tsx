import { Image, Text, View } from 'react-native';

import { type InteractionItem } from '@/app/(app)/message-detail/interaction';
import { toRelativeDate } from '@/utils/date';

export const InteractionListItem = ({ item }: { item: InteractionItem }) => {
  return (
    <View className="flex-row border-b border-gray-100 bg-white px-4 py-3">
      <Image
        source={{ uri: item.user.avatar }}
        className="h-10 w-10 rounded-full"
      />
      <View className="ml-3 flex-1">
        <View className="flex-row items-center">
          <Text className="font-bold">{item.user.name}</Text>
          <Text className="ml-2 text-gray-500">
            {item.type === 'like' ? '赞了' : '回复了'}
          </Text>
          <Text className="ml-2 text-gray-500">{item.targetContent}</Text>
        </View>
        {item.content && (
          <Text className="mt-1 text-gray-700">{item.content}</Text>
        )}
        <Text className="mt-1 text-xs text-gray-400">
          {toRelativeDate(new Date(item.createdAt))}
        </Text>
      </View>
    </View>
  );
};
