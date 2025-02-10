import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { MessageItem } from '@/components/message/message-item';

const MessageScreen = () => {
  const messages = [
    {
      id: 1,
      type: 'system',
      name: '新关注我的',
      message: '没有新通知',
      time: '周四',
      avatar: 'https://placekittens.com/200/200',
    },
    {
      id: 2,
      type: 'interaction',
      name: '互动消息',
      message: '欧得芬 r 等 3 人近期访问过你的主页',
      time: '20:17',
      avatar: 'https://placekittens.com/201/201',
      unread: 1,
    },
    {
      id: 3,
      type: 'group',
      name: '好哥哥们 💧 52',
      message: '球子: [分享视频]',
      time: '58分钟前',
      avatar: 'https://placekittens.com/202/202',
      unread: 1,
    },
    {
      id: 4,
      type: 'group',
      name: '可爱爸爸的粉丝群 50',
      message: '64名群成员在线',
      time: '19:26',
      avatar: 'https://placekittens.com/203/203',
      online: true,
    },
    {
      id: 5,
      type: 'user',
      name: 'Flechazo 🔥 353',
      message: '活',
      time: '18:46',
      avatar: 'https://placekittens.com/204/204',
    },
    {
      id: 6,
      type: 'user',
      name: '板蓝根er',
      message: '坏了，我都忘不懂了',
      time: '昨天 18:33',
      avatar: 'https://placekittens.com/205/205',
    },
    {
      id: 7,
      type: 'group',
      name: '415色批小分队',
      message: '今天2个朋友在线',
      time: '昨天 18:33',
      avatar: 'https://placekittens.com/206/206',
    },
    {
      id: 8,
      type: 'user',
      name: '小萌新',
      message: '已读 · [分享视频]',
      time: '前天',
      avatar: 'https://placekittens.com/207/207',
    },
    {
      id: 9,
      type: 'user',
      name: 'Redemption.',
      message: '已读 · [分享视频]',
      time: '前天',
      avatar: 'https://placekittens.com/208/208',
    },
    {
      id: 10,
      type: 'user',
      name: 'Tarth Cleya. (开学住校周末回',
      message: '谢谢！！！',
      time: '周四',
      avatar: 'https://placekittens.com/209/209',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center justify-between bg-white px-4 py-2">
        <TouchableOpacity>
          <Ionicons name="add-circle-outline" size={24} color="#333" />
        </TouchableOpacity>
        <Text className="text-xl font-medium">消息</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#333" />
        </TouchableOpacity>
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
