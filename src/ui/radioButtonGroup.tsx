import React, { useCallback, useEffect } from 'react';
import { Text, View } from 'react-native';
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { TouchableRipple } from 'react-native-paper';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface RadioButtonProps<T> {
  label: string;
  value: T;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  checked?: boolean;
  onChange?: (value: T, checked: boolean) => void;
  color?: string;
  activeColor?: string;
  activeTextColor?: string;
  icon?: React.ComponentType<{ checked: boolean }>;
  iconSize?: number;
  iconStyle?: StyleProp<ViewStyle>;
  iconPosition?: 'left' | 'right';
  labelStyle?: StyleProp<TextStyle>;
  labelPosition?: 'left' | 'right';
  labelLines?: number;
}

interface RadioGroupProps<T, Opt extends boolean = false> {
  value: Opt extends true ? T | null : T;
  onChange?: (value: Opt extends true ? T | null : T) => void;
  optional: Opt;
  direction?: 'horizontal' | 'vertical';
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}

export const RadioButton = <T,>(props: RadioButtonProps<T>) => {
  const {
    label,
    value,
    disabled,
    style,
    onPress,
    checked = false,
    onChange,
    color = '#00000000',
    activeColor = '#84AB62',
    activeTextColor = '#000000',
    icon: Icon,
    iconPosition = 'left',
    labelStyle,
    labelLines,
    index = 0,
    total = 0,
  } = props as RadioButtonProps<T> & { index?: number; total?: number };

  const handlePress = () => {
    if (!disabled && onChange) {
      console.log('value', value, 'checked', checked);
      onChange(value, checked);
    }
    if (!disabled && onPress) {
      onPress();
    }
  };

  const animatedBackground = useSharedValue(color);
  const animatedBackgroundStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: animatedBackground.value,
    };
  });

  useEffect(() => {
    if (checked) {
      animatedBackground.value = withTiming(activeColor, { duration: 200 });
    } else {
      animatedBackground.value = withTiming(color, { duration: 200 });
    }
  }, [checked, activeColor, color, animatedBackground]);

  return (
    <TouchableRipple
      onPress={handlePress}
      className="grow basis-1"
      disabled={disabled}
    >
      <Animated.View
        className={`flex-row items-center justify-center gap-2 p-2 ${
          index !== total - 1 ? 'border-r border-neutral-300' : ''
        }`}
        style={[style, animatedBackgroundStyle]}
      >
        {iconPosition === 'left' && Icon && <Icon checked={checked} />}
        <Text
          style={[
            labelStyle,
            checked &&
              activeTextColor && {
                color: activeTextColor,
              },
          ]}
          numberOfLines={labelLines}
        >
          {label}
        </Text>
        {iconPosition === 'right' && Icon && <Icon checked={checked} />}
      </Animated.View>
    </TouchableRipple>
  );
};

export const RadioButtonGroup = <T, Opt extends boolean>(
  props: RadioGroupProps<T, Opt>,
) => {
  type V = Opt extends true ? T | null : T;
  const { value, onChange, direction, style, children, optional } = props;
  const childCount = React.Children.count(children);

  const handleChange = useCallback(
    (newValue: V, clear = false) => {
      if (clear && optional && value === newValue) {
        console.log('clearing');
        onChange && onChange(null as V);
      } else if (value !== newValue) {
        onChange && onChange(newValue);
      }
    },
    [onChange, optional, value],
  );

  return (
    <View
      className="justify-between rounded-md border border-neutral-300"
      style={[
        {
          justifyContent: 'space-between',
        },
        style,
        { flexDirection: direction === 'horizontal' ? 'row' : 'column' },
      ]}
    >
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) {
          console.error('Invalid children in Radio group');
          return null;
        }
        return React.cloneElement(child as any, {
          index: index,
          total: childCount,
          checked: child.props.value === value,
          onChange: handleChange,
        });
      })}
    </View>
  );
};
