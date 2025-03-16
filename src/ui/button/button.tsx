import { TouchableOpacity, Text } from "react-native"
import clsx from "clsx"
import type { HapticFeedbackTypes } from "react-native-haptic-feedback"
import ReactNativeHapticFeedback from "react-native-haptic-feedback"
import { Trigger } from "@/shared/utils/index";

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'text';
  onPress: () => void;
  text?: string;
  virbate?: keyof typeof HapticFeedbackTypes;
  className?: string;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = (props) => {
  const { variant, text, children, onPress, virbate } = props;

  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isText = variant === 'text';

  const onClick = () => {
    onPress();
    if (virbate) {
      ReactNativeHapticFeedback.trigger(virbate);
      return
    }
    Trigger.selection();
  }


  return (
    <TouchableOpacity
      className={clsx([
        'py-4 border border-primary rounded-full items-center',
        {
          '!bg-primary': isPrimary,
          '!bg-white': isSecondary,
          '!border-0': isText,
        },
        props.className ? `!${props.className}` : ''
      ])}
      activeOpacity={0.8}
      onPress={onClick}
    >
      {children || <Text className={clsx(
        [
          'text-lg font-medium',
          {
            'text-white': isPrimary,
            'text-primary': !isPrimary,
          }
        ]
      )}>{text}</Text>}
    </TouchableOpacity>
  )
}

export default Button;