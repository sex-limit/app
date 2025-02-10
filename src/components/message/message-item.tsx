import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import { toRelativeDate } from '@/utils/date';

type TouchableReactiveProps = React.ComponentProps<typeof TouchableOpacity> &
  React.ComponentProps<typeof TouchableRipple>;

const TouchableReactive = (props: TouchableReactiveProps) => {
  if (Platform.OS === 'android') {
    return <TouchableRipple {...props} />;
  } else {
    return <TouchableOpacity activeOpacity={0.75} {...props} />;
  }
};

interface MessageItemProps {
  avatar: string;
  name: string;
  message: string;
  time?: string;
  unread?: number;
  online?: boolean;
}

export const MessageItem = ({
  avatar,
  name,
  message,
  time,
  unread,
  online,
}: MessageItemProps) => (
  <TouchableReactive
    className="flex-row items-center border-b border-gray-100 bg-white px-4 py-3"
    onPress={() => {}}
  >
    <>
      <View
        className={'flex items-center justify-center rounded-full'}
        style={{ width: 60, height: 60 }}
      >
        <Image source={{ uri: avatar }} className="h-12 w-12 rounded-full" />
        {online && (
          <View className="absolute bottom-2 right-2 h-4 w-4 rounded-full border-2 border-white bg-green-500" />
        )}
      </View>
      <View className={'flex-1'}>
        <Text className={'font-bold'}>{name}</Text>
        <View className={'flex-row items-center'}>
          <View className="shrink">
            <Text ellipsizeMode={'tail'} numberOfLines={1}>
              {message}
            </Text>
          </View>
          <View className="grow">
            {time && (
              <Text numberOfLines={1}>· {toRelativeDate(new Date(time))}</Text>
            )}
          </View>
        </View>
      </View>
      {unread && (
        <View className="ml-4 h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1">
          <Text className="text-xs text-white">{unread}</Text>
        </View>
      )}
    </>
  </TouchableReactive>
);
