import clsx from 'clsx';
import { Stack } from 'expo-router';
import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SceneMap, TabView } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PlanCard = () => (
  <TouchableOpacity className="mx-4 mb-3 overflow-hidden rounded-xl bg-white">
    <View className="relative">
      <Image
        source={{ uri: 'https://placekitten.com/400/200' }}
        className="h-[200px] w-full"
      />
      <View className="absolute left-3 top-3 flex-row items-center">
        <Image
          source={{ uri: 'https://placekitten.com/40/40' }}
          className="h-8 w-8 rounded-full border-2 border-white"
        />
        <View className="ml-2 rounded-full bg-black/50 px-2 py-1">
          <Text className="text-sm text-white">挑战中</Text>
        </View>
      </View>
      <TouchableOpacity className="absolute right-3 top-3 rounded-full bg-black/50 p-2">
        <Icon name="comment-outline" size={20} color="white" />
      </TouchableOpacity>
    </View>
    <View className="p-4">
      <Text className="mb-2 text-lg font-medium">坚持成就一年计划</Text>
      <Text className="mb-3 text-gray-600">
        每一天都是一个全新的开始，深呼吸，从头再来。人生在世，及时行乐。
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-gray-400">2024-11-12 23:00</Text>
        <View className="flex-row items-center gap-4">
          <View className="flex-row items-center">
            <Icon name="heart-outline" size={16} color="#666" />
            <Text className="ml-1 text-gray-600">99</Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="star-outline" size={16} color="#666" />
            <Text className="ml-1 text-gray-600">88</Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const PostCard = () => (
  <View className="mb-2 bg-white">
    <View className="p-4">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Image
            source={{ uri: 'https://placekitten.com/150/150' }}
            className="h-10 w-10 rounded-full"
          />
          <View className="ml-3 space-y-1">
            <Text className="font-medium">自己吓自己</Text>
            <Text className="text-gray-500">2天前</Text>
          </View>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="rounded-full bg-gray-900 px-4 py-1.5">
            <Text className="text-white">+ 关注</Text>
          </TouchableOpacity>
          <TouchableOpacity className="ml-2 p-2">
            <Icon name="dots-horizontal" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <Text className="mb-3 text-lg">美好的一天,从拥抱阳光开始</Text>
      <Text className="mb-3 text-gray-600">
        每一天都是一个全新的开始，深呼吸，从头再来。
      </Text>

      <View className="mb-3 flex-row">
        <Image
          source={{ uri: 'https://placekitten.com/150/150' }}
          className="h-24 w-24 rounded-lg"
        />
        <Image
          source={{ uri: 'https://placekitten.com/150/150' }}
          className="mx-2 h-24 w-24 rounded-lg"
        />
        <Image
          source={{ uri: 'https://placekitten.com/150/150' }}
          className="h-24 w-24 rounded-lg"
        />
      </View>

      <View className="mb-3 flex-row items-center">
        <Icon name="map-marker-outline" size={16} color="#666" />
        <Text className="ml-1 text-gray-600">上海市闵行区·上海交通大学</Text>
      </View>

      <View className="flex-row justify-between border-t border-gray-100 pt-3">
        <View className="flex-row items-center">
          <Icon name="heart-outline" size={20} color="#666" />
          <Text className="ml-1 text-gray-600">99</Text>
        </View>
        <View className="flex-row items-center">
          <Icon name="comment-outline" size={20} color="#666" />
          <Text className="ml-1 text-gray-600">100</Text>
        </View>
        <View className="flex-row items-center">
          <Icon name="share-outline" size={20} color="#666" />
          <Text className="ml-1 text-gray-600">100</Text>
        </View>
      </View>
    </View>

    <View className="border-t border-gray-100 px-4 py-3">
      <Text className="text-gray-500">共173条评论</Text>
      <View className="mt-2">
        <View className="mb-2 flex-row">
          <Image
            source={{ uri: 'https://placekitten.com/40/40' }}
            className="h-8 w-8 rounded-full"
          />
          <View className="ml-2 flex-1">
            <Text className="font-medium">海阔天空</Text>
            <Text className="text-gray-600">哥们加油💪，你可以</Text>
            <View className="mt-1 flex-row">
              <Text className="text-gray-400">1</Text>
              <Text className="mx-2 text-gray-400">·</Text>
              <TouchableOpacity>
                <Text className="text-gray-400">回复</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  </View>
);

const PostsRoute = () => (
  <ScrollView className="flex-1">
    <PostCard />
    <View className="h-2 bg-gray-100" />
    <PostCard />
  </ScrollView>
);

const PlansRoute = () => (
  <ScrollView className="flex-1 bg-gray-100 pt-3">
    <PlanCard />
    <PlanCard />
    <PlanCard />
    <PlanCard />
  </ScrollView>
);

const renderScene = SceneMap({
  posts: PostsRoute,
  plans: PlansRoute,
});

const CommunityScreen = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'posts', title: '帖子' },
    { key: 'plans', title: '计划' },
  ]);

  const renderHeader = () => (
    <View className="bg-white px-4 py-2">
      <View className="mb-4 flex-row items-center justify-between">
        <TouchableOpacity>
          <Icon name="cog-outline" size={24} color="#333" />
        </TouchableOpacity>
        <View className="flex-1 flex-row justify-center">
          {routes.map((route, i) => (
            <View key={route.key} className="relative mx-4">
              <TouchableOpacity
                onPress={() => setIndex(i)}
                className="flex flex-col items-center justify-center gap-[4px]"
              >
                <Text
                  className={clsx('text-center text-lg', {
                    'font-medium text-green-600': index === i,
                    'text-gray-600': index !== i,
                  })}
                >
                  {route.title}
                </Text>
                <View
                  className={clsx([
                    'bottom-1 h-0.5 w-6 bg-green-600',
                    {
                      'opacity-100': index === i,
                      'opacity-0': index !== i,
                    },
                  ])}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View className="flex-row items-center">
          <Icon name="map-marker" size={16} color="#666" />
          <Text className="ml-1">上海</Text>
        </View>
      </View>

      <View className="flex-row items-center rounded-full bg-gray-50 px-4 py-2">
        <Icon name="magnify" size={20} color="#666" />
        <TextInput
          placeholder="请搜索"
          className="ml-2 flex-1"
          placeholderTextColor="#999"
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      {renderHeader()}

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={() => null}
        style={{ backgroundColor: 'white' }}
      />
    </SafeAreaView>
  );
};

export default CommunityScreen;
