import Toast from 'react-native-toast-message';

export const showToast = {
  loading: (message: string) => {
    Toast.show({
      type: 'loading',
      text1: message,
      position: 'bottom',
      autoHide: false,
    });
  },
  success: (message: string) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'bottom',
      visibilityTime: 2000,
    });
  },
  error: (message: string) => {
    Toast.show({
      type: 'error',
      text1: message,
      position: 'bottom',
      visibilityTime: 2000,
    });
  },
  hide: () => {
    Toast.hide();
  },
};
