import React, { useState, useEffect } from 'react'
import { Modal, View, Text, TextInput, Pressable } from 'react-native'

type Props = {
  visible: boolean
  initialName?: string
  onClose: () => void
  onSave: (newName: string) => void
}

const EditReportTitleModal: React.FC<Props> = ({ visible, initialName = '', onClose, onSave }) => {
  const [name, setName] = useState(initialName)

  useEffect(() => {
    setName(initialName)
  }, [initialName, visible])

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 items-center justify-center bg-black/40">
        <View className="w-11/12 bg-white rounded-lg p-4">
          <Text className="text-lg font-semibold text-gray-900 mb-3">Edit report title</Text>
          <TextInput value={name} onChangeText={setName} className="border border-gray-300 rounded-md px-3 py-2 mb-4" />
          <View className="flex-row justify-end">
            <Pressable onPress={onClose} className="px-4 py-2 mr-2">
              <Text className="text-gray-700">Cancel</Text>
            </Pressable>
            <Pressable onPress={() => { onSave(name); }} className="bg-emerald-600 px-4 py-2 rounded-md">
              <Text className="text-white">Save</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

export default EditReportTitleModal
