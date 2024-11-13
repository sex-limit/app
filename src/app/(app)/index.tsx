import React, { useState } from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';

import { Text } from '@/ui';

function CheckInInfo() {
  const [daysCheckedIn, setDaysCheckedIn] = useState(5); // Example state for days checked in

  const handleCheckIn = () => {
    setDaysCheckedIn(daysCheckedIn + 1);
    // Add more logic for handling check-in here
  };

  return (
    <View className={'items-center p-4'}>
      <Text className={'text-2xl font-bold text-primary-500'}>
        今日打卡信息
      </Text>
      <Text className={'mt-2 text-lg'}>
        你已经连续打卡 {daysCheckedIn} 天了！
      </Text>
      <Text className={'mt-1 text-lg'}>今天你很棒啊！继续加油！</Text>
      <TouchableOpacity
        className={'mt-4 rounded-lg bg-primary-500 p-3'}
        onPress={handleCheckIn}
      >
        <Text className={'text-lg text-white'}>打卡</Text>
      </TouchableOpacity>
    </View>
  );
}

function Comments() {
  const commentsData = [
    {
      id: '1',
      user: '用户1',
      comment: '这真是太棒了！',
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: '2',
      user: '用户2',
      comment: '继续加油！',
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: '3',
      user: '用户3',
      comment: '很有意思的活动！',
      avatar: 'https://via.placeholder.com/50',
    },
  ];

  return (
    <View className={'flex-1 p-4'}>
      <Text className={'mb-4 text-xl font-bold'}>评论区</Text>
      <FlatList
        data={commentsData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className={'mb-4 flex-row items-center'}>
            <Image
              source={{ uri: item.avatar }}
              className={'h-10 w-10 rounded-full'}
            />
            <View className={'ml-4'}>
              <Text className={'font-bold'}>{item.user}</Text>
              <Text>{item.comment}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

function Leaderboard() {
  const leaderboardData = [
    {
      id: '1',
      user: '用户1',
      score: 100,
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: '2',
      user: '用户2',
      score: 90,
      avatar: 'https://via.placeholder.com/50',
    },
    {
      id: '3',
      user: '用户3',
      score: 80,
      avatar: 'https://via.placeholder.com/50',
    },
  ];

  return (
    <View className={'flex-1 p-4'}>
      <Text className={'mb-4 text-xl font-bold'}>排行榜</Text>
      <FlatList
        data={leaderboardData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className={'mb-4 flex-row items-center'}>
            <Image
              source={{ uri: item.avatar }}
              className={'h-10 w-10 rounded-full'}
            />
            <View className={'ml-4 flex-1'}>
              <Text className={'font-bold'}>{item.user}</Text>
            </View>
            <Text className={'font-bold'}>{item.score} 分</Text>
          </View>
        )}
      />
    </View>
  );
}

export default function CheckInPage() {
  const [selectedTab, setSelectedTab] = useState('Comments');

  return (
    <SafeAreaView className={'flex-1'}>
      <CheckInInfo />
      <View className={'flex-row justify-around p-4'}>
        <TouchableOpacity onPress={() => setSelectedTab('Comments')}>
          <Text className={selectedTab === 'Comments' ? 'font-bold' : ''}>
            评论区
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('Leaderboard')}>
          <Text className={selectedTab === 'Leaderboard' ? 'font-bold' : ''}>
            排行榜
          </Text>
        </TouchableOpacity>
      </View>
      {selectedTab === 'Comments' && <Comments />}
      {selectedTab === 'Leaderboard' && <Leaderboard />}
    </SafeAreaView>
  );
}
