import React, { useState } from 'react'
import { View, Text, Pressable, ScrollView, TextInput, Linking } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import BackButton from '@/components/BackButton'
import FAQItem from '@/features/support/components/FAQItem'
import { useToast } from '../../../contexts/ToastContext'
import { useRouter } from 'expo-router'

const DEFAULT_SUPPORT_EMAIL = 'ladera.portfolio@gmail.com'
const DEFAULT_SUPPORT_PHONE = '+63 992 932 2972'
const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL || DEFAULT_SUPPORT_EMAIL
const SUPPORT_PHONE = process.env.EXPO_PUBLIC_SUPPORT_PHONE || DEFAULT_SUPPORT_PHONE

const FAQ_ITEMS = [
  {
    q: 'Why can\'t I download my results?',
    a: 'Make sure the app has the necessary permissions. Go to your device\'s Settings, find Thyra, and enable access for Files and Media (or Photos & Storage on some devices), then try downloading again.'
  },
  {
    q: 'Why did my analysis fail?',
    a: 'Analysis failures are usually caused by poor image quality or unsupported file formats. If the problem persists, please contact support.'
  },
]

export default function SettingScreen() {
  const router = useRouter()
  const { show } = useToast()
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  const submitSupport = async () => {
    const subject = 'ThyrA Support Request'
    const body = message.trim() || ''
    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    try {
      const canOpen = await Linking.canOpenURL(url)
      if (!canOpen) {
        await Linking.openURL(url)
        return
      }
      await Linking.openURL(url)
    } catch (e) {
      show('danger', 'Could not open email', 'Please try again or contact support directly at ' + SUPPORT_EMAIL)
    }
  }

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-gray-100 pt-6 pb-8 px-4 border-b border-transparent">
      <View className="relative flex-row items-center mb-6">
        <BackButton />
        <View pointerEvents="none" className="absolute left-0 right-0 items-center">
          <Text className="font-bold text-3xl text-black">Support</Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold mb-3">Help Center</Text>
          <Text className="text-sm text-gray-600 mb-4">Find answers to common questions and reach out to support directly from this page.</Text>

          {FAQ_ITEMS.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.q}
              answer={faq.a}
              open={selectedFaq === index}
              onToggle={() => setSelectedFaq(selectedFaq === index ? null : index)}
            />
          ))}
        </View>

        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold mb-3">Contact Support</Text>
          <Text className="text-sm text-gray-600 mb-3">Describe your issue and we will get back to you.</Text>
          <TextInput
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            placeholder="Describe the problem, include steps to reproduce if applicable..."
            className="bg-gray-100 rounded-md border border-gray-200 p-3 text-sm mb-3"
            editable={!sending}
          />
          <Pressable className={`py-3 rounded-md ${sending ? 'bg-gray-400' : 'bg-red-600'}`} onPress={submitSupport} disabled={sending}>
            <Text className="text-center text-white font-semibold">Email Support</Text>
          </Pressable>
        </View>

        <View className="bg-white rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold mb-3">Privacy Policy</Text>
          <Text className="text-sm text-gray-600 mb-4">Review our privacy practices and data handling in a dedicated policy page.</Text>
          <Pressable
            onPress={() => router.push('/privacy-policy')}
            className="py-3 rounded-md bg-red-600"
          >
            <Text className="text-center text-white font-semibold">View Privacy Policy</Text>
          </Pressable>
        </View>

        <View className="bg-white rounded-xl p-4">
          <Text className="text-lg font-semibold mb-3">Contact Info</Text>
          <View className="space-y-3">
            <View>
              <Text className="font-semibold">Email</Text>
              <Text className="text-sm text-gray-600">{SUPPORT_EMAIL}</Text>
            </View>
            <View>
              <Text className="font-semibold">Phone</Text>
              <Text className="text-sm text-gray-600">{SUPPORT_PHONE}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
