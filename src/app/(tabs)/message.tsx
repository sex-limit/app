import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MessageItem = ({
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
  <TouchableOpacity className="flex-row items-center border-b border-gray-100 bg-white px-4 py-3">
    <View className="relative">
      <Image source={{ uri: avatar }} className="h-12 w-12 rounded-full" />
      {online && (
        <View className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
      )}
    </View>
    <View className="ml-3 flex-1">
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-medium">{name}</Text>
        <Text className="text-sm text-gray-400">{time}</Text>
      </View>
      <View className="mt-1 flex-row items-center justify-between">
        <Text className="text-sm text-gray-500" numberOfLines={1}>
          {message}
        </Text>
        {unread && (
          <View className="h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1">
            <Text className="text-xs text-white">{unread}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);

const MessageScreen = () => {
  const messages = [
    {
      id: 1,
      type: 'system',
      name: '新关注我的',
      message: '没有新通知',
      time: '周四',
      avatar: 'https://placekitten.com/200/200',
    },
    {
      id: 2,
      type: 'interaction',
      name: '互动消息',
      message: '欧得芬 r 等 3 人近期访问过你的主页',
      time: '20:17',
      avatar: 'https://placekitten.com/201/201',
      unread: 1,
    },
    {
      id: 3,
      type: 'group',
      name: '好哥哥们 💧 52',
      message: '球子: [分享视频]',
      time: '58分钟前',
      avatar: 'https://placekitten.com/202/202',
      unread: 1,
    },
    {
      id: 4,
      type: 'group',
      name: '可爱爸爸的粉丝群 50',
      message: '64名群成员在线',
      time: '19:26',
      avatar: 'https://placekitten.com/203/203',
      online: true,
    },
    {
      id: 5,
      type: 'user',
      name: 'Flechazo 🔥 353',
      message: '活',
      time: '18:46',
      avatar: 'https://placekitten.com/204/204',
    },
    {
      id: 6,
      type: 'user',
      name: '板蓝根er',
      message: '坏了，我都忘不懂了',
      time: '昨天 18:33',
      avatar: 'https://placekitten.com/205/205',
    },
    {
      id: 7,
      type: 'group',
      name: '415色批小分队',
      message: '今天2个朋友在线',
      time: '昨天 18:33',
      avatar: 'https://placekitten.com/206/206',
    },
    {
      id: 8,
      type: 'user',
      name: '小萌新',
      message: '已读 · [分享视频]',
      time: '前天',
      avatar: 'https://placekitten.com/207/207',
    },
    {
      id: 9,
      type: 'user',
      name: 'Redemption.',
      message: '已读 · [分享视频]',
      time: '前天',
      avatar: 'https://placekitten.com/208/208',
    },
    {
      id: 10,
      type: 'user',
      name: 'Tarth Cleya. (开学住校周末回',
      message: '谢谢！！！',
      time: '周四',
      avatar: 'https://placekitten.com/209/209',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-4 py-2">
        <Text className="text-2xl font-medium">消息</Text>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity>
            <Icon name="magnify" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Icon name="plus-circle-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Message List */}
      <ScrollView className="flex-1">
        {messages.map((message) => (
          <MessageItem key={message.id} {...message} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default MessageScreen;
