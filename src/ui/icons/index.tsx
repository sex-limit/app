import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface IconProps {
  color: string;
  size?: number;
}

export const HomeIcon = ({ color, size = 24 }: IconProps) => (
  <Icon name="home-outline" size={size} color={color} />
);

export const CommunityIcon = ({ color, size = 24 }: IconProps) => (
  <Icon name="account-group-outline" size={size} color={color} />
);

export const MessageIcon = ({ color, size = 24 }: IconProps) => (
  <Icon name="message-outline" size={size} color={color} />
);

export const ProfileIcon = ({ color, size = 24 }: IconProps) => (
  <Icon name="account-outline" size={size} color={color} />
);
