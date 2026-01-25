import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { ImageUp } from 'lucide-react-native';
import { useImagePicker } from '../hooks/useImagePicker';
import Animated from 'react-native-reanimated';
import usePressableAnimation from '../hooks/usePressableAnimation';

const ImageUploadArea = () => {
  const { imageUri, pickImage } = useImagePicker();
  const { animatedStyle, onPressIn, onPressOut } = usePressableAnimation();

  async function handlePick() {
    const uri = await pickImage();
    if (uri) {
      // optional: upload or other action
    }
  }


  return (
    <Pressable
      onPress={handlePick}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
     
    >
        <Animated.View style={[{ flex: 1, elevation: 1, borderRadius: 16 }, animatedStyle]} className="bg-white rounded-xl p-4 w-full h-80">
            <View className="flex-1 border-2 border-dashed border-gray-300 rounded-xl items-center justify-center">
            {imageUri ? (
                <Image source={{ uri: imageUri }} className="w-48 h-48 rounded-lg" />
            ) : (
                <>
                <View className="rounded-full mb-6">
                    <ImageUp size={100} color="#E31837" />
                </View>

                <Text className="text-lg font-bold text-gray-800">
                    Upload your image here
                </Text>

                <Text className="text-gray-400 mt-1 text-sm">
                    Supports PNG, JPG, JPEG
                </Text>
                </>
            )}
            </View>
        </Animated.View>

    </Pressable>
  );
};

export default ImageUploadArea;
