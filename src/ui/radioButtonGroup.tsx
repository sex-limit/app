import React, { useCallback } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { type StyleProp, type TextStyle, type ViewStyle } from 'react-native';

export interface RadioButtonProps<T> {
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
  } = props as RadioButtonProps<T>;

  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(value, checked);
    }
    if (!disabled && onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      className={`h-9 flex-1 grow basis-1 flex-row items-center justify-center gap-2 rounded-lg  p-2`}
      style={[
        style,
        {
          backgroundColor: checked ? activeColor : color,
        },
      ]}
    >
      <>
        {iconPosition === 'left' && Icon && <Icon checked={checked} />}
        <Text
          className={`text-sm font-medium text-[#666]`}
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
      </>
    </TouchableOpacity>
  );
};

export const RadioButtonGroup = <T, Opt extends boolean>(
  props: RadioGroupProps<T, Opt>,
) => {
  type V = Opt extends true ? T | null : T;
  const { value, onChange, direction, style, children, optional } = props;

  const handleChange = useCallback(
    (newValue: V, clear = false) => {
      if (clear && optional && value === newValue) {
        onChange && onChange(null as V);
      } else if (value !== newValue) {
        onChange && onChange(newValue);
      }
    },
    [onChange, optional, value],
  );

  return (
    <View
      className="mb-6 flex-row justify-between gap-2 rounded-md"
      style={[
        {
          justifyContent: 'space-between',
        },
        style,
        { flexDirection: direction === 'horizontal' ? 'row' : 'column' },
      ]}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) {
          console.error('Invalid children in Radio group');
          return null;
        }
        return React.cloneElement(child as any, {
          checked: child.props.value === value,
          onChange: handleChange,
        });
      })}
    </View>
  );
};
