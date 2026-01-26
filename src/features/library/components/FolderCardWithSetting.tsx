import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useCreateFolder } from '../hooks/CreateFolderModalContext';
import Animated from 'react-native-reanimated';
import { MoreVerticalIcon, Folder } from 'lucide-react-native';
import usePressableAnimation from '../../../hooks/usePressableAnimation';

interface FolderCardProps {
  title: string;
  itemCount: number;
  date: string;
  onPress?: () => void;
  onMenuPress?: () => void;
}

const FolderCard = ({ title, itemCount, date, onPress, onMenuPress }: FolderCardProps) => {
  const { animatedStyle, onPressIn, onPressOut } = usePressableAnimation();
  const { openActionBar, openEditModal, openDeleteModal } = useCreateFolder();

  return (
    <Pressable
      onPress={onPress}
      onLongPress={() => openActionBar({ onEdit: onMenuPress, onDelete: undefined })}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className="w-30 h-56 mb-4"
    >
      <Animated.View style={[{ elevation: 4 }, animatedStyle]} className="bg-white rounded-lg p-4 w-full h-full shadow-lg shadow-gray-200">
        {/* Menu Button - Absolute positioned to top right */}
        <View className="absolute top-4 right-2 z-10">
          <Pressable onPress={() => {
            if (onMenuPress) {
              onMenuPress()
              return
            }
            openActionBar({
              onEdit: () => openEditModal({ name: title, description: '' }),
              onDelete: () => openDeleteModal(title),
            })
          }} onLongPress={() => openActionBar({ onEdit: () => openEditModal({ name: title, description: '' }), onDelete: () => openDeleteModal(title) })} className="p-2 active:opacity-50">
            <MoreVerticalIcon size={24} color="#000" strokeWidth={3} />
          </Pressable>
        </View>

        {/* Folder Icon Container */}
        <View className="items-center justify-center mt-4 ">
          <View className="relative">
            {/* Main Folder Shape */}
            <Folder 
              size={100} 
              color="#FFD100" 
              fill="#FFD100" 
            />
            {/* Accent Tab (Visual tweak to match your orange/yellow folder) */}
            <View 
              className="absolute top-[10px] left-[5px] w-8 h-3 rounded-tl-sm rounded-tr-md bg-amber-500"
            />
          </View>
        </View>

        {/* Folder Info */}
        <View className="items-center">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-lg font-bold text-black text-center mb-1 w-full"
          >
            {title}
          </Text>

          <Text className="text-xs w-full text-center text-gray-800 font-medium">{itemCount} Items <Text className="text-gray-400">|</Text> {date}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default FolderCard;