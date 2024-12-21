import { type SvgProps } from 'react-native-svg';

import Apple from '@/ui/assets/icons/apple.svg';
import Tiktok from '@/ui/assets/icons/tiktok.svg';

const createIcon =
  (Icon: React.FC<SvgProps>) => (props: SvgProps & { size?: number }) => {
    const size = props.size ?? 16;
    return <Icon color={'#fff'} width={size} height={size} {...props} />;
  };

export const Icons = {
  Tiktok: createIcon(Tiktok),
  Apple: createIcon(Apple),
};
