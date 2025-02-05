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
      record ? getModeTheme(record?.record.mode) : '#f5f5f5',
    );

    // const animatedProgressBgStyle = useAnimatedStyle(() => {
    //   if (progressAnim.value === 0) {
    //     return {
    //       backgroundColor: '#00000000',
    //     };
    //   }
    //   let targetColor = animatedThemeColor.value;
    //   if (animatedThemeColor.value.startsWith('#')) {
    //     targetColor = `${animatedThemeColor.value}33`;
    //   } else if (animatedThemeColor.value.startsWith('rgb(')) {
    //     let [r, g, b] = animatedThemeColor.value.slice(4, -1).split(',');
    //     targetColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
    //   } else if (animatedThemeColor.value.startsWith('rgba(')) {
    //     let [r, g, b] = animatedThemeColor.value.slice(5, -1).split(',');
    //     targetColor = `rgba(${r}, ${g}, ${b}, 0.2)`;
    //   }
    //   return {
    //     backgroundColor: interpolateColor(
    //       progressAnim.value,
    //       [0, 1],
    //       ['#00000000', targetColor],
    //     ),
    //   };
    // });
    const animatedTextColor = useSharedValue(
      record ? getModeTheme(record?.record.mode) : '#333333',
    );
    const animatedThemeColorStyle = useAnimatedStyle(() => ({
      borderColor: animatedThemeColor.value,
    }));
    const animatedTextColorStyle = useAnimatedStyle(() => ({
      color: animatedTextColor.value,
    }));

    useEffect(() => {
      animatedThemeColor.value = withTiming(
        record ? getModeTheme(record?.record.mode) : '#f5f5f5',
        { duration: 200 },
      );
      animatedTextColor.value = withTiming(
        record ? getModeTheme(record?.record.mode) : '#333333',
        { duration: 50 },
      );
    }, [record, animatedThemeColor, animatedTextColor]);

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
                animatedThemeColorStyle,
                // animatedProgressBgStyle
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
