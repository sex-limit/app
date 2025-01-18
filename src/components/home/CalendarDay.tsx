import React, { memo, useCallback, useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { type CheckInRecord, getModeTheme } from '@/contexts/CheckInContext';

interface CalendarDayProps {
  day: number;
  record?: CheckInRecord;
  isToday: boolean;
  onToggleDay?: (day: number) => void;
}

const CalendarDay = memo(
  ({ day, record, isToday, onToggleDay }: CalendarDayProps) => {
    const scaleAnim = useSharedValue(1);
    const progressAnim = useSharedValue(0);

    const handlePress = useCallback(() => {
      if (record) {
        scaleAnim.value = withSequence(
          withTiming(0.8, { duration: 100 }),
          withTiming(1, { duration: 100 }),
        );
      } else {
        progressAnim.value = withTiming(1, { duration: 300 });
      }

      onToggleDay?.(day);
    }, [record, onToggleDay, day, scaleAnim, progressAnim]);

    const animatedThemeColor = useSharedValue(
      record ? getModeTheme(record?.mode) : undefined,
    );
    const animatedThemeColorStyle = useAnimatedStyle(() => ({
      borderColor: animatedThemeColor.value,
    }));
    const animatedTextColorStyle = useAnimatedStyle(() => ({
      color: animatedThemeColor.value || '#f5f5f5',
    }));

    useEffect(() => {
      animatedThemeColor.value = withTiming(
        record ? getModeTheme(record?.mode) : '#f5f5f5',
        { duration: 200 },
      );
    }, [record, animatedThemeColor]);

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
          {record && (
            <Animated.View
              className={`absolute h-12 w-12 rounded-full border `}
              style={[
                // {
                //   backgroundColor: progressAnim.interpolate({
                //     inputRange: [0, 1],
                //     outputRange: [
                //       'rgba(138, 184, 110, 0)',
                //       'rgba(138, 184, 110, 0.2)',
                //     ],
                //   }),
                // },
                animatedThemeColorStyle,
              ]}
            />
          )}
          {isToday && !record && (
            <View className="absolute h-12 w-12 rounded-full bg-[#f5f5f5]" />
          )}
          {record ? (
            <Animated.Text
              className="text-base"
              style={[animatedTextColorStyle]}
            >
              {day}
            </Animated.Text>
          ) : (
            <Text className="text-base text-[#333333]">{day}</Text>
          )}
        </Animated.View>
      </TouchableOpacity>
    );
  },
);

export { CalendarDay };
