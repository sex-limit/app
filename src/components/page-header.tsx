import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  type StyleProp,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

interface PageHeaderProps {
  title?: string;
  back?: boolean;
  height?: number;
  left?: React.ReactNode;
  center?: React.ReactNode;
  right?: React.ReactNode;
  headerStyle?: StyleProp<ViewStyle>;
}

/**
 * Header component for pages.
 *
 * @param {string} title - The title of the page.
 * @param {boolean} back - Whether to show the back button.
 * @param {number} height - The height of the header.
 * @param {React.ReactNode} left - The content to display on the left side of the header. It will override the back button.
 * @param {React.ReactNode} center - The content to display in the center of the header. It will override the title.
 * @param {React.ReactNode} right - The content to display on the right side of the header.
 * @returns
 */
export const PageHeader = ({
  title,
  back = true,
  height = 56,
  left,
  center,
  right,
  headerStyle,
}: PageHeaderProps) => {
  return (
    <View
      className="flex-row items-center gap-2 border-b border-gray-200 bg-white px-4 py-3"
      style={[
        {
          height,
        },
        headerStyle,
      ]}
    >
      <View className="grow basis-1 items-start">
        {left ||
          (back && (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={20} color="black" />
            </TouchableOpacity>
          ))}
      </View>
      <View className="shrink items-center">
        {center || (
          <Text className="text-md" ellipsizeMode="tail" numberOfLines={1}>
            {title}
          </Text>
        )}
      </View>
      <View className="grow basis-1 items-end">{right}</View>
    </View>
  );
};
