import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { type CheckInRecord } from '@/contexts/CheckInContext';
import { getDaysInMonth } from '@/utils/date';

import { CarouselSwitch } from './CarouselSwith';
import { MonthCalendar } from './MonthCalendar';

interface YearCalendarProps {
  year: number;
  month: number;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onJumpTo: (year: number, month: number) => void;
  checkedDays: Map<string, CheckInRecord>;
  onToggleDay: (day: number) => void;
}

const CalendarHeader = memo(
  ({
    year,
    month,
    monthPickerVisible,
    toggleMonthPicker: toggleYearPicker,
    gotoPrevMonth,
    gotoNextMonth,
  }: {
    year: number;
    month: number;
    monthPickerVisible: boolean;
    toggleMonthPicker: () => void;
    gotoPrevMonth: () => void;
    gotoNextMonth: () => void;
  }) => {
    const chevronRotate = useSharedValue(0);
    const chevronAnimatedStyle = useAnimatedStyle(() => {
      return {
        transform: [{ rotate: `${chevronRotate.value}deg` }],
      };
    });

    useEffect(() => {
      chevronRotate.value = withTiming(monthPickerVisible ? 180 : 0, {
        duration: 200,
      });
    }, [monthPickerVisible, chevronRotate]);

    return (
      <View className="mb-3 flex-row items-center justify-between">
        <TouchableOpacity
          onPress={toggleYearPicker}
          className="flex-row items-center"
        >
          <Text className="text-xl font-medium">
            {year}年{month + 1}月
          </Text>
          <Animated.View
            style={[
              {
                transformOrigin: 'center',
                marginLeft: 4,
              },
              chevronAnimatedStyle,
            ]}
          >
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#666"
            />
          </Animated.View>
        </TouchableOpacity>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => {
              runOnJS(gotoPrevMonth)();
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
              runOnJS(gotoNextMonth)();
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
    );
  },
);

const MonthPicker = memo(
  ({
    year,
    month,
    visible,
    onSelect,
    onCancel,
  }: {
    year: number;
    month: number;
    visible: boolean;
    onSelect: (year: number, month: number) => void;
    onCancel: () => void;
  }) => {
    const [yearPickerVisible, setYearPickerVisible] = useState(visible);
    const [monthPickerVisible, setMonthPickerVisible] = useState(visible);
    const yearPickerOpacity = useSharedValue(0);
    const monthPickerOpacity = useSharedValue(0);
    const animatedYearPickerStyle = useAnimatedStyle(() => {
      return {
        opacity: yearPickerOpacity.value,
        transform: [{ translateY: yearPickerOpacity.value * 10 }],
        visibility: yearPickerOpacity.value === 0 ? 'hidden' : 'visible',
      };
    });
    const animatedMonthPickerStyle = useAnimatedStyle(() => {
      return {
        opacity: monthPickerOpacity.value,
        transform: [{ translateY: monthPickerOpacity.value * 10 }],
        visibility: monthPickerOpacity.value === 0 ? 'hidden' : 'visible',
      };
    });
    const selectedYear = useRef(year);
    const selectedMonth = useRef(month);

    useEffect(() => {
      setYearPickerVisible(visible);
      yearPickerOpacity.value = withTiming(visible ? 1 : 0, { duration: 200 });
    }, [visible, yearPickerOpacity]);

    useEffect(() => {
      monthPickerOpacity.value = withTiming(monthPickerVisible ? 1 : 0, {
        duration: 200,
      });
    }, [monthPickerVisible, monthPickerOpacity]);

    return (
      <>
        {/* Year Picker */}
        {yearPickerVisible && (
          <Animated.View
            style={[
              {
                position: 'absolute',
              },
              animatedYearPickerStyle,
            ]}
            className="absolute top-[50px] z-10 rounded-sm border-y-2 border-[#f5f5f5] bg-white"
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
                height: 340,
              }}
            >
              {Array.from({ length: 24 }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    selectedYear.current = year - 12 + i;
                    setYearPickerVisible(false);
                    setMonthPickerVisible(true);
                  }}
                  className="m-2 w-20 rounded-lg bg-[#f5f5f5] p-4"
                >
                  <Text className="text-center text-[#666]">
                    {year - 12 + i}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}

        {/* Month Picker */}
        {monthPickerVisible && (
          <Animated.View
            style={[
              {
                position: 'absolute',
              },
              animatedMonthPickerStyle,
            ]}
            className="absolute top-[50px] z-10 rounded-sm border-y-2 border-[#f5f5f5] bg-white"
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
                height: 340,
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    selectedMonth.current = i;
                    setMonthPickerVisible(false);
                    onSelect(selectedYear.current, selectedMonth.current);
                  }}
                  className="m-2 w-20 rounded-lg bg-[#f5f5f5] p-4"
                >
                  <Text className="text-center text-[#666]">{i + 1}月</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        )}
        {/* background */}
        {(yearPickerVisible || monthPickerVisible) && (
          <View className="absolute top-[50px] z-0 h-[340px] w-full rounded-sm  bg-white" />
        )}

        {/* Overlay to close pickers */}
        {(yearPickerVisible || monthPickerVisible) && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (yearPickerVisible) {
                setYearPickerVisible(false);
                onCancel();
              }
              if (monthPickerVisible) {
                setMonthPickerVisible(false);
                onCancel();
              }
            }}
            className="absolute inset-0 -left-full -top-full h-[200vh] w-[200vw]"
          />
        )}
      </>
    );
  },
);

const StatsRow = ({ checkedDays, year, month }: any) => (
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
        {((checkedDays.size / getDaysInMonth(year, month)) * 100).toFixed(1)}%
      </Text>
    </View>
    <View>
      <Text className="text-sm text-[#666666]">小记数</Text>
      <Text className="mt-1 text-center text-2xl font-medium">0</Text>
    </View>
  </View>
);

export const YearCalendar = ({
  year,
  month,
  onPrevMonth,
  onNextMonth,
  onJumpTo,
  checkedDays,
  onToggleDay,
}: YearCalendarProps) => {
  const selectedYear = useRef(year);
  const selectedMonth = useRef(month);

  const [monthPickerVisible, setMonthPickerVisible] = useState(false);

  const toggleMonthPicker = useCallback(() => {
    setMonthPickerVisible(true);
  }, [setMonthPickerVisible]);

  const handleSelect = useCallback(
    (year: number, month: number) => {
      selectedYear.current = year;
      selectedMonth.current = month;
      setMonthPickerVisible(false);
      onJumpTo(year, month);
    },
    [onJumpTo],
  );

  const handleCancel = useCallback(() => {
    setMonthPickerVisible(false);
  }, [setMonthPickerVisible]);

  // const [current, setCurrent] = useState(new Date(year, month, 1));
  const current = new Date(year, month, 1);

  const handleSetCurrent = useCallback(
    (current: Date) => {
      console.log('current', current);
      // setCurrent(current);
      onJumpTo(current.getFullYear(), current.getMonth());
    },
    [onJumpTo],
  );

  return (
    <View className="w-full ">
      <CalendarHeader
        year={year}
        month={month}
        toggleMonthPicker={toggleMonthPicker}
        monthPickerVisible={monthPickerVisible}
        gotoPrevMonth={onPrevMonth}
        gotoNextMonth={onNextMonth}
      />

      <CarouselSwitch
        current={current}
        getPrev={(current) =>
          new Date(current.getFullYear(), current.getMonth() - 1, 1)
        }
        getNext={(current) =>
          new Date(current.getFullYear(), current.getMonth() + 1, 1)
        }
        onChange={(current) => handleSetCurrent(current)}
        RenderItem={({ item: current, active }) => {
          console.log('MonthCalendar called 0 at', new Date());

          return (
            <MonthCalendar
              year={current.getFullYear()}
              month={current.getMonth()}
              checkedDays={active ? checkedDays : undefined}
              // checkedDays={undefined}
              onToggleDay={onToggleDay}
            />
          );
        }}
      />

      <MonthPicker
        year={year}
        month={month}
        onSelect={handleSelect}
        visible={monthPickerVisible}
        onCancel={handleCancel}
      />
      <StatsRow checkedDays={checkedDays} year={year} month={month} />
    </View>
  );
};
