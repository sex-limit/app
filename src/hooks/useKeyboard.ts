import { useEffect, useState } from 'react';
import { Keyboard, type KeyboardEvent } from 'react-native';

/**
 * Hook to detect keyboard show/hide events
 *
 * @param onKeyboardShow Optional callback when keyboard is shown
 * @param onKeyboardHide Optional callback when keyboard is hidden
 * @returns Object containing keyboardShown and keyboardHeight
 */
export const useKeyboard = (
  onKeyboardShow?: () => void,
  onKeyboardHide?: () => void,
) => {
  const [keyboardShown, setKeyboardShown] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardWillShow = (_e: KeyboardEvent) => {
      let metrics = Keyboard.metrics();
      setKeyboardShown(true);
      setKeyboardHeight(metrics?.height || 240);
      onKeyboardShow && onKeyboardShow?.();
    };

    const keyboardWillHide = (_e: KeyboardEvent) => {
      setKeyboardShown(false);
      setKeyboardHeight(0);
      onKeyboardHide && onKeyboardHide?.();
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
  }, [onKeyboardHide, onKeyboardShow]);

  return { keyboardShown, keyboardHeight };
};
