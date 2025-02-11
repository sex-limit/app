import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import Dropdown, { DropdownProvider } from '@/components/dropdown';
import { InteractionListItem } from '@/components/interaction/interaction-item';

export type InteractionType = 'like' | 'reply' | 'all';

export interface InteractionItem {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  type: 'like' | 'reply';
  targetContent: string;
  content?: string;
  createdAt: string;
}

const mockData: InteractionItem[] = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'Flechazo',
      avatar: 'https://placekittens.com/200/200',
    },
    type: 'like',
    targetContent: '你的动态',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Flechazo',
      avatar: 'https://placekittens.com/201/201',
    },
    type: 'reply',
    targetContent: '你的动态',
    content: '你的动态很棒！',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Flechazo',
      avatar: 'https://placekittens.com/202/202',
    },
    type: 'like',
    targetContent: '你的动态',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    user: {
      id: '4',
      name: 'Flechazo',
      avatar: 'https://placekittens.com/203/203',
    },
    type: 'reply',
    targetContent: '你的动态',
    content: '你的动态很棒！',
    createdAt: new Date().toISOString(),
  },
];

export default function Page() {
  const [type, setType] = useState<InteractionType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // TODO: 实现刷新逻辑
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <DropdownProvider>
      <View className="flex-1 bg-white">
        <View className="flex-row items-center border-b border-gray-200 bg-white px-4 py-3">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <View className="flex-1 items-center">
            <Dropdown
              anchor={
                <Text>
                  {type === 'all'
                    ? '全部消息'
                    : type === 'like'
                      ? '收到的赞'
                      : '收到的回复'}
                </Text>
              }
              indicator={true}
            >
              <Dropdown.Item onPress={() => setType('all')}>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="pulse-outline" size={16} color="#333" />
                  <Text>全部消息</Text>
                </View>
              </Dropdown.Item>
              <Dropdown.Item onPress={() => setType('like')}>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="heart-outline" size={16} color="#333" />
                  <Text>收到的赞</Text>
                </View>
              </Dropdown.Item>
              <Dropdown.Item onPress={() => setType('reply')}>
                <View className="flex-row items-center gap-1">
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={16}
                    color="#333"
                  />
                  <Text>收到的回复</Text>
                </View>
              </Dropdown.Item>
              {/* <Menu.Item
              onPress={() => {
                setType('like');
                closeMenu();
              }}
              title="收到的赞"
            />
            <Menu.Item
              onPress={() => {
                setType('reply');
                closeMenu();
              }}
              title="收到的回复"
            /> */}
            </Dropdown>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <FlashList
          data={mockData} // TODO: 添加实际数据
          renderItem={({ item }) => <InteractionListItem item={item} />}
          estimatedItemSize={80}
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      </View>
    </DropdownProvider>
  );
}
