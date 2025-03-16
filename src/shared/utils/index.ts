import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export const Trigger = {
  soft: () => {
    ReactNativeHapticFeedback.trigger('soft')
  },
  light: () => {
    ReactNativeHapticFeedback.trigger('impactLight')
  },
  medium: () => {
    ReactNativeHapticFeedback.trigger('impactMedium')
  },
  heavy: () => {
    ReactNativeHapticFeedback.trigger('impactHeavy')
  },
  selection: () => {
    ReactNativeHapticFeedback.trigger('selection')
  },
  rigid: () => {
    ReactNativeHapticFeedback.trigger('rigid')
  },
}
