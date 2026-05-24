import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { View, Text, ScrollView, Pressable, Linking } from 'react-native'
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
          <Text className="text-sm text-gray-600">Thyra does not collect, store, or transmit any personal data. All image analysis is performed locally on your device. This page explains what that means for you.</Text>
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">What We Collect</Text>
          <View className="bg-white rounded-md p-3">
            <Text className="font-medium">No Personal Data</Text>
            <Text className="text-sm text-gray-600 mb-2">We do not collect your name, email address, or any identifying information.</Text>
            <Text className="font-medium">No Usage Data</Text>
            <Text className="text-sm text-gray-600 mb-2">We do not run analytics, crash reporting, or any form of usage tracking.</Text>
            <Text className="font-medium">No Images or Clinical Data</Text>
            <Text className="text-sm text-gray-600">Thyroid FNAB slide images you capture or upload never leave your device. They are processed entirely on-device and are never sent to any server.</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">How We Use Your Data</Text>
          <View className="bg-white rounded-md p-3">
            <Text className="text-sm text-gray-600">We don't. Because no data is collected or transmitted, there is nothing to use, store, or process on our end. All adequacy assessments happen locally on your device and remain entirely under your control.</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">Sharing & Third Parties</Text>
          <View className="bg-white rounded-md p-3">
            <Text className="text-sm text-gray-600">We do not share any data with third parties because we do not collect any data to begin with. No external analytics, advertising, or data processing services are integrated into this app.</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">Clinical Disclaimer</Text>
          <View className="bg-white rounded-md p-3">
            <Text className="text-sm text-gray-600">Thyra is intended as a decision-support tool for trained medical professionals. It is not a substitute for the judgment of a licensed pathologist or clinician. Adequacy assessments produced by this app should be interpreted in the context of the full clinical picture.</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-base mb-2 font-semibold">Contact</Text>
          <View className="bg-white rounded-md p-3 space-y-2">
            <Pressable onPress={contactSupport} className="py-2">
              <Text className="text-sm text-blue-600">Contact Support</Text>
            </Pressable>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-xs text-gray-500">Effective date: 2026-01-31</Text>
          <Text className="text-xs text-gray-500 mt-2">Questions about this policy? Reach us at {SUPPORT_EMAIL}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}