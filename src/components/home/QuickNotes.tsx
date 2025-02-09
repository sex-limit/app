import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
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
  ScrollView,
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
import Toast from 'react-native-toast-message';

import { type CheckInRecord, type RecordMode } from '@/contexts/CheckInContext';
import { useKeyboard } from '@/hooks/useKeyboard';
import { Input } from '@/ui';
import { EmojiPicker } from '@/ui/emojiPicker';
import { ImagePicker } from '@/ui/imageUploader';
import {
  RadioButton,
  RadioButtonGroup,
  type RadioButtonProps,
} from '@/ui/radioButtonGroup';

export type NoteData = {
  note: string;
  record: CheckInRecord['record'] | null;
  count?: number;
};

export interface NumericRadioButtonProps<T> extends RadioButtonProps<T> {
  count: number;
  onCountChange?: (value: T, count: number) => void;
}

export const NumericRadioButton = <T,>({
  ...props
}: NumericRadioButtonProps<T>) => {
  const label = useMemo(() => {
    if (props.count && props.count !== 0) {
      return `${props.label} x${props.count}`;
    }
    return props.label;
  }, [props.count, props.label]);
  const onPlus = useCallback(() => {
    props.onCountChange && props.onCountChange(props.value, props.count + 1);
  }, [props]);
  const onMinus = useCallback(() => {
    if (props.count <= 1) {
      return;
    }
    props.onCountChange && props.onCountChange(props.value, props.count - 1);
  }, [props]);

  if (props.count === null || !props.checked) {
    return <RadioButton {...props} />;
  }

  return (
    <View className="grow basis-1 flex-row items-stretch justify-between">
      <RadioButton {...props} label={label} onChange={onPlus} />
      <TouchableOpacity
        onPress={onMinus}
        className="absolute left-0 h-full w-10 items-center justify-center border-r border-neutral-300/30 p-2"
      >
        <MaterialCommunityIcons
          name="minus"
          size={18}
          color={props.activeTextColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPlus}
        className="absolute right-0 h-full w-10 items-center justify-center border-l border-neutral-300/30 p-2"
      >
        <MaterialCommunityIcons
          name="plus"
          size={18}
          color={props.activeTextColor}
        />
      </TouchableOpacity>
    </View>
  );
};

interface QuickNotesProps {
  onClose: () => void;
  onConfirm: (note: NoteData, date: Date) => void;
}

interface QuickNotesMethods {
  present: (
    date: Date,
    initialMode: RecordMode,
    initialNote: string,
    initialCount: number | null,
  ) => void;
  dismiss: () => void;
}

const QuickNotes = forwardRef(
  ({ onClose, onConfirm }: QuickNotesProps, ref) => {
    const [presenting, setPresenting] = useState(false);
    const bottomSheetRef = useRef<BottomSheetModal>(null);

    const { control, setValue, handleSubmit, getValues } = useForm<NoteData>({
      defaultValues: {
        note: '',
        record: {
          mode: 'limit',
          count: null,
        },
      },
    });

    const backdropOpacity = useSharedValue(0);

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    const [currentDate, setCurrentDate] = useState(new Date());

    const present = useCallback(
      (
        date: Date,
        initialMode: RecordMode,
        initialNote: string,
        initialCount: number | null = null,
        // eslint-disable-next-line max-params
      ) => {
        setValue('note', initialNote);
        setValue('record', { mode: initialMode, count: initialCount });
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

    const handleEmojiPickerToggle = useCallback((expanded: boolean) => {
      if (expanded) {
        Keyboard.dismiss();
      }
      setEmojiPickerExpanded(expanded);
    }, []);

    const handleKeyboardShow = useCallback(() => {
      handleEmojiPickerToggle(false);
    }, [handleEmojiPickerToggle]);

    const { keyboardHeight } = useKeyboard(handleKeyboardShow);

    const [bottomSheetHeight, setBottomSheetHeight] = useState<number | null>(
      null,
    );

    const handleBottomSheetLayout = useCallback(
      (event: LayoutChangeEvent) => {
        if (emojiPickerExpanded === false) {
          setBottomSheetHeight(Math.ceil(event.nativeEvent.layout.height));
        }
      },
      [emojiPickerExpanded],
    );

    const snapPoints = useMemo(() => {
      const emojiPickerHeight = emojiPickerExpanded ? 240 : 0;
      return [
        (bottomSheetHeight ?? 380) +
          Math.max(emojiPickerHeight, keyboardHeight) +
          40,
      ];
    }, [bottomSheetHeight, emojiPickerExpanded, keyboardHeight]);

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

    const inputScrollViewRef = useRef<ScrollView>(null);
    const [scrollViewHeight, setScrollViewHeight] = useState<number>(24 * 8);
    const handleImagePickerChange = useCallback(
      (images: string[], old: string[]) => {
        if (images.length > old.length) {
          inputScrollViewRef.current?.scrollToEnd({ animated: true });
        }
      },
      [],
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
          snapPoints={snapPoints}
          keyboardBehavior="extend"
          keyboardBlurBehavior="restore"
          enableContentPanningGesture={false}
          enableHandlePanningGesture={true}
          enableOverDrag={true}
          enableDynamicSizing={false}
          onChange={handleBottomSheetChange}
          backgroundStyle={{
            backgroundColor: '#fff',
            borderRadius: 20,
          }}
        >
          <BottomSheetView
            className="px-5 pt-4"
            onLayout={handleBottomSheetLayout}
          >
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

            <View></View>
            {/* Main */}
            <View className="mt-4">
              <ImagePicker.Provider
                limit={9}
                onImagesChange={handleImagePickerChange}
              >
                <Controller
                  control={control}
                  name="record"
                  render={({ field: { onChange, value } }) => (
                    <>
                      <RadioButtonGroup
                        value={value?.mode ?? null}
                        onChange={(v) => onChange({ mode: v, count: 1 })}
                        direction="horizontal"
                        optional={true}
                      >
                        <RadioButton
                          label="戒🦌"
                          value="limit"
                          activeColor="#84AB62"
                          activeTextColor="#ffffff"
                          color="#F5F5F5"
                        />
                        <NumericRadioButton
                          label="开🦌"
                          count={value?.count ?? 0}
                          onCountChange={(v, c) =>
                            onChange({ mode: v, count: c })
                          }
                          value="exhaustive"
                          activeColor="#84AB62"
                          activeTextColor="#ffffff"
                          color="#F5F5F5"
                        />
                      </RadioButtonGroup>
                    </>
                  )}
                />
                <ScrollView
                  style={{
                    height: scrollViewHeight, //24 * 5,
                  }}
                  className="rounded-xl bg-[#F5F5F5] p-3"
                  ref={inputScrollViewRef}
                >
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
                        numberOfLines={5}
                        ref={inputRef}
                        textAlignVertical="top"
                        placeholder="写下你的心得感受..."
                        placeholderTextColor="#999"
                        className="rounded-xl bg-[#F5F5F5]  text-base leading-6 text-[#333]"
                      />
                    )}
                  />
                  <ImagePicker.Preview />
                  <View className="mt-6"></View>
                </ScrollView>

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
                  <EmojiPicker.Provider
                    isExpanded={emojiPickerExpanded}
                    onEmojiSelected={handleSelectEmoji}
                    onToggleExpand={handleEmojiPickerToggle}
                  >
                    <View className="flex-row items-center gap-2">
                      {/* <ImagePickerExample /> */}
                      <ImagePicker.Trigger />
                      <EmojiPicker.QuickInput />
                      <EmojiPicker.Toggler />
                    </View>
                    <EmojiPicker.Picker emojiSize={24} columns={8} />
                  </EmojiPicker.Provider>
                </View>
              </ImagePicker.Provider>
            </View>
            <Toast />
          </BottomSheetView>
        </BottomSheetModal>
      </>
    );
  },
) as React.ForwardRefExoticComponent<
  QuickNotesProps & React.RefAttributes<QuickNotesMethods>
> &
  QuickNotesMethods;

export { QuickNotes };
