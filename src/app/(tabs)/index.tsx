import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { type NoteData, QuickNotes } from '@/components/home/QuickNotes';
import { StatCard } from '@/components/home/StatCard';
import { YearCalendar } from '@/components/home/YearCalendar';
import { type RecordMode, useCheckIn } from '@/contexts/CheckInContext';
import { useMySexLimitPlanDetail } from '@/api/plan/usePlanDetail';
import { useMyPlanCheckedDays } from '@/api/plan/usePlanChecked';
import { client } from '@/api';

export default function Home() {
  const today = new Date();

  const { setRecord, getBetween, deleteRecord } = useCheckIn();
  const [currentDate, setCurrentDate] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const { data, planId } = useMyPlanCheckedDays({
    year: currentDate.year,
  });

  const planDetail = data?.data;

  const todayChecked = useMemo(() => {
    return planDetail?.checkedDays.find(
      (d) =>
        new Date(d).getFullYear() === today.getFullYear() &&
        new Date(d).getMonth() === today.getMonth() &&
        new Date(d).getDate() === today.getDate(),
    );
  }, [planDetail, currentDate.year, currentDate.month, today.getDate]);

  const [checkedDays, setCheckedDays] = useState(new Map<string, any>());

  useEffect(() => {
    const getter = async () => {
      const data = await getBetween(
        planId,
        new Date(Date.UTC(currentDate.year, currentDate.month, 1)),
        new Date(Date.UTC(currentDate.year, currentDate.month + 1, 0)),
      );
      setCheckedDays(new Map(data.map((d) => [d.date.toISOString(), d])));
    };
    getter();
  }, [currentDate]);

  const [lastWeekCheckedCount, setLastWeekCheckedCount] = useState(0);

  useEffect(() => {
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const getter = async () => {
      const lastWeekChecked = await getBetween(
        planId,
        lastWeek,
        new Date(Date.now()),
      );
      setLastWeekCheckedCount(
        lastWeekChecked.reduce((acc, cur) => acc + (cur.record?.count ?? 1), 0),
      );
    };
    getter();
  }, [getBetween]);

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
      initialImgs?: string[],
      // eslint-disable-next-line max-params
    ) => {
      quickNotesRef.current?.present(
        date,
        initialMode,
        initialNote,
        initialCount,
        initialImgs ?? [],
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
        record?.record.mode ?? 'Positive',
        record?.note.content ?? '',
        record?.record.count ?? null,
        record?.note.imgs,
      );
    },
    [currentDate.year, currentDate.month, checkedDays, handleQuickNotes],
  );

  const handleQuickNotesClose = useCallback(() => {}, []);

  const handleQuickNotesConfirm = useCallback(
    async (note: NoteData, date: Date) => {
      console.log(note, date);
      await client({
        method: 'POST',
        url: `/plan/check-in`,
        data: {
          planId,
          checkTimes: note.record === null ? 0 : (note.record.count ?? 1),
          status: note.record?.mode ?? 'Positive',
          date: date.toISOString(),
          quickPost: {
            content: note.note,
            imgs: note.imgs ?? [],
          },
        },
      });

      if (note.record === null) {
        deleteRecord(date);
        setCheckedDays((prev) => {
          const newMap = new Map(prev);
          newMap.delete(date.toISOString());
          return newMap;
        });
      } else {
        setRecord({
          date,
          record: note.record,
          note: {
            content: note.note,
            imgs: note.imgs ?? [],
          },
        });
        setCheckedDays((prev) => {
          const newMap = new Map(prev);
          newMap.set(date.toISOString(), {
            date,
            record: note.record,
            note: {
              content: note.note,
              imgs: note.imgs ?? [],
            },
          });
          return newMap;
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
                source={{
                  uri: planDetail?.coverAvatar,
                }}
                className="h-24 w-24 rounded-xl"
              />
              <Text className="text-2xl font-medium text-white">
                {planDetail?.title}
              </Text>
              <View className="flex-row flex-wrap items-center gap-3">
                {[
                  {
                    icon: 'check-circle' as const,
                    text: `${planDetail?.title ?? ''}最长坚持${planDetail?.postiveLongestCheckedDays ?? 0}天`,
                  },
                  {
                    icon: 'check-circle' as const,
                    text: `已坚持${planDetail?.postiveLatestConsutiveCheckedDays ?? 0}天`,
                  },
                  {
                    icon: 'clock-outline' as const,
                    text: todayChecked ? '今天已记录' : '今天未记录',
                  },
                ].map((item, index) => (
                  <View
                    key={index}
                    className="flex-row items-center rounded-lg bg-white/20 px-3 py-1.5"
                  >
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
                  value={planDetail?.checkedDays.length.toString() ?? '0'}
                  label="累计打卡"
                  icon={
                    <Ionicons
                      name="stats-chart-outline"
                      size={20}
                      color="#666"
                    />
                  }
                />
                <StatCard
                  value={
                    planDetail?.postiveCheckedDays.length.toString() ?? '0'
                  }
                  label="累计坚持"
                  icon={
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="#666"
                    />
                  }
                />
                <StatCard
                  value={(lastWeekCheckedCount / 7).toFixed(1)}
                  label="上周日均"
                  icon={
                    <Ionicons name="analytics-outline" size={20} color="#666" />
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
        planEmoji={planDetail?.coverEmoji ?? '🦌'}
        onClose={handleQuickNotesClose}
        onConfirm={handleQuickNotesConfirm}
      />
    </>
  );
}
