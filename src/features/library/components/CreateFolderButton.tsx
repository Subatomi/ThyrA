import React from 'react';
import { Pressable } from 'react-native';
import Animated from 'react-native-reanimated';
import usePressableAnimation from '../../../hooks/usePressableAnimation';
import { FolderPlus } from 'lucide-react-native';
import { useCreateFolder } from '../hooks/CreateFolderModalContext';

export default function CreateFolderButton() {
  const { animatedStyle, onPressIn, onPressOut } = usePressableAnimation();

  const { open, isActionBarVisible } = useCreateFolder();

  if (isActionBarVisible) return null;

  return (
    <Pressable
      onPress={() => open()}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      accessibilityRole="button"
      className="absolute bottom-2 right-4 items-center z-20"
    >
      <Animated.View className="w-14 h-14 rounded-full bg-red-600 items-center justify-center shadow-lg" style={animatedStyle as any}>
        <FolderPlus size={20} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}
