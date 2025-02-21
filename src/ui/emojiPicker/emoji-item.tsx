import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
export interface Emoji {
  emoji: string;
  name: string;
  slug: string;
}

interface EmojiItemProps {
  emoji: string;
  size: number;
  onPress: (emoji: string) => void;
}

export const EmojiItem = React.memo(
  ({ emoji, size, onPress }: EmojiItemProps) => {
    return (
      <TouchableOpacity className="m-auto p-1" onPress={() => onPress(emoji)}>
        <Text style={{ fontSize: size, margin: 'auto' }}>{emoji}</Text>
      </TouchableOpacity>
    );
  },
);
