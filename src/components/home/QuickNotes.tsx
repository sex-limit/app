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
import {
  Keyboard,
  type LayoutChangeEvent,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { Input } from '@/ui';
import { EmojiPicker } from '@/ui/emojiPicker';

interface QuickNotesProps {
  onClose: () => void;
  onConfirm: () => void;
}

interface QuickNotesMethods {
  present: () => void;
  dismiss: () => void;
}

const QuickNotes = forwardRef(
  ({ onClose, onConfirm }: QuickNotesProps, ref) => {
    const [presenting, setPresenting] = useState(false);
    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const [note, setNote] = useState('');

    const handleSelectEmoji = useCallback(
      (emoji: string) => {
        setNote((note) => {
          return note + emoji;
        });
      },
      [setNote],
    );

    const backdropOpacity = useSharedValue(0);

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    const present = useCallback(() => {
      backdropOpacity.value = withDelay(300, withTiming(1, { duration: 100 }));
      bottomSheetRef.current?.present();
      setPresenting(true);
    }, [backdropOpacity]);

    const dismiss = useCallback(() => {
      backdropOpacity.value = 0;
      bottomSheetRef.current?.dismiss();
      setPresenting(false);
    }, [backdropOpacity]);

    const handleConfirm = useCallback(() => {
      onConfirm();
      dismiss();
    }, [onConfirm, dismiss]);

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
              <TouchableOpacity onPress={handleConfirm}>
                <Text>确认</Text>
              </TouchableOpacity>
            </View>

            <Text>Todo: plan select</Text>
            {/* Main */}
            <View className="mt-4">
              <Input
                value={note}
                onChangeText={setNote}
                multiline={true}
                numberOfLines={8}
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
                  backgroundColor: '#EBEBEB',
                }}
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
