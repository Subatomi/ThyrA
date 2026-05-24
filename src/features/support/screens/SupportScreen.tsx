import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Pressable, TextInput, Linking } from 'react-native';
import BackButton from '@/components/BackButton';
import FAQItem from '@/features/support/components/FAQItem';
import { useToast } from '../../../contexts/ToastContext';

// Default fallback values
const DEFAULT_SUPPORT_EMAIL = 'ladera.portfolio@gmail.com';
const DEFAULT_SUPPORT_PHONE = '+63 992 932 2972';

// Use environment variables if available, otherwise use defaults
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL;
const SUPPORT_PHONE = process.env.EXPO_PUBLIC_SUPPORT_PHONE || DEFAULT_SUPPORT_PHONE;

const FAQ_ITEMS = [
  { q: 'How do I reset my password?', a: 'Go to Tab Button → Account → Change Password and follow the steps.' },
  { q: 'How do I update my email address?', a: 'Use the account settings page to update email and profile details.' },
  { q: 'Where are my reports stored?', a: 'Reports are saved in the app and can be accessed from the Home screen.' },
];

export default function SupportScreen() {
  const { show } = useToast();
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const submitSupport = async () => {
    const subject = 'ThyrA Support Request';
    const body = message.trim() || '';
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        // console.warn('mailto canOpenURL false; trying openURL anyway:', url);
        try {
          await Linking.openURL(url);
          return;
        } catch (innerErr) {
          // console.warn('Linking.openURL fallback failed:', innerErr);
          show('warning', 'Email app not available', 'Please configure an email application on your device or send to ' + SUPPORT_EMAIL);
          return;
        }
      }
      await Linking.openURL(url);
    } catch (e) {
      // console.error('Support submit error', e);
      show('danger', 'Could not open email', 'Please try again or contact support directly at ' + SUPPORT_EMAIL);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100 pt-6 pb-4 px-4 border-b border-transparent">
      <View className="relative flex-row items-center mb-6">
        <BackButton />
        <View pointerEvents="none" className="absolute left-0 right-0 items-center">
          <Text className="font-bold text-3xl text-black
          ">Support</Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="p-4"
      contentContainerStyle={{ flexGrow: 1}}>
        <View>
          <View className="mb-4">
            <Text className="text-lg font-semibold mb-2">Common FAQs</Text>
            {FAQ_ITEMS.map((f, i) => (
              <FAQItem key={i} question={f.q} answer={f.a} open={selectedFaq === i} onToggle={() => setSelectedFaq(selectedFaq === i ? null : i)} />
            ))}
          </View>

          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Contact Support</Text>
            <Text className="text-sm text-gray-600 mb-2">Describe your issue and we will get back to you.</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={5}
              placeholder="Describe the problem, include steps to reproduce if applicable..."
              className="bg-white rounded-md border border-gray-200 p-3 text-sm mb-3"
              editable={!sending}
            />
            <Pressable className={`py-3 rounded-md ${sending ? 'bg-gray-400' : 'bg-red-600'}`} onPress={submitSupport} disabled={sending}>
              <Text className="text-center text-white font-semibold">Email Support</Text>
            </Pressable>
          </View>
        </View>


        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Contact Info</Text>
          <View className="bg-white rounded-md p-3">
            <Text className="font-semibold">Email</Text>
            <Text className="text-sm text-gray-600 mb-2">
            {SUPPORT_EMAIL}
            </Text>
            <Text className="font-semibold">Phone</Text>
            <Text className="text-sm text-gray-600">{SUPPORT_PHONE}</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

