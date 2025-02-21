import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';

import { type Emoji, EmojiItem } from './emoji-item';

interface EmojiListProps {
  slug: string;
  emojis: Emoji[];
  columns: number;
  emojiSize: number;
  onEmojiPress: (emoji: string) => void;
}

export const EmojiList = ({
  emojis,
  columns,
  onEmojiPress,
  emojiSize,
}: EmojiListProps) => {
  const renderItem = useCallback(
    ({ item }: { item: Emoji }) => (
      <EmojiItem emoji={item.emoji} size={emojiSize} onPress={onEmojiPress} />
    ),
    [onEmojiPress, emojiSize],
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
};
