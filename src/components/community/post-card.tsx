import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
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

import { EmojiPicker } from '@/ui/emojiPicker';
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

interface PostCardActionPropsBase {
  id: number;
}

interface PostFavoriteActionProps extends PostCardActionPropsBase {
  favoriteCount: number;
  isLiked: boolean;
}

const PostFavoriteAction = ({
  favoriteCount,
  isLiked,
}: PostFavoriteActionProps) => {
  const [favorite, setFavorite] = useState(favoriteCount);
  const [liked, setLiked] = useState(isLiked);

  useEffect(() => {
    setFavorite(favoriteCount);
  }, [favoriteCount, setFavorite]);
  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked, setLiked]);

  return (
    <View className="flex-row items-center">
      <Icon
        name={liked ? 'heart' : 'heart-outline'}
        size={20}
        color={liked ? '#F87171' : '#666'}
        onPress={() => {
          setLiked(!liked);
          setFavorite(liked ? favorite - 1 : favorite + 1);
        }}
      />
      <Text className="ml-1 text-gray-600">{favorite}</Text>
    </View>
  );
};

interface PostShareActionProp extends PostCardActionPropsBase {
  shareCount: number;
}

const PostShareAction = ({ shareCount }: PostShareActionProp) => {
  return (
    <View className="flex-row items-center">
      <Icon name="share-outline" size={20} color="#666" />
      <Text className="ml-1 text-gray-600">{shareCount}</Text>
    </View>
  );
};

interface PostCommentActionProps extends PostCardActionPropsBase {
  commentCount: number;
  onTriggerComment: (id: number) => void;
}

const PostCommentAction = ({
  id,
  commentCount,
  onTriggerComment,
}: PostCommentActionProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center"
      onPress={() => onTriggerComment(id)}
    >
      <Icon name="comment-outline" size={20} color="#666" />
      <Text className="ml-1 text-gray-600">{commentCount}</Text>
    </TouchableOpacity>
  );
};

function generateMockComments(count: number, withReply = true) {
  const candidateBody = [
    '哥们加油💪，你可以',
    '加油，你也可以的',
    '你是最棒的',
    'Distinctio repellendus distinctio voluptatem.',
    'Ea ullam quia accusantium.',
    'Eius repellat maiores corrupti.',
    'Et quo rerum vitae ipsam. Voluptatem omnis velit. Sint eos omnis voluptatem voluptate quod rerum. Consectetur qui delectus repellendus quae dolore unde molestiae. Consectetur debitis libero eum voluptas.',
    'Ipsam illo vero nesciunt perferendis ut iusto saepe. Autem voluptatem labore rerum consequatur reprehenderit molestias ab non. Ipsum ducimus similique quos eius ut nisi.',
    'Quis sunt ut rerum et sint nam rerum qui. Eum tempore earum est molestias aut iure. Labore distinctio quae maxime ipsam ut porro vitae. Rerum in reprehenderit fuga ipsam tempore ea soluta. Commodi et fuga et et. Fugiat aut optio sit magni.',
  ];
  const candidateUserName = ['Alice', 'Bob', 'Charlie', 'David', 'Eve'];
  const candidateLocation = ['上海', '北京', '杭州', '合肥', '南京'];
  const comments: IPostCommentListItem[] = [];
  let replies: IPostCommentReplyItem[] = [];
  for (let i = 0; i < count; i++) {
    const favoriteCounts = Math.floor(Math.random() * 10);
    if (withReply) {
      let temp = generateMockComments(
        Math.floor(Math.random() * favoriteCounts),
        false,
      );
      replies = temp.map((reply) => {
        return {
          ...reply,
          replyTo:
            Math.random() > 0.5
              ? user
              : temp[Math.floor(Math.random() * temp.length)].user,
        };
      });
    }
    const user = {
      id: i,
      createAt: new Date(Date.now() - i * 1000).toISOString(),
      username: candidateUserName[i % candidateUserName.length],
      avatar: 'https://placekittens.com/40/40',
      followed: false,
    };
    const comment: IPostCommentListItem = {
      id: i.toString(),
      createAt: new Date(Date.now() - i * 1000000000).toISOString(),
      body: candidateBody[i % candidateBody.length],
      ip_location: candidateLocation[i % candidateLocation.length],
      favoriteCounts,
      user,
      isLiked: false,
      repliesCount: 0,
      replies: replies,
    };
    comments.push(comment);
  }
  return comments;
}

// trigger more and fold
interface PostCommentMoreProps {
  onTriggerMore: () => void;
  onFold: () => void;
  total: number;
  visibleCount: number;
  defaultVisibleCount: number;
}

const PostCommentMore = ({
  onTriggerMore,
  onFold,
  total,
  visibleCount,
  defaultVisibleCount,
}: PostCommentMoreProps) => {
  return (
    <View className="mt-2 flex-row items-center justify-start gap-5 pl-10">
      {visibleCount < total && (
        <TouchableOpacity
          onPress={() => onTriggerMore()}
          className="flex-row items-center justify-center"
        >
          <Text style={{ color: '#153663' }} className="font-bold">
            展开 {total - visibleCount} 条回复
          </Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={16}
            color="#153663"
          />
        </TouchableOpacity>
      )}
      {visibleCount > defaultVisibleCount && (
        <TouchableOpacity
          onPress={() => onFold()}
          className="flex-row items-center justify-center"
        >
          <Text style={{ color: '#153663' }} className="font-bold">
            收起
          </Text>
          <MaterialCommunityIcons name="chevron-up" size={16} color="#153663" />
        </TouchableOpacity>
      )}
    </View>
  );
};

type PostCommentItemProps =
  | {
      type: 'comment';
      comment: IPostCommentListItem;
    }
  | {
      type: 'reply';
      comment: IPostCommentReplyItem;
    };

const PostCommentItem = ({ type, comment }: PostCommentItemProps) => {
  const defaultVisibleCount = 2;
  const [visibleCount, setVisibleCount] = useState(defaultVisibleCount);

  return (
    <View>
      <View className="mb-2 flex-row">
        {type === 'comment' ? (
          <Image
            source={{ uri: comment.user.avatar }}
            className="h-9 w-9 rounded-full"
          />
        ) : (
          <Image
            source={{ uri: comment.user.avatar }}
            className="h-6 w-6 rounded-full"
          />
        )}
        <View className="ml-3 flex-1">
          <Text className="text-neutral-500">{comment.user.username}</Text>
          <Text
            className="mt-1 text-base"
            style={{
              lineHeight: 24,
            }}
          >
            <Text className=" text-base text-neutral-700">{comment.body} </Text>
            <View
              className="flex-row items-center gap-2"
              style={{
                transform: [{ translateY: 4 }],
                minWidth: 200,
              }}
            >
              <Text className="text-sm text-neutral-400">
                {toRelativeDate(new Date(comment.createAt))}
              </Text>
              <Text className="text-sm text-neutral-400">
                {comment.ip_location}
              </Text>
              <TouchableOpacity>
                <Text className="text-sm text-neutral-600">回复</Text>
              </TouchableOpacity>
            </View>
          </Text>
        </View>
        <View className="ml-3 flex-col items-center gap-1">
          <TouchableOpacity>
            <Icon
              name={comment.isLiked ? 'heart' : 'heart-outline'}
              size={20}
              color={comment.isLiked ? '#F87171' : '#525252'}
            />
          </TouchableOpacity>
          <Text className="text-sm text-neutral-600">
            {comment.favoriteCounts}
          </Text>
        </View>
      </View>
      {type === 'comment' && (
        <View style={{ paddingLeft: 42 }}>
          {comment.replies.length > 0 &&
            comment.replies.map(
              (reply, index) =>
                index < visibleCount && (
                  <PostCommentItem key={index} type="reply" comment={reply} />
                ),
            )}
          <PostCommentMore
            total={comment.replies.length}
            visibleCount={visibleCount}
            defaultVisibleCount={defaultVisibleCount}
            onTriggerMore={() => setVisibleCount((prev) => prev + 4)}
            onFold={() => setVisibleCount(defaultVisibleCount)}
          />
          <View className="mb-3 mt-1">
            <View className="border-t border-neutral-200 " />
          </View>
        </View>
      )}
    </View>
  );
};

const commentsData = generateMockComments(10);
const PostComments = () => {
  const defaultVisibleCount = 2;
  const [visibleCount, setVisibleCount] = useState(defaultVisibleCount);
  return (
    <View className="pt-2">
      <View>
        {commentsData.map(
          (comment, index) =>
            visibleCount > index && (
              <PostCommentItem key={index} type="comment" comment={comment} />
            ),
        )}
      </View>
      <PostCommentMore
        total={commentsData.length}
        visibleCount={visibleCount}
        defaultVisibleCount={defaultVisibleCount}
        onTriggerMore={() => setVisibleCount((prev) => prev + 4)}
        onFold={() => setVisibleCount(defaultVisibleCount)}
      />
    </View>
  );
};

interface PostReplyBottomSheetMethods {
  open: (
    type: 'comment' | 'reply',
    id: string,
    replyTo?: User,
    refContent?: string,
  ) => void;
  close: () => void;
}

interface PostReplyBottomSheetProps {
  onSend: (type: 'comment' | 'reply', id: string, content: string) => void;
}

const PostReplyBottomSheet = forwardRef<
  PostReplyBottomSheetMethods,
  PostReplyBottomSheetProps
>(({ onSend }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const [type, setType] = useState<'comment' | 'reply'>('comment');
  const [id, setId] = useState('');
  const [replyTo, setReplyTo] = useState<User | undefined>();
  const [refContent, setRefContent] = useState<string>();
  const [content, setContent] = useState('');

  const open = useCallback(
    (
      type: 'comment' | 'reply',
      id: string,
      replyTo?: User,
      refContent?: string,
      // eslint-disable-next-line max-params
    ) => {
      console.log('open', type, id, replyTo, refContent);
      setType(type);
      setId(id);
      setReplyTo(replyTo);
      setRefContent(
        refContent ||
          'Blanditiis inventore labore eveniet quia corrupti ex voluptatem omnis.',
      );
      setContent('');
      bottomSheetModalRef.current?.present();
    },
    [],
  );

  const close = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  const onSendComment = useCallback(() => {
    onSend(type, id, content);
    bottomSheetModalRef.current?.dismiss();
  }, [content, id, onSend, type]);

  return (
    <BottomSheetModal
      index={0}
      ref={bottomSheetModalRef}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enableDynamicSizing={false}
      enableContentPanningGesture={false}
      snapPoints={[500]}
      backdropComponent={() => (
        <View className="absolute h-screen w-screen bg-black/30" />
      )}
      backgroundStyle={{
        borderRadius: 0,
      }}
      handleComponent={() => (
        <View className="flex-row items-center justify-between gap-2 rounded-t-2xl bg-neutral-100 px-4 ">
          <View className="flex-1 flex-row items-center justify-start py-1">
            <Text className="text-neutral-500">回复 </Text>
            {replyTo && (
              <>
                <Text className="text-neutral-500">@</Text>
                <Text className="text-neutral-500">{replyTo?.username}</Text>
              </>
            )}
            {refContent && (
              <Text
                className="flex-1 overflow-hidden text-neutral-500"
                numberOfLines={1}
              >
                : {refContent}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={close} className="p-1">
            <MaterialCommunityIcons name="close" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      )}
    >
      <BottomSheetView className="px-4 py-2">
        <EmojiPicker.Provider
          isExpanded={true}
          onEmojiSelected={() => {}}
          onToggleExpand={() => {}}
        >
          <View className="mb-4 flex-row items-stretch">
            <BottomSheetTextInput
              value={content}
              onChangeText={setContent}
              placeholder="发一条友善的评论吧 ~"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              style={{
                lineHeight: 20,
                height: 100 + 20,
                padding: 10,
              }}
              className="rounded-lg bg-[#EBEBEB]"
            />
            <View className="rounded-r-full bg-neutral-100 px-5 pl-2 text-base">
              <EmojiPicker.Toggler size={24} padding={8} />
            </View>
          </View>
          <EmojiPicker.Picker />
        </EmojiPicker.Provider>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

interface PostReactionProps
  extends PostFavoriteActionProps,
    PostShareActionProp {
  author: User;
  commentCount: number;
}

const PostReaction = ({
  id,
  favoriteCount,
  isLiked,
  commentCount,
  shareCount,
  author,
}: PostReactionProps) => {
  const [commentVisible, setCommentVisible] = useState(true);
  const postReplyBottomSheetRef = useRef<PostReplyBottomSheetMethods>(null);
  const handleTriggerComment = () => {
    postReplyBottomSheetRef.current?.open('comment', id.toString(), author);
  };
  return (
    <>
      <View className="mb-2 flex-row justify-around border-t border-gray-100 pt-3">
        <View className="flex-1 basis-1 items-center">
          <PostFavoriteAction
            id={id}
            favoriteCount={favoriteCount}
            isLiked={isLiked}
          />
        </View>
        <View className="flex-1 basis-1 items-center">
          <PostCommentAction
            id={id}
            commentCount={commentCount}
            onTriggerComment={handleTriggerComment}
          />
        </View>
        <View className="flex-1 basis-1 items-center">
          <PostShareAction id={id} shareCount={shareCount} />
        </View>
      </View>
      <View className="border-t border-gray-100 px-4 py-3">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className=" text-gray-500">共 {commentCount} 条评论</Text>
          <TouchableOpacity
            onPress={() => setCommentVisible(!commentVisible)}
            className="ml-2 flex-row items-center"
          >
            {commentVisible ? (
              <>
                <Text className="text-gray-500">收起</Text>
                <MaterialCommunityIcons
                  name="chevron-up"
                  size={16}
                  color="#666"
                />
              </>
            ) : (
              <>
                <Text className="text-gray-500">展开</Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={16}
                  color="#666"
                />
              </>
            )}
          </TouchableOpacity>
        </View>
        {commentVisible && <PostComments />}
      </View>
      <PostReplyBottomSheet
        onSend={(...args) => console.log(args)}
        ref={postReplyBottomSheetRef}
      />
    </>
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
    <View className=" bg-white">
      <View className="p-4">
        <PostCardHeader user={postData.user}>
          <PostCardAvatar user={postData.user} updateAt={postData.updateAt} />
        </PostCardHeader>
        <Text className="mb-3 text-lg">{postData.title}</Text>
        <Text className="mb-3 text-gray-600">{postData.body}</Text>

        <View className="mb-3 flex-row gap-3">
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
      </View>

      <PostReaction
        id={postData.id}
        favoriteCount={postData.favoriteCounts}
        isLiked={postData.isLiked}
        commentCount={postData.commentCounts}
        shareCount={postData.shareCounts}
        author={postData.user}
      />
    </View>
  );
};
