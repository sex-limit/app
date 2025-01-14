import React, { useCallback, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';

interface CalendarDayProps {
  day: number;
  isChecked: boolean;
  isToday: boolean;
  onPress?: () => void;
}

export const CalendarDay = ({
  day,
  isChecked,
  isToday,
  onPress,
}: CalendarDayProps) => {
  const [scaleAnim] = useState(new Animated.Value(1));
  const [progressAnim] = useState(new Animated.Value(0));

  const handlePress = useCallback(() => {
    if (isChecked) {
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
      Animated.sequence([
        Animated.timing(progressAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start();
    }

    onPress?.();
  }, [onPress, scaleAnim, progressAnim, isChecked]);

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
        {isChecked && (
          <Animated.View
            className="absolute h-12 w-12 rounded-full border border-[#8AB86E]"
            style={{
              backgroundColor: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  'rgba(138, 184, 110, 0)',
                  'rgba(138, 184, 110, 0.2)',
                ],
              }),
            }}
          />
        )}
        {isToday && !isChecked && (
          <View className="absolute h-12 w-12 rounded-full bg-[#f5f5f5]" />
        )}
        <Text
          className={`text-base ${isChecked ? 'text-[#8AB86E]' : 'text-[#333333]'}`}
        >
          {day}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};
