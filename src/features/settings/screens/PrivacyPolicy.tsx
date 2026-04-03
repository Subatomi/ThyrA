import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, ScrollView, Pressable, Linking, Alert } from 'react-native'
import BackButton from '@/components/BackButton'
import { useRouter } from 'expo-router'

const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL || 'support@example.com'

export default function PrivacyPolicy() {
  const router = useRouter()

  const contactSupport = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`)
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} className="flex-1 bg-slate-100 pt-6 pb-4 px-4 border-b border-transparent">
      <View className="relative flex-row items-center mb-6">
        <BackButton />
        <View pointerEvents="none" className="absolute left-0 right-0 items-center">
          <Text className="font-bold text-3xl text-black">Privacy Policy</Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="p-4">
        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">Summary</Text>
          <Text className="text-sm text-gray-600">We collect the minimum information required to provide and improve the app. This page summarizes what we collect, why, and how you can manage your data.</Text>
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">What We Collect</Text>
          <View className="bg-white rounded-md p-3">
            <Text className="font-medium">Personal Data</Text>
            <Text className="text-sm text-gray-600 mb-2">Name, email address and profile information you provide.</Text>
            <Text className="font-medium">Usage Data</Text>
            <Text className="text-sm text-gray-600 mb-2">Analytics and crash reports to help us improve the app.</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">How We Use Data</Text>
          <View className="bg-white rounded-md p-3">
            <Text className="text-sm text-gray-600">We use the information you provide and data collected from your device only to personalize your experience and to analyze and improve our service. This includes tailoring the app to your preferences, diagnosing and fixing issues, and improving features. We do not sell your personal information.</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">Sharing & Third Parties</Text>
          <View className="bg-white rounded-md p-3">
            <Text className="text-sm text-gray-600">We do not share your personal data with third parties except when required by law, to enforce our terms, or to protect people’s safety. When necessary, we may disclose limited data to trusted service providers who process data on our behalf under contract and strict confidentiality terms.</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">Your Choices</Text>
          <View className="bg-white rounded-md p-3 space-y-2">
            <Pressable onPress={contactSupport} className="py-2">
              <Text className="text-sm text-blue-600">Contact Support</Text>
            </Pressable>
            <Pressable onPress={() => router.push('/setting')} className="py-2">
              <Text className="text-sm text-red-600">Delete account (go to Settings)</Text>
            </Pressable>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-xs text-gray-500">Effective date: 2026-01-31</Text>
          <Text className="text-xs text-gray-500 mt-2">If you have questions about this policy, contact {SUPPORT_EMAIL}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
