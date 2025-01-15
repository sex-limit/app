import React, { memo, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  PanResponder,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
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
              gotoPrevMonth();
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
              gotoNextMonth();
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
                height: 336,
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
                height: 336,
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
          <View className="absolute top-[50px] z-0 h-[336px] w-full rounded-sm  bg-white" />
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

const ThreeMonthViewPanel = memo(
  ({
    panYear,
    panMonth,
    checkedDays,
  }: {
    panYear: number;
    panMonth: number;
    checkedDays: Set<string>;
  }) => {
    const prevMonth = panMonth === 0 ? 11 : panMonth - 1;
    const nextMonth = panMonth === 11 ? 0 : panMonth + 1;
    const prevYear = panMonth === 0 ? panYear - 1 : panYear;
    const nextYear = panMonth === 11 ? panYear + 1 : panYear;
    const emptySet = new Set<string>();
    return (
      <>
        <View style={{ width: '33.33%' }}>
          <MonthCalendar
            year={prevYear}
            month={prevMonth}
            checkedDays={emptySet}
            onToggleDay={() => {}}
          />
        </View>
        <View style={{ width: '33.33%' }}>
          <MonthCalendar
            year={panYear}
            month={panMonth}
            checkedDays={checkedDays}
            onToggleDay={() => {}}
          />
        </View>
        <View style={{ width: '33.33%' }}>
          <MonthCalendar
            year={nextYear}
            month={nextMonth}
            checkedDays={emptySet}
            onToggleDay={() => {}}
          />
        </View>
      </>
    );
  },
);

const MonthViewSwitcher = ({
  checkedDays,
  onToggleDay,
  gotoPrevMonth,
  gotoNextMonth,
  monthViewTranslateX,
  year,
  month,
}: {
  checkedDays: Set<string>;
  onToggleDay: (day: number) => void;
  gotoPrevMonth: () => void;
  gotoNextMonth: () => void;
  monthViewTranslateX: any;
  year: number;
  month: number;
}) => {
  const swiping = useDerivedValue(() => {
    return monthViewTranslateX.value !== 0;
  });
  const swipeOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: swiping.value ? 1 : 0,
    };
  });
  const calendarOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: swiping.value ? 0 : 1,
    };
  });

  const [panYear, setPanYear] = useState(year);
  const [panMonth, setPanMonth] = useState(month);

  useEffect(() => {
    setPanYear(year);
    setPanMonth(month);
  }, [year, month]);

  const animatedMonthViewStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: monthViewTranslateX.value }],
    };
  });

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderMove: (_, gestureState) => {
      monthViewTranslateX.value = gestureState.dx;
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        gotoPrevMonth();
      } else if (gestureState.dx < -50) {
        gotoNextMonth();
      } else {
        monthViewTranslateX.value = withSpring(0);
      }
    },
    onPanResponderTerminate: () => {
      monthViewTranslateX.value = withSpring(0);
    },
  });

  return (
    <View className=" min-h-[336px] overflow-hidden">
      <Animated.View
        style={[
          {
            flexDirection: 'row',
            width: '300%',
            marginLeft: '-100%',
          },
          swipeOpacityStyle,
          animatedMonthViewStyle,
        ]}
      >
        <ThreeMonthViewPanel
          panYear={panYear}
          panMonth={panMonth}
          checkedDays={checkedDays}
        />
      </Animated.View>
      <Animated.View
        className="absolute w-full"
        style={[calendarOpacityStyle]}
        {...panResponder.panHandlers}
      >
        <MonthCalendar
          year={year}
          month={month}
          checkedDays={checkedDays}
          onToggleDay={onToggleDay}
        />
      </Animated.View>
    </View>
  );
};

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
  const displayWidth = Dimensions.get('window').width - 56;
  const monthViewTranslateX = useSharedValue(0);

  const selectedYear = useRef(year);
  const selectedMonth = useRef(month);

  const [monthPickerVisible, setMonthPickerVisible] = useState(false);

  const toggleMonthPicker = () => {
    setMonthPickerVisible(true);
  };

  const handleSelect = (year: number, month: number) => {
    selectedYear.current = year;
    selectedMonth.current = month;
    setMonthPickerVisible(false);
    onJumpTo(year, month);
  };

  const gotoPrevMonth = () => {
    monthViewTranslateX.value = withTiming(
      displayWidth,
      { duration: 200 },
      () => {
        monthViewTranslateX.value = 0;
      },
    );
    if (month === 0) {
      onPrevMonth();
    } else {
      runOnJS(onPrevMonth)();
    }
  };

  const gotoNextMonth = () => {
    monthViewTranslateX.value = withTiming(
      -displayWidth,
      { duration: 200 },
      () => {
        monthViewTranslateX.value = 0;
      },
    );
    if (month === 11) {
      onNextMonth();
    } else {
      runOnJS(onNextMonth)();
    }
  };

  return (
    <View className="w-full ">
      <CalendarHeader
        year={year}
        month={month}
        toggleMonthPicker={toggleMonthPicker}
        monthPickerVisible={monthPickerVisible}
        gotoPrevMonth={gotoPrevMonth}
        gotoNextMonth={gotoNextMonth}
      />

      <MonthViewSwitcher
        checkedDays={checkedDays}
        onToggleDay={onToggleDay}
        gotoPrevMonth={gotoPrevMonth}
        gotoNextMonth={gotoNextMonth}
        monthViewTranslateX={monthViewTranslateX}
        year={year}
        month={month}
      />

      <MonthPicker
        year={year}
        month={month}
        onSelect={handleSelect}
        visible={monthPickerVisible}
        onCancel={() => {
          setMonthPickerVisible(false);
        }}
      />
      <StatsRow checkedDays={checkedDays} year={year} month={month} />
    </View>
  );
};
