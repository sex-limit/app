import { type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { CommonActions } from '@react-navigation/native';
import { TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from '@/ui/text';

const BottomText: React.FC<{ isFocused: boolean; title: string }> = ({
  isFocused,
  title,
}) => {
  return (
    <Text
      className={'font-bold'}
      style={{
        color: isFocused ? 'black' : 'rgba(0, 0, 0, 0.3)',
      }}
    >
      {title}
    </Text>
  );
};

const BottomTabBar: React.FC<BottomTabBarProps> = (props) => {
  const { state, navigation, descriptors } = props;

  return (
    <SafeAreaView
      className={'items-center justify-center bg-white'}
      edges={['bottom']}
    >
      <View
        className={
          'bottom-0 h-16 w-screen flex-row items-center border-t border-t-black/5 bg-white'
        }
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const options = descriptors[route.key]?.options;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.dispatch({
                ...CommonActions.navigate({ name: route.name, merge: true }),
                target: state.key,
              });
            }
          };

          return (
            <TouchableOpacity
              key={index}
              onPress={onPress}
              className={'flex-1'}
              activeOpacity={0.45}
            >
              <View
                className={'flex-1 items-center justify-center rounded-full'}
              >
                <View className={'relative'}>
                  <BottomText
                    isFocused={isFocused}
                    title={options?.title || route.name}
                  />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default BottomTabBar;
