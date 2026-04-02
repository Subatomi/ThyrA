import React, { useEffect, useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, ActivityIndicator} from 'react-native';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import OtpBoxes from '@/components/OtpBoxes';
import { startEmailChange, verifyEmailChange } from 'api/auth';
import { refreshProfileFromServer } from '@/features/profile/services/refreshProfile';
import { useToast } from '../../../contexts/ToastContext';

type SendResult = { success: boolean; error?: string };

type Props = {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSendVerification: (newEmail: string, password: string) => Promise<SendResult>;
};

export default function EditEmailModal({ visible, initialValue, onClose, onSendVerification }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { show } = useToast();
  const [email, setEmail] = useState(initialValue);
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const screenWidth = Dimensions.get('window').width;
  const boxSize = (screenWidth - 80) / 6 - 8; 

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
      const newEmail = email.trim();
      if (!newEmail) {
        setError('Please enter a valid email');
        return;
      }
      if (!password) {
        setError('Password is required');
        return;
      }
      await startEmailChange({ new_email: newEmail, password });
      setVerificationSent(true);
    } catch (e) {
      console.error(e);
      setError('Could not send verification. Please try again.');
      show('danger', 'Verification failed', 'Could not send verification email.');
    } finally {
      setSaving(false);
    }
  };

  const handleVerify = async () => {
    setError(null);
    setSaving(true);
    try {
      const newEmail = email.trim();
      if (!newEmail || code.length !== 6) {
        setError('Enter the 6-digit code');
        return;
      }
      await verifyEmailChange({ new_email: newEmail, code });
      await refreshProfileFromServer();
      show('success', 'Email updated', 'Your email has been updated successfully.');
      onClose();
    } catch (e) {
      console.error(e);
      setError('Verification failed. Please check your code and try again.');
      show('danger', 'Verification failed', 'Code verification failed.');
    } finally {
      setSaving(false);
    }
  };


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} className="justify-end">
        <View style={{ paddingBottom: insets.bottom }} className="bg-white rounded-t-xl p-4 border-t border-gray-200">
          {verificationSent ? (
            <>
              <Text className="text-lg font-semibold mb-1">OTP verification sent</Text>
              <Text className="">Enter the 6-digit code sent to {email}</Text>
              {!!error && (
                <Text className="text-red-600 mb-2 text-center">{error}</Text>
              )}
              <OtpBoxes length={6} boxSize={boxSize} onComplete={setCode} />
              <View className='flex-row justify-end'>
                <Pressable className="py-2 px-4" onPress={() => { onClose()}}><Text className="text-center">Cancel</Text></Pressable>
                <Pressable className="bg-green-600 py-2 px-4 rounded-md disabled:opacity-60" onPress={handleVerify} disabled={saving || code.length !== 6}>
                  <Text className="text-white text-center">{saving ? 'Verifying...' : 'Confirm'}</Text>
                </Pressable>
              </View>
            </>
          ) : (
            <>
              <Text className="text-lg font-semibold mb-3">Change Email</Text>
              <TextInput onChangeText={setEmail} keyboardType="email-address" placeholder="Enter new email"  className="border border-gray-200 rounded-md px-3 py-2 mb-2" />
              <TextInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Current password" className="border border-gray-200 rounded-md px-3 py-2 mb-2" />
              {error ? <Text className="text-red-600 mb-2">{error}</Text> : null}
              <Pressable className="bg-green-600 py-2 px-4 rounded-md mb-2 disabled:opacity-60" onPress={handleSend} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center">Send verification</Text>}
              </Pressable>
              <Pressable className="py-2 px-4" onPress={() => { onClose()}}><Text className="text-center">Cancel</Text></Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

 
