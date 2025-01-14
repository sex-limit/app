import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { getDaysInMonth } from '@/utils/date';

import { MonthCalendar } from './MonthCalendar';

interface YearCalendarProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpTo: (year: number, month: number) => void;
  checkedDays: Set<string>;
  onToggleDay: (day: number) => void;
}

export const YearCalendar = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onJumpTo,
  checkedDays,
  onToggleDay,
}: YearCalendarProps) => {
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
