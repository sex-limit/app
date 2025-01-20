import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { QuickNotes } from '@/components/home/QuickNotes';
import { StatCard } from '@/components/home/StatCard';
import { YearCalendar } from '@/components/home/YearCalendar';
import { useCheckIn } from '@/contexts/CheckInContext';

export default function Home() {
  const today = new Date();
  const { check, currentMode, setMode, getBetween } = useCheckIn();
  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });
  const checkedDays = useMemo(() => {
    return new Map(
      getBetween(
        new Date(Date.UTC(currentDate.year, currentDate.month, 1)),
        new Date(Date.UTC(currentDate.year, currentDate.month + 1, 0)),
      ).map((d) => [d.date.toISOString(), d]),
    );
  }, [currentDate, getBetween]);

  const handlePrevMonth = useCallback(() => {
    let year = currentDate.year;
    let month = currentDate.month;
    if (month === 0) {
      year = year - 1;
      month = 11;
    } else {
      month = month - 1;
    }
    setCurrentDate({ year, month });
  }, [currentDate.month, currentDate.year]);

  const handleNextMonth = useCallback(() => {
    let year = currentDate.year;
    let month = currentDate.month;
    if (month === 11) {
      year = year + 1;
      month = 0;
    } else {
      month = month + 1;
    }
    setCurrentDate({ year, month });
  }, [currentDate.month, currentDate.year]);

  const handleJumpTo = useCallback(
    (year: number, month: number) => {
      setCurrentDate({ year, month });
    },
    [setCurrentDate],
  );

  const leftArrowOffset = useSharedValue(0);
  const rightArrowOffset = useSharedValue(0);

  const leftArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftArrowOffset.value }],
  }));

  const rightArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightArrowOffset.value }],
  }));

  const handleSwitchMode = useCallback(() => {
    leftArrowOffset.value = withSequence(
      withTiming(-2, { duration: 150 }),
      withTiming(0, { duration: 150 }),
    );
    rightArrowOffset.value = withSequence(
      withTiming(2, { duration: 150 }),
      withTiming(0, { duration: 150 }),
    );
    setMode(currentMode === 'limit' ? 'exhaustive' : 'limit');
  }, [currentMode, leftArrowOffset, rightArrowOffset, setMode]);

  const quickNotesRef = useRef<typeof QuickNotes>(null);

  const handleQuickNotes = useCallback(() => {
    quickNotesRef.current?.present();
  }, []);

  const handleQuickNotesClose = useCallback(() => {}, []);

  const handleToggleDay = useCallback(
    (day: number) => {
      handleQuickNotes();
      check(new Date(Date.UTC(currentDate.year, currentDate.month, day)));
    },
    [handleQuickNotes, check, currentDate.year, currentDate.month],
  );

  return (
    <>
      <View className="absolute h-screen w-full rounded-2xl bg-[rgba(242,242,242)]">
        <Image
          className="h-1/2 w-full rounded-b-2xl"
          source={
            currentMode === 'limit'
              ? require('@/ui/assets/image/home-bg.png')
              : require('@/ui/assets/image/home-bg-red.png')
          }
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
        onPress={handleSwitchMode}
      >
        <View className="h-[15px] w-[15px]">
          <Animated.View style={leftArrowStyle}>
            <MaterialCommunityIcons
              name="arrow-left-thin"
              size={15}
              color="#666"
              className="absolute translate-x-[-3px] translate-y-[4px]"
            />
          </Animated.View>
          <Animated.View style={rightArrowStyle}>
            <MaterialCommunityIcons
              name="arrow-right-thin"
              size={15}
              color="#666"
              className="absolute translate-x-[3px] translate-y-[-2px]"
            />
          </Animated.View>
        </View>
        <Text className="ml-2">
          切换{currentMode === 'limit' ? '🪷' : '🦌'}模式
        </Text>
      </TouchableOpacity>
      <QuickNotes ref={quickNotesRef} onClose={() => {}} onConfirm={() => {}} />
    </>
  );
}
