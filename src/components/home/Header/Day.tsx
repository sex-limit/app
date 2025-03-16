import React from 'react';
import { Pressable, View, Text, FlatList } from "react-native";

type DayProps = {
  day: string;
  date: string;
  isSelected?: boolean;
  onPress?: () => void;
};

const Day: React.FC<DayProps> = ({ day, date, isSelected, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <View className="items-center px-2">
        <Text className="text-xs text-gray-500">{day}</Text>
        <View
          className={`mt-1 h-8 w-8 items-center justify-center rounded-full ${isSelected ? 'bg-black' : 'bg-transparent'
            }`}
        >
          <Text className={`text-base font-medium ${isSelected ? 'text-white' : 'text-black'}`}>
            {date}
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

const HomeHeaderDay: React.FC = (props) => {
  const [selectedDay, setSelectedDay] = React.useState('19');

  // Generate more days to fill the screen width
  const generateDays = () => {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const result = [];

    // Past days
    for (let i = 12; i >= 1; i--) {
      const dayIndex = (days.length + (i % 7)) % 7;
      result.unshift({ day: days[dayIndex], date: `${i}` });
    }

    // Current and future days
    for (let i = 13; i <= 30; i++) {
      const dayIndex = (i - 1) % 7;
      result.push({
        day: days[dayIndex],
        date: `${i}`,
        isSelected: i === 19
      });
    }

    return result;
  };

  const daysOfWeek = generateDays();

  const handleDayPress = (date: string) => {
    setSelectedDay(date);
  };

  return (
    <View className="mt-4 w-full">
      <View className="flex-row items-center justify-between px-4 mb-2">
        <Text className="text-base font-semibold">April 2023</Text>
        <View className="flex-row">
          <Pressable className="mr-2 px-2 py-1 bg-gray-100 rounded-md">
            <Text className="text-sm">Today</Text>
          </Pressable>
          <Pressable className="px-2 py-1 bg-gray-100 rounded-md">
            <Text className="text-sm">Month</Text>
          </Pressable>
        </View>
      </View>
      <FlatList
        data={daysOfWeek}
        renderItem={({ item }) => (
          <Day
            day={item.day}
            date={item.date}
            isSelected={item.date === selectedDay}
            onPress={() => handleDayPress(item.date)}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
        initialScrollIndex={15}
        getItemLayout={(data, index) => ({
          length: 40, // approximate width of each item
          offset: 40 * index,
          index,
        })}
        style={{ width: '100%' }}
      />
    </View>
  );
};

export default HomeHeaderDay;