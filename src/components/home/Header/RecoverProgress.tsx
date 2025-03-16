import { View, Text } from "react-native"
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
type CountdownProps = {
  startDate: string;
};

const Countdown: React.FC<CountdownProps> = ({ startDate }) => {
  const [days, setDays] = useState(0);
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const startTime = new Date(startDate).getTime();

    const updateCounter = () => {
      const now = new Date().getTime();
      const diff = now - startTime;

      // Calculate days, hours, minutes, seconds
      const dayCount = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setDays(dayCount);
      setTimeString(`${hours}小时${minutes}分钟${seconds}秒`);
    };

    // Update immediately
    updateCounter();

    // Set interval to update every second
    const interval = setInterval(updateCounter, 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [startDate]);

  return (
    <View className={'gap-y-1'}>
      <Text className="text-primary font-medium">已经戒色</Text>
      <Text className="mt-2 text-5xl font-bold text-black">{days} 天</Text>
      <View className="rounded-full bg-gray-100 px-4 py-2">
        <Text className="text-center text-primary">{timeString}</Text>
      </View>
    </View>
  );
};

const HomeScreenRecoverProgress: React.FC = () => {
  return (
    <View className="mx-4 mt-6 rounded-3xl bg-white p-6">
      <View className="flex-row items-center justify-between">
        <Countdown startDate="2024-04-19" />
        <AnimatedCircularProgress
          size={100}
          width={6}
          fill={40}
          tintColor={'#000'}
          rotation={0}
          backgroundColor="#E6E6E6">
          {
            () => (
              <MaterialIcons name={'energy-savings-leaf'} size={24} color={'#000'} />
            )
          }
        </AnimatedCircularProgress>
      </View>
    </View>
  )
}

export default HomeScreenRecoverProgress;