import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const HomeHeaderActions: React.FC = () => {
  return (
    <View className="mx-4 mt-4 flex-row gap-x-4">
      {/* Protein Card */}
      <View className="flex-1 rounded-3xl bg-white p-4">
        <Text className="text-lg font-medium">5月23日</Text>
        <Text className="text-sm text-gray-500">你可能会在以上时间退出戒色</Text>

        <View className="items-center justify-center mt-4">
          <AnimatedCircularProgress
            size={80}
            width={4}
            fill={75}
            tintColor="#FF6B6B"
            backgroundColor="#E6E6E6"
            rotation={0}>
            {() => (
              <FontAwesome5 name="clock" size={20} color="#FF6B6B" />
            )}
          </AnimatedCircularProgress>
        </View>
      </View>

      {/* Carbs Card */}
      <View className="flex-1 rounded-3xl bg-white p-4">
        <Text className="text-lg font-medium">今日状态</Text>
        <Text className="text-sm text-gray-500">不错哦</Text>

        <View className="items-center justify-center">
          <View className={'bg-[#F8F8FD] w-[84px] h-[84px] items-center justify-center rounded-full p-2'}>
            <Text className={'text-[50px]'}>😁</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default HomeHeaderActions;