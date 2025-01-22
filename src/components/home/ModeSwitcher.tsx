import { useCallback, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ModeSwitcher = () => {
  const [mode, setMode] = useState<'limit' | 'exhaustive'>('limit');
  const leftArrowOffset = useSharedValue(0);
  const rightArrowOffset = useSharedValue(0);

  const leftArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: leftArrowOffset.value }],
  }));

  const rightArrowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: rightArrowOffset.value }],
  }));

  const handleSwitchMode = useCallback(() => {
    leftArrowOffset.value = withSequence(
      withTiming(-2, { duration: 150 }),
      withTiming(0, { duration: 150 }),
    );
    rightArrowOffset.value = withSequence(
      withTiming(2, { duration: 150 }),
      withTiming(0, { duration: 150 }),
    );
    setMode(mode === 'limit' ? 'exhaustive' : 'limit');
  }, [mode, leftArrowOffset, rightArrowOffset, setMode]);

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      className="absolute bottom-[20px] left-1/2 z-20 -translate-x-1/2 flex-row items-center rounded-full bg-white px-4 py-2 shadow-sm"
      onPress={handleSwitchMode}
    >
      <View className="h-[15px] w-[15px]">
        <Animated.View style={leftArrowStyle}>
          <MaterialCommunityIcons
            name="arrow-left-thin"
            size={15}
            color="#666"
            className="absolute translate-x-[-3px] translate-y-[4px]"
          />
        </Animated.View>
        <Animated.View style={rightArrowStyle}>
          <MaterialCommunityIcons
            name="arrow-right-thin"
            size={15}
            color="#666"
            className="absolute translate-x-[3px] translate-y-[-2px]"
          />
        </Animated.View>
      </View>
      <Text className="ml-2">切换{mode === 'limit' ? '🪷' : '🦌'}模式</Text>
    </TouchableOpacity>
  );
};
