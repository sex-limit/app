import { Platform, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

type TouchableReactiveProps = React.ComponentProps<typeof TouchableOpacity> &
  React.ComponentProps<typeof TouchableRipple> & {
    innerRef?: React.RefObject<any>;
  };

/**
 * A component that renders a touchable element with platform-specific behavior.
 *
 * On Android, it renders a `TouchableRipple` component.
 * On other platforms, it renders a `TouchableOpacity` component with an `activeOpacity` of 0.75.
 *
 * @param {TouchableReactiveProps} props - The properties passed to the touchable component.
 * @returns {JSX.Element} The platform-specific touchable component.
 */
export const TouchableReactive = (props: TouchableReactiveProps) => {
  if (Platform.OS === 'android') {
    return <TouchableRipple {...props} ref={props.innerRef} />;
  } else {
    return (
      <TouchableOpacity activeOpacity={0.75} {...props} ref={props.innerRef} />
    );
  }
};
