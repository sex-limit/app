import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Reusable components
const StatItem = ({ value, label }: { value: string; label: string }) => (
  <View className="items-center">
    <Text className="text-[20px] font-medium text-black">{value}</Text>
    <Text className="mt-1 text-xs text-[#999999]">{label}</Text>
  </View>
);

const TabItem = ({
  icon,
  label,
  badge,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: number;
  active?: boolean;
}) => (
  <TouchableOpacity className="items-center px-4">
    <View className="relative">
      {icon}
      {badge && (
        <View className="absolute -right-2 -top-1 h-4 w-4 items-center justify-center rounded-full bg-red-500">
          <Text className="text-xs text-white">{badge}</Text>
        </View>
      )}
    </View>
    <Text
      className={`mt-1 text-xs ${active ? 'text-black' : 'text-[#999999]'}`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const ContentTabItem = ({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) => (
  <Pressable className="flex-1">
    <View
      className={`border-b-2 py-3 ${
        active ? 'border-black' : 'border-transparent'
      }`}
    >
      <Text
        className={`text-center text-sm ${
          active ? 'font-medium text-black' : 'text-[#999999]'
        }`}
      >
        {label}
      </Text>
    </View>
  </Pressable>
);

const VideoItem = ({ views, index }: { views: number; index: number }) => (
  <View className="w-1/3 p-0.5">
    <View className="relative aspect-[3/4] bg-gray-100">
      <View className="absolute bottom-2 left-2 flex-row items-center">
        <FontAwesome name="play" size={12} color="white" />
        <Text className="ml-1 text-white">{views}万</Text>
      </View>
    </View>
  </View>
);

export default function ProfilePage() {
  return (
    <View className="flex-1 bg-white">
      {/* Cover Image */}
      <ImageBackground className="h-[200px] w-full bg-gray-200">
        <SafeAreaView edges={['top']} className="flex-1">
          <View className="mt-4 flex-row items-center justify-between px-4">
            <TouchableOpacity className="flex-row items-center rounded-full bg-black/30 px-3 py-1.5">
              <FontAwesome name="user-plus" size={16} color="white" />
              <Text className="ml-1 text-white">添加朋友</Text>
            </TouchableOpacity>
            <View className="flex-row gap-4">
              <TouchableOpacity className="rounded-full bg-black/30 p-2">
                <FontAwesome name="users" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="rounded-full bg-black/30 p-2">
                <FontAwesome name="search" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity className="rounded-full bg-black/30 p-2">
                <FontAwesome name="bars" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>

      {/* Profile Info */}
      <View className="-mt-16 px-4">
        <View className="h-[84px] w-[84px] rounded-2xl bg-gray-100" />
        <View className="mt-3">
          <Text className="text-xl font-bold">The Milky Way</Text>
          <Text className="mt-1 text-sm text-[#999999]">
            抖音号：tiktok_frontend_部
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View className="mt-4 flex-row justify-around px-4">
        <StatItem value="1477" label="获赞" />
        <StatItem value="55" label="互关" />
        <StatItem value="357" label="关注" />
        <StatItem value="99" label="粉丝" />
      </View>

      {/* Edit Profile Button */}
      <View className="mt-4 px-4">
        <TouchableOpacity className="rounded-md border border-[#e0e0e0] px-4 py-2">
          <Text className="text-center">编辑主页</Text>
        </TouchableOpacity>
      </View>

      {/* User Info Tags */}
      <View className="mt-4 flex-row flex-wrap gap-2 px-4">
        <View className="flex-row items-center rounded-full bg-[#f5f5f5] px-3 py-1">
          <FontAwesome name="mars" size={14} color="#666" />
          <Text className="ml-1 text-sm text-[#666666]">21岁</Text>
        </View>
        <View className="rounded-full bg-[#f5f5f5] px-3 py-1">
          <Text className="text-sm text-[#666666]">埃塞俄比亚</Text>
        </View>
        <TouchableOpacity className="rounded-full bg-[#f5f5f5] px-3 py-1">
          <Text className="text-sm text-[#666666]">+ 添加学校等标签</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-6 border-b border-[#f0f0f0]"
      >
        <TabItem
          icon={<FontAwesome name="shopping-bag" size={24} color="#666" />}
          label="团购带货"
        />
        <TabItem
          icon={<FontAwesome name="tv" size={24} color="#666" />}
          label="主播中心"
        />
        <TabItem
          icon={<FontAwesome name="shopping-cart" size={24} color="#666" />}
          label="抖音商城"
        />
        <TabItem
          icon={<FontAwesome name="history" size={24} color="#666" />}
          label="观看历史"
        />
        <TabItem
          icon={<FontAwesome name="th" size={24} color="#666" />}
          label="全部功能"
        />
      </ScrollView>

      {/* Content Tabs */}
      <View className="flex-row border-b border-[#f0f0f0]">
        <ContentTabItem label="作品" active />
        <ContentTabItem label="私密" />
        <ContentTabItem label="推荐" />
        <ContentTabItem label="收藏" />
        <ContentTabItem label="喜欢" />
      </View>

      {/* Video Grid */}
      <ScrollView>
        <View className="flex-row flex-wrap">
          {[2.1, 1.1, 1.5, 2.2, 1.7].map((views, index) => (
            <VideoItem key={index} views={views} index={index} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
