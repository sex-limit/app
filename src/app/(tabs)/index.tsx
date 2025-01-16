import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { StatCard } from '@/components/home/StatCard';
import { YearCalendar } from '@/components/home/YearCalendar';
import { useCheckIn } from '@/contexts/CheckInContext';

export default function Home() {
  const today = new Date();
  const { getByMonth, checkInRecords, handleCheckIn } = useCheckIn();
  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const [checkedDays, setCheckedDays] = useState<Set<string>>(new Set());

  const colorScheme = useColorScheme();
  const barStyle = colorScheme === 'dark' ? 'light-content' : 'dark-content';

  useEffect(() => {
    requestAnimationFrame(() => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle(barStyle);
      StatusBar.setTranslucent(true);
    });
  });

  const updateCheckedDays = useCallback(
    (year: number, month: number) => {
      setCheckedDays(new Set(getByMonth(year, month).map((d) => d.toString())));
    },
    [getByMonth],
  );

  useEffect(() => {
    updateCheckedDays(currentDate.year, currentDate.month);
  }, [currentDate, updateCheckedDays]);

  const handleToggleDay = useCallback(
    (day: number) => {
      const dayStr = `${currentDate.year}-${currentDate.month + 1}-${day}`;
      handleCheckIn(dayStr, !checkedDays.has(dayStr));
    },
    [checkedDays, currentDate, handleCheckIn],
  );

  const handlePrevMonth = () => {
    let year = currentDate.year;
    let month = currentDate.month;
    if (month === 0) {
      year = year - 1;
      month = 11;
    } else {
      month = month - 1;
    }
    updateCheckedDays(year, month);
    setCurrentDate({ year, month });
  };

  const handleNextMonth = () => {
    let year = currentDate.year;
    let month = currentDate.month;
    if (month === 11) {
      year = year + 1;
      month = 0;
    } else {
      month = month + 1;
    }
    updateCheckedDays(year, month);
    setCurrentDate({ year, month });
  };

  const handleJumpTo = (year: number, month: number) => {
    setCurrentDate({ year, month });
    updateCheckedDays(year, month);
  };

  return (
    <>
      <View className="absolute h-screen w-full rounded-2xl bg-[rgba(242,242,242)]">
        <Image
          className="h-1/2 w-full rounded-b-2xl"
          source={require('@/ui/assets/image/home-bg.png')}
        />
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SafeAreaView className="z-10 flex-1" style={{ flex: 1 }}>
          <View className={'flex h-full flex-1 flex-col'}>
            {/* Profile Section */}
            <View className="items-center pt-4">
              <Image
                source={{ uri: 'https://i.pravatar.cc/300' }}
                className="h-20 w-20 rounded-2xl bg-gray-200"
              />
              <Text className="mt-2 text-xl font-bold">黄子韬call me粉</Text>
              <Text className="mt-1 text-sm text-[#666666]">
                🎯 你已累计打卡慈慈 {checkedDays.size} 天
              </Text>
            </View>

            {/* Stats Section */}
            <View className="mx-4 mt-4 rounded-2xl border border-[#8AB86E] bg-white p-4">
              <View className="flex-row justify-around">
                <StatCard
                  value="30"
                  label="累计总数"
                  icon={
                    <MaterialCommunityIcons
                      name="chart-bar"
                      size={20}
                      color="#666"
                    />
                  }
                />
                <StatCard
                  value="3"
                  label="上周日均"
                  icon={
                    <MaterialCommunityIcons
                      name="chart-timeline-variant"
                      size={20}
                      color="#666"
                    />
                  }
                />
                <StatCard
                  value="4"
                  label="单日最高"
                  icon={
                    <MaterialCommunityIcons
                      name="trending-up"
                      size={20}
                      color="#666"
                    />
                  }
                />
              </View>
            </View>

            {/* Calendar Section */}
            <View className="mx-4 mb-20 mt-4 rounded-2xl bg-white p-4">
              <YearCalendar
                year={currentDate.year}
                month={currentDate.month}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onJumpTo={handleJumpTo}
                checkedDays={checkedDays}
                onToggleDay={handleToggleDay}
              />
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.6}
        className="absolute bottom-[20px] left-1/2 z-20 -translate-x-1/2 flex-row items-center rounded-full bg-white px-4 py-2 shadow-sm"
      >
        <MaterialCommunityIcons name="swap-horizontal" size={20} color="#666" />
        <Text className="ml-1">切换模式</Text>
      </TouchableOpacity>
    </>
  );
}
