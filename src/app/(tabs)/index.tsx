import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type NoteData, QuickNotes } from '@/components/home/QuickNotes';
import { StatCard } from '@/components/home/StatCard';
import { YearCalendar } from '@/components/home/YearCalendar';
import { type RecordMode, useCheckIn } from '@/contexts/CheckInContext';

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
    (
      date: Date,
      initialMode: RecordMode,
      initialNote: string,
      initialCount: number | null,
      // eslint-disable-next-line max-params
    ) => {
      quickNotesRef.current?.present(
        date,
        initialMode,
        initialNote,
        initialCount,
      );
    },
    [],
  );

  const handleToggleDay = useCallback(
    (day: number) => {
      const date = new Date(Date.UTC(currentDate.year, currentDate.month, day));
      const record = checkedDays.get(date.toISOString());
      handleQuickNotes(
        date,
        record?.record.mode ?? 'limit',
        record?.note ?? '',
        record?.record.count ?? null,
      );
    },
    [currentDate.year, currentDate.month, checkedDays, handleQuickNotes],
  );

  const handleQuickNotesClose = useCallback(() => {}, []);

  const handleQuickNotesConfirm = useCallback(
    (note: NoteData, date: Date) => {
      if (note.record === null) {
        deleteRecord(date);
      } else {
        setRecord({
          date,
          record: note.record,
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
          className="h-1/2 w-full rounded-b-3xl"
          source={require('@/ui/assets/image/home-bg.png')}
        />
      </View>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <SafeAreaView className="z-10 flex-1" style={{ flex: 1 }}>
          <View className={'flex h-full flex-1 flex-col px-4'}>
            {/* Profile Section */}
            <View className="items-center gap-y-6 py-4">
              <Image
                source={{uri: 'https://sns-webpic-qc.xhscdn.com/202502051403/b3152fccf01f310f28a8072e260eee94/1040g008318l1tgj1466g5n9g8fgk6cpklpnjo5o!nd_dft_wlteh_webp_3'}}
                className="h-24 w-24 rounded-xl"
              />
              <Text className="text-2xl font-medium text-white">六年之约</Text>
              <View className="flex-row flex-wrap items-center gap-3">
                {[
                  { icon: 'check-circle', text: '六年之约打卡354天' },
                  { icon: 'check-circle', text: '坚持戒涩60天' },
                  { icon: 'clock-outline', text: '今天已记录' },
                ].map((item, index) => (
                  <View key={index} className="flex-row items-center rounded-lg bg-white/20 px-3 py-1.5">
                    <MaterialCommunityIcons
                      name={item.icon}
                      size={12}
                      color="#fff"
                    />
                    <Text className="ml-1 text-xs text-white">{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Stats Section */}
            <View className="mt-4 rounded-2xl border border-[#8AB86E] bg-white p-4">
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
            <View className="mb-20 mt-4 rounded-2xl bg-white p-4">
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
