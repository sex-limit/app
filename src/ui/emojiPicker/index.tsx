import React, { useCallback, useContext, useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { EmojiItem } from './emoji-item';
import { EmojiTabs } from './emoji-tabs';

interface EmojiPickerContextValue {
  isExpanded: boolean;
  setIsExpanded: (isExpanded: boolean | ((prev: boolean) => boolean)) => void;
  onEmojiSelected: (emoji: string) => void;
}

const EmojiPickerContext = React.createContext<EmojiPickerContextValue>({
  isExpanded: false,
  setIsExpanded: () => {},
  onEmojiSelected: () => {},
});

interface EmojiPickerProviderProps {
  isExpanded: boolean;
  onToggleExpand: (isExpanded: boolean) => void;
  onEmojiSelected: (emoji: string) => void;
  children: React.ReactNode;
}

/**
 * Provides the EmojiPicker context with expanded state and event handlers
 * to a pair of Toggler and Picker components.
 *
 * As some child components is memorized, you may need to memorize `onEmojiSelected`
 */
const Provider = ({
  isExpanded,
  onToggleExpand,
  onEmojiSelected,
  children,
}: EmojiPickerProviderProps) => {
  const handleSetIsExpanded = useCallback(
    (value: boolean | ((prev: boolean) => boolean)) => {
      if (typeof value === 'function') {
        onToggleExpand(value(isExpanded));
      } else {
        onToggleExpand(value);
      }
    },
    [isExpanded, onToggleExpand],
  );

  return (
    <EmojiPickerContext.Provider
      value={{
        isExpanded,
        setIsExpanded: handleSetIsExpanded,
        onEmojiSelected,
      }}
    >
      {children}
    </EmojiPickerContext.Provider>
  );
};

interface TogglerProps {
  size?: number;
  padding?: number;
}

/**
 * Used inside a Provider to toggle the expanded state of the EmojiPicker
 */
const Toggler = ({ size = 24, padding = 8 }: TogglerProps) => {
  const { setIsExpanded } = useContext(EmojiPickerContext);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, [setIsExpanded]);

  return (
    <TouchableOpacity onPress={handleToggleExpand} style={{ padding }}>
      <MaterialCommunityIcons
        name="emoticon-excited-outline"
        size={size}
        color="#666"
      />
    </TouchableOpacity>
  );
};

interface PickerProps {
  emojiSize?: number;
  columns?: number;
}

/**
 * Used inside a Provider to display the EmojiPicker
 */
const Picker = ({ emojiSize = 24, columns = 8 }: PickerProps) => {
  const { isExpanded, onEmojiSelected } = useContext(EmojiPickerContext);

  const selectorOpacity = useSharedValue(0);

  const selectorStyle = useAnimatedStyle(() => ({
    opacity: selectorOpacity.value,
  }));

  useEffect(() => {
    selectorOpacity.value = isExpanded ? 1 : 0;
  }, [isExpanded, selectorOpacity]);

  return (
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
      <EmojiTabs
        columns={columns}
        emojiSize={emojiSize}
        onEmojiPress={onEmojiSelected}
      />
    </Animated.View>
  );
};

const FREQUENTLY_USED_EMOJIS = ['😊', '😂', '❤️', '👍', '🎉'];

/**
 * Optional component to quickly input emojis
 *
 * It should be used inside a Provider as well.
 */
const QuickInput = () => {
  const { onEmojiSelected } = useContext(EmojiPickerContext);

  return (
    <View className="flex-row items-center">
      {FREQUENTLY_USED_EMOJIS.map((emoji) => (
        <EmojiItem
          key={emoji}
          emoji={emoji}
          size={20}
          onPress={onEmojiSelected}
        />
      ))}
    </View>
  );
};

export const EmojiPicker = {
  Provider,
  Toggler,
  Picker,
  QuickInput,
};
