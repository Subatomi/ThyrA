import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { changePassword } from 'api/auth';
type Result = { success: boolean; error?: string };

type Props = {
  visible: boolean;
  onClose: () => void;
};


export default function ChangePasswordModal({ visible, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [current, setCurrent] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      setCurrent('');
      setPassword('');
      setConfirm('');
      setError(null);
      setSuccess(false);
    }
  }, [visible]);

  const handleChange = async () => {
    setError(null);
    if (!current) return setError('Enter current password');
    if (!password) return setError('Enter new password');
    if (password.length < 8) return setError('New password must be at least 8 characters');
    if (password !== confirm) return setError('Passwords do not match');

    setSaving(true);
    try {
      const res = await changePassword({ current_password: current, new_password: password });
      setSuccess(true);
    } catch (error: any) {
      setSuccess(false);
      setError(error.message || 'Failed to change password');
    }finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} className="justify-end">
        <View style={{ paddingBottom: insets.bottom  }} className="bg-white rounded-t-xl p-4 border-t border-gray-200">
          <Text className="text-lg font-semibold mb-3">Change password</Text>

          {success ? (
            <View>
              <Text className="mb-3">Your password was changed.</Text>
              <Pressable className="bg-green-600 py-2 px-4 rounded-md" onPress={onClose}>
                <Text className="text-white text-center">Done</Text>
              </Pressable>
            </View>
          ) : (
            <>
              {error ? <Text className="text-red-600 mb-2">{error}</Text> : null}
              <TextInput value={current} onChangeText={setCurrent} secureTextEntry placeholder="Current password" className="border border-gray-200 rounded-md px-3 py-2 mb-2" />
              <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="New password" className="border border-gray-200 rounded-md px-3 py-2 mb-2" />
              <TextInput value={confirm} onChangeText={setConfirm} secureTextEntry placeholder="Confirm new password" className="border border-gray-200 rounded-md px-3 py-2 mb-2" />


              <Pressable className="bg-green-600 py-2 px-4 rounded-md mb-2" onPress={handleChange} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center">Change password</Text>}
              </Pressable>
              <Pressable className="py-2 px-4" onPress={onClose}><Text className="text-center">Cancel</Text></Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
