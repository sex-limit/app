import { Ionicons } from '@expo/vector-icons';
import { useMemo, useRef } from 'react';
import {
  Animated,
  Dimensions,
  type LayoutChangeEvent,
  PanResponder,
  TouchableOpacity,
  useAnimatedValue,
  View,
} from 'react-native';

import { deferred } from '@/utils/deferred';

import { DropdownProvider } from '../dropdown';

interface CarouselSwitchProps<T> {
  current: T;
  picker?: React.ReactNode;
  RenderItem: (props: { item: T; active: boolean }) => React.ReactNode;
  getPrev: (current: T) => T;
  getNext: (current: T) => T;
  onChange: (current: T) => void;
}

export const CarouselSwitch = <T,>({
  current,
  picker,
  RenderItem,
  getPrev,
  getNext,
  onChange,
}: CarouselSwitchProps<T>) => {
  const prev = getPrev(current);
  const next = getNext(current);

  const monthViewTranslateX = useAnimatedValue(0);
  const containerWidth = useRef(Dimensions.get('window').width - 56);
  const handleCarouselContainerLayout = (event: LayoutChangeEvent) => {
    containerWidth.current = event.nativeEvent.layout.width / 3;
  };

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
    },
    onPanResponderMove: (_, gestureState) => {
      Animated.timing(monthViewTranslateX, {
        toValue: gestureState.dx,
        duration: 0,
        useNativeDriver: true,
      }).start();
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 50) {
        Animated.timing(monthViewTranslateX, {
          toValue: containerWidth.current,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          console.log('Trigger prev at', new Date());
          onChange(prev);
          monthViewTranslateX.setValue(0);
        });
      } else if (gestureState.dx < -50) {
        Animated.timing(monthViewTranslateX, {
          toValue: -containerWidth.current,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          console.log('Trigger next at', new Date());
          onChange(next);
          monthViewTranslateX.setValue(0);
        });
      } else {
        Animated.timing(monthViewTranslateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }).start();
      }
    },
    onPanResponderTerminate: () => {
      Animated.timing(monthViewTranslateX, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    },
  });

  const DeferredItem = useMemo(() => deferred(RenderItem), [RenderItem]);

  const handleGotoPrev = () => {
    Animated.timing(monthViewTranslateX, {
      toValue: containerWidth.current,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onChange(prev);
      monthViewTranslateX.setValue(0);
    });
  };

  const handleGotoNext = () => {
    Animated.timing(monthViewTranslateX, {
      toValue: -containerWidth.current,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onChange(next);
      monthViewTranslateX.setValue(0);
    });
  };

  return (
    <View>
      <DropdownProvider
        style={{ height: 340, width: '100%', backgroundColor: 'white' }}
      >
        <View className="flex-row items-center justify-between p-0">
          {picker}
          <CarouselSwitchArrow
            onPrev={handleGotoPrev}
            onNext={handleGotoNext}
          />
        </View>
        <View className="overflow-hidden">
          <Animated.View
            style={{
              width: '300%',
              flexDirection: 'row',
              marginLeft: '-100%',
              transform: [{ translateX: monthViewTranslateX }],
            }}
            {...panResponder.panHandlers}
            onLayout={handleCarouselContainerLayout}
          >
            <View style={{ width: '33.33%' }}>
              <DeferredItem item={prev} active={false} />
            </View>
            <View style={{ width: '33.33%' }}>
              <RenderItem item={current} active={true} />
            </View>
            <View style={{ width: '33.33%' }}>
              <DeferredItem item={next} active={false} />
            </View>
          </Animated.View>
        </View>
      </DropdownProvider>
    </View>
  );
};

interface CarouselSwitchArrowProps {
  onPrev: () => void;
  onNext: () => void;
}

export const CarouselSwitchArrow = ({
  onPrev,
  onNext,
}: CarouselSwitchArrowProps) => {
  return (
    <View className="flex-row gap-2">
      <TouchableOpacity
        onPress={onPrev}
        className="h-12 w-12 items-center justify-center rounded-lg bg-[#f5f5f5]"
      >
        <Ionicons name="chevron-back" size={18} color="#666" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onNext}
        className="h-12 w-12 items-center justify-center rounded-lg bg-[#f5f5f5]"
      >
        <Ionicons name="chevron-forward" size={18} color="#666" />
      </TouchableOpacity>
    </View>
  );
};
