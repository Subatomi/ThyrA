import React from 'react';
import { View, Text, Alert ,Pressable } from 'react-native';
import { useCreateFolder } from '../hooks/CreateFolderModalContext';
import Animated from 'react-native-reanimated';
import { MoreVerticalIcon, Folder } from 'lucide-react-native';
import usePressableAnimation from '../../../hooks/usePressableAnimation';
import { deleteFolder } from "api/folder";
import { useRouter } from 'expo-router'

interface FolderCardProps {
  id: string
  title: string;
  onPress?: () => void;
  onMenuPress?: () => void;
}

const FolderCard = ({ id, title, onPress, onMenuPress }: FolderCardProps) => {
  const router = useRouter();
  const { animatedStyle, onPressIn, onPressOut } = usePressableAnimation();
  const { openActionBar, openEditModal, openDeleteModal } = useCreateFolder();

  // Wrap the onPress prop to include navigation
  const handlePress = () => {
    // Navigate first
    router.push({
      pathname: '/report-folder',
      params: {
        folderId: id,
        folderName: title,
      },
    });

    // Call any additional onPress logic passed from parent
    if (onPress) onPress();
  };

  return (
    <Pressable
      onPress={handlePress}  // 👈 use this
      onLongPress={() =>
        openActionBar({
          onEdit: () => {
            if (onMenuPress) onMenuPress();
            else openEditModal({ id, name: title, description: '' });
          },
          onDelete: () => openDeleteModal(title, id.toString()),
        })
      }
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      className="w-full max-w-48 h-56 mb-4"
    >
      <Animated.View
        style={[{ elevation: 4 }, animatedStyle]}
        className="bg-white rounded-lg p-4 w-full h-fit shadow-lg shadow-gray-200"
      >
        {/* Menu Button */}
        {title !== "default" && (
          <View className="absolute top-4 right-2 z-10">
            <Pressable
              onPress={() => {
                if (onMenuPress) {
                  onMenuPress();
                  return;
                }
                openActionBar({
                  onEdit: () => openEditModal({ id, name: title, description: '' }),
                  onDelete: () => openDeleteModal(title, id.toString()),
                });
              }}
              onLongPress={() =>
                openActionBar({
                  onEdit: () => openEditModal({ id, name: title, description: '' }),
                  onDelete: () => openDeleteModal(title, id.toString()),
                })
              }
              className="p-2 active:opacity-50"
            >
              <MoreVerticalIcon size={24} color="#000" strokeWidth={3} />
            </Pressable>
          </View>
        )}

        {/* Folder Icon */}
        <View className="items-center justify-center mt-4 ">
          <View className="relative">
            <Folder size={100} color="#FFD100" fill="#FFD100" />
            <View
              className="absolute top-[10px] left-[5px] w-8 h-3 rounded-tl-sm rounded-tr-md bg-amber-500"
            />
          </View>
        </View>

        {/* Folder Title */}
        <View className="items-center">
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-lg font-bold text-black text-center mb-1 w-full"
          >
            {title}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

export default FolderCard;