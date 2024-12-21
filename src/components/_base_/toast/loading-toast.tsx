import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { BaseToast, type BaseToastProps } from 'react-native-toast-message';

export const LoadingToast = (props: BaseToastProps) => {
  return (
    <BaseToast
      {...props}
      style={{
        borderLeftWidth: 0,
        height: 'auto',
        paddingVertical: 12,
        backgroundColor: '#18191A',
        borderRadius: 8,
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
      }}
      text1Style={{
        fontSize: 14,
        fontWeight: '400',
        color: 'white',
      }}
      renderLeadingIcon={() => (
        <View style={{ marginLeft: 10, justifyContent: 'center' }}>
          <ActivityIndicator size={24} color="white" />
        </View>
      )}
    />
  );
};
