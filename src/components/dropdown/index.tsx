import { Ionicons } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  type LayoutChangeEvent,
  type LayoutRectangle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface DropdownContextType {
  visible: boolean;
  trigger: (items: React.ReactNode[], anchorLayout: LayoutRectangle) => void;
  clear: () => void;
}

const DropdownContext = React.createContext<DropdownContextType>({
  visible: false,
  trigger: () => {},
  clear: () => {},
});

interface DropdownProviderProps {
  children: React.ReactNode;
}

const DropdownProvider = ({ children }: DropdownProviderProps) => {
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState<React.ReactNode[]>([]);
  const anchorLayoutRef = useRef<LayoutRectangle | null>(null);

  const itemsLayoutRef = useRef<LayoutRectangle>({
    x: 0,
    y: 0,
    width: anchorLayoutRef.current?.width ?? 0,
    height: anchorLayoutRef.current?.height ?? 0,
  });

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const updateTranslate = () => {
    translateX.set(
      anchorLayoutRef.current
        ? anchorLayoutRef.current.x +
            anchorLayoutRef.current.width / 2 -
            itemsLayoutRef.current.width / 2
        : 0,
    );
    translateY.set(
      anchorLayoutRef.current
        ? anchorLayoutRef.current.y + anchorLayoutRef.current.height + 8
        : 0,
    );
  };

  const opacity = useSharedValue(0);

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.get() },
        { translateY: translateY.get() },
      ],
      opacity: opacity.value,
    };
  });

  const handleItemsLayout = (event: LayoutChangeEvent) => {
    itemsLayoutRef.current = event.nativeEvent.layout;
    updateTranslate();
  };

  const trigger = (items: React.ReactNode[], anchorLayout: LayoutRectangle) => {
    anchorLayoutRef.current = anchorLayout;
    updateTranslate();
    setVisible(true);
    opacity.set(withTiming(1, { duration: 200 }));
    setItems(items);
  };

  const clear = () => {
    anchorLayoutRef.current = null;
    setVisible(false);
    opacity.set(0);
    setItems([]);
  };

  return (
    <DropdownContext.Provider
      value={{
        visible,
        trigger,
        clear,
      }}
    >
      {visible && (
        <View className="absolute left-0 top-0 z-10 h-screen w-screen">
          <View
            className="absolute left-0 top-0 h-screen w-screen"
            onTouchEnd={clear}
          />
          <Animated.View
            className="absolute left-0 top-0 border border-gray-100"
            style={[translateStyle]}
            onLayout={handleItemsLayout}
          >
            {items.map((item, index) => (
              <View key={index}>{item}</View>
            ))}
          </Animated.View>
        </View>
      )}
      {children}
    </DropdownContext.Provider>
  );
};

interface DropdownProps {
  // should be a view, not a ref
  anchor: React.ReactNode;
  children: React.ReactNode;
  indicator?: boolean;
  onOpen?: () => void;
  onDismiss?: () => void;
}

const Dropdown = ({
  anchor,
  children,
  indicator,
  onOpen,
  onDismiss,
}: DropdownProps) => {
  const { trigger, visible } = useContext(DropdownContext);

  const anchorRef = React.useRef<View>(null);
  const anchorLayoutRef = React.useRef<LayoutRectangle | null>(null);
  const onLayout = () => {
    // eslint-disable-next-line max-params
    anchorRef.current?.measureInWindow((x, y, width, height) => {
      console.log('measureInWindow', { x, y, width, height });
      anchorLayoutRef.current = { width, height, x, y };
    });
  };

  const indicatorRotate = useSharedValue(0);

  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${indicatorRotate.value}deg` }],
    };
  });

  useEffect(() => {
    if (visible) {
      onOpen?.();
      indicatorRotate.set(withTiming(180, { duration: 200 }));
    } else {
      onDismiss?.();
      indicatorRotate.set(withTiming(0, { duration: 200 }));
    }
  }, [visible, onDismiss, onOpen, indicatorRotate]);

  const handlePress = () => {
    trigger(
      [children],
      anchorLayoutRef.current ?? { x: 0, y: 0, width: 0, height: 0 },
    );
  };

  return (
    <TouchableOpacity
      ref={anchorRef}
      onLayout={onLayout}
      onPress={handlePress}
      className="flex-row items-center gap-1"
    >
      <>
        {anchor}
        {indicator && (
          <Animated.View style={[indicatorStyle]}>
            <Ionicons name="chevron-down" size={16} color="#333" />
          </Animated.View>
        )}
      </>
    </TouchableOpacity>
  );
};

interface DropdownItemProps {
  onPress?: () => void;
  children: React.ReactNode;
}

const DropdownItem = ({ onPress, children }: DropdownItemProps) => {
  const { clear } = useContext(DropdownContext);

  const handlePress = () => {
    clear();
    onPress?.();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View className=" bg-white p-4 ">{children}</View>
    </TouchableWithoutFeedback>
  );
};

export default Object.assign(Dropdown, {
  Provider: DropdownProvider,
  Item: DropdownItem,
});

export { Dropdown, DropdownItem, DropdownProvider };
