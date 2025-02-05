import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  type NativeSyntheticEvent,
  Text,
  type TextInput as NTextInput,
  type TextInputSelectionChangeEventData,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { type CheckInRecord } from '@/contexts/CheckInContext';
import { Input } from '@/ui';
import { EmojiPicker } from '@/ui/emojiPicker';

export type NoteData = {
  note: string;
  mode: CheckInRecord['mode'] | null;
};

interface QuickNotesProps {
  onClose: () => void;
  onConfirm: (note: NoteData, date: Date) => void;
}

interface QuickNotesMethods {
  present: (date: Date, initialMode: string, initialNote: string) => void;
  dismiss: () => void;
}

const QuickNotes = forwardRef(
  ({ onClose, onConfirm }: QuickNotesProps, ref) => {
    const [presenting, setPresenting] = useState(false);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const { control, setValue, handleSubmit, getValues } = useForm<NoteData>({
      defaultValues: {
        note: '',
        mode: 'limit',
      },
    });

    const backdropOpacity = useSharedValue(0);

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    const [currentDate, setCurrentDate] = useState(new Date());

    const present = useCallback(
      (date: Date, initialMode: string, initialNote: string) => {
        setValue('note', initialNote);
        setValue('mode', initialMode as any);
        backdropOpacity.value = withDelay(
          300,
          withTiming(1, { duration: 100 }),
        );
        setCurrentDate(date);
        setPresenting(true);
        bottomSheetRef.current?.present();
      },
      [backdropOpacity, setValue],
    );

    const dismiss = useCallback(() => {
      backdropOpacity.value = 0;
      bottomSheetRef.current?.dismiss();
      setPresenting(false);
    }, [backdropOpacity]);

    const handleClose = useCallback(() => {
      onClose();
      dismiss();
    }, [onClose, dismiss]);

    const handleBottomSheetChange = useCallback(
      (index: number) => {
        if (index === -1) {
          dismiss();
        }
      },
      [dismiss],
    );

    useImperativeHandle(ref, () => ({
      present,
      dismiss,
    }));

    const [emojiPickerExpanded, setEmojiPickerExpanded] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const handleEmojiPickerToggle = useCallback((expanded: boolean) => {
      if (expanded) {
        Keyboard.dismiss();
      }
      setEmojiPickerExpanded(expanded);
    }, []);

    useEffect(() => {
      const keyboardWillShow = () => {
        let metrics = Keyboard.metrics();
        handleEmojiPickerToggle(false);
        if (!metrics) {
          setKeyboardHeight(240);
        } else {
          setKeyboardHeight(metrics.height);
        }
      };
      const keyboardWillHide = () => {
        setKeyboardHeight(0);
      };
      const showSubscription = Keyboard.addListener(
        'keyboardDidShow',
        keyboardWillShow,
      );
      const hideSubscription = Keyboard.addListener(
        'keyboardDidHide',
        keyboardWillHide,
      );
      return () => {
        showSubscription.remove();
        hideSubscription.remove();
      };
    }, [handleEmojiPickerToggle]);

    const selection = useRef({ start: 0, end: 0 });
    const inputRef = useRef<NTextInput>(null);

    const handleSelectionChange = useCallback(
      (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
        selection.current = event.nativeEvent.selection;
      },
      [selection],
    );

    const handleSelectEmoji = useCallback(
      (emoji: string) => {
        let note = getValues('note');
        let prefix = note.slice(0, selection.current.start);
        let suffix = note.slice(selection.current.end);
        let newNote = prefix + emoji + suffix;
        setValue('note', newNote);
        requestAnimationFrame(() => {
          let newSelection = {
            start: selection.current.start + emoji.length,
            end: selection.current.start + emoji.length,
          };
          selection.current = newSelection;
          inputRef.current?.setSelection(newSelection.start, newSelection.end);
        });
      },
      [getValues, setValue],
    );

    const onSubmit = useCallback(
      (data: NoteData) => {
        onConfirm(data, currentDate);
        dismiss();
      },
      [currentDate, onConfirm, dismiss],
    );

    return (
      <>
        <Animated.View
          className="absolute z-[1000] h-full w-full bg-black/50"
          style={[
            {
              pointerEvents: presenting ? 'auto' : 'none',
            },
            backdropStyle,
          ]}
          onTouchEnd={handleClose}
        />
        <BottomSheetModal
          index={0}
          ref={bottomSheetRef}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          enableContentPanningGesture={false}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
          enableDynamicSizing={true}
          backgroundStyle={{
            backgroundColor: '#fff',
            borderRadius: 20,
          }}
        >
          <BottomSheetView className="px-5 pt-4">
            {/* Header */}
            <View className="mb-6 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleClose}
                className="h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5]"
              >
                <MaterialCommunityIcons name="close" size={20} color="#333" />
              </TouchableOpacity>

              <View className="items-center">
                <Text className="text-lg font-semibold text-[#333]">小记</Text>
                <Text className="text-xs text-[#666]">hijack</Text>
              </View>

              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                className="h-10 w-10 items-center justify-center rounded-full bg-[#F5F5F5]"
              >
                <MaterialCommunityIcons name="check" size={20} color="#333" />
              </TouchableOpacity>
            </View>

            {/* Main Content */}
            <View>
              <View className="mb-6 flex-row items-center justify-between">
                <Controller
                  control={control}
                  name="mode"
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => onChange('limit')}
                        className={`h-9 flex-1 items-center justify-center rounded-lg ${
                          value === 'limit' ? 'bg-[#84AB62]' : 'bg-[#F5F5F5]'
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            value === 'limit' ? 'text-white' : 'text-[#666]'
                          }`}
                        >
                          戒🦌
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => onChange('relapse')}
                        className={`h-9 flex-1 items-center justify-center rounded-lg ${
                          value === 'relapse' ? 'bg-[#84AB62]' : 'bg-[#F5F5F5]'
                        }`}
                      >
                        <Text
                          className={`text-sm font-medium ${
                            value === 'relapse' ? 'text-white' : 'text-[#666]'
                          }`}
                        >
                          开🦌
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                />
              </View>

              {/* Note Input */}
              <Controller
                control={control}
                name="note"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onSelectionChange={handleSelectionChange}
                    onBlur={onBlur}
                    multiline={true}
                    numberOfLines={8}
                    ref={inputRef}
                    textAlignVertical="top"
                    placeholder="写下你的心得感受..."
                    placeholderTextColor="#999"
                    className="min-h-[160px] rounded-xl bg-[#F5F5F5] p-3 text-base leading-6 text-[#333]"
                  />
                )}
              />

              {/* Time Display */}
              <View className="mt-3 flex-row items-center">
                <Text className="text-sm text-[#333]">
                  {currentDate
                    .toLocaleString('zh-CN', {
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                    .replace(/\//g, '/')}
                </Text>
              </View>

              {/* Emoji Picker */}
              <View className="mt-3">
                <EmojiPicker
                  isExpanded={emojiPickerExpanded}
                  onToggleExpand={handleEmojiPickerToggle}
                  ActionBarLeft={ImageUpload}
                  onEmojiSelected={handleSelectEmoji}
                  emojiSize={24}
                  style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: 12,
                    padding: 8,
                  }}
                />
              </View>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  },
) as React.ForwardRefExoticComponent<
  QuickNotesProps & React.RefAttributes<QuickNotesMethods>
> &
  QuickNotesMethods;

const ImageUpload = () => {
  return (
    <TouchableOpacity className="flex-1 flex-row items-center gap-2">
      <MaterialCommunityIcons name="image-plus" size={20} color="#666" />
      <Text className="text-sm text-[#666]">添加图片</Text>
    </TouchableOpacity>
  );
};

export { QuickNotes };
