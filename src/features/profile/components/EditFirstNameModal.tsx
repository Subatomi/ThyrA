import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { updateProfile } from 'api/auth';
import { refreshProfileFromServer } from '@/features/profile/services/refreshProfile';

type Props = {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => Promise<void> | void;
};

export default function EditFirstNameModal({ visible, initialValue, onClose, onSave }: Props) {
  const insets = useSafeAreaInsets();
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue, visible]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const first = value.trim();
      if (!first) {
        return;
      }
      if (__DEV__) console.log('[EditFirstNameModal] updating first_name', first);
      await updateProfile({ first_name: first });
      await refreshProfileFromServer();
      if (__DEV__) console.log('[EditFirstNameModal] update complete, cache refreshed');
      await Promise.resolve(onSave(first));
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} className="justify-end">
        <View style={{ paddingBottom: insets.bottom }} className="bg-white rounded-t-xl p-4 border-t border-gray-200">
          <Text className="text-lg font-semibold mb-3">First name</Text>
          <TextInput value={value} onChangeText={setValue} className="border border-gray-200 rounded-md px-3 py-2 mb-3" />
          <View className="flex-row justify-end">
            <Pressable className="py-2 px-4" onPress={onClose}><Text>Cancel</Text></Pressable>
            <Pressable className="bg-green-600 py-2 px-4 rounded-md mr-2" onPress={handleSave} disabled={saving}>
              {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white">Save</Text>}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
