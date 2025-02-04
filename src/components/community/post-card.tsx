import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Image,
  type StyleProp,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import { Portal } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { toRelativeDate } from '@/utils/date';

interface PostCardAvatarProps {
  user: User;
  updateAt: string;
}

const PostCardAvatar = ({ user, updateAt }: PostCardAvatarProps) => {
  const date = toRelativeDate(new Date(updateAt));
  return (
    <View className="flex-row items-center">
      <Image source={{ uri: user.avatar }} className="h-10 w-10 rounded-full" />
      <View className="ml-3">
        <Text className="font-medium">{user.username}</Text>
        <Text className="text-gray-500">{date}</Text>
      </View>
    </View>
  );
};

interface PopoverButtonProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const PopoverButton = ({
  children,
  trigger,
  className,
  style,
}: PopoverButtonProps) => {
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef<View>(null);
  const menuRef = useRef<View>(null);

  const menuOffset = useSharedValue({ x: 0, y: 0 });
  const onTriggerLayout = useCallback(() => {
    Promise.all([
      new Promise<Layout>((resolve) => {
        triggerRef.current?.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }),
      new Promise<Layout>((resolve) => {
        menuRef.current?.measureInWindow((x, y, width, height) => {
          resolve({ x, y, width, height });
        });
      }),
    ]).then(([trigger, menu]) => {
      const x = trigger.x + trigger.width - menu.width - 6;
      const y = trigger.y + trigger.height + 6;
      menuOffset.set({ x, y });
    });
  }, [menuOffset]);

  const menuOffsetStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: menuOffset.value.x },
        { translateY: menuOffset.value.y },
      ],
    };
  });

  useEffect(() => {
    if (visible) {
      onTriggerLayout();
    }
  }, [onTriggerLayout, visible]);

  const menuOpacity = useSharedValue(0);

  const menuOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: menuOpacity.value,
    };
  });

  useEffect(() => {
    if (visible) {
      menuOpacity.set(withDelay(25, withTiming(1, { duration: 0 })));
    } else {
      menuOpacity.set(withDelay(25, withTiming(0, { duration: 0 })));
    }
  }, [menuOpacity, visible]);

  return (
    <View className="z-10">
      <TouchableOpacity
        onPress={() => setVisible(true)}
        className={className}
        style={style}
        ref={triggerRef}
      >
        {trigger}
      </TouchableOpacity>
      <Portal>
        <Animated.View
          style={[
            menuOpacityStyle,
            {
              pointerEvents: visible ? 'auto' : 'none',
            },
          ]}
        >
          <View
            className="absolute h-screen w-screen"
            onTouchStart={() => setVisible(false)}
          ></View>
          <Animated.View
            className="absolute"
            style={[menuOffsetStyle]}
            ref={menuRef}
          >
            <View>{children}</View>
          </Animated.View>
        </Animated.View>
      </Portal>
    </View>
  );
};

interface PostCardHeaderProps {
  user: User;
  children?: React.ReactNode;
}

const PostCardHeader = ({ user, children }: PostCardHeaderProps) => {
  const [isFollowed, setIsFollowed] = useState(user.followed);

  return (
    <View className="mb-3 flex-row items-center justify-between">
      {children}
      <View className="flex-row items-center">
        {isFollowed ? (
          <TouchableOpacity
            onPress={() => setIsFollowed(!isFollowed)}
            className="h-8 flex-row items-center justify-center rounded-lg bg-neutral-400 px-4"
          >
            <Text className="text-sm text-white">已关注</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setIsFollowed(!isFollowed)}
            className="h-8 flex-row items-center justify-center rounded-lg bg-[#84AB62] px-4"
          >
            <MaterialCommunityIcons name="plus" size={16} color="white" />
            <Text className="ml-1 text-sm text-white">关注</Text>
          </TouchableOpacity>
        )}
        <PopoverButton
          className="ml-2 p-2"
          trigger={<Icon name="dots-horizontal" size={20} color="#666" />}
        >
          <View className="rounded-lg bg-white shadow-lg">
            <TouchableOpacity className="w-full px-6 py-4">
              <Text className="w-full text-gray-600">举报</Text>
            </TouchableOpacity>
          </View>
        </PopoverButton>
      </View>
    </View>
  );
};

export const PostCard = () => {
  const postData: IPost = {
    id: 1,
    createAt: '2025-2-2 22:22',
    updateAt: '2025-2-3 11:14',
    title: '美好的一天,从拥抱阳光开始',
    body: '每一天都是一个全新的开始，深呼吸，从头再来。',
    imgs: [
      'https://placekittens.com/150/150',
      'https://placekittens.com/151/150',
      'https://placekittens.com/152/150',
    ],
    favoriteCounts: 99,
    user: {
      id: 1,
      createAt: '2025-2-2 22:22',
      username: '自己吓自己',
      avatar: 'https://placekittens.com/50/50',
      followed: false,
    },
    tags: [],
    isLiked: false,
    commentCounts: 173,
    ip_location: '上海市闵行区·上海交通大学',
    shareCounts: 5,
  };

  return (
    <View className="mb-2 bg-white">
      <View className="p-4">
        <PostCardHeader user={postData.user}>
          <PostCardAvatar user={postData.user} updateAt={postData.updateAt} />
        </PostCardHeader>
        <Text className="mb-3 text-lg">{postData.title}</Text>
        <Text className="mb-3 text-gray-600">{postData.body}</Text>

        <View className="mb-3 flex-row">
          {postData.imgs.map((img, index) => (
            <Image
              key={index}
              source={{ uri: img }}
              className="h-24 w-24 rounded-lg"
            />
          ))}
        </View>

        <View className="mb-3 flex-row items-center">
          <Icon name="map-marker-outline" size={16} color="#666" />
          <Text className="ml-1 text-gray-600">{postData.ip_location}</Text>
        </View>

        <View className="flex-row justify-around border-t border-gray-100 pt-3">
          <View className="flex-row items-center">
            <Icon name="heart-outline" size={20} color="#666" />
            <Text className="ml-1 text-gray-600">
              {postData.favoriteCounts}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="comment-outline" size={20} color="#666" />
            <Text className="ml-1 text-gray-600">{postData.commentCounts}</Text>
          </View>
          <View className="flex-row items-center">
            <Icon name="share-outline" size={20} color="#666" />
            <Text className="ml-1 text-gray-600">{postData.shareCounts}</Text>
          </View>
        </View>
      </View>

      <View className="border-t border-gray-100 px-4 py-3">
        <Text className="text-gray-500">
          共 {postData.commentCounts} 条评论
        </Text>
        <View className="mt-2">
          <View className="mb-2 flex-row">
            <Image
              source={{ uri: 'https://placekittens.com/40/40' }}
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
};
