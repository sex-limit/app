import React, { useCallback } from 'react';
import {
  type StyleProp,
  Text,
  type TextStyle,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface CalendarDayProps {
  day: number;
  isChecked: boolean;
  isToday: boolean;
  onPress?: () => void;
  animatedThemeColorStyle: StyleProp<ViewStyle>;
  animatedTextColorStyle: StyleProp<TextStyle>;
}

export const CalendarDay = ({
  day,
  isChecked,
  isToday,
  onPress,
  animatedThemeColorStyle,
  animatedTextColorStyle,
}: CalendarDayProps) => {
  const scaleAnim = useSharedValue(1);
  const progressAnim = useSharedValue(0);

  const handlePress = useCallback(() => {
    if (isChecked) {
      scaleAnim.value = withSequence(
        withTiming(0.8, { duration: 100 }),
        withTiming(1, { duration: 100 }),
      );
    } else {
      progressAnim.value = withTiming(1, { duration: 300 });
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
        {isToday && !isChecked && (
          <View className="absolute h-12 w-12 rounded-full bg-[#f5f5f5]" />
        )}
        {isChecked ? (
          <Animated.Text className="text-base" style={[animatedTextColorStyle]}>
            {day}
          </Animated.Text>
        ) : (
          <Text className="text-base text-[#333333]">{day}</Text>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};
