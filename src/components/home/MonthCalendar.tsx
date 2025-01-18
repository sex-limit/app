import React, { memo } from 'react';
import { Text, View } from 'react-native';

import { type CheckInRecord } from '@/contexts/CheckInContext';
import { getDaysInMonth, getFirstDayOfMonth } from '@/utils/date';

import { CalendarDay } from './CalendarDay';

interface MonthCalendarProps {
  year: number;
  month: number;
  checkedDays: Map<string, CheckInRecord>;
  onToggleDay: (day: number) => void;
}

export const MonthCalendar = memo(
  ({ year, month, checkedDays, onToggleDay }: MonthCalendarProps) => {
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
      <View className="flex-1 grow-0 basis-1" style={{ height: 340 }}>
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

        {weeks.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row">
            {week.map((day, dayIndex) => (
              <CalendarDay
                key={dayIndex}
                day={day}
                record={checkedDays.get(
                  new Date(Date.UTC(year, month, day)).toISOString(),
                )}
                isToday={isCurrentMonth && day === currentDay}
                onToggleDay={onToggleDay}
              />
            ))}
          </View>
        ))}
      </View>
    );
  },
);
