import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PostCard = () => (
  <TouchableOpacity className="mb-2 bg-white p-4">
    <View className="mb-3 flex-row items-center">
      <Image
        source={{ uri: 'https://placekitten.com/50/50' }}
        className="h-8 w-8 rounded-full"
      />
      <View className="flex-1 flex-row items-center">
        <View className="ml-2">
          <Text className="text-sm font-bold">坚持戒断一年计划</Text>
          <View className="mt-1 rounded bg-gray-100 px-2 py-0.5">
            <Text className="text-xs text-gray-500">挑战中</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity>
        <Icon name="comment-outline" size={20} color="#666" />
      </TouchableOpacity>
    </View>
    <Text className="mb-2 text-base">
      每一天都是一个全新的开始，深呼吸，从头再来。人生在世·及时行乐。
    </Text>
    <View className="flex-row items-center justify-between">
      <Text className="text-gray-400">2024-11-12 23:00</Text>
      <View className="flex-row items-center">
        <View className="mr-4 flex-row items-center">
          <Icon name="heart-outline" size={16} color="#666" />
          <Text className="ml-1 text-gray-500">99</Text>
        </View>
        <View className="flex-row items-center">
          <Icon name="star-outline" size={16} color="#666" />
          <Text className="ml-1 text-gray-500">88</Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const CommunityScreen = () => {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* 顶部导航栏 */}
      <View className="flex-row items-center justify-between bg-white px-4 py-2">
        <Icon name="cog-outline" size={24} color="#666" />
        <View className="flex-row space-x-4">
          <Text className="text-base">帖子</Text>
          <Text className="border-b-2 border-green-600 text-base text-green-600">
            计划
          </Text>
        </View>
        <View className="flex-row items-center">
          <Icon name="map-marker-outline" size={24} color="#666" />
          <Text className="ml-1">上海</Text>
        </View>
      </View>

      {/* 搜索栏 */}
      <View className="flex-row bg-white px-4 py-2">
        <View className="flex-1 flex-row">
          <TouchableOpacity className="border-r border-gray-200 px-3 py-1">
            <Text className="text-green-600">最新</Text>
          </TouchableOpacity>
          <TouchableOpacity className="px-3 py-1">
            <Text className="text-gray-400">历史最热</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center rounded-full bg-gray-100 px-4 py-1">
          <Icon name="magnify" size={20} color="#999" />
          <TextInput
            placeholder="请搜索"
            className="ml-2 flex-1"
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* 帖子列表 */}
      <ScrollView className="flex-1">
        <PostCard />
        <PostCard />
        <PostCard />
        <PostCard />
      </ScrollView>

      {/* 底部发布按钮 */}
      <TouchableOpacity
        className="absolute bottom-20 right-4 h-14 w-14 items-center justify-center rounded-full bg-green-600"
        style={{ elevation: 5 }}
      >
        <Icon name="pencil" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CommunityScreen;
