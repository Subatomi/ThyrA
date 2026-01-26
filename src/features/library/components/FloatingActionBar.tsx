import React from 'react'
import { View, Pressable, Text } from 'react-native'
import { Edit3, Trash2 } from 'lucide-react-native'

type Props = {
  onEdit?: () => void
  onDelete?: () => void
}

const FloatingActionBar: React.FC<Props> = ({ onEdit, onDelete }) => {
  return (
    <View className="absolute left-4 right-4 bottom-3">
      <View className="bg-white rounded-lg p-2 flex-row justify-center gap-10 items-center shadow" style={{ elevation: 6 }}>
        <Pressable onPress={onEdit} className="p-2 rounded-md items-center">
          <Edit3 size={20} color="#111827" />
          <Text className="text-xs mt-1">Edit</Text>
        </Pressable>
        <Pressable onPress={onDelete} className="p-2 rounded-md items-center">
          <Trash2 size={20} color="#E11D48" />
          <Text className="text-xs mt-1">Delete</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default FloatingActionBar
