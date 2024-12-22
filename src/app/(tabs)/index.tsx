import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useState } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const StatCard = ({
  value,
  label,
  icon,
}: {
  value: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <View className="items-center">
    {icon}
    <Text className="mt-1 text-base font-medium">{value}</Text>
    <Text className="mt-0.5 text-sm text-[#666666]">{label}</Text>
  </View>
);

const CalendarDay = ({
  day,
  isChecked,
  isToday,
  onPress,
}: {
  day: number;
  isChecked: boolean;
  isToday: boolean;
  onPress?: () => void;
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));

  const handlePress = useCallback(() => {
    if (isChecked) {
      // Simple scale animation for unchecking
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Progress animation for checking
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }

    onPress?.();
  }, [onPress, scaleAnim, progressAnim, isChecked]);

  if (!day) return <View className="h-12 w-12 flex-1" />;

  return (
    <TouchableOpacity
      className="w-13 h-14 flex-1 items-center justify-center"
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Animated.View
        className="relative h-12 w-12 items-center justify-center"
        style={{
          transform: [{ scale: scaleAnim }],
        }}
      >
        {isChecked && (
          <Animated.View
            className="absolute h-12 w-12 rounded-full border border-[#8AB86E]"
            style={{
              backgroundColor: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  'rgba(138, 184, 110, 0)',
                  'rgba(138, 184, 110, 0.2)',
                ],
              }),
            }}
          />
        )}
        {isToday && !isChecked && (
          <View className="absolute h-12 w-12 rounded-full bg-[#f5f5f5]" />
        )}
        <Text
          className={`text-base ${
            isChecked ? 'text-[#8AB86E]' : 'text-[#333333]'
          }`}
        >
          {day}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Helper functions remain the same
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const MonthCalendar = ({
  year,
  month,
  checkedDays,
  onToggleDay,
}: {
  year: number;
  month: number;
  checkedDays: Set<string>;
  onToggleDay: (day: number) => void;
}) => {
  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === year && today.getMonth() === month;
  const currentDay = today.getDate();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const weeks: number[][] = [];
  let currentWeek: number[] = Array(7).fill(0);

  // Adjust for Monday start
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  // Fill in the days
  let dayCounter = 1;
  for (let i = adjustedFirstDay; i < 7; i++) {
    currentWeek[i] = dayCounter++;
  }
  weeks.push([...currentWeek]);

  currentWeek = Array(7).fill(0);
  while (dayCounter <= daysInMonth) {
    for (let i = 0; i < 7 && dayCounter <= daysInMonth; i++) {
      currentWeek[i] = dayCounter++;
    }
    weeks.push([...currentWeek]);
    currentWeek = Array(7).fill(0);
  }

  const weekDays = ['一', '二', '三', '四', '五', '六', '日'];

  return (
    <View className="flex-1">
      {/* Weekday headers */}
      <View className="mb-2 flex-row">
        {weekDays.map((day, index) => (
          <View
            key={index}
            className="h-12 w-12 flex-1 items-center justify-center"
          >
            <Text className="text-sm text-[#666666]">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className="flex-row">
          {week.map((day, dayIndex) => (
            <CalendarDay
              key={dayIndex}
              day={day}
              isChecked={checkedDays.has(`${year}-${month + 1}-${day}`)}
              isToday={isCurrentMonth && day === currentDay}
              onPress={() => day && onToggleDay(day)}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const YearCalendar = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  checkedDays,
  onToggleDay,
}: {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  checkedDays: Set<string>;
  onToggleDay: (day: number) => void;
}) => {
  return (
    <View className={'w-full'}>
      <View className="mb-6 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Text className="text-xl font-medium">
            {year}年{month + 1}月
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#666"
            style={{ marginLeft: 4 }}
          />
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={onPrevMonth}
            className="h-12 w-12 items-center justify-center rounded-lg bg-[#f5f5f5]"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onNextMonth}
            className="h-12 w-12 items-center justify-center rounded-lg bg-[#f5f5f5]"
          >
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      <MonthCalendar
        year={year}
        month={month}
        checkedDays={checkedDays}
        onToggleDay={onToggleDay}
      />

      {/* Stats Row */}
      <View className="mt-8 flex-row justify-between">
        <View>
          <Text className="text-sm text-[#666666]">完成天数</Text>
          <Text className="mt-1 text-2xl font-medium">{checkedDays.size}</Text>
        </View>
        <View>
          <Text className="text-sm text-[#666666]">打卡次数</Text>
          <Text className="mt-1 text-2xl font-medium">{checkedDays.size}</Text>
        </View>
        <View>
          <Text className="text-sm text-[#666666]">月完成率</Text>
          <Text className="mt-1 text-2xl font-medium">
            {((checkedDays.size / getDaysInMonth(year, month)) * 100).toFixed(
              1,
            )}
            %
          </Text>
        </View>
        <View>
          <Text className="text-sm text-[#666666]">小记数</Text>
          <Text className="mt-1 text-2xl font-medium">0</Text>
        </View>
      </View>
    </View>
  );
};

export default function HomePage() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [checkedDays, setCheckedDays] = useState<Set<string>>(new Set());

  const handleToggleDay = useCallback(
    (day: number) => {
      const dateKey = `${currentYear}-${currentMonth + 1}-${day}`;
      const newCheckedDays = new Set(checkedDays);
      if (newCheckedDays.has(dateKey)) {
        newCheckedDays.delete(dateKey);
      } else {
        newCheckedDays.add(dateKey);
      }
      setCheckedDays(newCheckedDays);
    },
    [checkedDays, currentYear, currentMonth],
  );

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <>
      <View className="absolute h-screen w-full rounded-2xl bg-black/5">
        <Image
          className="h-1/2 w-full rounded-b-2xl"
          source={require('@/ui/assets/image/home-bg.png')}
        />
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SafeAreaView className="relative z-10 flex-1" style={{ flex: 1 }}>
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

          {/* Action Buttons */}
          {/* <View className="mt-4 flex-row justify-center gap-3 px-4">
            <TouchableOpacity className="flex-1 rounded-full bg-white py-3">
              <Text className="text-center text-base">慈慈打卡</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex-1 rounded-full border border-[#8AB86E] bg-transparent py-3">
              <Text className="text-center text-base text-[#8AB86E]">
                戒瘾打卡
              </Text>
            </TouchableOpacity>
          </View> */}

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
          <View className="mx-4 mt-4 rounded-2xl bg-white p-4">
            <YearCalendar
              year={currentYear}
              month={currentMonth}
              onPrevMonth={handlePrevMonth}
              onNextMonth={handleNextMonth}
              checkedDays={checkedDays}
              onToggleDay={handleToggleDay}
            />
          </View>

          <View className="h-20" />
        </SafeAreaView>
      </ScrollView>
    </>
  );
}
