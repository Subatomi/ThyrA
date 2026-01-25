import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Edit3, Trash2 } from 'lucide-react-native';

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
  onClose: () => void;
};

export default function ActionBar({ onEdit, onDelete, onClose }: Props) {
  return (
    <View pointerEvents="box-none" className="absolute left-0 right-0 bottom-0 items-center">
      <View className="w-full" style={{elevation:4}}>
        <View className="flex-row items-center bg-white p-1 rounded-t-xl shadow-xl w-full justify-center gap-10">
          <Pressable onPress={() => { onEdit?.(); onClose(); }} className="items-center px-2 py-2">
            <Edit3 size={15} color="#000" />
            <Text className="text-xs mt-1">Edit</Text>
          </Pressable>

          <Pressable onPress={() => { onDelete?.(); onClose(); }} className="items-center px-2 py-2">
            <Trash2 size={15} color="#000" />
            <Text className="text-xs mt-1">Delete</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
