import React from 'react';
import { Image, Platform, Text, TouchableOpacity, View } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

type TouchableReactiveProps = React.ComponentProps<typeof TouchableOpacity> &
  React.ComponentProps<typeof TouchableRipple>;

const TouchableReactive = (props: TouchableReactiveProps) => {
  if (Platform.OS === 'android') {
    return <TouchableRipple {...props} />;
  } else {
    return <TouchableOpacity activeOpacity={0.75} {...props} />;
  }
};

export const MessageItem = ({
  avatar,
  name,
  message,
  time,
  unread,
  online,
}: {
  avatar: string;
  name: string;
  message: string;
  time: string;
  unread?: number;
  online?: boolean;
}) => (
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
        <View>
          <Text ellipsizeMode={'tail'} numberOfLines={1}>
            {message}
          </Text>
        </View>
      </View>
      {unread && (
        <View className="h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1">
          <Text className="text-xs text-white">{unread}</Text>
        </View>
      )}
    </>
  </TouchableReactive>
);
