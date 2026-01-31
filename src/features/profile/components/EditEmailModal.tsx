import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';

type SendResult = { success: boolean; error?: string };

type Props = {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  // should attempt to re-auth and send verification; return {success, error}
  onSendVerification: (newEmail: string, password: string) => Promise<SendResult>;
};

export default function EditEmailModal({ visible, initialValue, onClose, onSendVerification }: Props) {
  const [email, setEmail] = useState(initialValue);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setEmail(initialValue);
    setPassword('');
    setError(null);
    setVerificationSent(false);
  }, [initialValue, visible]);

  const handleSend = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await onSendVerification(email.trim(), password);
      if (!res.success) {
        setError(res.error || 'Failed to re-authenticate');
        return;
      }
      setVerificationSent(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} className="justify-end">
        <View className="bg-white rounded-t-xl p-4 border-t border-gray-200">
          <Text className="text-lg font-semibold mb-3">Change Email</Text>

          {verificationSent ? (
            <View>
              <Text className="mb-3">Verification sent to {email}</Text>
              <Pressable className="bg-green-600 py-2 px-4 rounded-md" onPress={onClose}>
                <Text className="text-white text-center">Done</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <TextInput value={email} onChangeText={setEmail} keyboardType="email-address" className="border border-gray-200 rounded-md px-3 py-2 mb-2" />
              <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Current password" className="border border-gray-200 rounded-md px-3 py-2 mb-2" />
              {error ? <Text className="text-red-600 mb-2">{error}</Text> : null}

              <Pressable className="bg-green-600 py-2 px-4 rounded-md mb-2" onPress={handleSend} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center">Send verification</Text>}
              </Pressable>
              <Pressable className="py-2 px-4" onPress={onClose}><Text className="text-center">Cancel</Text></Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
