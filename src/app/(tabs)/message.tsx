import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

import { MessageItem } from '@/components/message/message-item';

const MessageScreen = () => {
  const messages = [
    {
      id: 2,
      type: 'interaction',
      name: '互动消息',
      message: '欧得芬 r 等 3 人近期访问过你的主页',
      avatar: 'https://placekittens.com/201/201',
      unread: 1,
    },
    {
      id: 3,
      type: 'group',
      name: '好哥哥们 💧 52',
      message:
        '球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]球子: [分享视频]',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/202/202',
      unread: 1,
    },
    {
      id: 4,
      type: 'group',
      name: '可爱爸爸的粉丝群 50',
      message: '64名群成员在线',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/203/203',
      online: true,
    },
    {
      id: 5,
      type: 'user',
      name: 'Flechazo 🔥 353',
      message: '活',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/204/204',
    },
    {
      id: 6,
      type: 'user',
      name: '板蓝根er',
      message: '坏了，我都忘不懂了',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/205/205',
    },
    {
      id: 7,
      type: 'group',
      name: '415色批小分队',
      message: '今天2个朋友在线',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/206/206',
    },
    {
      id: 8,
      type: 'user',
      name: '小萌新',
      message: '已读 · [分享视频]',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/207/207',
    },
    {
      id: 9,
      type: 'user',
      name: 'Redemption.',
      message: '已读 · [分享视频]',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/208/208',
    },
    {
      id: 10,
      type: 'user',
      name: 'Tarth Cleya. (开学住校周末回',
      message: '谢谢！！！',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/209/209',
    },
    {
      id: 11,
      type: 'user',
      name: 'Tarth Cleya. (开学住校周末回',
      message: '谢谢！！！',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/210/210',
    },
    {
      id: 12,
      type: 'user',
      name: 'Tarth Cleya. (开学住校周末回',
      message: '谢谢！！！',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/211/211',
    },
    {
      id: 13,
      type: 'user',
      name: 'Tarth Cleya. (开学住校周末回',
      message: '谢谢！！！',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/212/212',
    },
    {
      id: 14,
      type: 'user',
      name: 'Tarth Cleya. (开学住校周末回',
      message: '谢谢！！！',
      time: new Date(
        Date.now() - Math.floor(Math.random() * 86400000 * 2),
      ).toISOString(),
      avatar: 'https://placekittens.com/213/213',
    },
  ];

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // TODO: 实现刷新逻辑
    setTimeout(() => setRefreshing(false), 1000);
  };

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

      <FlashList
        data={messages}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        renderItem={({ item }) => (
          <MessageItem
            {...item}
            onPress={() => {
              const path = (() => {
                switch (item.type) {
                  case 'interaction':
                    return '/message-detail/interaction';
                  default:
                    return '/message-detail';
                }
              })();
              router.push(path, {});
            }}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default MessageScreen;
