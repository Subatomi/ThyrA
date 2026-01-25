import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { LucideInfo } from 'lucide-react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  onCreate: (data: { name: string; description?: string }) => void;
};

export default function CreateFolderModal({ visible, onClose, onCreate }: Props) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!visible) {
      setName('');
      setDescription('');
    }
  }, [visible]);

  function handleCreate() {
    const trimmed = { name: name.trim(), description: description.trim() };
    onCreate(trimmed);
  }

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View className="flex-1 bg-black/40 items-center justify-center">
          <View className="w-11/12 bg-white rounded-xl p-6">
            <View className="flex-row items-center mb-3">
              <LucideInfo size={20} color="#ef4444" />
              <Text className="text-lg font-semibold text-gray-900 ml-2">Create Folder</Text>
            </View>

            <Text className="text-sm text-gray-700">Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Folder name"
              className="border border-gray-200 rounded-md px-3 py-2 mb-3"
              accessibilityLabel="Folder name"
            />

            <Text className="text-sm text-gray-700">Description (optional)</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Brief description"
              className="border border-gray-200 rounded-md px-3 py-2 mb-4"
              multiline
              numberOfLines={3}
            />

            <View className="flex-row justify-end">
              <Pressable onPress={onClose} className="px-4 py-2 mr-2">
                <Text className="text-gray-700">Cancel</Text>
              </Pressable>
              <Pressable onPress={handleCreate} className="px-4 py-2 bg-red-600 rounded-md">
                <Text className="text-white">Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
