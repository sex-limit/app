import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type NoteData, QuickNotes } from '@/components/home/QuickNotes';
import { StatCard } from '@/components/home/StatCard';
import { YearCalendar } from '@/components/home/YearCalendar';
import { useCheckIn } from '@/contexts/CheckInContext';

export default function Home() {
  const today = new Date();
  const { setRecord, getBetween, deleteRecord } = useCheckIn();
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

  const quickNotesRef = useRef<typeof QuickNotes>(null);

  const handleQuickNotes = useCallback(
    (date: Date, initialMode: string, initialNote: string) => {
      quickNotesRef.current?.present(date, initialMode, initialNote);
    },
    [],
  );

  const handleToggleDay = useCallback(
    (day: number) => {
      const date = new Date(Date.UTC(currentDate.year, currentDate.month, day));
      const record = checkedDays.get(date.toISOString());
      handleQuickNotes(date, record?.mode ?? 'limit', record?.note ?? '');
    },
    [currentDate.year, currentDate.month, checkedDays, handleQuickNotes],
  );

  const handleQuickNotesClose = useCallback(() => {}, []);

  const handleQuickNotesConfirm = useCallback(
    (note: NoteData, date: Date) => {
      if (note.mode === null) {
        deleteRecord(date);
      } else {
        setRecord({
          date,
          mode: note.mode,
          note: note.note,
        });
      }
    },
    [deleteRecord, setRecord],
  );

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

      <QuickNotes
        ref={quickNotesRef}
        onClose={handleQuickNotesClose}
        onConfirm={handleQuickNotesConfirm}
      />
    </>
  );
}
