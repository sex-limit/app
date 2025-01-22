import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Keyboard,
  type LayoutChangeEvent,
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
import { RadioButton, RadioButtonGroup } from '@/ui/radioButtonGroup';

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

    const [bottomSheetHeight, setBottomSheetHeight] = useState<number | null>(
      null,
    );
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const handleBottomSheetLayout = useCallback(
      (event: LayoutChangeEvent) => {
        if (bottomSheetHeight === null) {
          setBottomSheetHeight(
            Math.ceil(event.nativeEvent.layout.height) - 240,
          );
        }
      },
      [bottomSheetHeight],
    );

    const snapPoints = useMemo(() => {
      const emojiPickerHeight = emojiPickerExpanded ? 240 : 0;
      return [
        (bottomSheetHeight ?? 300) +
          Math.max(emojiPickerHeight, keyboardHeight) +
          40,
      ];
    }, [bottomSheetHeight, emojiPickerExpanded, keyboardHeight]);

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
          onChange={handleBottomSheetChange}
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          enableContentPanningGesture={false}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
        >
          <BottomSheetView className=" p-4" onLayout={handleBottomSheetLayout}>
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <TouchableOpacity onPress={handleClose}>
                <Text>取消</Text>
              </TouchableOpacity>
              <Text className="text-xl font-bold">小记</Text>
              <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                <Text>确认</Text>
              </TouchableOpacity>
            </View>

            <View></View>
            {/* Main */}
            <View className="mt-4">
              <Controller
                control={control}
                name="mode"
                render={({ field: { onChange, value } }) => (
                  <>
                    {/* <View className="flex-row items-center justify-between">
                      <Text className="mb-2  font-light text-neutral-100">
                        今天的状态
                      </Text>
                    </View> */}
                    <RadioButtonGroup
                      value={value}
                      onChange={(v) => onChange(v)}
                      direction="horizontal"
                      optional={true}
                    >
                      <RadioButton
                        icon={({ checked }) => (
                          <MaterialCommunityIcons
                            name="leaf"
                            size={18}
                            color={checked ? '#ffffff' : '#84AB62'}
                          />
                        )}
                        label="戒"
                        value="limit"
                        activeColor="#84AB62"
                        activeTextColor="#ffffff"
                      />

                      <RadioButton
                        icon={({ checked }) => (
                          <MaterialCommunityIcons
                            name="fire"
                            size={20}
                            color={checked ? '#ffffff' : '#CD6464'}
                          />
                        )}
                        label="鹿"
                        value="exhaustive"
                        activeColor="#CD6464"
                        activeTextColor="#ffffff"
                      />
                    </RadioButtonGroup>
                  </>
                )}
              />
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
                    placeholder="写一段感想吧..."
                    style={{
                      marginTop: 8,
                      marginBottom: 10,
                      borderRadius: 10,
                      fontSize: 16,
                      lineHeight: 20,
                      height: 160 + 16,
                      padding: 8,
                      color: '#333',
                      backgroundColor: '#EBEBEB',
                    }}
                  />
                )}
              />
            </View>

            {/* Footer */}
            <View>
              <EmojiPicker
                isExpanded={emojiPickerExpanded}
                onToggleExpand={handleEmojiPickerToggle}
                ActionBarLeft={ImageUpload}
                onEmojiSelected={handleSelectEmoji}
              />
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
  return <Text className="flex-1">Todo: image uploader</Text>;
};

export { QuickNotes };
