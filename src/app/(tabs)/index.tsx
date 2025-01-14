import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useColorScheme,
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
    <View className="flex-1 grow-0 basis-1">
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
  onJumpTo,
  checkedDays,
  onToggleDay,
}: {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpTo: (year: number, month: number) => void;
  checkedDays: Set<string>;
  onToggleDay: (day: number) => void;
}) => {
  const [monthViewTranslateX] = useState(new Animated.Value(0));
  const displayWidth = Dimensions.get('window').width - 56;
  const [isYearPickerVisible, setYearPickerVisible] = useState(false);
  const [isMonthPickerVisible, setMonthPickerVisible] = useState(false);
  const selectedYear = useRef(year);
  const selectedMonth = useRef(month);
  const [yearPickerOpacity] = useState(new Animated.Value(0));
  const [monthPickerOpacity] = useState(new Animated.Value(0));

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderMove: Animated.event([null, { dx: monthViewTranslateX }], {
      useNativeDriver: false,
    }),
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        Animated.timing(monthViewTranslateX, {
          toValue: displayWidth,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onPrevMonth();
          monthViewTranslateX.setValue(0);
        });
      } else if (gestureState.dx < -50) {
        Animated.timing(monthViewTranslateX, {
          toValue: -displayWidth,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          onNextMonth();
          monthViewTranslateX.setValue(0);
        });
      } else {
        Animated.spring(monthViewTranslateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const prevMonth = month === 0 ? 11 : month - 1;
  const nextMonth = month === 11 ? 0 : month + 1;
  const prevYear = month === 0 ? year - 1 : year;
  const nextYear = month === 11 ? year + 1 : year;

  const handleYearSelect = (newYear: number) => {
    selectedYear.current = newYear;
    setYearPickerVisible(false);
    setMonthPickerVisible(true);
    Animated.timing(monthPickerOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleMonthSelect = (newMonth: number) => {
    selectedMonth.current = newMonth;
    setMonthPickerVisible(false);
    onJumpTo(selectedYear.current, selectedMonth.current);
  };

  const toggleYearPicker = () => {
    setYearPickerVisible(!isYearPickerVisible);
    Animated.timing(yearPickerOpacity, {
      toValue: isYearPickerVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const toggleMonthPicker = () => {
    setMonthPickerVisible(!isMonthPickerVisible);
    Animated.timing(monthPickerOpacity, {
      toValue: isMonthPickerVisible ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="w-full ">
      {/* Month Header */}
      <View className="mb-6 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={toggleYearPicker}
          className="flex-row items-center"
        >
          <Text className="text-xl font-medium">
            {year}年{month + 1}月
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={24}
            color="#666"
            style={{ marginLeft: 4 }}
          />
        </TouchableOpacity>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => {
              Animated.spring(monthViewTranslateX, {
                toValue: displayWidth,
                useNativeDriver: true,
              }).start(() => {
                onPrevMonth();
                monthViewTranslateX.setValue(0);
              });
            }}
            className="h-12 w-12 items-center justify-center rounded-lg bg-[#f5f5f5]"
          >
            <MaterialCommunityIcons
              name="chevron-left"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Animated.spring(monthViewTranslateX, {
                toValue: -displayWidth,
                useNativeDriver: true,
              }).start(() => {
                onNextMonth();
                monthViewTranslateX.setValue(0);
              });
            }}
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

      <View className="overflow-hidden">
        <Animated.View
          style={{
            flexDirection: 'row',
            width: '300%',
            transform: [{ translateX: monthViewTranslateX }],
            marginLeft: '-100%',
          }}
          {...panResponder.panHandlers}
        >
          <View style={{ width: '33.33%' }}>
            <MonthCalendar
              year={prevYear}
              month={prevMonth}
              checkedDays={checkedDays}
              onToggleDay={onToggleDay}
            />
          </View>
          <View style={{ width: '33.33%' }}>
            <MonthCalendar
              year={year}
              month={month}
              checkedDays={checkedDays}
              onToggleDay={onToggleDay}
            />
          </View>
          <View style={{ width: '33.33%' }}>
            <MonthCalendar
              year={nextYear}
              month={nextMonth}
              checkedDays={checkedDays}
              onToggleDay={onToggleDay}
            />
          </View>
        </Animated.View>
      </View>

      {/* Year Picker */}
      {isYearPickerVisible && (
        <Animated.View
          style={{
            opacity: yearPickerOpacity,
            position: 'absolute',
          }}
          className="absolute top-[60px] z-10 rounded-sm border-y-2 border-[#f5f5f5] bg-white"
        >
          <ScrollView
            showsVerticalScrollIndicator
            nestedScrollEnabled={true}
            contentContainerStyle={{
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
            style={{
              height: 300,
            }}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleYearSelect(year - 12 + i)}
                className="m-2 w-20 rounded-lg bg-[#f5f5f5] p-4"
              >
                <Text className="text-center text-[#666]">{year - 12 + i}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Month Picker */}
      {isMonthPickerVisible && (
        <Animated.View
          style={{
            opacity: monthPickerOpacity,
            position: 'absolute',
          }}
          className="absolute top-[60px] z-10 rounded-sm border-y-2 border-[#f5f5f5] bg-white"
        >
          <ScrollView
            showsVerticalScrollIndicator
            nestedScrollEnabled={true}
            contentContainerStyle={{
              justifyContent: 'center',
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
            style={{
              height: 300,
            }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => handleMonthSelect(i)}
                className="m-2 w-20 rounded-lg bg-[#f5f5f5] p-4"
              >
                <Text className="text-center text-[#666]">{i + 1}月</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Overlay to close pickers */}
      {(isYearPickerVisible || isMonthPickerVisible) && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (isYearPickerVisible) {
              toggleYearPicker();
            }
            if (isMonthPickerVisible) {
              toggleMonthPicker();
            }
          }}
          className="absolute inset-0 -left-full -top-full h-[200vh] w-[200vw]"
        />
      )}

      {/* Stats Row */}
      <View className="mt-8 flex-row justify-between">
        <View>
          <Text className="text-sm text-[#666666]">完成天数</Text>
          <Text className="mt-1 text-center text-2xl font-medium">
            {checkedDays.size}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-[#666666]">打卡次数</Text>
          <Text className="mt-1 text-center text-2xl font-medium">
            {checkedDays.size}
          </Text>
        </View>
        <View>
          <Text className="text-sm text-[#666666]">月完成率</Text>
          <Text className="mt-1 text-center text-2xl font-medium">
            {((checkedDays.size / getDaysInMonth(year, month)) * 100).toFixed(
              1,
            )}
            %
          </Text>
        </View>
        <View>
          <Text className="text-sm text-[#666666]">小记数</Text>
          <Text className="mt-1 text-center text-2xl font-medium">0</Text>
        </View>
      </View>
    </View>
  );
};

export default function Home() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
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

  const handleJumpTo = (year: number, month: number) => {
    setCurrentYear(year);
    setCurrentMonth(month);
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
                year={currentYear}
                month={currentMonth}
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
