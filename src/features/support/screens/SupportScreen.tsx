import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, ScrollView, Pressable, TextInput, Alert } from 'react-native';
import BackButton from '@/components/BackButton';
import FAQItem from '@/features/support/components/FAQItem';

const FAQ_ITEMS = [
  { q: 'How do I reset my password?', a: 'Go to Tab Button → Account → Change Password and follow the steps.' },
  { q: 'How do I update my email address?', a: 'Open your Profile → Edit Profile → Email and follow the steps' },
  { q: 'Where are my reports stored?', a: 'Reports are saved under Library → Reports' },
];

export default function SupportScreen() {
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const submitSupport = async () => {
    if (!message.trim()) return Alert.alert('Please describe your issue');
    setSending(true);
    try {
      // mock request
      await new Promise((r) => setTimeout(r, 800));
      setMessage('');
      Alert.alert('Request submitted', 'We received your message and will respond via email.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-slate-100 pt-6 pb-4 px-4 border-b border-transparent">
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
              <Text className="text-center text-white font-semibold">Send</Text>
            </Pressable>
          </View>
        </View>


        <View className="mb-6">
          <Text className="text-lg font-semibold mb-2">Contact Info</Text>
          <View className="bg-white rounded-md p-3">
            <Text className="font-semibold">Email</Text>
            <Text className="text-sm text-gray-600 mb-2">support@example.com</Text>
            <Text className="font-semibold">Phone</Text>
            <Text className="text-sm text-gray-600">+1 (555) 555-0123</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
