import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { messages } from '@/app/(tabs)/message';
import { PageHeader } from '@/components/page-header';
import { Input } from '@/ui';
import { toRelativeDate } from '@/utils/date';

// IM Chat Messages
interface ChatMessage {
  id: number;
  sender: User;
  type: 'text' | 'image';
  content: string;
  time: Date;
}

const their: User = {
  id: 1,
  username: 'Flechazo',
  avatar: 'https://placekittens.com/204/204',
  createAt: new Date().toISOString(),
  followed: true,
};

const me: User = {
  id: 2,
  username: '板蓝根er',
  avatar: 'https://placekittens.com/203/203',
  createAt: new Date().toISOString(),
  followed: false,
};

const mockChatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: me,
    type: 'text',
    content: 'Happy New Year!',
    time: new Date('2022-02-01 00:00:01'),
  },
  {
    id: 2,
    sender: their,
    type: 'text',
    content: 'Happy New Year!',
    time: new Date('2022-02-01 00:00:12'),
  },
  {
    id: 3,
    sender: me,
    type: 'text',
    content: 'Happy New Year!',
    time: new Date('2023-01-22 00:02:05'),
  },
  {
    id: 4,
    sender: their,
    type: 'text',
    content: 'Happy New Year!',
    time: new Date('2023-01-22 00:03:15'),
  },
  {
    id: 5,
    sender: me,
    type: 'text',
    content: 'Happy New Year!',
    time: new Date('2024-02-10 00:01:05'),
  },
  {
    id: 6,
    sender: their,
    type: 'text',
    content: 'Happy New Year!',
    time: new Date('2024-02-10 08:23:15'),
  },
  {
    id: 7,
    sender: me,
    type: 'text',
    content: 'Happy New Year!',
    time: new Date('2025-01-29 00:03:02'),
  },
  {
    id: 8,
    sender: their,
    type: 'text',
    content: 'Happy New Year!',
    time: new Date('2025-01-29 00:05:20'),
  },
  {
    id: 9,
    sender: me,
    type: 'text',
    content: 'Hello there!',
    time: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: 10,
    sender: me,
    type: 'text',
    content: 'How are you today?',
    time: new Date(Date.now() - 1000 * 60 * 59),
  },
  {
    id: 11,
    sender: their,
    type: 'text',
    content: 'I am good, thank you.',
    time: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: 12,
    sender: me,
    type: 'text',
    content: 'Do you like Laozi?',
    time: new Date(Date.now() - 1000 * 60 * 20),
  },
  {
    id: 13,
    sender: their,
    type: 'text',
    content: "No, I don't.",
    time: new Date(Date.now() - 1000 * 60),
  },
  {
    id: 14,
    sender: me,
    type: 'text',
    content: 'Hahaha, me neither. I like Confucius.',
    time: new Date(Date.now() - 1000 * 30),
  },
  {
    id: 15,
    sender: their,
    type: 'text',
    content: "I don't like Laozi, Confucius, \nor you.",
    time: new Date(Date.now() - 1000 * 10),
  },
  {
    id: 16,
    sender: me,
    type: 'image',
    content:
      'https://picx.zhimg.com/v2-bbdb55c63ed7f9def388c3982557a7a2_xl.jpg',
    time: new Date(Date.now() - 1000 * 5),
  },
  {
    id: 17,
    sender: their,
    type: 'text',
    content: "I don't like this Mickey Mouse either.",
    time: new Date(Date.now() - 1000 * 2),
  },
];

export default function Page() {
  const { type, id } = useLocalSearchParams();
  const msg = messages.find((m) => m.type === type && m.id === +id);
  return (
    <>
      <KeyboardAvoidingView behavior="height" style={{ flex: 1 }}>
        <PageHeader title={msg ? msg.name : 'Message Not Found'} />
        <ChatFlow messages={mockChatMessages} />
        <ChatInput />
      </KeyboardAvoidingView>
    </>
  );
}

interface ChatItemProps {
  message: ChatMessage;
  isMe: boolean;
}

const ChatItem = ({ message, isMe }: ChatItemProps) => {
  return (
    <View
      className={`flex-row items-start gap-2`}
      style={{
        justifyContent: isMe ? 'flex-end' : 'flex-start',
        flexDirection: isMe ? 'row-reverse' : 'row',
        marginLeft: isMe ? 'auto' : 0,
      }}
    >
      <View className="flex-row items-center gap-2">
        <Image
          className="h-8 w-8 rounded-full"
          source={{ uri: message.sender.avatar }}
        />
      </View>
      <View
        className={`rounded-lg p-2 ${isMe ? 'bg-blue-100' : 'bg-gray-100'}`}
      >
        {message.type === 'text' ? (
          <Text>{message.content}</Text>
        ) : (
          <Image
            className="h-40 w-40 rounded-lg"
            source={{ uri: message.content }}
          />
        )}
      </View>
    </View>
  );
};

interface ChatFlowProps {
  messages: ChatMessage[];
}

const ChatFlow = ({ messages }: ChatFlowProps) => {
  const shouldShowTime = (index: number) => {
    if (index === 0) return true;
    const prev = messages[index - 1];
    const current = messages[index];
    return current.time.getTime() - prev.time.getTime() > 1000 * 60 * 5;
  };

  return (
    <ScrollView
      className="my-4 flex-col px-4"
      contentContainerStyle={{ gap: 10 }}
    >
      {messages.map((msg, index) => (
        <React.Fragment key={msg.id}>
          {shouldShowTime(index) && (
            <Text className="text-center text-sm text-gray-400">
              {toRelativeDate(msg.time, true)}
            </Text>
          )}
          <ChatItem message={msg} isMe={msg.sender.id === me.id} />
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

const ChatInput = () => {
  return <Input placeholder="Type a message" />;
};
