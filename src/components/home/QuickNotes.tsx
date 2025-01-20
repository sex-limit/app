import {
  BottomSheetModal,
  BottomSheetTextInput,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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
        console.log(note, emoji);
        setNote(note + emoji);
      },
      [note, setNote],
    );

    const backdropOpacity = useSharedValue(0);

    const backdropStyle = useAnimatedStyle(() => ({
      opacity: backdropOpacity.value,
    }));

    const present = useCallback(() => {
      backdropOpacity.value = withTiming(1, { duration: 200 });
      bottomSheetRef.current?.present();
      setPresenting(true);
    }, [backdropOpacity]);

    const dismiss = useCallback(() => {
      backdropOpacity.value = withTiming(0, { duration: 200 });
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

    useImperativeHandle(ref, () => ({
      present,
      dismiss,
    }));

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
          onChange={onClose}
          ref={bottomSheetRef}
          keyboardBehavior="interactive"
          keyboardBlurBehavior="restore"
          enableContentPanningGesture={true}
          enableHandlePanningGesture={true}
          enableDynamicSizing={true}
          maxDynamicContentSize={600}
          onDismiss={dismiss}
        >
          <BottomSheetView className="rounded-t-2xl bg-white p-4">
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
              <BottomSheetTextInput
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
                actionBarLeft={
                  <Text className="flex-1">Todo: image uploader</Text>
                }
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

export { QuickNotes };
