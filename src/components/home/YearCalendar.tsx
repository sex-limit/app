import React, { useCallback } from 'react';
import { Text, View } from 'react-native';

import { type CheckInRecord } from '@/contexts/CheckInContext';
import { getDaysInMonth } from '@/utils/date';

import { DatePicker } from '../date-picker';
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
  onJumpTo,
  checkedDays,
  onToggleDay,
}: YearCalendarProps) => {
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
      <CarouselSwitch
        current={current}
        getPrev={(current) =>
          new Date(current.getFullYear(), current.getMonth() - 1, 1)
        }
        getNext={(current) =>
          new Date(current.getFullYear(), current.getMonth() + 1, 1)
        }
        onChange={(current) => handleSetCurrent(current)}
        picker={
          <DatePicker
            picker="month"
            value={current}
            onChange={handleSetCurrent}
          />
        }
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
      <StatsRow checkedDays={checkedDays} year={year} month={month} />
    </View>
  );
};
