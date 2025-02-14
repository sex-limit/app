import React, { useCallback, useEffect } from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from 'react-native';

import { type CheckInRecord, getModeTheme } from '@/contexts/CheckInContext';

interface CalendarDayProps {
  day: number;
  record?: CheckInRecord;
  isToday: boolean;
  onToggleDay?: (day: number) => void;
}

const CalendarDay = ({
  day,
  record,
  isToday,
  onToggleDay,
}: CalendarDayProps) => {
  const scaleAnim = useAnimatedValue(1);
  const progressAnim = useAnimatedValue(0);

  const handlePress = useCallback(() => {
    if (record) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        progressAnim.setValue(0);
      });
    }

    onToggleDay?.(day);
  }, [record, onToggleDay, day, scaleAnim, progressAnim]);

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

  const themeColorAnim = useAnimatedValue(0);

  const themeBaseColor = '#f5f5f5';
  const themeColor = record
    ? getModeTheme(record?.record.mode)
    : themeBaseColor;
  const textColor = record ? getModeTheme(record?.record.mode) : '#333333';

  useEffect(() => {
    Animated.timing(themeColorAnim, {
      toValue: record ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [record, themeColorAnim]);

  if (!day) return <View className="h-12 w-12 flex-1" />;

  return (
    <TouchableOpacity
      className="w-13 h-14 flex-1 items-center justify-center"
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        className="relative h-12 w-12 items-center justify-center"
        style={{}}
      >
        {record && (
          <Animated.View
            className={`absolute h-12 w-12 rounded-full border `}
            style={[
              {
                borderColor: themeColor,
                opacity: themeColorAnim,
              },
            ]}
          />
        )}
        {isToday && !record && (
          <View className="absolute h-12 w-12 rounded-full bg-[#f5f5f5]" />
        )}
        {record ? (
          <Text
            className="text-base"
            style={[
              {
                color: textColor,
              },
            ]}
          >
            {day}
          </Text>
        ) : (
          <Text className="text-base text-[#333333]">{day}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export { CalendarDay };
