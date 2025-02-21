import { Ionicons } from '@expo/vector-icons';
import React, { createContext, useState } from 'react';
import {
  Image,
  type ImageStyle,
  type StyleProp,
  Text,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';
import {
  type ImageLibraryOptions,
  launchImageLibrary,
} from 'react-native-image-picker';

import { showToast } from '@/components/_base_/toast/toast';

interface ImagePickerContextType {
  limit?: number;
  imageUris: string[];
  setImageUris: (value: string[] | ((prev: string[]) => string[])) => void;
}

const ImagePickerContext = createContext<ImagePickerContextType>({
  limit: 1,
  imageUris: [],
  setImageUris: () => {},
});

interface ImagePickerProviderProps {
  limit?: number;
  children: React.ReactNode;
  onImagesChange?: (images: string[], old: string[]) => void;
}

const ImagePickerProvider = ({
  limit = 1,
  children,
  onImagesChange,
}: ImagePickerProviderProps) => {
  const [imageUris, setImageUris] = useState<string[]>([]);

  const handleSetImageUris = (
    value: string[] | ((prev: string[]) => string[]),
  ) => {
    const newUris = typeof value === 'function' ? value(imageUris) : value;
    onImagesChange?.(newUris, imageUris);
    setImageUris(newUris);
  };

  return (
    <ImagePickerContext.Provider
      value={{ limit, imageUris, setImageUris: handleSetImageUris }}
    >
      {children}
    </ImagePickerContext.Provider>
  );
};

interface ImagePickerTriggerProps {
  children?: React.ReactNode;
}

const ImagePickerTrigger = ({ children }: ImagePickerTriggerProps) => {
  const { setImageUris, imageUris, limit } =
    React.useContext(ImagePickerContext);

  const rest = (limit ?? 1) - imageUris.length;
  const disabled = rest <= 0;

  const pickImage = () => {
    let options: ImageLibraryOptions = {
      mediaType: 'photo' as const,
      selectionLimit: rest,
    };
    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        // console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        showToast.error(`ImagePicker Error: ${response.errorMessage}`);
      } else if (response.assets) {
        const sources =
          (response.assets
            .map((asset) => asset.uri)
            .filter(Boolean) as string[]) ?? [];
        setImageUris((prev) => [...prev, ...sources]);
      } else {
        console.log('Unknown ImagePicker error');
        showToast.error('Unknown ImagePicker error');
      }
    });
  };

  return (
    <TouchableOpacity
      className="flex-1 flex-row items-center gap-2"
      onPress={pickImage}
      disabled={disabled}
    >
      {children ?? (
        <>
          <Ionicons
            name="images-outline"
            size={20}
            color={disabled ? '#aaa' : '#666'}
          />
          <Text style={{ fontSize: 12, color: disabled ? '#aaa' : '#666' }}>
            添加图片
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

interface ImagePickerPreviewProps {
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: StyleProp<ViewStyle>;
}

const ImagePickerPreview = ({
  imageStyle,
  containerStyle,
}: ImagePickerPreviewProps) => {
  const { imageUris, setImageUris } = React.useContext(ImagePickerContext);

  const removeImage = (index: number) => {
    setImageUris((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <View
      className="flex-row flex-wrap justify-start gap-4"
      style={containerStyle}
    >
      {imageUris.map((uri, index) => (
        <View key={index} className="relative">
          <Image
            source={{ uri }}
            style={[{ width: 108, height: 108, borderRadius: 5 }, imageStyle]}
          />
          <TouchableOpacity
            className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 rounded-full bg-neutral-400 p-[2px]"
            onPress={() => removeImage(index)}
          >
            <Ionicons name="close" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export const ImagePicker = {
  Provider: ImagePickerProvider,
  Trigger: ImagePickerTrigger,
  Preview: ImagePickerPreview,
};
