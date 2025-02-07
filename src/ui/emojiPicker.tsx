import { FlashList } from '@shopify/flash-list';
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  type LayoutChangeEvent,
  PanResponder,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import groupedEmojisJSON from 'unicode-emoji-json/data-by-group.json';

export interface Emoji {
  emoji: string;
  name: string;
  slug: string;
}

const EmojiVersionCap = 14.0;

// Group emojis to map slug to emojis
// and filter out newer emojis
const groupedEmojis = groupedEmojisJSON.reduce(
  (acc, curr) => {
    curr.emojis = curr.emojis.filter(
      (emoji) => parseFloat(emoji.emoji_version) <= EmojiVersionCap,
    );
    acc[curr.slug] = curr;
    return acc;
  },
  {} as Record<string, (typeof groupedEmojisJSON)[number]>,
);

interface EmojiItemProps {
  emoji: string;
  size: number;
  onPress: (emoji: string) => void;
}

const EmojiItem = React.memo(({ emoji, size, onPress }: EmojiItemProps) => {
  return (
    <TouchableOpacity className="m-auto p-1" onPress={() => onPress(emoji)}>
      <Text style={{ fontSize: size, margin: 'auto' }}>{emoji}</Text>
    </TouchableOpacity>
  );
});

const EMOJI_CATEGORIES = [
  {
    slug: 'smileys_emotion',
    icon: 'emoticon-happy-outline',
  },
  {
    slug: 'people_body',
    icon: 'human-greeting',
  },
  {
    slug: 'animals_nature',
    icon: 'dog',
  },
  {
    slug: 'food_drink',
    icon: 'food',
  },
  {
    slug: 'travel_places',
    icon: 'airplane',
  },
  {
    slug: 'activities',
    icon: 'basketball',
  },
  {
    slug: 'objects',
    icon: 'lightbulb-outline',
  },
  {
    slug: 'symbols',
    icon: 'heart-outline',
  },
  {
    slug: 'flags',
    icon: 'flag-outline',
  },
] as const;

interface EmojiTabsHeaderProps {
  activeTab: string;
  onTabChange: (slug: string, index: number) => void;
}

const EmojiTabsHeader: React.FC<EmojiTabsHeaderProps> = ({
  activeTab,
  onTabChange,
}) => {
  const handleTabChange = useCallback(
    (slug: string, index: number) => {
      onTabChange(slug, index);
    },
    [onTabChange],
  );
  return (
    <View className="flex-row justify-around border-b border-neutral-200">
      {EMOJI_CATEGORIES.map((category, index) => (
        <TouchableOpacity
          key={category.slug}
          onPress={() => handleTabChange(category.slug, index)}
          className={`my-1 rounded-md p-1`}
          style={{
            backgroundColor:
              activeTab === category.slug ? '#F0EFEE' : 'transparent',
          }}
        >
          <MaterialCommunityIcons
            name={category.icon}
            size={24}
            color={activeTab === category.slug ? '#84AB62' : '#666'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

interface EmojiListProps {
  slug: string;
  emojis: Emoji[];
  columns: number;
  onEmojiPress: (emoji: string) => void;
}

const EmojiList = React.memo(
  ({ emojis, columns, onEmojiPress }: EmojiListProps) => {
    const renderItem = useCallback(
      ({ item }: { item: Emoji }) => (
        <EmojiItem emoji={item.emoji} size={24} onPress={onEmojiPress} />
      ),
      [onEmojiPress],
    );

    const getItemType = useCallback(() => {
      return 'emoji';
    }, []);

    return (
      <FlashList
        className="flex-1"
        data={emojis}
        renderItem={renderItem}
        estimatedItemSize={32.4}
        numColumns={columns}
        keyExtractor={(item) => item.slug}
        getItemType={getItemType}
        contentContainerStyle={{
          paddingVertical: 8,
        }}
      />
    );
  },
);

interface EmojiTabsProps {
  columns: number;
  onEmojiPress: (emoji: string) => void;
}

const EmojiTabs: React.FC<EmojiTabsProps> = ({ columns, onEmojiPress }) => {
  const [activeTab, setActiveTab] = useState('smileys_emotion');
  const containerRef = useRef<View>(null);
  const width = useSharedValue(Dimensions.get('window').width);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (containerRef.current) {
        width.value = event.nativeEvent.layout.width;
      }
    },
    [width],
  );

  const translateX = useSharedValue(0);
  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const [activeIndex, setActiveIndex] = useState(0);

  const [visitedTabs, setVisitedTabs] = useState<boolean[]>(
    Array.from({ length: EMOJI_CATEGORIES.length }, (_, i) => i === 0),
  );

  const handleSetActiveTab = useCallback(
    (index: number) => {
      setActiveTab(EMOJI_CATEGORIES[index].slug);
      setActiveIndex(index);
      if (!visitedTabs[index]) {
        setVisitedTabs((prev) => {
          prev[index] = true;
          return [...prev];
        });
      }
    },
    [visitedTabs],
  );

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
        },
        onPanResponderMove: (_, gestureState) => {
          const newTranslateX = -activeIndex * width.value + gestureState.dx;
          translateX.value = newTranslateX;
        },
        onPanResponderEnd: (_, gestureState) => {
          const currentIndex = activeIndex;
          const swipeThreshold = width.value / 5;

          let newIndex = currentIndex;

          if (Math.abs(gestureState.dx) > swipeThreshold) {
            if (gestureState.dx > 0 && currentIndex > 0) {
              newIndex = currentIndex - 1;
            } else if (
              gestureState.dx < 0 &&
              currentIndex < EMOJI_CATEGORIES.length - 1
            ) {
              newIndex = currentIndex + 1;
            }
          }

          handleSetActiveTab(newIndex);
          translateX.value = withTiming(-newIndex * width.value, {
            duration: 300,
          });
        },
      }),
    [activeIndex, width.value, translateX, handleSetActiveTab],
  );

  const handleTabChange = useCallback(
    (slug: string, index: number) => {
      handleSetActiveTab(index);
      translateX.value = withTiming(-index * width.value, { duration: 300 });
    },
    [handleSetActiveTab, translateX, width.value],
  );

  return (
    <View
      className="w-full flex-1 overflow-hidden"
      ref={containerRef}
      onLayout={handleLayout}
    >
      <View className="grow-0">
        <EmojiTabsHeader activeTab={activeTab} onTabChange={handleTabChange} />
      </View>
      <Animated.View
        className="flex-1 flex-row"
        style={[
          { flex: 1, width: `${100 * EMOJI_CATEGORIES.length}%` },
          containerStyle,
        ]}
        {...panResponder.panHandlers}
      >
        {EMOJI_CATEGORIES.map((category, index) =>
          visitedTabs[index] ? (
            <EmojiList
              key={category.slug}
              slug={category.slug}
              emojis={groupedEmojis[category.slug].emojis}
              columns={columns}
              onEmojiPress={onEmojiPress}
            />
          ) : (
            <View key={category.slug} className="flex-1" />
          ),
        )}
      </Animated.View>
    </View>
  );
};

export interface EmojiPickerProps {
  onEmojiSelected: (emoji: string) => void;
  isExpanded: boolean;
  onToggleExpand: (isExpanded: boolean) => void;
  ActionBarLeft?: React.ComponentType;
  ActionBarRight?: React.ComponentType;
}

const FREQUENTLY_USED_EMOJIS = ['😊', '😂', '❤️', '👍', '🎉'];

const EmojiPicker = memo(
  ({
    onEmojiSelected,
    isExpanded,
    onToggleExpand,
    ActionBarLeft,
    ActionBarRight,
  }: EmojiPickerProps) => {
    const handleEmojiPress = useCallback(
      (emoji: string) => {
        onEmojiSelected(emoji);
      },
      [onEmojiSelected],
    );

    // const isKeyboardShown = useSharedValue(false);

    const handleExpand = useCallback(() => {
      onToggleExpand(!isExpanded);
    }, [isExpanded, onToggleExpand]);

    const selectorOpacity = useSharedValue(0);

    const selectorStyle = useAnimatedStyle(() => ({
      opacity: selectorOpacity.value,
    }));

    useEffect(() => {
      selectorOpacity.value = isExpanded ? 1 : 0;
    }, [isExpanded, selectorOpacity]);

    return (
      <View className="relative flex-col">
        <View className="flex-row items-center justify-between">
          {ActionBarLeft ? <ActionBarLeft /> : null}
          {FREQUENTLY_USED_EMOJIS.map((emoji) => (
            <EmojiItem
              key={emoji}
              emoji={emoji}
              size={20}
              onPress={handleEmojiPress}
            />
          ))}
          <TouchableOpacity onPress={handleExpand} className="p-2">
            <MaterialCommunityIcons
              name="emoticon-excited-outline"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
          {ActionBarRight ? <ActionBarRight /> : null}
        </View>
        <Animated.View
          style={[
            {
              transformOrigin: 'top',
              height: isExpanded ? 240 : 0,
              width: '100%',
              position: 'relative',
              bottom: 0,
              left: 0,
              right: 0,
            },
            selectorStyle,
          ]}
        >
          <EmojiTabs columns={8} onEmojiPress={handleEmojiPress} />
        </Animated.View>
      </View>
    );
  },
);

EmojiPicker.displayName = 'EmojiPicker';

export { EmojiPicker };
